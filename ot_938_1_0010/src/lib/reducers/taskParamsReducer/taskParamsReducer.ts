import {
  createSelector,
  createSlice,
  Dispatch,
  PayloadAction,
} from '@reduxjs/toolkit';
import { equals } from 'ramda';
import { http, RootState } from '@atollis/ot_105_5_0070';
import Endpoints from '../../Endpoints';
import { MANAGEMENT, ManagementStore } from '../managementReducer';
import {
  createIdentifiedObj,
  createIdentifiedObjUser,
  createIdentifiedObjWithIdentifier,
  createTaskFilter,
  IdentifiedObj,
  IdentifiedUser,
} from '../../helpers';

export const TASK_PARAMS_KEY = 'taskParams';

export type BusinessObject = {
  NAIMENOVANIE: string;
  IDENTIFIKATOR?: string;
  bo_id: string;
  obj_id: string;
};
export interface Task {
  identifier?: string;
  name?: string;
  description?: string;
  startDatePlan?: string;
  endDatePlan?: string;
  startDateFact?: string;
  endDateFact?: string;
  reportDate?: string;
  report?: { identifier: string; name: string };
  status?: IdentifiedObj;
  inputForm?: { name?: string; url?: string; id?: string };
  executor?: IdentifiedUser;
  campaign?: IdentifiedObj;
  reportType?: IdentifiedObj;
  taskType?: IdentifiedObj;
  division?: IdentifiedObj;
  typeButton?: string;
  statusButton?: string;
}
export interface TaskResponse {
  obj_id: string;
  IDENTIFIKATOR: string;
  NAIMENOVANIE: string;
  OPISANIE?: string;
  TIP_ZADACHI?: {
    obj_id: string;
    NAIMENOVANIE: string;
    KOD_TIPA: string;
  };
  'DATA_NACHALA_`<PLAN`>'?: string;
  'DATA_ZAVERSHENIYA_`<PLAN`>'?: string;
  'DATA_NACHALA_`<FAKT`>'?: string;
  'DATA_ZAVERSHENIYA_`<FAKT`>'?: string;
  KAMPANIYA: {
    'DATA_NACHALA_`<PLAN`>'?: string;
    'DATA_ZAVERSHENIYA_`<PLAN`>'?: string;
    'DATA_NACHALA_`<FAKT`>'?: string;
    'DATA_ZAVERSHENIYA_`<FAKT`>'?: string;
    NAIMENOVANIE: string;
    OTCHYOTNAYA_DATA?: string;
    OTCHET: {
      IDENTIFIKATOR: string;
      NAIMENOVANIE: string;
      FORMA_VVODA: {
        IDENTIFIKATOR: string;
        NAIMENOVANIE: string;
        'SSY`LKA_NA_FORMU_VVODA': string;
        obj_id: string;
      };
    };
    obj_id: string;
  };
  AVTOR?: {
    IDENTIFIKATOR: string;
    NAIMENOVANIE: string;
    obj_id: string;
  };
  'ISPOLNITEL`'?: {
    NAIMENOVANIE: string;
    obj_id: string;
  };
  PODRAZDELENIE?: {
    NAIMENOVANIE: string;
    obj_id: string;
  };
  STATUS_ZADACHI?: {
    obj_id: string;
    NAIMENOVANIE: string;
    IDENTIFIKATOR: string;
  };
  'OTVETSTVENNY`J_IOGV'?: {
    obj_id: string;
    NAIMENOVANIE: string;
  };
}

export interface ShowcaseTask {
  IDENTIFIKATOR: string;
  IDENTIFIKATOR_ZADACHI: string;
  NAIMENOVANIE_ZADACHI: string;
  OTCHET: string;
  TIP_ZADACHI: string;
  IDENTIFIKATOR_KAMPANII: string;
  KAMPANIYA: string;
  'DATA_NACHALA_`<PLAN`>': string;
  'DATA_ZAVERSHENIYA_`<PLAN`>': string;
  'DATA_NACHALA_`<FAKT`>': string;
  'DATA_ZAVERSHENIYA_`<FAKT`>': string;
  PODRAZDELENIE: string;
  'ISPOLNITEL`': string;
  AVTOR: string;
  STATUS_ZADACHI: string;
  OPISANIE: string;
  'IDENTIFIKATOR_FORMY`_VVODA': string;
  FORMA_VVODA: string;
  'SSY`LKA_NA_FORMU_VVODA': string;
  ATRIBUT_DLYA_PODSVETKI?: string;
  CZVET_PODSVETKI_ATRIBUTA?: string;
  'TEKST_OSHIBKI_BIZNES-PRAVILA'?: string;
}

export interface TaskParamsState {
  task: Task | null;
  formData: Task | null;
  isLoading: boolean;
  isChanged: boolean;
  isCheckValid: boolean;
  isValid: boolean;
}

const initialState: TaskParamsState = {
  isLoading: false,
  task: null,
  formData: null,
  isChanged: false,
  // validation
  isCheckValid: false,
  isValid: false,
};

export const taskParamsSlice = createSlice({
  name: TASK_PARAMS_KEY,
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<Task | undefined>) => {
      state.task = action.payload || null;
      state.formData = action.payload || null;
      state.isChanged = false;
    },
    updateFormData: (
      state,
      action: PayloadAction<Partial<Omit<Task, 'identifier'>>>,
    ) => {
      if (state.formData) {
        state.formData = { ...state.formData, ...action.payload };
        state.isChanged = !equals(state.formData, state.task);
      }
    },
    resetFormData: state => {
      state.formData = state.task;
      state.isChanged = false;
    },
    fetchTaskRequest: state => {
      state.isLoading = true;
      state.task = null;
      state.formData = null;
    },
    fetchTaskSuccess: (state, action: PayloadAction<Task>) => {
      state.task = action.payload;
      state.formData = action.payload;
      state.isLoading = false;
    },
    fetchTaskFailure: state => {
      state.isLoading = false;
    },
    // save data
    saveTaskRequest: state => {
      state.isLoading = true;
    },
    saveTaskSuccess: state => {
      state.isLoading = false;
    },
    saveTaskFailure: state => {
      state.isLoading = false;
    },
    // validation
    setIsCheckValid: (
      state: TaskParamsState,
      action: PayloadAction<boolean>,
    ) => {
      state.isCheckValid = action.payload;
    },
    setIsValid: (state: TaskParamsState, action: PayloadAction<boolean>) => {
      state.isValid = action.payload;
    },
    // clear
    clearTaskParams: () => initialState,
  },
});

export const {
  setFormData,
  updateFormData,
  resetFormData,
  fetchTaskRequest,
  fetchTaskSuccess,
  fetchTaskFailure,
  // save data
  saveTaskRequest,
  saveTaskSuccess,
  saveTaskFailure,
  // validation
  setIsCheckValid,
  setIsValid,
  // clear
  clearTaskParams,
} = taskParamsSlice.actions;

// Selectors
const taskParamsState = (state: RootState & ManagementStore) =>
  state[MANAGEMENT][TASK_PARAMS_KEY];

export const taskParamsSelector = createSelector(taskParamsState, data => data);

// async actions
const tasksFields =
  'TIP_ZADACHI, KAMPANIYA, KAMPANIYA/OTCHET, KAMPANIYA/OTCHET/FORMA_VVODA, STATUS_ZADACHI, ПОДРАЗДЕЛЕНИЕ';

export type AdditionalEmployee = {
  SOTRUDNIKI: BusinessObject;
  ZADACHA: BusinessObject;
  PODRAZDELENIE?: BusinessObject;
};

export const requestTask = async (id: string): Promise<Task | null> => {
  try {
    const res = await http.get<{ d: TaskResponse[] }>(Endpoints.tasks(), {
      params: {
        $expand: tasksFields,
        $decorator: 'odataPlus',
        $filter: `IDENTIFIKATOR eq ${id}`,
      },
    });
    const tasksId = res.data.d[0].IDENTIFIKATOR;
    const task = res.data.d[0];
    return Promise.all([
      loadRole([tasksId], 'Исполнитель'),
      loadInputForm(task.KAMPANIYA.OTCHET.FORMA_VVODA.IDENTIFIKATOR),
    ]).then(([executorsRes, inputFormRes]) => {
      let newTask = { ...task };

      const executor = executorsRes.data.d.find(
        (item: AdditionalEmployee) => item.ZADACHA.obj_id === task.obj_id,
      );

      if (executor) {
        newTask = {
          ...newTask,
          'ISPOLNITEL`': executor.SOTRUDNIKI,
        };
      }
      newTask = {
        ...newTask,
        KAMPANIYA: {
          ...newTask.KAMPANIYA,
          OTCHET: {
            ...newTask.KAMPANIYA.OTCHET,
            FORMA_VVODA: inputFormRes.data.d[0],
          },
        },
      };
      return createTask(newTask);
    });
  } catch (err) {
    return null;
  }
};

export const getTask = (id: string) => (dispatch: Dispatch) => {
  dispatch(fetchTaskRequest());

  requestTask(id)
    .then(newTask => {
      if (newTask) {
        dispatch(fetchTaskSuccess(newTask));
      } else {
        dispatch(fetchTaskFailure());
      }
    })
    .catch(() => {
      dispatch(fetchTaskFailure());
    });
};

const loadRole = (tasksIds: string[], fieldName: string) =>
  http
    .get(Endpoints.employeeRoleInTask(), {
      params: {
        $expand: 'ROL`, SOTRUDNIKI, ZADACHA',
        $decorator: 'odataPlus',
        $filter: createTaskFilter(fieldName, tasksIds),
      },
    })
    .then(res => res);

const loadInputForm = (inputFormId: string) =>
  http
    .get(Endpoints.inputForms(), {
      params: {
        $decorator: 'odataPlus',
        $filter: `IDENTIFIKATOR eq ${inputFormId}`,
      },
    })
    .then(res => res);

export const saveTask =
  (data: Task, action?: string) => (dispatch: Dispatch) => {
    dispatch(saveTaskRequest());
    const requestData = requestDataMaperForSave(data);
    console.log('save task OBJ: ', requestData);

    return http
      .post(Endpoints.saveTask(), requestData)
      .then(() => {
        dispatch(saveTaskSuccess());
        return 'success';
      })
      .catch(() => {
        dispatch(saveTaskFailure());
        return null;
      });
  };

export const createTask = (responseTask: TaskResponse): Task => ({
  // form data
  identifier: responseTask.IDENTIFIKATOR,
  name: responseTask.NAIMENOVANIE,
  description: responseTask.OPISANIE,
  campaign: createIdentifiedObjWithIdentifier(responseTask.KAMPANIYA),
  startDatePlan: responseTask['DATA_NACHALA_`<PLAN`>'],
  endDatePlan: responseTask['DATA_ZAVERSHENIYA_`<PLAN`>'],
  startDateFact: responseTask['DATA_NACHALA_`<FAKT`>'],
  endDateFact: responseTask['DATA_ZAVERSHENIYA_`<FAKT`>'],
  executor: createIdentifiedObjUser({ ...responseTask['ISPOLNITEL`'] }),
  status: createIdentifiedObjWithIdentifier(responseTask.STATUS_ZADACHI),
  reportDate: responseTask.KAMPANIYA?.OTCHYOTNAYA_DATA,
  // TODO найти id
  report: {
    name: responseTask.KAMPANIYA.OTCHET.NAIMENOVANIE,
    identifier: responseTask.KAMPANIYA.OTCHET.IDENTIFIKATOR,
  },
  inputForm: {
    name: responseTask.KAMPANIYA.OTCHET.FORMA_VVODA?.NAIMENOVANIE,
    id: responseTask.KAMPANIYA.OTCHET.FORMA_VVODA?.obj_id,
    url: responseTask.KAMPANIYA.OTCHET.FORMA_VVODA?.['SSY`LKA_NA_FORMU_VVODA'],
  },
  taskType: createIdentifiedObj(responseTask.TIP_ZADACHI),
  division: createIdentifiedObjWithIdentifier(responseTask?.PODRAZDELENIE),
  typeButton: responseTask.TIP_ZADACHI?.KOD_TIPA,
  statusButton: responseTask.STATUS_ZADACHI?.NAIMENOVANIE,
});

const requestDataMaperForSave = (obj: Task) => {
  const emptyVal = null;

  return {
    tasks: {
      identifier: obj.identifier || emptyVal,
      name: obj.name || emptyVal,
      description: obj.description || emptyVal,
      campaign: {
        id: obj.campaign?.id || emptyVal,
        identifier: obj.campaign?.identifier || emptyVal,
        name: obj.campaign?.name || emptyVal,
      },
      startDatePlan: obj.startDatePlan || emptyVal,
      endDatePlan: obj.endDatePlan || emptyVal,
      startDateFact: obj.startDateFact || emptyVal,
      endDateFact: obj.endDateFact || emptyVal,
      executor: {
        id: obj.executor?.id || emptyVal,
        name: obj.executor?.name || emptyVal,
        login: obj.executor?.login || emptyVal,
      },
      status: {
        id: obj.status?.id || emptyVal,
        name: obj.status?.name || emptyVal,
        identifier: obj.status?.identifier || emptyVal,
      },
      reportDate: obj.reportDate || emptyVal,
      report: {
        identifier: obj.report?.identifier || emptyVal,
        name: obj.report?.name || emptyVal,
      },
      inputForm: {
        name: obj.inputForm?.name || emptyVal,
        id: obj.inputForm?.id || emptyVal,
        url: obj.inputForm?.url || emptyVal,
      },
      taskType: {
        id: obj.taskType?.id || emptyVal,
        name: obj.taskType?.name || emptyVal,
      },
      division: {
        id: obj.division?.id || emptyVal,
        name: obj.division?.name || emptyVal,
        identifier: obj.division?.identifier || emptyVal,
      },
    },
  };
};

export default taskParamsSlice.reducer;
