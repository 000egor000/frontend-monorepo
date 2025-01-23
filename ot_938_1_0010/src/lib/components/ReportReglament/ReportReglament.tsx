import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { ScrollArea } from '@atollis-ui/scroll-area';
import { TextInput } from '@atollis-ui/input';
import { Button } from '@atollis-ui/button';

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderDefault,
  LayoutComponentProps,
  useLayoutMaximizedPropsForCard,
} from '@atollis/ot_105_5_0070';
import ReportReglamentDurationItem from './ReportReglamentDurationItem';
import ReportReglamentParamsPopup from './ReportReglamentParamsPopup';
import {
  getReportReglament,
  IAllReglamentVariables,
  reportReglamentSelector,
  resetPeriod,
  resetReglamentPopup,
  saveReglamentPopupValues,
  setInitialReglament,
  setReglament,
} from '../../reducers/reportReglamentReducer/reportReglamentReducer';
import {
  Report,
  reportParamsSelector,
  requestDataMapperForSave,
  setIsChangedReglament,
  setIsCheckValid,
  setIsValidReglament,
} from '../../reducers/reportParamsReducer/reportParamsReducer';
import './ReportReglament.scss';

const ReportReglament = ({
  isMaximized,
  switchLayoutMaximizedStatus,
}: Partial<LayoutComponentProps>) => {
  const dispatch = useDispatch();
  const params = useParams();

  const { menuList, onMenuItemClick } = useLayoutMaximizedPropsForCard(
    isMaximized,
    switchLayoutMaximizedStatus,
  );

  const {
    period,
    reglament,
    intermediateReglament,
    incomingReglament,
    isLoading: isLoadingReglament,
  } = useSelector(reportReglamentSelector);
  const { isCheckValid } = useSelector(reportParamsSelector);

  const [isFormReady, setIsFormReady] = useState(true);

  const [visibleReportReglamentPopup, setVisibleReportReglamentPopup] =
    useState(false);

  const onReglamentValueChange = <T extends keyof IAllReglamentVariables>(
    fildName: T,
    value: string | number,
  ) => {
    dispatch(setReglament({ [fildName]: value }));
  };

  useEffect(() => {
    if (isCheckValid) {
      const onValidate = () => {
        dispatch(setIsValidReglament(true));
        dispatch(setIsCheckValid({ isCheck: false }));
      };

      onValidate();
    }
  }, [isCheckValid, dispatch]);

  useEffect(() => {
    if (
      JSON.stringify(
        requestDataMapperForSave({} as Report, intermediateReglament).reports
          .reglamentReport,
      ) !==
      JSON.stringify(
        requestDataMapperForSave({} as Report, incomingReglament).reports
          .reglamentReport,
      )
    ) {
      dispatch(setIsChangedReglament(true));
    } else dispatch(setIsChangedReglament(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intermediateReglament, incomingReglament]);

  useEffect(() => {
    if (params.id) dispatch(getReportReglament(params.id));
    else dispatch(setInitialReglament());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    // for reset form validation
    setIsFormReady(false);
    const id = setTimeout(() => setIsFormReady(true));

    return () => {
      clearTimeout(id);
    };
  }, [params.id]);

  const onSaveReglamentPopup = () => {
    dispatch(saveReglamentPopupValues());
    setVisibleReportReglamentPopup(false);
  };

  const onCancelReportReglamentPopup = () => {
    setVisibleReportReglamentPopup(false);
    dispatch(resetReglamentPopup());
    dispatch(resetPeriod());
  };

  return (
    <Card className="report-reglament-card">
      <CardHeader>
        <CardHeaderDefault
          title="Настройка регламента"
          onDoubleClick={switchLayoutMaximizedStatus}
          menuList={menuList}
          onMenuItemClick={onMenuItemClick}
        />
      </CardHeader>
      {isFormReady && !isLoadingReglament && (
        <CardBody>
          <ScrollArea className="scrollArea">
            <div className="report-reglament-content-conteiner">
              <div className="report-reglament-duration-conteiner">
                <h3>Длительность задач</h3>
                <ReportReglamentDurationItem
                  itemName="Ввод данных"
                  fildName="inputData"
                  required
                  value={reglament.inputData || 0}
                  onValueChange={onReglamentValueChange}
                />
                <ReportReglamentDurationItem
                  itemName="Согласования данных"
                  fildName="reconciliationData"
                  required
                  value={reglament.reconciliationData || 0}
                  onValueChange={onReglamentValueChange}
                />
                <ReportReglamentDurationItem
                  itemName="Утверждения данных"
                  fildName="validationData"
                  required
                  value={reglament.validationData || 0}
                  onValueChange={onReglamentValueChange}
                />
                <ReportReglamentDurationItem
                  itemName="Смещение запуска к отчетной дате"
                  fildName="shiftData"
                  minValue={-99}
                  value={reglament.shiftData || 0}
                  onValueChange={onReglamentValueChange}
                />
              </div>
              <div className="report-reglament-content-item item-launch-regulament">
                <TextInput
                  label="Регламент запуска"
                  readOnly
                  value={period.name}
                  className="launch-regulament"
                  size="small"
                />
                <Button onClick={() => setVisibleReportReglamentPopup(true)}>
                  {period.name === 'Не задан' ? 'Задать' : 'Изменить'}
                </Button>
              </div>
            </div>
            <ReportReglamentParamsPopup
              visible={visibleReportReglamentPopup}
              period={period}
              reglamentData={reglament}
              onCancel={onCancelReportReglamentPopup}
              onConfirm={onSaveReglamentPopup}
              onReglamentValueChange={onReglamentValueChange}
            />
          </ScrollArea>
        </CardBody>
      )}
    </Card>
  );
};

export default memo(ReportReglament);
