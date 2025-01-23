import { rootApi } from '@atollis/ot_105_5_0070';

const itgApi = '/itg_api/';

interface TaskAndProjectManagEndpoints {
  presets: () => string;
  relevanceStatuses: () => string;
  processTemplates: () => string;
  taskTypes: () => string;
  statuses: () => string;
  inputForms: () => string;
  // reports
  reports: () => string;
  saveReport: () => string;
  saveCampaign: () => string;
  saveTask: () => string;
  reportReglament: () => string;
  // tasks
  tasks: () => string;
  taskStatuses: () => string;
  campaignPresets: () => string;
  campaigns: () => string;
  campaignStatus: () => string;
  staff: () => string;
  divisions: () => string;
  roleDivisionInCampaign: () => string;
  roleEmployeeInCampaign: () => string;

  divisionRoleInReport: () => string;
  employeeRoleInReport: () => string;

  employeeRoleInTask: () => string;
  iogvvo: () => string;
  completeCampaign: () => string;
  showcaseTasks: () => string;
  showcaseCampaigns: () => string;
  showcaseReports: () => string;
}

const Endpoints: TaskAndProjectManagEndpoints = {
  presets: () => `${rootApi}presets`, // TODO add url
  relevanceStatuses: () => `${itgApi}masterRecords/odata/АКТУАЛЬНОСТЬ`,
  processTemplates: () => `${itgApi}masterRecords/odata/ШАБЛОН ПРОЦЕССА`,
  taskTypes: () => `${itgApi}masterRecords/odata/ТИП ЗАДАЧИ`,
  statuses: () => `${itgApi}masterRecords/odata/СТАТУС`, // Не используется
  taskStatuses: () => `${itgApi}masterRecords/odata/СТАТУС ЗАДАЧИ`,
  inputForms: () => `${itgApi}masterRecords/odata/ФОРМА ВВОДА`,
  // reports
  reports: () => `${itgApi}masterRecords/odata/ОТЧЕТ`,
  saveReport: () =>
    `${itgApi}boProxy/process/134556261236757755975016818508406466`,
  saveCampaign: () =>
    `${itgApi}boProxy/process/266550005673667235755422097760822566`,
  completeCampaign: () =>
    `${itgApi}boProxy/process/211150677812416429969056332558063854`,
  saveTask: () =>
    `${itgApi}boProxy/process/230204087789522025405535435069526707`,
  reportReglament: () =>
    `${itgApi}masterRecords/odata/РЕГЛАМЕНТ ЗАПУСКА ОТЧЕТОВ`,
  // tasks
  tasks: () => `${itgApi}masterRecords/odata/ЗАДАЧА`,
  campaignPresets: () => `${rootApi}atolluser/presets`, // TODO add url (Пока url из юзеров)
  campaigns: () => `${itgApi}masterRecords/odata/КАМПАНИЯ`,
  campaignStatus: () => `${itgApi}masterRecords/odata/СТАТУС КАМПАНИИ`,
  staff: () => `${itgApi}masterRecords/odata/СОТРУДНИКИ`,
  roleDivisionInCampaign: () =>
    `${itgApi}masterRecords/odata/РОЛЬ ПОДРАЗДЕЛЕНИЯ В КАМПАНИИ`,
  roleEmployeeInCampaign: () =>
    `${itgApi}masterRecords/odata/РОЛЬ СОТРУДНИКА В КАМПАНИИ`,
  divisions: () => `${itgApi}masterRecords/odata/ПОДРАЗДЕЛЕНИЕ`,

  divisionRoleInReport: () =>
    `${itgApi}masterRecords/odata/РОЛЬ ПОДРАЗДЕЛЕНИЯ В ОТЧЕТЕ`,
  employeeRoleInReport: () =>
    `${itgApi}masterRecords/odata/РОЛЬ СОТРУДНИКА В ОТЧЕТЕ`,
  employeeRoleInTask: () =>
    `${itgApi}masterRecords/odata/РОЛЬ СОТРУДНИКА В ЗАДАЧЕ`,
  iogvvo: () => `${itgApi}masterRecords/odata/ИОГВ ВО`,

  showcaseTasks: () => `${itgApi}masterRecords/odata/МОНИТОРИНГ ЗАДАЧ`,
  showcaseCampaigns: () => `${itgApi}masterRecords/odata/МОНИТОРИНГ КАМПАНИЯ`,
  showcaseReports: () => `${itgApi}masterRecords/odata/МОНИТОРИНГ ОТЧЕТОВ`,
};

export default Endpoints;
