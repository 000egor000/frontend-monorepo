import { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  getGUID,
  http,
  OneBtnPopup,
  popupHelpers,
  TwoBtnsPopup,
} from '@atollis/ot_105_5_0070';
import { AlertSvg } from '@atollis/ot_105_5_0080';
import { Spin } from '@atollis-ui/spin';
import { EButtonVariant } from '@atollis-ui/button';
import RunReportModalContent from './RunReportModalContent';
import Endpoints from '../../Endpoints';
import { CampaignRequest } from '../../reducers/Campaigns/campaignFormReducer';
import {
  ResponseDepartmentRoleInReport,
  reportParamsSelector,
} from '../../reducers/reportParamsReducer/reportParamsReducer';

interface RunReportModalProps {
  visible?: boolean;
  onCancel: () => void;
  reportData: IReportData;
  setStatusType: (statusType: number) => void;
  statusModalOpen: () => void;
}

interface IReportData {
  id: string | undefined;
  name: string | undefined;
}

interface ReportResponse {
  FORMA_VVODA: {
    KOD: string;
    'SSY`LKA_NA_FORMU_VVODA': string;
    bo_id: string;
    obj_id: string;
  };
  IDENTIFIKATOR: string;
  NAIMENOVANIE: string;
  KOD: string;
  DATA_SOZDANIYA: string;
  bo_id: string;
  obj_id: string;
  SHABLON_PROCZESSA?: {
    bo_id: string;
    NAIMENOVANIE: string;
    IDENTIFIKATOR: string;
    obj_id: string;
  };
}

const expands = 'SHABLON_PROCZESSA,FORMA_VVODA';
const selects =
  'KOD,NAIMENOVANIE,IDENTIFIKATOR,DATA_SOZDANIYA,SHABLON_PROCZESSA/IDENTIFIKATOR,SHABLON_PROCZESSA/NAIMENOVANIE,FORMA_VVODA/KOD,FORMA_VVODA/SSY`LKA_NA_FORMU_VVODA';

const RunReportModal = ({
  visible,
  onCancel,
  reportData,
  setStatusType,
  statusModalOpen,
}: RunReportModalProps) => {
  const [reportingDate, setReportingDate] = useState('');
  const [startDatePlan, setStartDatePlan] = useState('');
  const [completionDatePlan, setCompletionDatePlan] = useState('');
  const [popupHelpersVisible, setPopupHelpersVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { formData } = useSelector(reportParamsSelector);

  const onSaveHandler = async (report: IReportData) => {
    const { id, name } = report;
    if ((id && formData && !name) || (id && name)) {
      setIsLoading(true);
      const dateTest = convertDate(reportingDate);
      await http
        .get(Endpoints.campaigns(), {
          params: {
            $filter: `NAIMENOVANIE eq "${formData?.name ?? name} ${dateTest}"`,
          },
        })
        .then(res => {
          if (res.data.d.length === 0) {
            Promise.all([
              http.get<{ d: ReportResponse[] }>(Endpoints.reports(), {
                params: {
                  $expand: expands,
                  $select: selects,
                  $decorator: 'odataPlus',
                  $filter: `IDENTIFIKATOR eq ${id}`,
                },
              }),
              http.get(Endpoints.campaignStatus(), {
                params: {
                  $decorator: 'odataPlus',
                  $filter: `IDENTIFIKATOR eq 1`,
                },
              }),
              http.get(Endpoints.employeeRoleInReport(), {
                params: {
                  $expand: 'SOTRUDNIKI',
                  $decorator: 'odataPlus',
                  $filter:
                    'ROL`/NAIMENOVANIE eq Куратор and OTCHET/IDENTIFIKATOR eq' +
                    ` ${id}`,
                },
              }),
              http.get(Endpoints.divisionRoleInReport(), {
                params: {
                  $expand: 'ROL`, PODRAZDELENIE, OTCHET',
                  $select:
                    'PODRAZDELENIE/IDENTIFIKATOR,PODRAZDELENIE/NAIMENOVANIE',
                  $decorator: 'odataPlus',
                  $filter:
                    'ROL`/NAIMENOVANIE eq Ответственный and OTCHET/IDENTIFIKATOR eq' +
                    ` ${id}`,
                },
              }),
              http.get(Endpoints.divisionRoleInReport(), {
                params: {
                  $expand: 'ROL`, PODRAZDELENIE, OTCHET',
                  $select:
                    'PODRAZDELENIE/IDENTIFIKATOR,PODRAZDELENIE/NAIMENOVANIE',
                  $decorator: 'odataPlus',
                  $filter:
                    'ROL`/NAIMENOVANIE eq Участник AND OTCHET/IDENTIFIKATOR eq' +
                    ` ${id}`,
                  $top: 10000000,
                },
              }),
              getGUID(),
            ]).then(
              ([
                reportsAndFormInputResponse,
                campaignStatusResponse,
                employeeRoleInReportResponse,
                divisionRoleInReportExecuteResponse,
                divisionRoleInReportMemberResponse,
                GUIDResponse,
              ]) => {
                const response: CampaignRequest = {
                  campaigns: {
                    identifier: GUIDResponse,
                    name: `${
                      reportsAndFormInputResponse.data.d[0].NAIMENOVANIE
                    } ${convertDate(reportingDate)}`,
                    code: `${
                      reportsAndFormInputResponse.data.d[0].KOD
                    } ${convertDate(reportingDate)}`,
                    report: {
                      name:
                        reportsAndFormInputResponse.data.d[0].NAIMENOVANIE ||
                        null,
                      identifier:
                        reportsAndFormInputResponse.data.d[0].IDENTIFIKATOR ||
                        null,
                      createDate:
                        reportsAndFormInputResponse.data.d[0].DATA_SOZDANIYA ||
                        null,
                      processTemplate: {
                        id:
                          reportsAndFormInputResponse.data.d[0]
                            ?.SHABLON_PROCZESSA?.obj_id || null,
                        identifier:
                          reportsAndFormInputResponse.data.d[0]
                            ?.SHABLON_PROCZESSA?.IDENTIFIKATOR || null,
                        name:
                          reportsAndFormInputResponse.data.d[0]
                            ?.SHABLON_PROCZESSA?.NAIMENOVANIE || null,
                      },
                    },
                    inputForm: {
                      id: reportsAndFormInputResponse.data.d[0].FORMA_VVODA
                        .obj_id,
                      name: reportsAndFormInputResponse.data.d[0].FORMA_VVODA
                        .KOD,
                      url: reportsAndFormInputResponse.data.d[0].FORMA_VVODA[
                        'SSY`LKA_NA_FORMU_VVODA'
                      ],
                    },
                    reportingDate,
                    startDateFact: null,
                    startDatePlan,
                    completionDateFact: null,
                    completionDatePlan,
                    status: {
                      id: '1',
                      name: campaignStatusResponse.data.d[0]?.NAIMENOVANIE,
                      identifier:
                        campaignStatusResponse.data.d[0]?.IDENTIFIKATOR,
                    },
                    curator: {
                      id: employeeRoleInReportResponse.data.d[0]?.SOTRUDNIKI
                        .obj_id,
                      name: employeeRoleInReportResponse.data.d[0]?.SOTRUDNIKI
                        .NAIMENOVANIE,
                      login:
                        employeeRoleInReportResponse.data.d[0]?.SOTRUDNIKI
                          .IDENTIFIKATOR,
                    },
                    responsibleIOGV: {
                      id: divisionRoleInReportExecuteResponse.data.d[0]
                        .PODRAZDELENIE.obj_id,
                      name: divisionRoleInReportExecuteResponse.data.d[0]
                        .PODRAZDELENIE.NAIMENOVANIE,
                      identifier:
                        divisionRoleInReportExecuteResponse.data.d[0]
                          .PODRAZDELENIE.IDENTIFIKATOR,
                    },
                    participatingDivision:
                      divisionRoleInReportMemberResponse.data.d.map(
                        (value: ResponseDepartmentRoleInReport) => ({
                          id: value.PODRAZDELENIE.obj_id,
                          name: value.PODRAZDELENIE.NAIMENOVANIE,
                          identifier: value.PODRAZDELENIE.IDENTIFIKATOR,
                        }),
                      ),
                  },
                };
                console.log('save campaign: ', response);
                http.post(Endpoints.saveCampaign(), response).then(value => {
                  setStatusType(value.status);
                  setIsLoading(false);
                  onCancel();
                  statusModalOpen();
                });
              },
            );
          } else {
            setPopupHelpersVisible(true);
            setIsLoading(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };
  const onValueChangeReportingDate = (value: string) => {
    setReportingDate(value);
  };
  const onValueChangeBeginningDate = (value: string) => {
    setStartDatePlan(value);
  };
  const onValueChangeEndingDate = (value: string) => {
    setCompletionDatePlan(value);
  };

  const popupHelpersClick = () => {
    setPopupHelpersVisible(false);
  };

  return (
    <TwoBtnsPopup
      visible={visible}
      title="Запустить формирование отчёта"
      firstBtnText="Отмена"
      secondBtnText="Запустить"
      onFirstBtnClick={onCancel}
      onSecondBtnClick={() => onSaveHandler(reportData)}
      secondVariant={EButtonVariant.PRIMARY}
      withoutScroll
    >
      <RunReportModalContent
        reportingDate={reportingDate}
        startDatePlan={startDatePlan}
        completionDatePlan={completionDatePlan}
        onValueChangeBeginningDate={onValueChangeBeginningDate}
        onValueChangeEndingDate={onValueChangeEndingDate}
        onValueChangeReportingDate={onValueChangeReportingDate}
      />
      {isLoading && (
        <div className="spin">
          <Spin />
        </div>
      )}
      <OneBtnPopup
        visible={popupHelpersVisible}
        title={popupHelpers.objAlreadyExistsTitle}
        status="warning"
        icon={<AlertSvg />}
        btnText="Закрыть"
        onBtnClick={popupHelpersClick}
      >
        {popupHelpers.objAlreadyExistsContent}
      </OneBtnPopup>
    </TwoBtnsPopup>
  );
};
const convertDate = (date: string): string =>
  new Date(
    new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60 * 1000,
  )
    .toISOString()
    .split('T')[0]
    .split('-')
    .reverse()
    .join('.');

export default memo(RunReportModal);
