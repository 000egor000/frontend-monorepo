import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Spin } from '@atollis-ui/spin';

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardHeaderDefault,
  getGUID,
  GridLayout,
  TSettings,
} from '@atollis/ot_105_5_0070';
import { AlertSvg, CloseSvg, OpenSvg } from '@atollis/ot_105_5_0080';
import manageRoutes from '@atollis/ot_938_5_0010';
import { ScrollArea } from '@atollis-ui/scroll-area';
import CampaignParams from '../CampaignParams/CampaignParams';
import CampaignsDetailFooter from './CampaignsDetailFooter';
import InputForm from '../InputForm/InputForm';
import RelatedTasks from '../RelatedTasks/RelatedTasks';
import ParticipatingDivisions from '../ParticipatingDivisions/ParticipatingDivisions';
import {
  Campaign,
  campaignFormSelector,
  clearCampaignFormState,
  completeCampaign,
  getCampaign,
  resetCampaignFormState,
  saveCampaign,
  setIsCheckValid,
  setIsValid,
  setIsValidParticipatingDivisions,
  setUpdatedAfterSaving,
} from '../../reducers/Campaigns/campaignFormReducer';

import { BtnsId, btnsInfo } from '../buttons';
import {
  IDetailSettings,
  IManagementSettings,
} from '../../defaultSettings/defaultSettings';
import libName from '../../constants';
import { useStatusesChoose } from '../../dataSources';
import { IdentifiedObj } from '../../helpers';
import './CampaignsDetail.scss';
import TwoBtnsPopupCamping from '../Modal/TwoBtnsPopupCamping/TwoBtnsPopupCamping';

interface CampaignsDetailProps {
  isUiSettingsLoading: boolean;
  expand: boolean;
  settings: IManagementSettings;
  setExpand: () => void;
  getListDataSource: () => { reload: () => unknown };
  saveUiSettings: (
    setting: Partial<TSettings<IManagementSettings>>,
    projectKey: string,
    componentKey: keyof IManagementSettings,
  ) => void;
}

const CampaignsDetail = ({
  isUiSettingsLoading,
  expand,
  settings,
  setExpand,
  getListDataSource,
  saveUiSettings,
}: CampaignsDetailProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { statusesChoose } = useStatusesChoose();

  const {
    isValid,
    isValidParticipatingDivisions,
    isChanged,
    formData,
    isLoading: isLoadingForm,
    saveAction,
  } = useSelector(campaignFormSelector);

  const isLoading = isLoadingForm || isUiSettingsLoading;

  const [popupVisible, setPopupVisible] = useState(false);
  const [stopModalVisible, setStopModalVisible] = useState<boolean>(false);
  const newGUID = useRef<string>('');

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

  useEffect(() => {
    if (params.id) dispatch(getCampaign(params.id));
    return () => {
      dispatch(clearCampaignFormState());
    };
  }, [dispatch, params.id]);

  useEffect(() => {
    if (!params.id) {
      getGUID().then(result => {
        newGUID.current = result;
      });
    }
  }, [params]);

  useEffect(() => {
    if (
      isValid &&
      isValidParticipatingDivisions &&
      formData &&
      saveAction !== 'saveAndGoRoute'
    ) {
      dispatch(setIsValid(false));
      dispatch(setIsValidParticipatingDivisions(false));

      (
        dispatch(
          saveCampaign({
            ...formData,
            identifier: params.id ? formData.identifier : newGUID.current,
          }),
        ) as unknown as Promise<null | Campaign>
      )
        .then(data => {
          if (data && params.id) {
            dispatch(getCampaign(params.id));
            dispatch(setUpdatedAfterSaving());
            getListDataSource()?.reload();
          }
          if (data) {
            navigate(
              `${manageRoutes.base}/${manageRoutes.campaigns}/${data.identifier}`,
            );
          }
        })
        .finally(() => {
          dispatch(setIsCheckValid({ isCheck: false }));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid, isValidParticipatingDivisions]);

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

  const onFooterConfirm = useCallback(() => {
    dispatch(setIsCheckValid({ isCheck: true, saveAction: 'save' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFooterCancel = useCallback(() => {
    setPopupVisible(true);
  }, []);

  const onFooterDanger = useCallback(() => {
    setStopModalVisible(true);
  }, []);

  const onModalConfirm = () => {
    dispatch(resetCampaignFormState());
    setPopupVisible(false);
  };

  const onStopModalConfirm = async () => {
    (
      dispatch(
        completeCampaign({
          ...formData,
          /* eslint-disable no-underscore-dangle */
          status: statusesChoose.find(
            (el: IdentifiedObj) => el.name === 'Завершена',
          ),
          completionDateFact: new Date(
            new Date(`${new Date().toISOString().split('T')[0]}T00:00:00.000`),
          ).toISOString(),
        }),
      ) as unknown as Promise<null | Campaign>
    ).then(data => {
      if (data && params.id) {
        dispatch(getCampaign(params.id));
        dispatch(setUpdatedAfterSaving());
      }
      getListDataSource()?.reload();
    });
    setStopModalVisible(false);
  };

  const saveSetting = useCallback(
    (newSettings: Partial<IDetailSettings>) => {
      if (!isUiSettingsLoading) {
        saveUiSettings(
          newSettings,
          libName,
          params.id ? 'campaignEditDetail' : 'campaignCreateDetail',
        );
      }
    },
    [isUiSettingsLoading, saveUiSettings],
  );

  return (
    <Card isContainer className="campaigns-detail">
      <CardHeader>
        <CardHeaderDefault
          title={
            params.id
              ? 'Детализация / Редактирование'
              : 'Детализация / Создание'
          }
          buttons={cardBtns}
          menuList={cardMenuList}
          onButtonClick={onButtonClick}
        />
      </CardHeader>
      <CardBody>
        {!isUiSettingsLoading && !isLoading ? (
          <ScrollArea height="100%" width="100%">
            {params.id ? (
              <GridLayout
                layouts={settings.campaignEditDetail?.layouts}
                saveLayoutSettings={saveSetting}
              >
                <CampaignParams key="params" />
                <ParticipatingDivisions key="participatingDivisions" />
                <RelatedTasks key="relatedTasks" />
                <InputForm key="inputForm" />
              </GridLayout>
            ) : (
              <GridLayout
                layouts={settings.campaignCreateDetail?.layouts}
                saveLayoutSettings={saveSetting}
              >
                <CampaignParams key="params" />
                <ParticipatingDivisions key="participatingDivisions" />
              </GridLayout>
            )}
          </ScrollArea>
        ) : (
          <div className="spin">
            <Spin />
          </div>
        )}
      </CardBody>

      <CardFooter>
        {!isLoading && (
          <>
            <CampaignsDetailFooter
              onConfirm={onFooterConfirm}
              onCancel={onFooterCancel}
              onDanger={onFooterDanger}
              disabledConfirm={!isChanged}
              disabledCancel={!isChanged}
              disabledDanger={formData.status?.name === 'Завершена'}
            />
            <TwoBtnsPopupCamping
              visible={popupVisible}
              title="Вы уверены, что хотите завершить редактирование?"
              icon={<AlertSvg />}
              firstBtnText="Отмена"
              secondBtnText="Уверен"
              onFirstBtnClick={() => setPopupVisible(false)}
              onSecondBtnClick={onModalConfirm}
              content="Все несохранённые данные будут потеряны."
              appearance="blue"
            />
            <TwoBtnsPopupCamping
              visible={stopModalVisible}
              title="Вы уверены, что хотите завершить кампанию?"
              icon={<AlertSvg />}
              firstBtnText="Отмена"
              secondBtnText="Уверен"
              onFirstBtnClick={() => setStopModalVisible(false)}
              onSecondBtnClick={onStopModalConfirm}
              content="Все задачи кампании будут завершены."
              appearance="blue"
            />
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default memo(CampaignsDetail);
