import { memo } from 'react';

import { Select, TextInput, DatePicker } from '@atollis-ui/input';
import { Radio } from '@atollis-ui/radio';
import dayjs from 'dayjs';
import ReportReglamentDurationItem from '../ReportReglamentDurationItem';
import {
  IAllReglamentVariables,
  IConstraint,
  IRadioGroupItems,
  IReglamentPeriod,
  ISentReglament,
  months,
} from '../../../reducers/reportReglamentReducer/reportReglamentReducer';

import './PopupContentVariants.scss';

export interface PopupContentVariantsProps {
  period: IReglamentPeriod;
  reglamentData: IAllReglamentVariables;
  onReglamentValueChange: <T extends keyof IAllReglamentVariables>(
    fildName: T,
    value: string | number,
  ) => void;
}

export interface ButtonGroupCustomProps {
  reglamentData: string[] | undefined;
  onReglamentValueChange: <T extends keyof IAllReglamentVariables>(
    fildName: T,
    value: string | number,
  ) => void;
}

const ButtonGroupCustom = ({
  reglamentData,
  onReglamentValueChange,
}: ButtonGroupCustomProps) => {
  const clickItem = (value: string) => () => {
    const filterArray = reglamentData ?? [];

    const dataRes = (val: string): string =>
      (filterArray?.includes(val)
        ? filterArray.filter(el => el !== val)
        : filterArray.concat(val)
      ).join();

    onReglamentValueChange('dayOfWeek', dataRes(value));
  };

  const getClass = (value: string) =>
    reglamentData?.includes(value) ? 'active' : 'default';

  return (
    <ul className="button-group">
      {buttonGroupData.map(({ text, value }) => (
        <li
          key={text + value}
          className={getClass(value)}
          onClick={clickItem(value)}
        >
          {text}
        </li>
      ))}
    </ul>
  );
};

const PopupContentVariants = ({
  reglamentData,
  period,
  onReglamentValueChange,
}: PopupContentVariantsProps) => {
  const today = new Date(new Date().setHours(0, 0, 0, 0));

  const minEndDate = reglamentData.startDateReglament
    ? new Date(reglamentData.startDateReglament).setDate(
        new Date(reglamentData.startDateReglament).getDate() + 1,
      )
    : `${
        new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]
      }T00:00:00.000`;

  const handleRadioChange = (radioId: string) => {
    // Маппинг радио-кнопок на соответствующие значения
    const radioMappings: Record<
      string,
      {
        key: keyof ISentReglament | keyof IConstraint | keyof IRadioGroupItems;
        value: string | number;
      }
    > = {
      radioBtn1: { key: 'monthlyIntervalItem', value: 1 },
      radioBtn2: { key: 'monthlyIntervalItem', value: 0 },
      never: { key: 'completionItem', value: 'never' },
      runCount: { key: 'completionItem', value: 'runCount' },
      endDate: { key: 'completionItem', value: 'endDate' },
      radioBtn3: { key: 'annualIntervalItem', value: 'annualIntervalItem' },
      radioBtn4: { key: 'annualIntervalItem', value: 'annualWeekDayOfMouth' },
    };

    if (radioId in radioMappings) {
      const { key, value } = radioMappings[radioId];
      onReglamentValueChange(key, value);
    }
  };

  const onDateBoxValueChange =
    (name: keyof ISentReglament | keyof IConstraint | keyof IRadioGroupItems) =>
    (value: dayjs.Dayjs) => {
      onReglamentValueChange(
        name,
        value
          ? `${value.format('YYYY-MM-DDTHH:mm').split('T')[0]}T00:00:00.000`
          : value,
      );
    };

  return (
    <>
      {period.name === 'Ежедневно' && (
        <div className="reglament-popup-content-interval">
          <ReportReglamentDurationItem
            itemName="Интервал"
            fildName="interval"
            minValue={1}
            value={reglamentData.interval || 1}
            onValueChange={onReglamentValueChange}
          />
        </div>
      )}
      {period.name === 'Еженедельно' && (
        <>
          <div className="reglament-popup-content-interval">
            <ReportReglamentDurationItem
              itemName="Интервал"
              fildName="interval"
              minValue={1}
              value={reglamentData.interval || 1}
              finalWord="нед."
              onValueChange={onReglamentValueChange}
            />
          </div>
          <p className="p-over-content">Дни повторения</p>

          <ButtonGroupCustom
            reglamentData={reglamentData.dayOfWeek?.split(',')}
            onReglamentValueChange={onReglamentValueChange}
          />
        </>
      )}
      {period.name === 'Ежемесячно' && (
        <div className="reglament-popup-content-interval">
          <div className="report-reglament-content-item">
            <Radio
              id="radioBtn1"
              checked={!!reglamentData.monthlyIntervalItem}
              onChange={() => {
                handleRadioChange('radioBtn1');
              }}
            />
            <TextInput
              className="numberbox"
              value={reglamentData.dayOfMonth || 1}
              onChange={e => {
                handleRadioChange('radioBtn1');
                onReglamentValueChange('dayOfMonth', e.target.value);
              }}
            />
            <p>числа каждого</p>
            <Select
              className="select-temp-test"
              options={months}
              defaultValue={reglamentData.interval || months[0].value}
              onSelect={value => {
                handleRadioChange('radioBtn1');
                onReglamentValueChange('interval', value);
              }}
            />
            <p className="numberbox-container-days">мес.</p>
          </div>

          <div className="report-reglament-content-item">
            <Radio
              id="radioBtn2"
              checked={!reglamentData.monthlyIntervalItem}
              onChange={() => handleRadioChange('radioBtn2')}
            />
            <Select
              options={serialMonth}
              defaultValue={reglamentData.weekOfMonth || serialMonth[0].value}
              onSelect={value => {
                handleRadioChange('radioBtn2');
                onReglamentValueChange('weekOfMonth', value);
              }}
            />
            <div className="box-container">
              <Select
                options={buttonsWeek}
                defaultValue={
                  reglamentData.dayOfWeek?.split(',')[0] || buttonsWeek[0].value
                }
                onSelect={value => {
                  handleRadioChange('radioBtn2');
                  onReglamentValueChange('dayOfWeek', value);
                }}
              />
              <p className="numberbox-container-days">мес.</p>
            </div>
          </div>
        </div>
      )}
      {period.name === 'Ежегодно' && (
        <div className="reglament-popup-content-interval">
          <ReportReglamentDurationItem
            itemName="Интервал"
            fildName="interval"
            value={reglamentData.interval || 1}
            finalWord="г."
            minValue={1}
            onValueChange={onReglamentValueChange}
          />

          <div className="report-reglament-content-item">
            <Radio
              id="radioBtn3"
              checked={
                reglamentData.annualIntervalItem === 'annualIntervalItem'
              }
              onChange={() => handleRadioChange('radioBtn3')}
            />
            <TextInput
              className="numberbox"
              value={reglamentData.date || 1}
              onChange={e => {
                handleRadioChange('radioBtn3');
                onReglamentValueChange('date', e.target.value);
              }}
            />
            <p>числа каждого</p>
            <Select
              options={months}
              defaultValue={reglamentData.monthFromDate || months[0].value}
              className="months-selector"
              onSelect={value => {
                handleRadioChange('radioBtn3');
                onReglamentValueChange('monthFromDate', value);
              }}
            />
            <p className="numberbox-container-days">мес.</p>
          </div>
          <div className="report-reglament-content-item">
            <Radio
              id="radioBtn4"
              checked={
                reglamentData.annualIntervalItem === 'annualWeekDayOfMouth'
              }
              onChange={() => handleRadioChange('radioBtn4')}
            />
            <Select
              options={serialMonth}
              defaultValue={reglamentData.weekOfMonth || serialMonth[0].value}
              className="start-end-day-of-mouth-selector"
              onSelect={value => {
                handleRadioChange('radioBtn4');
                onReglamentValueChange('weekOfMonth', value);
              }}
            />
            <Select
              options={buttonsWeek}
              defaultValue={
                reglamentData.dayOfWeek?.split(',')[0] || buttonsWeek[0].value
              }
              className="week-day-selector"
              onSelect={value => {
                handleRadioChange('radioBtn4');
                onReglamentValueChange('dayOfWeek', value);
              }}
            />
            <Select
              options={months}
              defaultValue={reglamentData.monthFromWeek || months[0].value}
              className="months-selector"
              onSelect={value => {
                handleRadioChange('radioBtn4');
                onReglamentValueChange('monthFromWeek', value);
              }}
            />
          </div>
        </div>
      )}
      <div className="reglament-popup-content-interval-range">
        <div className="report-reglament-content-item datebox-container">
          <p>Начало</p>
          <div className="box-container">
            <DatePicker
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              value={
                reglamentData.startDateReglament
                  ? dayjs(reglamentData.startDateReglament)
                  : dayjs(today)
              }
              className="interval-box"
              format="M/D/YYYY"
              onChange={date => {
                onDateBoxValueChange('startDateReglament')(date as dayjs.Dayjs);
              }}
            />
          </div>
        </div>
        <p className="p-over-content">Окончание</p>
        <div
          className="report-reglament-content-item"
          style={{ justifyContent: 'flex-start' }}
        >
          <Radio
            id="never"
            checked={reglamentData.completionItem === 'never'}
            onChange={() => handleRadioChange('never')}
          />
          <p>Никогда</p>
        </div>
        <div className="report-reglament-content-item">
          <Radio
            id="runCount"
            checked={reglamentData.completionItem === 'runCount'}
            onChange={() => handleRadioChange('runCount')}
          />
          <ReportReglamentDurationItem
            itemName="После"
            fildName="runCountValue"
            finalWord="раз"
            value={reglamentData.runCountValue || 1}
            maxValue={1000}
            minValue={1}
            onValueChange={onReglamentValueChange}
            onRadioChange={handleRadioChange}
          />
        </div>
        <div className="report-reglament-content-item">
          <Radio
            id="endDate"
            checked={reglamentData.completionItem === 'endDate'}
            onChange={() => handleRadioChange('endDate')}
          />
          <div className="report-reglament-content-item datebox-container">
            <p>Дата</p>
            <div className="box-container">
              <DatePicker
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                value={
                  reglamentData.startDateReglament
                    ? dayjs(reglamentData.finishDateReglament)
                    : dayjs(minEndDate)
                }
                className="interval-box"
                format="M/D/YYYY"
                onChange={date => {
                  handleRadioChange('endDate');
                  onDateBoxValueChange('finishDateReglament')(
                    date as dayjs.Dayjs,
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const completion = [
  { text: 'Никогда', value: 'never' },
  { template: 'runCount', value: 'runCount' },
  { template: 'endDate', value: 'endDate' },
];

const serialMonth = [
  { label: 'Первый', value: 1 },
  { label: 'Второй', value: 2 },
  { label: 'Третий', value: 3 },
  { label: 'Четвертый', value: 4 },
  { label: 'Последний', value: 5 },
];

const buttonsWeek = [
  { label: 'Пн', value: 'monday' },
  { label: 'Вт', value: 'tuesday' },
  { label: 'Ср', value: 'wednesday' },
  { label: 'Чт', value: 'thursday' },
  { label: 'Пт', value: 'friday' },
  { label: 'Сб', value: 'saturday' },
  { label: 'Вс', value: 'sunday' },
];

const buttonGroupData = [
  { text: 'Пн', value: 'monday' },
  { text: 'Вт', value: 'tuesday' },
  { text: 'Ср', value: 'wednesday' },
  { text: 'Чт', value: 'thursday' },
  { text: 'Пт', value: 'friday' },
  { text: 'Сб', value: 'saturday' },
  { text: 'Вс', value: 'sunday' },
];

export default memo(PopupContentVariants);
