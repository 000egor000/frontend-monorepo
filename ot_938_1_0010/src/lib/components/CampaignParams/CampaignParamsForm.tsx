import { useEffect, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import dayjs from 'dayjs';
import { DatePicker, Select, TextInput } from '@atollis-ui/input';
import { ScrollArea } from '@atollis-ui/scroll-area';
import { useParams } from 'react-router-dom';

import {
  Campaign,
  campaignFormSelector,
  setFormData,
  setIsChanged,
  setIsCheckValid,
  setIsValid,
} from '../../reducers/Campaigns/campaignFormReducer';

import './CampaignParams.scss';
import {
  useReportsCampaign,
  useInputFormCampaign,
  useStatusesCampaign,
  useCuratorCampaign,
  useDivisionsIOGVCampaign,
} from '../../dataSources';

interface CampaignParamsProps {
  formData: Campaign;
}

const CampaignParamsForm = ({ formData }: CampaignParamsProps) => {
  const dispatch = useDispatch();
  const params = useParams();

  const { isCheckValid, isLoadFilligFields } =
    useSelector(campaignFormSelector);

  useEffect(() => {
    if (isCheckValid) {
      // TODO: имплементировать новую валидацию
      const onValidate = () => {
        dispatch(setIsValid(true));
        dispatch(setIsCheckValid(false));
      };

      onValidate();
    }
  }, [isCheckValid, dispatch]);

  const changeFormData = (name: string, data: string) => {
    dispatch(setFormData({ name, data }));
    dispatch(setIsChanged());
  };

  const onTextBoxValueChange =
    (name: string) => (e: ChangeEvent<{ value: string }>) => {
      changeFormData(name, e.target.value);
    };

  const onSelectBoxItemClick = (name: string) => (value: string) =>
    changeFormData(name, value);

  const onDateBoxValueChange = (name: string) => (value: dayjs.Dayjs) => {
    changeFormData(name, value.format('YYYY-MM-DDTHH:mm:ssZ[Z]'));
  };

  const { items: reports } = useReportsCampaign();
  const { items: inputForm } = useInputFormCampaign();
  const { items: statuses } = useStatusesCampaign();
  const { items: curator } = useCuratorCampaign();
  const { items: divisionsIOGV } = useDivisionsIOGVCampaign();

  return (
    !isLoadFilligFields &&
    formData && (
      <ScrollArea height="100%" width="100%">
        <div className="campaign-params-form">
          <TextInput
            value={formData.code}
            label="Код отчета"
            onChange={onTextBoxValueChange('code')}
            required
            placeholder="Код отчета"
          />
          <TextInput
            value={formData.name}
            label="Наименование"
            onChange={onTextBoxValueChange('name')}
            required
            placeholder="Наименование отчета"
          />

          <Select
            label="Отчет"
            options={reports}
            value={[(formData.report?.name ?? formData.report) as string]}
            onSelect={onSelectBoxItemClick('report')}
            disabled
            required
          />

          {!params.id && (
            <Select
              label="Отчет"
              options={inputForm}
              onSelect={onSelectBoxItemClick('inputForm')}
              value={[
                (formData.inputForm?.name ?? formData.inputForm) as string,
              ]}
              disabled
            />
          )}

          <DatePicker
            label="Отчётная дата"
            value={
              formData.reportingDate ? dayjs(formData.reportingDate) : null
            }
            disabled
            format="DD.MM.YYYY"
            onChange={date => {
              onDateBoxValueChange('reportingDate')(date as dayjs.Dayjs);
            }}
          />

          <div className="campaign-params-form-row">
            <DatePicker
              label="Дата начала (план)"
              value={
                formData.startDatePlan ? dayjs(formData.startDatePlan) : null
              }
              disabled
              format="DD.MM.YYYY"
              onChange={date => {
                onDateBoxValueChange('startDatePlan')(date as dayjs.Dayjs);
              }}
            />

            <DatePicker
              label="Дата завершения (план)"
              value={
                formData.completionDatePlan
                  ? dayjs(formData.completionDatePlan)
                  : null
              }
              disabled
              format="DD.MM.YYYY"
              onChange={date => {
                onDateBoxValueChange('completionDatePlan')(date as dayjs.Dayjs);
              }}
            />
          </div>
          <div className="campaign-params-form-row">
            <DatePicker
              label="Дата начала (факт)"
              value={
                formData.startDateFact ? dayjs(formData.startDateFact) : null
              }
              disabled
              format="DD.MM.YYYY"
              onChange={date => {
                onDateBoxValueChange('startDateFact')(date as dayjs.Dayjs);
              }}
            />

            <DatePicker
              label="Дата завершения (факт)"
              value={
                formData.completionDateFact
                  ? dayjs(formData.completionDateFact)
                  : null
              }
              disabled
              format="DD.MM.YYYY"
              onChange={date => {
                onDateBoxValueChange('completionDateFact')(date as dayjs.Dayjs);
              }}
            />
          </div>

          <Select
            label="Статус"
            options={statuses}
            onSelect={onSelectBoxItemClick('statusesChoose')}
            value={[(formData.status?.name ?? formData.status) as string]}
            disabled
            required
          />

          <Select
            label="Куратор"
            options={curator}
            onSelect={onSelectBoxItemClick('curatorChoose')}
            value={[(formData.curator?.login ?? formData.curator) as string]}
            disabled
            required
          />

          <Select
            label="Ответственный ИОГВ"
            options={divisionsIOGV}
            onSelect={onSelectBoxItemClick('divisionsIOGV')}
            value={[
              (formData.responsibleIOGV?.name ??
                formData.responsibleIOGV) as string,
            ]}
            disabled
            required
          />
        </div>
      </ScrollArea>
    )
  );
};

export default CampaignParamsForm;
