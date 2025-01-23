import { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TwoBtnsPopup } from '@atollis/ot_105_5_0070';
import { Radio } from '@atollis-ui/radio';
import {
  IAllReglamentVariables,
  IReglamentPeriod,
  ReglamentPeriodNames,
  reportReglamentSelector,
  setPeriod,
} from '../../reducers/reportReglamentReducer/reportReglamentReducer';
import PopupContentVariants from './PopupContentVariants/PopupContentVariants';

interface ReportReglamentParamsPopupProps {
  visible?: boolean;
  period: IReglamentPeriod;
  reglamentData: IAllReglamentVariables;
  onCancel: () => void;
  onConfirm: () => void;
  onReglamentValueChange: <T extends keyof IAllReglamentVariables>(
    fildName: T,
    value: string | number,
  ) => void;
}

const ReportReglamentParamsPopup = ({
  visible,
  period,
  reglamentData,
  onCancel,
  onConfirm,
  onReglamentValueChange,
}: ReportReglamentParamsPopupProps) => {
  const dispatch = useDispatch();
  const [currentPeriodicity, setPeriodicity] = useState(periodicity[0]);
  const { disabledSave } = useSelector(reportReglamentSelector);

  const periodicityChangeHandler = (value: ReglamentPeriodNames) => {
    setPeriodicity(value);
    dispatch(setPeriod(value));
  };

  return (
    <TwoBtnsPopup
      visible={visible}
      title="Параметры регламента"
      firstBtnText="Отмена"
      secondBtnText="Сохранить"
      onFirstBtnClick={onCancel}
      onSecondBtnClick={onConfirm}
      secondBtnOptions={{
        type: 'default',
        stylingMode: 'contained',
        disabled: disabledSave,
      }}
    >
      <div className="reglament-popup-content-wrapper">
        <div className="reglament-period-names">
          {periodicity.map(value => (
            <Radio
              id={value}
              key={value}
              checked={value === currentPeriodicity}
              onChange={({ id, checked }) => {
                if (checked) {
                  periodicityChangeHandler(id as ReglamentPeriodNames);
                }
              }}
            >
              {value}
            </Radio>
          ))}
        </div>

        <div className="reglament-popup-content-interval-container">
          {period.name !== 'Не задан' && (
            <PopupContentVariants
              key={period.name}
              period={period}
              reglamentData={reglamentData}
              onReglamentValueChange={onReglamentValueChange}
            />
          )}
        </div>
      </div>
    </TwoBtnsPopup>
  );
};

export const periodicity = [
  'Не задан',
  'Ежедневно',
  'Еженедельно',
  'Ежемесячно',
  'Ежегодно',
];

export default memo(ReportReglamentParamsPopup);
