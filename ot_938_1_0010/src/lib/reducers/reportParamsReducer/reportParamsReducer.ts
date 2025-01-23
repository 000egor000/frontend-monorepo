import {
  createSelector,
  createSlice,
  Dispatch,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  compareWithoutOrder,
  getGUID,
  http,
  RootState,
} from '@atollis/ot_105_5_0070';
import Endpoints from '../../Endpoints';
import { MANAGEMENT, ManagementStore } from '../managementReducer';
import {
  createIdentifiedObj,
  createIdentifiedObjInputForm,
  createIdentifiedObjUser,
  createIdentifiedObjWithIdentifier,
  IdentifiedInputForm,
  IdentifiedObj,
  IdentifiedUser,
  takeTimeZone,
} from '../../helpers';
import {
  IAllReglamentVariables,
  ISentReglament,
} from '../reportReglamentReducer/reportReglamentReducer';

export const REPORT_PARAMS_KEY = 'report-params';

export interface Report {
  // form data
  name: string;
  processTemplate?: IdentifiedObj;
  responsibleIogv?: IdentifiedObj;
  activity?: IdentifiedObj;
  inputForm?: IdentifiedInputForm;
  description?: string;

  identifier: string;
  reportDate?: string;
  status?: IdentifiedObj;
  reportMembers?: (IdentifiedObj | undefined)[] | undefined;
  reportMembersString?: string;
  curator?: IdentifiedUser;
  createDate?: string;
  createAuthor?: IdentifiedUser;
  expiredCampaigns?: IdentifiedObj[];
  code?: string;
  startDate?: string;
  endDate?: string;
}

export interface ShowcaseReport {
  IDENTIFIKATOR: string;
  SKHEMA_SOGLASOVANIYA: string;
  IDENTIFIKATOR_OTCHETA: string;
  NAIMENOVANIE_OTCHETA: string;
  'OTVETSTVENNY`J_IOGV': string;
  OTCHETNAYA_DATA: string;
  STATUS_OTCHYOTA: string;
  'IDENTIFIKATOR_FORMY`_VVODA': string;
  FORMA_VVODA: string;
  'SSY`LKA_NA_FORMU_VVODA': string;
  UCHASTNIKI_OTCHETA: string;
  REGLAMENT: string;
  KURATOR: string;
  DATA_SOZDANIYA: string;
  AVTOR_SOZDANIYA: string;
  'AKTIVNOST`': string;
  'PROSROCHENNY`J': string;
  ATRIBUT_DLYA_PODSVETKI?: string;
  CZVET_PODSVETKI_ATRIBUTA?: string;
  'TEKST_OSHIBKI_BIZNES-PRAVILA'?: string;
}

export interface ResponseReport {
  obj_id: string;
  IDENTIFIKATOR: string;
  NAIMENOVANIE: string;
  OPISANIE: string;
  DATA_SOZDANIYA?: string;
  'OTVETSTVENNY`J_IOGV'?: {
    obj_id: string;
    NAIMENOVANIE: string;
  };
  'AKTUAL`NOST`'?: {
    obj_id: string;
    NAIMENOVANIE: string;
  };
  FORMA_VVODA?: {
    obj_id: string;
    NAIMENOVANIE: string;
    'SSY`LKA_NA_FORMU_VVODA': string;
  };
  KURATOR?: {
    obj_id: string;
    FIO: string;
    'OTVETSTVENNY`J_IOGV': {
      obj_id: string;
      NAIMENOVANIE: string;
    };
  };
  SHABLON_PROCZESSA?: {
    IDENTIFIKATOR: string;
    obj_id: string;
    NAIMENOVANIE: string;
    OPISANIE: string;
  };
  UCHASTNIK?: {
    'OTVETSTVENNY`J_IOGV': {
      obj_id: string;
      NAIMENOVANIE: string;
    };
  };
  AVTOR?: {
    FIO: string;
  };
  KOD?: string;
  DATA_NACHALA_DEJSTVIYA?: string;
  DATA_OKONCHANIYA_DEJSTVIYA?: string;
}

interface ResponseInputFormInReport {
  FORMA_VVODA: {
    NAIMENOVANIE: string;
    'SSY`LKA_NA_FORMU_VVODA': string;
    obj_id: string;
  };
}

interface ResponseRoleWithReport {
  obj_id: string;

  OTCHET: {
    obj_id: string;
    IDENTIFIKATOR: string;
  };
}

export interface ResponseDepartmentRoleInReport extends ResponseRoleWithReport {
  PODRAZDELENIE: {
    obj_id: string;
    NAIMENOVANIE: string;
    IDENTIFIKATOR: string;
  };
}

export interface ResponseEmployeeRoleInReport extends ResponseRoleWithReport {
  SOTRUDNIKI: {
    obj_id: string;
    NAIMENOVANIE: string;
  };
}
interface ResponseExtraReportData {
  responsibleIogv?: ResponseDepartmentRoleInReport[];
  reportMembers?: ResponseDepartmentRoleInReport[];
  curator?: ResponseEmployeeRoleInReport[];
  author?: ResponseEmployeeRoleInReport[];
}

type ResponseReportWithExtraData = ResponseReport & ResponseExtraReportData;

type SaveAction = 'save' | 'create' | 'saveAndGoRoute';
export interface ReportParamsState {
  report: Report | null;
  formData: Report | null;
  isLoading: boolean;
  isChanged: boolean;
  isChangedReglament: boolean;
  // validation
  isValid: boolean;
  isValidMembers: boolean;
  isValidReglament: boolean;
  isCheckValid: boolean;
  saveAction: SaveAction;
}

const initialState: ReportParamsState = {
  isLoading: false,
  report: null,
  formData: null,
  isChanged: false,
  isChangedReglament: false,
  // validation
  isValid: false,
  isValidMembers: false,
  isValidReglament: false,
  isCheckValid: false,
  saveAction: 'save',
};

export const reportParamsSlice = createSlice({
  name: REPORT_PARAMS_KEY,
  initialState,
  reducers: {
    // formData
    updateFormData: (
      state,
      action: PayloadAction<Partial<Omit<Report, 'identifier'>>>,
    ) => {
      if (state.formData) {
        state.formData = { ...state.formData, ...action.payload };
        state.isChanged =
          !compareWithoutOrder(state.formData, state.report) ||
          state.isChangedReglament;
      }
    },
    setIsChangedReglament: (state, action: PayloadAction<boolean>) => {
      state.isChangedReglament = action.payload;
      state.isChanged =
        !compareWithoutOrder(state.formData, state.report) || action.payload;
    },
    resetFormData: state => {
      state.formData = state.report;
      state.isChanged = false;
    },
    // report
    fetchReportRequest: state => {
      state.isLoading = true;
      state.report = null;
      state.formData = null;
    },
    fetchReportSuccess: (state, action: PayloadAction<Report>) => {
      state.report = action.payload;
      state.formData = action.payload;
      state.isLoading = false;
      state.isChanged = false;
    },
    fetchReportFailure: state => {
      state.isLoading = false;
    },
    // save data
    saveReportRequest: state => {
      state.isLoading = true;
    },
    saveReportSuccess: state => {
      state.isLoading = false;
    },
    saveReportFailure: state => {
      state.isLoading = false;
    },
    // validation
    setIsCheckValid: (
      state: ReportParamsState,
      action: PayloadAction<{ isCheck: boolean; saveAction?: SaveAction }>,
    ) => {
      state.isCheckValid = action.payload.isCheck;
      if (action.payload.saveAction) {
        state.saveAction = action.payload.saveAction;
      }
    },
    setIsValid: (state: ReportParamsState, action: PayloadAction<boolean>) => {
      state.isValid = action.payload;
    },
    setIsValidMembers: (
      state: ReportParamsState,
      action: PayloadAction<boolean>,
    ) => {
      state.isValidMembers = action.payload;
    },
    setIsValidReglament: (
      state: ReportParamsState,
      action: PayloadAction<boolean>,
    ) => {
      state.isValidReglament = action.payload;
    },
    // clear
    clearReportParams: () => initialState,
    resetReportFormState: (state: ReportParamsState) => {
      state.formData = state.report;
      state.isChanged = false;
    },
  },
});

export const {
  // formData
  updateFormData,
  resetFormData,
  setIsChangedReglament,
  // report
  fetchReportRequest,
  fetchReportSuccess,
  fetchReportFailure,
  // save data
  saveReportRequest,
  saveReportSuccess,
  saveReportFailure,
  // validation
  setIsCheckValid,
  setIsValid,
  setIsValidMembers,
  setIsValidReglament,
  // clear
  clearReportParams,
  // reset
  resetReportFormState,
} = reportParamsSlice.actions;

// Selectors
const reportParamsState = (state: RootState & ManagementStore) =>
  state[MANAGEMENT][REPORT_PARAMS_KEY];

export const reportParamsSelector = createSelector(
  reportParamsState,
  data => data,
);

// async actions
export const getReport = (id: string) => (dispatch: Dispatch) => {
  dispatch(fetchReportRequest());
  http
    .get<{ d: ResponseReport[] }>(Endpoints.reports(), {
      params: {
        $decorator: 'odataPlus',
        $expand:
          'OTVETSTVENNY`J_IOGV, SHABLON_PROCZESSA, FORMA_VVODA, AKTUAL`NOST`, AVTOR, KURATOR, KOD, DATA_NACHALA_DEJSTVIYA, DATA_OKONCHANIYA_DEJSTVIYA',
        $filter: `IDENTIFIKATOR eq ${id}`,
      },
    })
    .then(response => {
      const report = response.data.d[0];
      // array with extra data
      const extraFields = [
        { name: 'responsibleIogv', fetch: fetchResponsibleIogv },
        { name: 'reportMembers', fetch: fetchReportMembers },
        { name: 'curator', fetch: fetchCurator },
        { name: 'author', fetch: fetchAuthor },
      ];

      const requests = extraFields.map(field =>
        field
          .fetch([report.IDENTIFIKATOR])
          .then(res => ({ fieldName: field.name, data: res.data.d })),
      );

      return Promise.all(requests)
        .then(addExtraFieldsToReports(report))
        .then(res => {
          dispatch(fetchReportSuccess(createReport(res)));
        });
    })
    .catch(() => dispatch(fetchReportFailure()));
};

export const fetchResponsibleIogv = (reportIdentifiers: string[]) =>
  http.get<{ d: ResponseDepartmentRoleInReport[] }>(
    Endpoints.divisionRoleInReport(),
    {
      params: {
        $decorator: 'odataPlus',
        $expand: 'ROL`,PODRAZDELENIE, OTCHET',
        $select: 'PODRAZDELENIE/NAIMENOVANIE, PODRAZDELENIE/IDENTIFIKATOR',
        $filter: addReportsToFilter(
          'ROL`/NAIMENOVANIE eq "Ответственный"',
          reportIdentifiers,
        ),
      },
    },
  );
export const fetchReportMembers = (reportIdentifiers: string[]) =>
  http.get<{ d: ResponseDepartmentRoleInReport[] }>(
    Endpoints.divisionRoleInReport(),
    {
      params: {
        $decorator: 'odataPlus',
        $expand: 'ROL`,PODRAZDELENIE, OTCHET',
        $select: 'PODRAZDELENIE/NAIMENOVANIE, PODRAZDELENIE/IDENTIFIKATOR',
        $filter: addReportsToFilter(
          'ROL`/NAIMENOVANIE eq "Участник"',
          reportIdentifiers,
        ),
        $top: 10000000,
      },
    },
  );
export const fetchCurator = (reportIdentifiers: string[]) =>
  http.get<{ d: ResponseEmployeeRoleInReport[] }>(
    Endpoints.employeeRoleInReport(),
    {
      params: {
        $decorator: 'odataPlus',
        $expand: 'ROL`, SOTRUDNIKI, OTCHET',
        $select: 'SOTRUDNIKI/NAIMENOVANIE, SOTRUDNIKI/IDENTIFIKATOR',
        $filter: addReportsToFilter(
          'ROL`/NAIMENOVANIE eq "Куратор"',
          reportIdentifiers,
        ),
      },
    },
  );

export const fetchInputForm = (reportIdentifiers: string[]) =>
  http.get<{ d: ResponseInputFormInReport[] }>(Endpoints.reports(), {
    params: {
      $decorator: 'odataPlus',
      $expand: 'FORMA_VVODA',
      $select:
        'FORMA_VVODA/KOD, FORMA_VVODA/NAIMENOVANIE, FORMA_VVODA/SSY`LKA_NA_FORMU_VVODA',
      $filter: `IDENTIFIKATOR eq ${reportIdentifiers[0]}`,
    },
  });

const fetchAuthor = (reportIdentifiers: string[]) =>
  http.get<{ d: ResponseEmployeeRoleInReport[] }>(
    Endpoints.employeeRoleInReport(),
    {
      params: {
        $decorator: 'odataPlus',
        $expand: 'ROL`, SOTRUDNIKI, OTCHET',
        $select: 'SOTRUDNIKI/NAIMENOVANIE, SOTRUDNIKI/IDENTIFIKATOR',
        $filter: addReportsToFilter(
          'ROL`/NAIMENOVANIE eq "Автор"',
          reportIdentifiers,
        ),
      },
    },
  );

export const saveReport =
  (data: Report, reglament: IAllReglamentVariables) =>
  async (dispatch: Dispatch) => {
    dispatch(saveReportRequest());

    const newReglamen = { ...reglament };

    if (!newReglamen.identifikator) {
      const newId = await getGUID();
      newReglamen.identifikator = newId;
    }

    const requestData = requestDataMapperForSave(data, newReglamen);
    console.log('save report: ', requestData);

    return http
      .post<Report & { reglamentReport: ISentReglament }>(
        Endpoints.saveReport(),
        requestData,
      )
      .then(() => {
        dispatch(saveReportSuccess());
        return data;
      })
      .catch(() => {
        dispatch(saveReportFailure());
        return null;
      });
  };

export const createEmptyFormData =
  (author: { login: string; name: string }) => async (dispatch: Dispatch) => {
    dispatch(fetchReportRequest());

    const idPromise = getGUID();
    const activityPromise = http
      .get<{ d: { id: string; name: string }[] }>(
        Endpoints.relevanceStatuses(),
        {
          params: {
            $decorator: 'odataPlus',
            $select: 'NAIMENOVANIE',
            $filter: 'NAIMENOVANIE eq "Неактивен"',
          },
        },
      )
      .then(res => createIdentifiedObj(res.data.d[0]));

    const [id, activity] = await Promise.all([idPromise, activityPromise]);

    dispatch(
      fetchReportSuccess({
        identifier: id,
        name: '',
        createDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        createAuthor: { id: '', ...author },
        activity,
        description: '',
        code: '',
        startDate: '',
        endDate: '',
        reportMembers: [],
        reportMembersString: '',
      }),
    );
  };

const createReport = (responseReport: ResponseReportWithExtraData): Report => ({
  name: responseReport.NAIMENOVANIE, // +
  processTemplate: createIdentifiedObjWithIdentifier(
    responseReport.SHABLON_PROCZESSA,
  ),
  responsibleIogv: createIdentifiedObjWithIdentifier({
    ...responseReport.responsibleIogv?.[0].PODRAZDELENIE,
  }), // Promise
  activity: createIdentifiedObj(responseReport['AKTUAL`NOST`']), // +
  inputForm: createIdentifiedObjInputForm(responseReport.FORMA_VVODA), // +
  description: responseReport.OPISANIE || '', // +

  identifier: responseReport.IDENTIFIKATOR, // +
  // reportDate: responseReport, // -
  // status: createIdentifiedObj(responseReport), // -
  reportMembers: responseReport.reportMembers
    ?.map(i => createIdentifiedObjWithIdentifier(i.PODRAZDELENIE))
    .filter(i => i !== undefined),
  reportMembersString: responseReport.reportMembers
    ?.map(i => createIdentifiedObj(i.PODRAZDELENIE))
    .filter(i => i !== undefined)
    .map(el => el?.name)
    .join(', '),
  // reglament: responseReport,
  curator: createIdentifiedObjUser({
    ...responseReport.curator?.[0].SOTRUDNIKI,
  }), // Promise
  createDate: responseReport.DATA_SOZDANIYA || '', // +
  createAuthor: createIdentifiedObjUser({
    ...responseReport.author?.[0].SOTRUDNIKI,
  }), // Promise
  // expiredCampaigns: responseReport, // -
  code: responseReport.KOD || '',
  startDate: responseReport.DATA_NACHALA_DEJSTVIYA || '',
  endDate: responseReport.DATA_OKONCHANIYA_DEJSTVIYA || '',
});

// helpers

const addExtraFieldsToReports =
  (reports: ResponseReport) =>
  (responses: { fieldName: string; data: ResponseRoleWithReport[] }[]) => {
    const extraObj = responses.reduce<
      Record<string, Record<string, ResponseRoleWithReport[]>>
    >((acc, { fieldName, data }) => {
      data.forEach(i => {
        const { obj_id: objId } = i.OTCHET;

        if (acc[objId]) {
          if (acc[objId][fieldName]) acc[objId][fieldName].push(i);
          else acc[objId][fieldName] = [i];
        } else {
          acc[objId] = {
            [fieldName]: [i],
          };
        }
      });

      return acc;
    }, {});

    const res = {
      ...reports,
      ...(extraObj[reports.obj_id] || {}),
    };

    return res as ResponseReportWithExtraData;
  };

const addReportsToFilter = (filter: string, reportIdentifiers: string[]) =>
  !reportIdentifiers.length
    ? filter
    : `${filter} and ( ${reportIdentifiers
        .map(id => `OTCHET/IDENTIFIKATOR eq "${id}"`)
        .join(' or ')} )`;

export const requestDataMapperForSave = (
  obj: Report,
  reglament: IAllReglamentVariables,
) => {
  const emptyVal = null;
  const reglamentMap = { ...reglament };

  switch (reglament.completionItem) {
    case 'endDate':
      reglamentMap.runCountValue = null;
      break;
    case 'runCount':
      reglamentMap.finishDateReglament = null;
      break;

    default:
      reglamentMap.finishDateReglament = null;
      reglamentMap.runCountValue = null;
      break;
  }

  return {
    reports: {
      name: obj.name || emptyVal,
      processTemplate: {
        id: obj.processTemplate?.id || emptyVal,
        name: obj.processTemplate?.name || emptyVal,
        identifier: obj.processTemplate?.identifier || emptyVal,
      },
      responsibleIogv: {
        id: obj.responsibleIogv?.id || emptyVal,
        name: obj.responsibleIogv?.name || emptyVal,
        identifier: obj.responsibleIogv?.identifier || emptyVal,
      },
      activity: {
        id: obj.activity?.id || emptyVal,
        name: obj.activity?.name || emptyVal,
      },
      inputForm: {
        id: obj.inputForm?.id || emptyVal,
        name: obj.inputForm?.name || emptyVal,
        link: obj.inputForm?.link || emptyVal,
        code: obj.inputForm?.code || emptyVal,
        identifier: obj.inputForm?.identifier || emptyVal,
      },
      description: obj.description || emptyVal,
      identifier: obj.identifier || emptyVal,
      reportMembers: obj.reportMembers || [],
      curator: {
        id: obj.curator?.id || emptyVal,
        name: obj.curator?.name || emptyVal,
        login: obj.curator?.login || emptyVal,
      },
      createDate: obj.createDate || emptyVal,
      createAuthor: {
        id: obj.createAuthor?.id || emptyVal,
        name: obj.createAuthor?.name || emptyVal,
        login: obj.createAuthor?.login || emptyVal,
      },
      code: obj.code || emptyVal,
      startDate: obj.startDate || emptyVal,
      endDate: obj.endDate || emptyVal,
      reglamentReport: {
        identifier: reglamentMap.identifikator,
        start_date: reglamentMap.startDateReglament
          ? takeTimeZone(reglamentMap.startDateReglament)
          : null,
        finish_date: reglamentMap.finishDateReglament
          ? takeTimeZone(reglamentMap.finishDateReglament)
          : null,
        rgl_type: reglamentMap.rglType,
        run_count: reglamentMap.runCountValue,
        constraint: reglamentMap.constraint,
        is_actual: '1',
        input_data: reglamentMap.inputData,
        reconciliation_data: reglamentMap.reconciliationData,
        validation_data: reglamentMap.validationData,
        shift_data: reglamentMap.shiftData,
        reglament_name: reglamentMap.reglamentName,
      },
    },
  };
};

export default reportParamsSlice.reducer;
