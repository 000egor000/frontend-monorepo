import { combineReducers } from 'redux';
import { registerReducer } from '@atollis/ot_105_5_0070';
import reportParamsReducer, {
  ReportParamsState,
  REPORT_PARAMS_KEY,
} from './reportParamsReducer/reportParamsReducer';
import taskParamsReducer, {
  TaskParamsState,
  TASK_PARAMS_KEY,
} from './taskParamsReducer/taskParamsReducer';
import campaignFormReducer, {
  CampaignFormState,
  CAMPAIGN_FORM_KEY,
} from './Campaigns/campaignFormReducer';
import reportReglamentReducer, {
  REPORT_REGLAMENT_KEY,
  ReportReglamentState,
} from './reportReglamentReducer/reportReglamentReducer';

interface managementState {
  [TASK_PARAMS_KEY]: TaskParamsState;
  [CAMPAIGN_FORM_KEY]: CampaignFormState;
  [REPORT_PARAMS_KEY]: ReportParamsState;
  [REPORT_REGLAMENT_KEY]: ReportReglamentState;
}

const managementReducer = combineReducers<managementState>({
  [TASK_PARAMS_KEY]: taskParamsReducer,
  [CAMPAIGN_FORM_KEY]: campaignFormReducer,
  [REPORT_PARAMS_KEY]: reportParamsReducer,
  [REPORT_REGLAMENT_KEY]: reportReglamentReducer,
});

export const MANAGEMENT = 'management';

export interface ManagementStore {
  [MANAGEMENT]: managementState;
}

registerReducer(MANAGEMENT, managementReducer);
