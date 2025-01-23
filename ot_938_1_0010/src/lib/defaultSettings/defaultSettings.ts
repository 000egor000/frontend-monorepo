import { IPreset, Layouts } from '@atollis/ot_105_5_0070';
import {
  layoutsReports,
  layoutsTasks,
  layoutsCampaigns,
  layoutsReportEditDetail,
  layoutsReportCreateDetail,
  layoutsCampaignEditDetail,
  layoutsCampaignCreateDetail,
  layoutsTaskDetail,
} from './defaultLayouts';

export interface IMonitoringSettings {
  layouts: Layouts;
  presets: IPreset[];
  activePreset?: IPreset;
}

export interface IDetailSettings {
  layouts: Layouts;
}

export interface IManagementSettings {
  campaignMonitoring: IMonitoringSettings;
  taskMonitoring: IMonitoringSettings;
  reportMonitoring: IMonitoringSettings;
  reportEditDetail: IDetailSettings;
  reportCreateDetail: IDetailSettings;
  campaignEditDetail: IDetailSettings;
  campaignCreateDetail: IDetailSettings;
  taskDetail: IDetailSettings;
}

const defaultSettings: IManagementSettings = {
  taskMonitoring: {
    layouts: layoutsTasks,
    presets: [],
  },
  campaignMonitoring: {
    layouts: layoutsCampaigns,
    presets: [],
  },
  reportMonitoring: {
    layouts: layoutsReports,
    presets: [],
  },
  reportEditDetail: {
    layouts: layoutsReportEditDetail,
  },
  reportCreateDetail: {
    layouts: layoutsReportCreateDetail,
  },
  campaignEditDetail: {
    layouts: layoutsCampaignEditDetail,
  },
  campaignCreateDetail: {
    layouts: layoutsCampaignCreateDetail,
  },
  taskDetail: {
    layouts: layoutsTaskDetail,
  },
};
export default defaultSettings;
