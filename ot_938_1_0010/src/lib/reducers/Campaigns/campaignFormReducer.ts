import {
  createSlice,
  PayloadAction,
  createSelector,
  Dispatch,
} from '@reduxjs/toolkit';
import { compareWithoutOrder, http, RootState } from '@atollis/ot_105_5_0070';
import Endpoints from '../../Endpoints';
import { MANAGEMENT, ManagementStore } from '../managementReducer';
import {
  createFilter,
  createIdentifiedObj,
  createIdentifiedObjUser,
  createIdentifiedObjWithIdentifier,
  createReport,
  IdentifiedObj,
  IdentifiedUser,
} from '../../helpers';

export const CAMPAIGN_FORM_KEY = 'campaignForm';

type BusinessObject = {
  NAIMENOVANIE: string;
  bo_id: string;
  obj_id: string;
};

export interface Campaign {
  identifier: string | null;
  name: string | null;
  report?: {
    identifier: string | null;
    name: string | null;
    createDate?: string | null;
    processTemplate?: {
      id: string | null;
      name: string | null;
      identifier: string | null;
    };
    code?: string | null;
  };
  inputForm?: {
    name: string | null;
    link?: string | null;
    url?: string | null;
    id?: string | null;
  };
  reportingDate?: string | null;
  startDateFact?: string | null;
  startDatePlan?: string | null;
  completionDateFact?: string | null;
  completionDatePlan?: string | null;
  status?: IdentifiedObj;
  curator?: IdentifiedUser;
  responsibleIOGV?: IdentifiedObj;
  participatingDivision?: (IdentifiedObj | undefined)[] | undefined;
  participatingDivisionString?: string | undefined | null;
  code?: string | null;
}

export interface ShowcaseCampaign {
  IDENTIFIKATOR: string;
  IDENTIFIKATOR_KAMPANII: string;
  NAIMENOVANIE_KAMPANII: string;
  IDENTIFIKATOR_OTCHETA: string;
  OTCHET: string;
  'IDENTIFIKATOR_FORMY`_VVODA': string;
  FORMA_VVODA: string;
  'SSY`LKA_NA_FORMU_VVODA': string;
  OTCHETNAYA_DATA: string;
  'DATA_NACHALA_`<PLAN`>': string;
  'DATA_ZAVERSHENIYA_`<PLAN`>': string;
  'DATA_NACHALA_`<FAKT`>': string;
  'DATA_ZAVERSHENIYA_`<FAKT`>': string;
  STATUS_KAMPANII: string;
  KURATOR: string;
  'OTVETSTVENNY`J_IOGV': string;
  UCHASTNIKI: string;
  AVTOR: string;
  ATRIBUT_DLYA_PODSVETKI?: string;
  CZVET_PODSVETKI_ATRIBUTA?: string;
  'TEKST_OSHIBKI_BIZNES-PRAVILA'?: string;
}

export interface CampaignResponse {
  'DATA_NACHALA_`<FAKT`>'?: string;
  'DATA_NACHALA_`<PLAN`>'?: string;
  'DATA_ZAVERSHENIYA_`<FAKT`>'?: string;
  'DATA_ZAVERSHENIYA_`<PLAN`>'?: string;
  IDENTIFIKATOR: string;
  NAIMENOVANIE: string;
  OTCHET: {
    DATA_SOZDANIYA: string;
    FORMA_VVODA: {
      IDENTIFIKATOR: string;
      NAIMENOVANIE: string;
      'SSY`LKA_NA_FORMU_VVODA': string;
    };
    IDENTIFIKATOR: string;
    NAIMENOVANIE: string;
    OPISANIE: string;
    bo_id: string;
    obj_id: string;
    KOD?: string;
  };
  OTCHYOTNAYA_DATA?: string;
  bo_id: string;
  obj_id: string;
  // _________________________
  KURATOR?: {
    FIO: string;
    IDENTIFIKATOR: string;
    'OTVETSTVENNY`J_IOGV': {
      IDENTIFIKATOR: string;
      NAIMENOVANIE: string;
      bo_id: string;
      obj_id: string;
    };
    bo_id: string;
    obj_id: string;
  };
  OPISANIE?: string;
  // TODO Author_____________________
  AVTOR?: {
    obj_id: string;
    NAIMENOVANIE: string;
  };
  // TODO Author_____________________
  'OTVETSTVENNY`J_IOGV'?: {
    NAIMENOVANIE: string;
    bo_id: string;
    obj_id: string;
  };
  STATUS_KAMPANII?: {
    IDENTIFIKATOR: string;
    NAIMENOVANIE: string;
    obj_id: string;
    bo_id: string;
  };
  UCHASTNIK?: BusinessObject[];
  KOD?: string;
}

export type fieldName =
  | 'name'
  | 'report'
  | 'inputForm'
  | 'reportingDate'
  | 'startDateFact'
  | 'startDatePlan'
  | 'completionDateFact'
  | 'completionDatePlan'
  | 'status'
  | 'curator'
  | 'responsibleIOGV'
  | 'participatingDivision'
  | 'code';

type ActionFormData = {
  name: string;
  data: string | IdentifiedObj | IdentifiedObj[];
};

export type AdditionalData = {
  PODRAZDELENIE: BusinessObject;
  KAMPANIYA: BusinessObject;
};

export const initialCampaign: Campaign = {
  identifier: '',
  name: '',
  report: { identifier: '', name: '', code: '' },
  inputForm: { url: '', name: '', link: '' },
  reportingDate: '',
  startDateFact: '',
  startDatePlan: '',
  completionDateFact: '',
  completionDatePlan: '',
  status: { id: '', name: '' },
  curator: { id: '', name: '' },
  responsibleIOGV: { id: '', name: '' },
  participatingDivision: [],
  code: '',
};

type SaveAction = 'save' | 'create' | 'saveAndGoRoute';

export interface CampaignFormState {
  campaign: Campaign;
  isLoading: boolean;
  isLoadFilligFields: boolean;
  formData: Campaign;
  isChanged: boolean;
  isCheckValid: boolean;
  isValid: boolean;
  isValidParticipatingDivisions: boolean;
  isUpdatedAfterSaving: boolean;
  saveAction: SaveAction;
}

export const initialState: CampaignFormState = {
  campaign: initialCampaign,
  formData: initialCampaign,
  isLoading: false,
  isLoadFilligFields: false,
  isChanged: false,
  isCheckValid: false,
  isValid: false,
  isValidParticipatingDivisions: false,
  isUpdatedAfterSaving: false,
  saveAction: 'save',
};

export const campaignFormSlice = createSlice({
  name: CAMPAIGN_FORM_KEY,
  initialState: initialState as CampaignFormState,
  reducers: {
    fetchCampaignRequest: (state: CampaignFormState) => {
      state.isLoading = true;
    },
    fetchCampaignSuccess: (
      state: CampaignFormState,
      action: PayloadAction<Campaign>,
    ) => {
      state.campaign = action.payload;
      state.isLoading = false;

      state.formData = action.payload;
      state.isChanged = false;
    },
    fetchCampaignFailure: (state: CampaignFormState) => {
      state.isLoading = false;
    },

    setFormData: (
      state: CampaignFormState,
      action: PayloadAction<ActionFormData>,
    ) => {
      state.formData = {
        ...state.formData,
        [action.payload.name]: action.payload.data,
      };
    },
    setIsChanged: (state: CampaignFormState) => {
      state.isChanged = !compareWithoutOrder(state.campaign, state.formData);
    },
    saveCampaignRequest: state => {
      state.isLoading = true;
    },
    saveCampaignSuccess: state => {
      state.isLoading = false;
    },
    saveCampaignFailure: state => {
      state.isLoading = false;
    },
    // validation
    setIsCheckValid: (
      state: CampaignFormState,
      action: PayloadAction<{
        isCheck: boolean;
        saveAction?: SaveAction;
      }>,
    ) => {
      state.isCheckValid = action.payload.isCheck;
      if (action.payload.saveAction) {
        state.saveAction = action.payload.saveAction;
      }
    },
    setIsValid: (state: CampaignFormState, action: PayloadAction<boolean>) => {
      state.isValid = action.payload;
    },
    setIsValidParticipatingDivisions: (
      state: CampaignFormState,
      action: PayloadAction<boolean>,
    ) => {
      state.isValidParticipatingDivisions = action.payload;
    },
    clearCampaignFormState: () => initialState,
    resetCampaignFormState: (state: CampaignFormState) => {
      state.formData = state.campaign;
      state.isChanged = false;
    },
    setIsLoadFillingFields: (
      state: CampaignFormState,
      action: PayloadAction<boolean>,
    ) => {
      state.isLoadFilligFields = action.payload;
    },
    setUpdatedAfterSaving: state => {
      state.isUpdatedAfterSaving = !state.isUpdatedAfterSaving;
    },
  },
});

export const {
  fetchCampaignRequest,
  fetchCampaignSuccess,
  fetchCampaignFailure,
  setFormData,
  setIsChanged,
  saveCampaignRequest,
  saveCampaignSuccess,
  saveCampaignFailure,
  // validation
  setIsCheckValid,
  setIsValid,
  setIsValidParticipatingDivisions,
  clearCampaignFormState,
  resetCampaignFormState,
  // filling fields
  setIsLoadFillingFields,
  setUpdatedAfterSaving,
} = campaignFormSlice.actions;

// Selectors
const getCampaignFormState = (state: RootState & ManagementStore) =>
  state[MANAGEMENT][CAMPAIGN_FORM_KEY];

export const campaignFormSelector = createSelector(
  getCampaignFormState,
  state => state,
);
export const campaignFormData = createSelector(
  getCampaignFormState,
  state => state.formData,
);
export const campaignIsUpdatedAfterSaving = createSelector(
  getCampaignFormState,
  state => state.isUpdatedAfterSaving,
);
// http action
const campaignFields =
  'OTVETSTVENNY`J_IOGV, UCHASTNIK, KURATOR, OTCHET, OTCHET/FORMA_VVODA,OTCHET/SHABLON_PROCZESSA, OTCHET/KOD, STATUS_KAMPANII, KOD';

export const getCampaign = (id: string) => (dispatch: Dispatch) => {
  dispatch(fetchCampaignRequest());
  http
    .get<{ d: CampaignResponse[] }>(Endpoints.campaigns(), {
      params: {
        $expand: campaignFields,
        $decorator: 'odataPlus',
        $filter: `IDENTIFIKATOR eq ${id}`,
      },
    })
    .then(res => {
      const campaign = res.data.d[0];
      const campaignId = res.data.d[0].IDENTIFIKATOR;
      return Promise.all([
        loadResponsible([campaignId]),
        loadParticipants([campaignId]),
        loadEmployee([campaignId], 'Куратор'),
        loadEmployee([campaignId], 'Автор'),
      ]).then(([responsibleRes, participantsRes, curatorRes, authorRes]) => {
        let newCam = campaign;
        const responsibleIOGV = responsibleRes.data.d.find(
          (item: AdditionalData) => item.KAMPANIYA.obj_id === campaign.obj_id,
        );
        const participants: AdditionalData[] = participantsRes.data.d.filter(
          (item: AdditionalData) => item.KAMPANIYA.obj_id === campaign.obj_id,
        );
        const curator = curatorRes.data.d.find(
          (item: AdditionalData) => item.KAMPANIYA.obj_id === campaign.obj_id,
        );

        if (responsibleIOGV)
          newCam = {
            ...newCam,
            'OTVETSTVENNY`J_IOGV': responsibleIOGV.PODRAZDELENIE,
          };
        if (participants) {
          newCam = {
            ...newCam,
            UCHASTNIK: participants.map(el => el.PODRAZDELENIE),
          };
        }
        if (curator) {
          newCam = {
            ...newCam,
            KURATOR: curator.SOTRUDNIKI,
          };
        }
        newCam = { ...newCam, AVTOR: authorRes.data.d[0]?.SOTRUDNIKI };

        dispatch(fetchCampaignSuccess(formattingCampaigns(newCam)));
      });
    })
    .catch(() => {
      dispatch(fetchCampaignFailure());
    });
};

const loadResponsible = (campaignsIds: string[]) =>
  http
    .get(Endpoints.roleDivisionInCampaign(), {
      params: {
        $expand: 'ROL`, PODRAZDELENIE, KAMPANIYA',
        $select: 'PODRAZDELENIE/NAIMENOVANIE',
        $decorator: 'odataPlus',
        $filter: createFilter('Ответственный', campaignsIds),
        $top: 10000000,
      },
    })
    .then(res => res);

const loadParticipants = (campaignsIds: string[]) =>
  http
    .get(Endpoints.roleDivisionInCampaign(), {
      params: {
        $expand: 'ROL`, PODRAZDELENIE, KAMPANIYA',
        $select: 'PODRAZDELENIE/NAIMENOVANIE',
        $decorator: 'odataPlus',
        $filter: createFilter('Участник', campaignsIds),
        $top: 10000000,
      },
    })
    .then(res => res);

const loadEmployee = (campaignsIds: string[], employeeName: string) =>
  http
    .get(Endpoints.roleEmployeeInCampaign(), {
      params: {
        $expand: 'ROL`, SOTRUDNIKI, KAMPANIYA',
        $select: 'SOTRUDNIKI/IDENTIFIKATOR, SOTRUDNIKI/NAIMENOVANIE',
        $decorator: 'odataPlus',
        $filter: createFilter(employeeName, campaignsIds),
      },
    })
    .then(res => res);

export const saveCampaign = (data: Campaign) => (dispatch: Dispatch) => {
  dispatch(saveCampaignRequest());
  const requestData = requestDataMapperForSave(data);
  console.log('save campaign: ', requestData);

  return http
    .post(Endpoints.saveCampaign(), requestData)
    .then(() => {
      dispatch(saveCampaignSuccess());
      return data;
    })
    .catch(() => {
      dispatch(saveCampaignFailure());
      return null;
    });
};

export const completeCampaign = (data: Campaign) => (dispatch: Dispatch) => {
  dispatch(saveCampaignRequest());
  const requestData = requestDataMapperForSave(data);
  console.log('complete campaign: ', requestData);

  return http
    .post(Endpoints.completeCampaign(), requestData)
    .then(() => {
      dispatch(saveCampaignSuccess());
      return data;
    })
    .catch(() => {
      dispatch(saveCampaignFailure());
      return null;
    });
};

// formatting
const formattingCampaigns = (campaign: CampaignResponse): Campaign => ({
  identifier: campaign.IDENTIFIKATOR,
  name: campaign.NAIMENOVANIE,
  report: createReport(campaign.OTCHET),
  inputForm: {
    id: campaign.OTCHET.FORMA_VVODA.IDENTIFIKATOR,
    name: campaign.OTCHET.FORMA_VVODA.NAIMENOVANIE,
    link: campaign.OTCHET.FORMA_VVODA['SSY`LKA_NA_FORMU_VVODA'],
  },
  reportingDate: campaign.OTCHYOTNAYA_DATA,
  startDateFact: campaign['DATA_NACHALA_`<FAKT`>'],
  startDatePlan: campaign['DATA_NACHALA_`<PLAN`>'],
  completionDateFact: campaign['DATA_ZAVERSHENIYA_`<FAKT`>'],
  completionDatePlan: campaign['DATA_ZAVERSHENIYA_`<PLAN`>'],
  status: createIdentifiedObjWithIdentifier(campaign.STATUS_KAMPANII),
  curator: createIdentifiedObjUser(campaign.KURATOR),
  responsibleIOGV: createIdentifiedObj(campaign['OTVETSTVENNY`J_IOGV']),
  participatingDivision: campaign?.UCHASTNIK?.map(createIdentifiedObj),
  participatingDivisionString: campaign?.UCHASTNIK?.map(createIdentifiedObj)
    .map(el => el?.name)
    .join(', '),
  code: campaign?.KOD,
});

export interface CampaignRequest {
  campaigns: Campaign;
}

const requestDataMapperForSave = (obj: Campaign): CampaignRequest => {
  const emptyVal = null;

  return {
    campaigns: {
      identifier: obj.identifier || emptyVal,
      name: obj.name || emptyVal,
      report: {
        name: obj.report?.name || emptyVal,
        identifier: obj.report?.identifier || emptyVal,
        createDate: obj.report?.createDate || emptyVal,
        processTemplate: {
          id: obj.report?.processTemplate?.id || emptyVal,
          identifier: obj.report?.processTemplate?.identifier || emptyVal,
          name: obj.report?.processTemplate?.name || emptyVal,
        },
      },
      inputForm: {
        id: obj.inputForm?.id || emptyVal,
        name: obj.inputForm?.name || emptyVal,
        url: obj.inputForm?.link || emptyVal,
      },
      reportingDate: obj.reportingDate || emptyVal,
      startDateFact: obj.startDateFact || emptyVal,
      startDatePlan: obj.startDatePlan || emptyVal,
      completionDateFact: obj.completionDateFact || emptyVal,
      completionDatePlan: obj.completionDatePlan || emptyVal,
      status: {
        id: obj.status?.id || emptyVal,
        name: obj.status?.name || emptyVal,
        identifier: obj.status?.identifier || emptyVal,
      },
      curator: {
        id: obj.curator?.id || emptyVal,
        name: obj.curator?.name || emptyVal,
        login: obj.curator?.login || emptyVal,
      },
      responsibleIOGV: {
        id: obj.responsibleIOGV?.id || emptyVal,
        name: obj.responsibleIOGV?.name || emptyVal,
        identifier: obj.responsibleIOGV?.identifier || emptyVal,
      },
      participatingDivision: obj.participatingDivision || [],
      code: obj.code || emptyVal,
    },
  };
};

export default campaignFormSlice.reducer;
