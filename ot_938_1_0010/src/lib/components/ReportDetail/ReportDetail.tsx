import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardHeaderDefault,
  GridLayout,
  TSettings,
  TwoBtnsPopup,
} from '@atollis/ot_105_5_0070';
import { selectCurrentUser } from '@atollis/ot_105_7_0010';
import { AlertSvg, CloseSvg, OpenSvg } from '@atollis/ot_105_5_0080';
import manageRoutes from '@atollis/ot_938_5_0010';
import { Spin } from '@atollis-ui/spin';
import ReportParams from '../ReportParams/ReportParams';
import ReportInputForm from '../ReportInputForm/ReportInputForm';
import ReportMembers from '../ReportMembers/ReportMembers';
import ReportReglament from '../ReportReglament/ReportReglament';
import ReportDetailFooter from './ReportDetailFooter';
import {
  createEmptyFormData,
  getReport,
  Report,
  reportParamsSelector,
  resetReportFormState,
  saveReport,
  setIsCheckValid,
  setIsValid,
  setIsValidMembers,
  setIsValidReglament,
} from '../../reducers/reportParamsReducer/reportParamsReducer';
import { BtnsId, btnsInfo } from '../buttons';
import libName from '../../constants';
import {
  IDetailSettings,
  IManagementSettings,
} from '../../defaultSettings/defaultSettings';
import {
  getReportReglament,
  reportReglamentSelector,
  resetPeriod,
  resetReglament,
} from '../../reducers/reportReglamentReducer/reportReglamentReducer';

interface ReportDetailProps {
  isUiSettingsLoading: boolean;
  settings: IManagementSettings;
  expand: boolean;
  setExpand: () => void;
  saveUiSettings: (
    setting: Partial<TSettings<IManagementSettings>>,
    projectKey: string,
    componentKey: keyof IManagementSettings,
  ) => void;
}

const ReportDetail = ({
  isUiSettingsLoading,
  settings,
  expand,
  setExpand,
  saveUiSettings,
}: ReportDetailProps) => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [popupVisible, setPopupVisible] = useState(false);

  const currentUser = useSelector(selectCurrentUser);
  const {
    formData,
    isValid,
    isValidMembers,
    isValidReglament,
    isChanged,
    isLoading: isLoadingParams,
    saveAction,
  } = useSelector(reportParamsSelector);
  const {
    intermediateReglament,
    identifikator,
    isLoading: isLoadingReglament,
  } = useSelector(reportReglamentSelector);

  const isLoading =
    isLoadingParams || isUiSettingsLoading || isLoadingReglament;

  const cardBtns = useMemo(
    () => [
      {
        id: 'expand',
        name: expand ? 'Свернуть' : 'Развернуть',
        icon: expand ? (
          <CloseSvg id={`_expand-icon${expand}`} />
        ) : (
          <OpenSvg id={`_expand-icon${expand}`} />
        ),
      },
    ],
    [expand],
  );

  const cardMenuList = useMemo(
    () => [
      {
        ...btnsInfo[BtnsId.info],
        id: BtnsId.info,
      },
    ],
    [],
  );

  const onButtonClick = useCallback(
    (id: string) => {
      switch (id) {
        case 'expand':
          setExpand();
          break;
      }
    },
    [setExpand],
  );

  useEffect(() => {
    if (params.id) {
      dispatch(getReport(params.id));
    } else {
      dispatch(
        createEmptyFormData({
          login: currentUser.email.split('@')[0].toUpperCase(),
          name: `${currentUser.surname} ${currentUser.name} ${currentUser.patronymic}`,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, params.id]);

  useEffect(() => {
    if (
      isValid &&
      isValidMembers &&
      isValidReglament &&
      formData &&
      saveAction !== 'saveAndGoRoute'
    ) {
      dispatch(setIsValid(false));
      dispatch(setIsValidMembers(false));
      dispatch(setIsValidReglament(false));

      (
        dispatch(
          saveReport(formData, { ...intermediateReglament, identifikator }),
        ) as unknown as Promise<null | Report>
      )
        .then(data => {
          if (data && params.id) {
            dispatch(getReport(params.id));
            dispatch(getReportReglament(params.id));
          }
          if (data) {
            navigate(
              `${manageRoutes.base}/${manageRoutes.reports}/${data.identifier}`,
            );
          }
        })
        .finally(() => {
          dispatch(setIsCheckValid({ isCheck: false }));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid, isValidMembers, isValidReglament]);

  const onFooterConfirm = useCallback(() => {
    dispatch(setIsCheckValid({ isCheck: true, saveAction: 'save' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const onFooterCancel = useCallback(() => {
    setPopupVisible(true);
  }, []);

  const onModalConfirm = () => {
    dispatch(resetReportFormState());
    dispatch(resetReglament());
    dispatch(resetPeriod());
    setPopupVisible(false);
  };

  const saveSetting = useCallback(
    (newSettings: Partial<IDetailSettings>) => {
      if (!isUiSettingsLoading) {
        saveUiSettings(
          newSettings,
          libName,
          params.id ? 'reportEditDetail' : 'reportCreateDetail',
        );
      }
    },
    [isUiSettingsLoading, saveUiSettings],
  );

  return (
    <Card isContainer>
      <CardHeader>
        <CardHeaderDefault
          title={
            params.id ? 'Детализация / Редактирование отчета' : 'Новый отчет'
          }
          menuList={cardMenuList}
          buttons={cardBtns}
          onButtonClick={onButtonClick}
        />
      </CardHeader>
      <CardBody>
        {!isUiSettingsLoading && (
          <div
            style={{
              display: 'flex',
              maxHeight: '100%',
              overflow: 'auto',
              width: '100%',
              flexDirection: 'column',
            }}
          >
            {params.id ? (
              <GridLayout
                layouts={settings.reportEditDetail?.layouts}
                saveLayoutSettings={saveSetting}
              >
                <ReportParams key="params" />
                <ReportReglament key="reglament" />
                <ReportMembers key="members" />
                <ReportInputForm key="inputForm" data={formData?.inputForm} />
              </GridLayout>
            ) : (
              <GridLayout
                layouts={settings.reportCreateDetail?.layouts}
                saveLayoutSettings={saveSetting}
              >
                <ReportParams key="params" />
                <ReportReglament key="reglament" />
                <ReportMembers key="members" />
              </GridLayout>
            )}
          </div>
        )}
      </CardBody>
      <CardFooter>
        <ReportDetailFooter
          onConfirm={onFooterConfirm}
          onCancel={onFooterCancel}
          disabledConfirm={!isChanged}
          disabledCancel={!isChanged}
        />
        <TwoBtnsPopup
          visible={popupVisible}
          title="Вы уверены, что хотите завершить редактирование?"
          status="warning"
          icon={<AlertSvg />}
          firstBtnText="Отмена"
          secondBtnText="Уверен"
          onFirstBtnClick={() => setPopupVisible(false)}
          onSecondBtnClick={onModalConfirm}
        >
          Все несохранённые данные будут потеряны.
        </TwoBtnsPopup>
        {isLoading && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Spin />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default memo(ReportDetail);
