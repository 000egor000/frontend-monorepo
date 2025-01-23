import { ChangeEvent, memo } from 'react';
import { TextInput } from '@atollis-ui/input';
import { IAllReglamentVariables } from '../../reducers/reportReglamentReducer/reportReglamentReducer';

interface ReportReglamentDurationItemProps<
  T extends keyof IAllReglamentVariables,
> {
  itemName?: string;
  fildName: T;
  required?: boolean;
  additionalFildName?: T;
  finalWord?: string;
  value?: number;
  additionalValue?: number;
  minValue?: number;
  maxValue?: number;
  onRadioChange?: (radioId: string) => void;
  onValueChange: <U extends keyof IAllReglamentVariables>(
    fildName: U,
    value: string,
  ) => void;
}

const ReportReglamentDurationItem = <T extends keyof IAllReglamentVariables>({
  itemName,
  fildName,
  required,
  additionalFildName,
  finalWord,
  value = 0,
  additionalValue = 0,
  minValue = 0,
  maxValue = 99,
  onRadioChange,
  onValueChange,
}: ReportReglamentDurationItemProps<T>) => {
  const changeHandler = ({ target }: ChangeEvent<HTMLInputElement>) => {
    let eventValue = target.value
      .replace(/[^\d.,]/g, '')
      .replace(/^0([\d.,]+)/, '$1');

    if (+eventValue > maxValue) {
      eventValue = String(maxValue);
    }
    if (+eventValue < minValue) {
      eventValue = String(minValue);
    }
    onRadioChange?.('runCount');
    onValueChange(fildName, eventValue);
  };

  return (
    <div className="report-reglament-content-item">
      {additionalFildName && (
        <div className="box-container">
          <TextInput
            className="numberbox"
            defaultValue={additionalValue}
            min={1}
            max={31}
            onChange={changeHandler}
          />
        </div>
      )}
      <p className={required ? 'required-field' : ''}>{itemName}</p>
      <div className="box-container">
        <TextInput
          className="numberbox"
          value={value}
          min={minValue || 0}
          max={maxValue || 99}
          onChange={changeHandler}
        />
        <p className="numberbox-container-days">{finalWord || 'дн.'}</p>
      </div>
    </div>
  );
};

export default memo(ReportReglamentDurationItem);
