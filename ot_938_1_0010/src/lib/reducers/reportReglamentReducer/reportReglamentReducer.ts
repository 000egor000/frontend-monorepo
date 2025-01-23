import {
  createSelector,
  createSlice,
  Dispatch,
  PayloadAction,
} from '@reduxjs/toolkit';
import { http, RootState } from '@atollis/ot_105_5_0070';
import { MANAGEMENT, ManagementStore } from '../managementReducer';
import Endpoints from '../../Endpoints';
import {
  createReportReglament,
  createReglamentByName,
  createReglamentByType,
} from '../../helpers';

export const REPORT_REGLAMENT_KEY = 'report-reglament';

export type ReglamentPeriodNames =
  | 'Не задан'
  | 'Ежедневно'
  | 'Еженедельно'
  | 'Ежемесячно'
  | 'Ежегодно';

export type DaysOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface IRadioGroupItems {
  completionItem?: string;
  monthlyIntervalItem?: string;
  annualIntervalItem?: string;
}

export interface IReglamentPeriod {
  name: ReglamentPeriodNames;
  value: number | null;
}

export interface ResponceReportReglament {
  IDENTIFIKATOR: string;
  DATA_NACHALA: string;
  DATA_OKONCHANIYA: string | null;
  TIP_REGLAMENTA: number;
  KOLICHESTVO_POVTORENIJ: number | null;
  USLOVIYA_ZAPUSKA: string | null;
  'FLAG_AKTUAL`NOSTI': string;
  'DLITEL`NOST`_VVODA': number;
  'DLITEL`NOST`_SOGLASOVANIYA': number;
  'DLITEL`NOST`_UTVERZHDENIYA': number;
  'SDVIG_DATY`_STARTA': string | number | null;
  NAIMENOVANIE_REGLAMENTA: string;
  FAKTICHESKOE_KOLICHESTVO_POVTORENIJ: number | null;
  OTCHETNAYA_DATA: string | null;
  bo_id: string;
  obj_id: string;
}

export interface ISentReglament {
  identifikator?: string; //  в таком виде приходит
  identifier?: string; //  для отправления
  startDateReglament: string | null; // диалоговое окно поле «Начало»
  finishDateReglament: string | null; // диалоговое окно поле «Дата»
  rglType: number | null; // диалоговое окно тип регламента – 3 – Ежедневно, 4 – Еженедельно, 5 – Ежемесячно, 6 – Ежегодно
  runCountValue: number | null; // диалоговое окно поле «После»
  constraint: string | null; // диалоговое окно – Условие запуска
  is_actual?: string;
  inputData: number | null; // поле «Ввод данных»
  reconciliationData: number | null; // поле «Согласование данных»
  validationData: number | null; // поле «Утверждение данных»
  shiftData: number | null; // поле «Смещение запуска к отчётной дате»
  reglamentName: string | null; // поле «Регламент запуска»
}

export interface IConstraint {
  interval: number | null;
  dayOfWeek?: string | null;
  dayOfMonth?: number | null;
  weekOfMonth?: number | null;
  month?: number | null;
  monthFromDate?: number | null;
  monthFromWeek?: number | null;
  date?: number | null;
}
export interface IChangeableFieldsConstraint {
  day_of_week?: string | null;
  day_of_month?: number | null;
  week_of_month?: number | null;
}

export type IAllReglamentVariables = ISentReglament &
  IConstraint &
  IRadioGroupItems;

export interface ReportReglamentState {
  period: IReglamentPeriod;
  identifikator?: string;
  incomingReglament: IAllReglamentVariables;
  intermediateReglament: IAllReglamentVariables;
  reglament: IAllReglamentVariables;
  isLoading: boolean;
  disabledSave: boolean;
}

const initialReglametValues = {
  startDateReglament: null,
  finishDateReglament: null,
  rglType: null,
  runCountValue: null,
  constraint: null,
  inputData: 0,
  reconciliationData: 0,
  validationData: 0,
  shiftData: 0,
  reglamentName: null,
  interval: null,
};

export const initialState: ReportReglamentState = {
  period: { name: 'Не задан', value: null },
  identifikator: undefined,
  incomingReglament: initialReglametValues,
  reglament: initialReglametValues,
  intermediateReglament: initialReglametValues,
  isLoading: false,
  disabledSave: false,
};

export const reportReglamentSlice = createSlice({
  name: REPORT_REGLAMENT_KEY,
  initialState,
  reducers: {
    fetchReglamentRequest: state => {
      state.isLoading = true;
      state.reglament = initialState.reglament;
      state.period = initialState.period;
    },
    fetchReglamentSuccess: (
      state,
      action: PayloadAction<IAllReglamentVariables>,
    ) => {
      state.reglament = action.payload;
      state.incomingReglament = action.payload;
      state.intermediateReglament = action.payload;
      state.period = createReglamentByType(action.payload.rglType);
      state.identifikator = action.payload.identifikator;
      state.isLoading = false;
    },
    fetchReglamentFailure: state => {
      state.isLoading = false;
    },
    setPeriod: (state, action: PayloadAction<ReglamentPeriodNames>) => {
      const period = createReglamentByName(action.payload);
      state.period = period;
      if (period.value === state.incomingReglament.rglType) {
        state.reglament = {
          ...state.incomingReglament,
          rglType: period.value,
        };
        state.intermediateReglament = {
          ...state.incomingReglament,
          rglType: period.value,
        };
      } else {
        const { inputData, reconciliationData, validationData, shiftData } =
          state.reglament;

        if (period.value === 3) {
          state.reglament = {
            ...initialValuesDaily,
            inputData,
            reconciliationData,
            validationData,
            shiftData,
          };
        }

        if (period.value === 4) {
          state.reglament = {
            ...initialValuesWeekly,
            inputData,
            reconciliationData,
            validationData,
            shiftData,
          };
        }

        if (period.value === 5) {
          state.reglament = {
            ...initialValuesMouthly,
            inputData,
            reconciliationData,
            validationData,
            shiftData,
          };
        }

        if (period.value === 6) {
          state.reglament = {
            ...initialValuesAnnual,
            inputData,
            reconciliationData,
            validationData,
            shiftData,
          };
        }
      }
      if (!period.value) {
        const { inputData, reconciliationData, validationData, shiftData } =
          state.reglament;
        state.reglament = {
          ...initialState.reglament,
          startDateReglament: null,
          finishDateReglament: null,
          ...{ inputData, reconciliationData, validationData, shiftData },
        };
      }
    },
    setReglament: (
      state,
      action: PayloadAction<Partial<IAllReglamentVariables>>,
    ) => {
      const reglamentData = { ...state.reglament, ...action.payload };

      if (reglamentData.completionItem === 'endDate') {
        if (
          !reglamentData.finishDateReglament &&
          reglamentData.startDateReglament
        ) {
          reglamentData.finishDateReglament = tomorrow;
        }
        if (
          reglamentData?.startDateReglament &&
          reglamentData?.finishDateReglament &&
          reglamentData?.startDateReglament >=
            reglamentData?.finishDateReglament
        ) {
          state.disabledSave = true;
        }
        if (
          !reglamentData?.startDateReglament ||
          !reglamentData?.finishDateReglament
        ) {
          state.disabledSave = true;
        }
        if (
          reglamentData?.startDateReglament &&
          reglamentData?.finishDateReglament &&
          reglamentData?.startDateReglament < reglamentData?.finishDateReglament
        ) {
          state.disabledSave = false;
        }
      } else {
        state.disabledSave = false;
      }

      if (
        reglamentData.monthlyIntervalItem === 'dateOfMonth' &&
        reglamentData.interval
      ) {
        const maxMonthLength = months.find(
          el => el.value === reglamentData.interval,
        )?.length;

        if (
          maxMonthLength &&
          reglamentData.dayOfMonth &&
          maxMonthLength < reglamentData.dayOfMonth
        ) {
          reglamentData.dayOfMonth = maxMonthLength;
        }
      }
      if (
        reglamentData.annualIntervalItem === 'annualDateOfMonth' &&
        reglamentData.monthFromDate
      ) {
        const maxMonthLength = months.find(
          el => el.value === reglamentData.monthFromDate,
        )?.length;

        if (
          maxMonthLength &&
          reglamentData.date &&
          maxMonthLength < reglamentData.date
        ) {
          reglamentData.date = maxMonthLength;
        }
      }
      const key = Object.keys(action.payload)[0];
      if (
        key === 'inputData' ||
        key === 'reconciliationData' ||
        key === 'validationData' ||
        key === 'shiftData'
      ) {
        state.intermediateReglament = reglamentData;
      }

      state.reglament = reglamentData;
    },
    setInitialReglament: state => {
      state.reglament = initialState.reglament;
      state.incomingReglament = initialState.incomingReglament;
      state.intermediateReglament = initialState.intermediateReglament;
      state.period = initialState.period;
    },
    saveReglamentPopupValues: state => {
      const objectToCompare = { ...state.reglament };
      const popupValues = { ...state.reglament };

      if (
        objectToCompare.rglType === null &&
        state.incomingReglament.rglType === null
      ) {
        state.reglament = state.incomingReglament;
        state.intermediateReglament = state.incomingReglament;
      } else {
        const completionItemMap: { [key: string]: () => void } = {
          runCount: () => {
            if (objectToCompare && objectToCompare.runCountValue) {
              popupValues.runCountValue = objectToCompare.runCountValue;
            } else {
              popupValues.runCountValue = 1;
            }
          },
          endDate: () => {
            if (objectToCompare && objectToCompare.finishDateReglament) {
              popupValues.finishDateReglament =
                objectToCompare.finishDateReglament;
            }
          },
        };

        if (popupValues.completionItem) {
          completionItemMap[popupValues.completionItem]?.();
        }

        if (state.reglament.monthlyIntervalItem) {
          const monthlyIntervalItemMap: { [key: string]: () => void } = {
            dateOfMonth: () => {
              if (objectToCompare && objectToCompare.dayOfMonth) {
                popupValues.dayOfMonth = objectToCompare.dayOfMonth;
              } else {
                popupValues.dayOfMonth = 1;
              }
              if (objectToCompare && objectToCompare.interval) {
                popupValues.interval = objectToCompare.interval;
              } else {
                popupValues.interval = 1;
              }
            },
            weekDayOfMonth: () => {
              if (objectToCompare && objectToCompare.weekOfMonth) {
                popupValues.weekOfMonth = objectToCompare.weekOfMonth;
              } else {
                popupValues.weekOfMonth = 1;
              }
              if (objectToCompare && objectToCompare.dayOfWeek) {
                popupValues.dayOfWeek = objectToCompare.dayOfWeek;
              } else {
                popupValues.dayOfWeek = 'monday';
              }
              popupValues.interval = 1;
            },
          };
          monthlyIntervalItemMap[state.reglament.monthlyIntervalItem]?.();
        }

        if (state.reglament.annualIntervalItem) {
          const annualIntervalItemMap: { [key: string]: () => void } = {
            annualDateOfMonth: () => {
              popupValues.date = objectToCompare?.date;
              popupValues.monthFromDate = objectToCompare?.monthFromDate;
            },
            annualWeekDayOfMouth: () => {
              popupValues.weekOfMonth = objectToCompare?.weekOfMonth;
              popupValues.dayOfWeek = objectToCompare?.dayOfWeek;
              popupValues.monthFromWeek = objectToCompare?.monthFromWeek;
            },
          };
          annualIntervalItemMap[state.reglament.annualIntervalItem]?.();
        }

        const {
          interval,
          dayOfWeek,
          rglType,
          monthlyIntervalItem,
          annualIntervalItem,
          dayOfMonth,
          date,
          monthFromDate,
          monthFromWeek,
          weekOfMonth,
        } = popupValues;

        const arr = [];
        let constraintString = '';
        if (rglType) {
          arr.push(`interval=${interval || '1'}`);

          if (
            dayOfWeek &&
            (rglType === 4 ||
              (rglType === 5 && monthlyIntervalItem === 'weekDayOfMonth') ||
              (rglType === 6 && annualIntervalItem === 'annualWeekDayOfMouth'))
          ) {
            arr.push(`day_of_week=${dayOfWeek}`);
          }
          if (
            dayOfMonth &&
            rglType === 5 &&
            monthlyIntervalItem === 'dateOfMonth'
          ) {
            arr.push(`day_of_month=${dayOfMonth}`);
          }
          if (
            date &&
            rglType === 6 &&
            annualIntervalItem === 'annualDateOfMonth'
          ) {
            arr.push(`date=${date}`);
          }
          if (
            monthFromDate &&
            rglType === 6 &&
            annualIntervalItem === 'annualDateOfMonth'
          ) {
            arr.push(`month=${monthFromDate}`);
          }
          if (
            monthFromWeek &&
            rglType === 6 &&
            annualIntervalItem === 'annualWeekDayOfMouth'
          ) {
            arr.push(`month=${monthFromWeek}`);
          }
          if (
            weekOfMonth &&
            ((rglType === 5 && monthlyIntervalItem === 'weekDayOfMonth') ||
              (rglType === 6 && annualIntervalItem === 'annualWeekDayOfMouth'))
          ) {
            arr.push(`week_of_month=${weekOfMonth}`);
          }

          constraintString = arr.join(';');
        }

        const newReglament = {
          ...state.reglament,
          ...popupValues,
          runCountValue: popupValues.runCountValue || null,
          constraint: constraintString || null,
        };

        state.reglament = newReglament;
        state.intermediateReglament = newReglament;
      }
    },
    resetReglamentPopup: state => {
      const { inputData, reconciliationData, validationData, shiftData } =
        state.reglament;
      const saveData = {
        ...state.intermediateReglament,
        inputData,
        reconciliationData,
        validationData,
        shiftData,
      };
      state.reglament = saveData;
    },
    resetReglament: state => {
      state.reglament = state.incomingReglament;
    },
    resetPeriod: state => {
      state.period = createReglamentByType(state.incomingReglament.rglType);
    },
  },
});

export const {
  fetchReglamentRequest,
  fetchReglamentSuccess,
  fetchReglamentFailure,
  setPeriod,
  setReglament,
  setInitialReglament,
  saveReglamentPopupValues,
  resetReglamentPopup,
  resetReglament,
  resetPeriod,
} = reportReglamentSlice.actions;

// Selectors
const reportReglamentState = (state: RootState & ManagementStore) =>
  state[MANAGEMENT][REPORT_REGLAMENT_KEY];

export const reportReglamentSelector = createSelector(
  reportReglamentState,
  data => data,
);

// http
export const getReportReglament = (id: string) => (dispatch: Dispatch) => {
  dispatch(fetchReglamentRequest());
  http
    .get(Endpoints.reportReglament(), {
      params: {
        $decorator: 'odataPlus',
        $expand: 'OTCHET',
        $filter: `OTCHET/IDENTIFIKATOR eq ${id}`,
      },
    })
    .then(res => {
      dispatch(fetchReglamentSuccess(createReportReglament(res.data.d[0])));
    })
    .catch(() => dispatch(fetchReglamentFailure()));
};

export default reportReglamentSlice.reducer;

export const today = `${new Date().toISOString().split('T')[0]}T00:00:00.000`;
export const tomorrow = `${
  new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .split('T')[0]
}T00:00:00.000`;

export const initialValuesDaily = {
  startDateReglament: today,
  finishDateReglament: tomorrow,
  rglType: 3,
  runCountValue: 1,
  constraint: 'interval=1',
  reglamentName: 'Ежедневно',
  completionItem: 'never',
  interval: 1,
};

export const initialValuesWeekly = {
  startDateReglament: today,
  finishDateReglament: tomorrow,
  rglType: 4,
  runCountValue: 1,
  constraint: 'interval=1',
  reglamentName: 'Еженедельно',
  interval: 1,
  completionItem: 'never',
};

export const initialValuesMouthly = {
  startDateReglament: today,
  finishDateReglament: tomorrow,
  rglType: 5,
  runCountValue: 1,
  constraint: 'interval=1;dayOfMonth=1',
  reglamentName: 'Ежемесячно',
  interval: 1,
  dayOfWeek: 'monday',
  monthlyIntervalItem: 'dateOfMonth',
  completionItem: 'never',
  weekOfMonth: 1,
  dayOfMonth: 1,
};

export const initialValuesAnnual = {
  startDateReglament: today,
  finishDateReglament: tomorrow,
  rglType: 6,
  runCountValue: 1,
  constraint: 'interval=1;date=1;month=1',
  reglamentName: 'Ежегодно',
  interval: 1,
  dayOfWeek: 'monday',
  annualIntervalItem: 'annualDateOfMonth',
  completionItem: 'never',
  weekOfMonth: 1,
  monthFromWeek: 1,
  date: 1,
  monthFromDate: 1,
};

export const months = [
  { label: 'Янв', value: 1 },
  { label: 'Фев', value: 2 },
  { label: 'Мрт', value: 3 },
  { label: 'Апр', value: 4 },
  { label: 'Май', value: 5 },
  { label: 'Июн', value: 6 },
  { label: 'Июл', value: 7 },
  { label: 'Авг', value: 8 },
  { label: 'Сен', value: 9 },
  { label: 'Окт', value: 10 },
  { label: 'Нбр', value: 11 },
  { label: 'Дек', value: 12 },
];
