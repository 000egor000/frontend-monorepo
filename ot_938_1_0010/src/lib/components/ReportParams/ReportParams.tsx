import { memo, useEffect, useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderDefault,
  LayoutComponentProps,
  useLayoutMaximizedPropsForCard,
} from '@atollis/ot_105_5_0070';
import formBuilderRoutes from '@atollis/ot_105_5_0130';

import './ReportParams.scss';

import { DatePicker, Select, TextArea, TextInput } from '@atollis-ui/input';
import { ScrollArea } from '@atollis-ui/scroll-area';
import { Button } from '@atollis-ui/button';
import { PlusIcon } from '@atollis-ui/icons';

import dayjs from 'dayjs';
import {
  Report,
  reportParamsSelector,
  setIsCheckValid,
  setIsValid,
  updateFormData,
} from '../../reducers/reportParamsReducer/reportParamsReducer';

import {
  useInputFormCampaign,
  useDivisionsIOGV,
  useProcessTemplates,
  useStaff,
  useRelevance,
  ProcessTemplatesT,
} from '../../dataSources';

const ReportParams = ({
  isMaximized,
  switchLayoutMaximizedStatus,
}: Partial<LayoutComponentProps>) => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const { items: inputForms } = useDivisionsIOGV();
  const { items: divisionsIOGV } = useInputFormCampaign();
  const { items: processTemplates } = useProcessTemplates();
  const { items: staff } = useStaff();
  const { items: relevance } = useRelevance();

  const { menuList, onMenuItemClick } = useLayoutMaximizedPropsForCard(
    isMaximized,
    switchLayoutMaximizedStatus,
  );

  const [isFormReady, setIsFormReady] = useState(true);

  const { formData, isCheckValid, isLoading } =
    useSelector(reportParamsSelector);

  useEffect(() => {
    if (isCheckValid) {
      // TODO: имплементировать новую валидацию
      const onValidate = () => {
        dispatch(setIsValid(true));
        dispatch(
          setIsCheckValid({
            isCheck: false,
          }),
        );
      };

      onValidate();
    }
  }, [isCheckValid, dispatch]);

  useEffect(() => {
    // for reset form validation
    setIsFormReady(false);
    const id = setTimeout(() => setIsFormReady(true));

    return () => {
      clearTimeout(id);
    };
  }, [params.id]);

  const changeFormData = (name: keyof Report, data: string) => {
    dispatch(updateFormData({ [name]: data }));
  };

  const onTextBoxValueChange =
    (name: keyof Report) => (e: ChangeEvent<{ value: string }>) =>
      changeFormData(name, e.target.value);

  const onSelectBoxItemClick = (name: keyof Report) => (value: string) =>
    changeFormData(name, value);

  const onDateBoxValueChange = (name: keyof Report) => (value: dayjs.Dayjs) => {
    changeFormData(name, value.format('YYYY-MM-DDTHH:mm:ssZ[Z]'));
  };

  const getOptions = (data: never[]) =>
    data.map((template: ProcessTemplatesT) => ({
      label: template.name,
      value: template.id,
    }));

  return (
    <Card className="report-params-card report-params">
      <CardHeader>
        <CardHeaderDefault
          title="Параметры"
          onDoubleClick={switchLayoutMaximizedStatus}
          menuList={menuList}
          onMenuItemClick={onMenuItemClick}
        />
      </CardHeader>
      <CardBody>
        {isFormReady && !isLoading && formData && (
          <ScrollArea className="scroll-area">
            <div className="report-params-container">
              <div className="group-params">
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
                <TextArea
                  label="Описание"
                  placeholder="Текстовое описание отчета"
                  value={formData.description}
                  onChange={onTextBoxValueChange('description')}
                />
                {/* TODO: Решить проблему с ResizeObserver другим способом */}
                <div className="select-temp">
                  <Select
                    label="Схема согласования"
                    options={getOptions(processTemplates)}
                    defaultValue={formData.processTemplate?.name}
                    onSelect={onSelectBoxItemClick('processTemplate')}
                    placeholder="Схема согласования"
                    required
                  />
                </div>
                <div className="select-temp">
                  <Select
                    label="Ответственный ИОГВ"
                    options={getOptions(divisionsIOGV)}
                    defaultValue={formData.responsibleIogv?.name}
                    onSelect={onSelectBoxItemClick('responsibleIogv')}
                    placeholder="Ответственный ИОГВ"
                    required
                  />
                </div>
                {/* TODO: по невыясненным причинам на этом селекте
                периодически возникает ошибка с ResizeObserver */}
                <div className="select-temp">
                  <Select
                    label="Куратор"
                    options={getOptions(staff)}
                    defaultValue={formData.curator?.name}
                    onSelect={onSelectBoxItemClick('curator')}
                    placeholder="Куратор"
                    required
                  />
                </div>
                <div className="select-temp">
                  <Select
                    label="Активность"
                    options={getOptions(relevance)}
                    defaultValue={formData.activity?.name}
                    onSelect={onSelectBoxItemClick('activity')}
                    placeholder="Активность"
                    required
                  />
                </div>
                <div className="field-with-btn">
                  <Select
                    label="Форма ввода"
                    options={getOptions(inputForms)}
                    defaultValue={formData.inputForm?.name}
                    onSelect={onSelectBoxItemClick('inputForm')}
                    placeholder="Форма ввода"
                  />
                  <Button
                    variant="secondary"
                    style={{ marginTop: '15px' }}
                    icon={<PlusIcon />}
                    onClick={() => {
                      navigate(
                        `${formBuilderRoutes.base}/${formBuilderRoutes.create}`,
                      );
                    }}
                  />
                </div>
                <div className="select-temp">
                  <Select
                    label="Автор"
                    options={getOptions(staff)}
                    defaultValue={formData.createAuthor?.name}
                    onSelect={onSelectBoxItemClick('createAuthor')}
                    required
                    disabled
                  />
                </div>
                <DatePicker
                  label="Дата начала действия"
                  // Проблема с типизацией компонента библиотеки
                  // TODO: исправить
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  value={formData.startDate ? dayjs(formData.startDate) : null}
                  onChange={date =>
                    onDateBoxValueChange('startDate')(date as dayjs.Dayjs)
                  }
                  format="DD.MM.YYYY"
                />
                <DatePicker
                  label="Дата окончания действия"
                  // Проблема с типизацией компонента библиотеки
                  // TODO: исправить
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  value={formData.endDate ? dayjs(formData.endDate) : null}
                  onChange={date =>
                    onDateBoxValueChange('endDate')(date as dayjs.Dayjs)
                  }
                  format="DD.MM.YYYY"
                />
                <DatePicker
                  label="Дата создания"
                  // Проблема с типизацией компонента библиотеки
                  // TODO: исправить
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  value={
                    formData.createDate ? dayjs(formData.createDate) : null
                  }
                  onChange={date =>
                    onDateBoxValueChange('createDate')(date as dayjs.Dayjs)
                  }
                  format="DD.MM.YYYY"
                  disabled
                />
              </div>
            </div>
          </ScrollArea>
        )}
      </CardBody>
    </Card>
  );
};

export default memo(ReportParams);
