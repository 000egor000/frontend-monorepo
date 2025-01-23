import { convertToDDMMYYYY, parseStringToObject } from '@atollis/ot_105_5_0070';
import { ResponseReport } from './reducers/reportParamsReducer/reportParamsReducer';
import {
  IAllReglamentVariables,
  IChangeableFieldsConstraint,
  IConstraint,
  IRadioGroupItems,
  IReglamentPeriod,
  ReglamentPeriodNames,
  ResponceReportReglament,
} from './reducers/reportReglamentReducer/reportReglamentReducer';

export interface IdentifiedObj {
  id: string | null;
  name: string | null;
  value?: string;
  label?: string;
  identifier?: string | null;
}

export const getIdentifiedObjCreator =
  (options: { id: string; name: string }) =>
  (obj?: { [key: string]: unknown }): IdentifiedObj | undefined => {
    if (!obj || typeof obj[options.id] !== 'string') return undefined;

    const id = obj[options.id] as string;
    const name =
      typeof obj[options.name] === 'string'
        ? (obj[options.name] as string)
        : '';

    return { id, name };
  };

export const objCreatorByInputField =
  (options: {
    id: string;
    name: string;
    code: string;
    identifier: string;
    link: string;
  }) =>
  (obj?: { [key: string]: unknown }): IdentifiedInputForm | undefined => {
    if (!obj || typeof obj[options.id] !== 'string') return undefined;

    const id = obj[options.id] as string;
    const name =
      typeof obj[options.name] === 'string'
        ? (obj[options.name] as string)
        : '';
    const code = obj[options.code] as string;
    const identifier =
      typeof obj[options.identifier] === 'string'
        ? (obj[options.identifier] as string)
        : '';
    const link = obj[options.link] || '';

    return { id, name, code, identifier, link: link as string };
  };

export const createIdentifiedObj = getIdentifiedObjCreator({
  id: 'obj_id',
  name: 'NAIMENOVANIE',
});

export const createIputFormObj = objCreatorByInputField({
  id: 'obj_id',
  name: 'NAIMENOVANIE',
  code: 'KOD',
  identifier: 'IDENTIFIKATOR',
  link: 'SSY`LKA_NA_FORMU_VVODA',
});

export const createReport = (responseReport: ResponseReport) => ({
  identifier: responseReport.IDENTIFIKATOR,
  name: responseReport.NAIMENOVANIE,
  createDate: responseReport.DATA_SOZDANIYA,
  processTemplate: {
    id: responseReport.SHABLON_PROCZESSA?.obj_id,
    identifier: responseReport.SHABLON_PROCZESSA?.IDENTIFIKATOR,
    name: responseReport.SHABLON_PROCZESSA?.NAIMENOVANIE,
  },
  code: responseReport.KOD,
});

export const createReportReglament = (
  responseReportReglament?: Partial<ResponceReportReglament>,
): IAllReglamentVariables => {
  const reglament = {
    identifikator: responseReportReglament?.IDENTIFIKATOR,
    startDateReglament: responseReportReglament?.DATA_NACHALA || null,
    finishDateReglament: responseReportReglament?.DATA_OKONCHANIYA || null,
    rglType: Number(responseReportReglament?.TIP_REGLAMENTA) || null,
    runCountValue:
      Number(responseReportReglament?.KOLICHESTVO_POVTORENIJ) || null,
    constraint: responseReportReglament?.USLOVIYA_ZAPUSKA || null,
    is_actual: responseReportReglament?.['FLAG_AKTUAL`NOSTI'],
    inputData: Number(responseReportReglament?.['DLITEL`NOST`_VVODA']) || null,
    reconciliationData:
      Number(responseReportReglament?.['DLITEL`NOST`_SOGLASOVANIYA']) || null,
    validationData:
      Number(responseReportReglament?.['DLITEL`NOST`_UTVERZHDENIYA']) || null,
    shiftData: Number(responseReportReglament?.['SDVIG_DATY`_STARTA']) || null,
    reglamentName: responseReportReglament?.NAIMENOVANIE_REGLAMENTA || null,
  };
  const constraintObj: IConstraint &
    IRadioGroupItems &
    IChangeableFieldsConstraint = { interval: 1 };

  if (responseReportReglament?.USLOVIYA_ZAPUSKA) {
    Object.assign(
      constraintObj,
      parseStringToObject(responseReportReglament?.USLOVIYA_ZAPUSKA, ';', '='),
    );
  }

  for (const key in constraintObj) {
    if (key !== 'day_of_week') {
      const value = constraintObj[key as keyof IConstraint];
      if (typeof value === 'string') {
        const parsedValue = parseInt(value, 10);
        constraintObj[key as keyof IConstraint] = isNaN(parsedValue)
          ? null
          : (parsedValue as never);
      }
    }
  }
  if (constraintObj.day_of_week)
    delete Object.assign(constraintObj, {
      dayOfWeek: constraintObj.day_of_week,
    }).day_of_week;

  if (constraintObj.day_of_month)
    delete Object.assign(constraintObj, {
      dayOfMonth: constraintObj.day_of_month,
    }).day_of_month;

  if (constraintObj.week_of_month)
    delete Object.assign(constraintObj, {
      weekOfMonth: constraintObj.week_of_month,
    }).week_of_month;

  if (reglament.rglType === 6) {
    if (constraintObj.dayOfWeek) {
      constraintObj.annualIntervalItem = 'annualWeekDayOfMouth';
    } else {
      constraintObj.annualIntervalItem = 'annualDateOfMonth';
    }
  } else {
    constraintObj.annualIntervalItem = undefined;
  }

  if (reglament.rglType === 5) {
    if (constraintObj.dayOfWeek) {
      constraintObj.monthlyIntervalItem = 'weekDayOfMonth';
    } else {
      constraintObj.monthlyIntervalItem = 'dateOfMonth';
    }
  } else {
    constraintObj.monthlyIntervalItem = undefined;
  }

  if (reglament.runCountValue) {
    constraintObj.completionItem = 'runCount';
  } else if (reglament.finishDateReglament) {
    constraintObj.completionItem = 'endDate';
  } else {
    constraintObj.completionItem = 'never';
  }

  if (constraintObj.annualIntervalItem === 'annualWeekDayOfMouth') {
    constraintObj.monthFromWeek = constraintObj.month;
  }
  if (constraintObj.annualIntervalItem === 'annualDateOfMonth') {
    constraintObj.monthFromDate = constraintObj.month;
  }

  return Object.assign(reglament, constraintObj);
};

export const createReglamentByName = (
  periodName: ReglamentPeriodNames,
): IReglamentPeriod => {
  switch (periodName) {
    case 'Ежедневно':
      return { name: 'Ежедневно', value: 3 };
    case 'Еженедельно':
      return { name: 'Еженедельно', value: 4 };
    case 'Ежемесячно':
      return { name: 'Ежемесячно', value: 5 };
    case 'Ежегодно':
      return { name: 'Ежегодно', value: 6 };
    default:
      return { name: 'Не задан', value: null };
  }
};

export const createReglamentByType = (
  periodType: number | null,
): IReglamentPeriod => {
  switch (periodType) {
    case 3:
      return { name: 'Ежедневно', value: 3 };
    case 4:
      return { name: 'Еженедельно', value: 4 };
    case 5:
      return { name: 'Ежемесячно', value: 5 };
    case 6:
      return { name: 'Ежегодно', value: 6 };
    default:
      return { name: 'Не задан', value: null };
  }
};

export const takeTimeZone = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toISOString();
};

// Проверить, используется-ли где-то и удалить, если нет
export const createIdentifiedObjFIO = getIdentifiedObjCreator({
  id: 'obj_id',
  name: 'FIO',
});

export interface IdentifiedInputForm extends IdentifiedObj {
  link?: string;
  code?: string;
}

export const createIdentifiedObjInputForm = (obj?: {
  [key: string]: unknown;
}) => {
  const identifiedObj = createIdentifiedObj(obj);

  if (!identifiedObj) return undefined;

  const inputForm: IdentifiedInputForm = {
    ...identifiedObj,
    link: obj?.['SSY`LKA_NA_FORMU_VVODA'] as string,
    code: obj?.KOD as string,
    identifier: obj?.IDENTIFIKATOR as string,
  };

  return inputForm;
};

export interface IdentifiedUser extends IdentifiedObj {
  login?: string | null;
}

export const createIdentifiedObjUser = (obj?: { [key: string]: unknown }) => {
  const identifiedObj = createIdentifiedObj(obj);

  if (!identifiedObj) return undefined;

  const user: IdentifiedUser = {
    ...identifiedObj,
    login: obj?.IDENTIFIKATOR as string,
  };

  return user;
};

export interface ProcessTemplate extends IdentifiedObj {
  identifier: string;
}

export const createIdentifiedObjWithIdentifier = (obj?: {
  [key: string]: unknown;
}) => {
  const identifiedObj = createIdentifiedObj(obj);

  if (!identifiedObj) return undefined;

  const processTemplate: ProcessTemplate = {
    ...identifiedObj,
    identifier: obj?.IDENTIFIKATOR as string,
  };

  return processTemplate;
};

export const createIdentifiedObjWithIdentifierForAntd = (obj?: {
  [key: string]: unknown;
}) => {
  const identifiedObj = createIdentifiedObj(obj);

  if (!identifiedObj) return undefined;

  const processTemplate: ProcessTemplate = {
    ...identifiedObj,
    value: identifiedObj?.id as string,
    label: identifiedObj?.name as string,
    identifier: obj?.IDENTIFIKATOR as string,
  };

  return processTemplate;
};

// Создание имени для Кампании (Отчет + отчетная дата)
export const concatStringAndDate = (string?: string, date?: string): string =>
  `${`${string} ` ?? ''}${date ? convertToDDMMYYYY(date) : ''}`;

// Формирование поля $filter для запросов дополнительных данных
export const createFilter = (fieldName: string, campaignsIds: string[]) =>
  `ROL\`/NAIMENOVANIE eq "${fieldName}" and ( ${campaignsIds
    .map(el => `KAMPANIYA/IDENTIFIKATOR eq "${el}"`)
    .join(' or ')})`;

export const createTaskFilter = (fieldName: string, campaignsIds: string[]) =>
  `ROL\`/NAIMENOVANIE eq "${fieldName}" and ( ${campaignsIds
    .map(el => `ZADACHA/IDENTIFIKATOR eq "${el}"`)
    .join(' or ')})`;
