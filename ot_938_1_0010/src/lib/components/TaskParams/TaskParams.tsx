import { ChangeEvent, memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderDefault,
  LayoutComponentProps,
  useLayoutMaximizedPropsForCard,
} from '@atollis/ot_105_5_0070';

import { DatePicker, Select, TextArea, TextInput } from '@atollis-ui/input';
import { ScrollArea } from '@atollis-ui/scroll-area';

import {
  setIsCheckValid,
  setIsValid,
  taskParamsSelector,
  updateFormData,
} from '../../reducers/taskParamsReducer/taskParamsReducer';

import {
  useCampaigns,
  useDivision,
  useEmployees,
  useReportsLoad,
  useStatusesList,
  useTaskTypes,
} from '../../dataSources';

const TaskParams = ({
  isMaximized,
  switchLayoutMaximizedStatus,
}: Partial<LayoutComponentProps>) => {
  const dispatch = useDispatch();

  const { menuList, onMenuItemClick } = useLayoutMaximizedPropsForCard(
    isMaximized,
    switchLayoutMaximizedStatus,
  );

  const { items: reports } = useReportsLoad();
  const { items: taskTypes } = useTaskTypes();
  const { items: campaigns } = useCampaigns();
  const { items: division } = useDivision();
  const { items: employees } = useEmployees();
  const { items: statuses } = useStatusesList();

  const { isLoading, formData, isCheckValid } = useSelector(taskParamsSelector);

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
    dispatch(updateFormData({ [name]: data }));
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

  return (
    <Card className="task-params task-detail-card">
      <CardHeader>
        <CardHeaderDefault
          title="Параметры"
          menuList={menuList}
          onDoubleClick={switchLayoutMaximizedStatus}
          onMenuItemClick={onMenuItemClick}
        />
      </CardHeader>
      <CardBody>
        {!isLoading && formData && (
          <ScrollArea className="scroll-area">
            <div className="flex-container">
              <TextInput
                value={formData.name}
                label="Наименование"
                onChange={onTextBoxValueChange('name')}
                disabled
                required
              />

              <div className="row-container">
                <Select
                  label="Отчет"
                  options={reports}
                  value={[
                    (formData.report?.identifier ?? formData.report) as string,
                  ]}
                  disabled
                  onSelect={onSelectBoxItemClick('report')}
                />
                <Select
                  label="Тип задачи"
                  options={taskTypes}
                  value={[
                    (formData.taskType?.id ?? formData.taskType) as string,
                  ]}
                  disabled
                  onSelect={onSelectBoxItemClick('taskType')}
                />
              </div>

              <Select
                label="Кампания"
                options={campaigns}
                value={[(formData.campaign?.id ?? formData.campaign) as string]}
                disabled
                onSelect={onSelectBoxItemClick('campaign')}
              />

              <div className="row-container">
                <DatePicker
                  label="Дата начала (план)"
                  // Проблема с типизацией компонента библиотеки
                  // TODO: исправить
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  value={
                    formData.startDatePlan
                      ? dayjs(formData.startDatePlan)
                      : null
                  }
                  disabled
                  format="DD.MM.YYYY"
                  onChange={date => {
                    onDateBoxValueChange('startDatePlan')(date as dayjs.Dayjs);
                  }}
                />
                <DatePicker
                  label="Дата завершения (план)"
                  // Проблема с типизацией компонента библиотеки
                  // TODO: исправить
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  value={
                    formData.endDatePlan ? dayjs(formData.endDatePlan) : null
                  }
                  disabled
                  format="DD.MM.YYYY"
                  onChange={date => {
                    onDateBoxValueChange('endDatePlan')(date as dayjs.Dayjs);
                  }}
                />
              </div>
              <div className="row-container">
                <DatePicker
                  label="Дата начала (факт)"
                  // Проблема с типизацией компонента библиотеки
                  // TODO: исправить
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  value={
                    formData.startDateFact
                      ? dayjs(formData.startDateFact)
                      : null
                  }
                  disabled
                  format="DD.MM.YYYY"
                  onChange={date => {
                    onDateBoxValueChange('startDateFact')(date as dayjs.Dayjs);
                  }}
                />
                <DatePicker
                  label="Дата завершения (факт)"
                  // Проблема с типизацией компонента библиотеки
                  // TODO: исправить
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  value={
                    formData.endDateFact ? dayjs(formData.endDateFact) : null
                  }
                  disabled
                  format="DD.MM.YYYY"
                  onChange={date => {
                    onDateBoxValueChange('endDateFact')(date as dayjs.Dayjs);
                  }}
                />
              </div>

              <Select
                label="Организация"
                options={division}
                value={[
                  (formData.division?.identifier ??
                    formData.division) as string,
                ]}
                disabled
                onSelect={onSelectBoxItemClick('division')}
              />

              <Select
                label="Исполнитель"
                options={employees}
                value={[
                  (formData.executor?.identifier ??
                    formData.executor) as string,
                ]}
                disabled
                onSelect={onSelectBoxItemClick('executor')}
              />

              <Select
                label="Статус"
                options={statuses}
                value={[
                  (formData.status?.identifier ?? formData.status) as string,
                ]}
                disabled
                onSelect={onSelectBoxItemClick('status')}
              />

              <TextArea
                name="description"
                label="Описание"
                value={formData.description}
                disabled
                onChange={onTextBoxValueChange('description')}
              />
            </div>
          </ScrollArea>
        )}
      </CardBody>
    </Card>
  );
};

export default memo(TaskParams);
