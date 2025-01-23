import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardHeaderDefault,
  GridLayout,
  TSettings,
  TwoBtnsPopup,
} from '@atollis/ot_105_5_0070';
import { AlertSvg, CloseSvg, OpenSvg } from '@atollis/ot_105_5_0080';
import { ScrollArea } from '@atollis-ui/scroll-area';
import {
  clearTaskParams,
  getTask,
  resetFormData,
  saveTask,
  setFormData,
  Task,
  taskParamsSelector,
} from '../../reducers/taskParamsReducer/taskParamsReducer';
import TaskParams from '../TaskParams/TaskParams';
import TaskInputForm from '../TaskInputForm/TaskInputForm';
import TaskDetailFooter from './TaskDetailFooter';
import { BtnsId, btnsInfo } from '../buttons';
import libName from '../../constants';
import {
  IDetailSettings,
  IManagementSettings,
} from '../../defaultSettings/defaultSettings';
import { IdentifiedObj } from '../../helpers';
import { useStatuses } from '../../dataSources';
import './TaskDetail.scss';

interface TaskDetailProps {
  isUiSettingsLoading: boolean;
  settings: IManagementSettings;
  expand: boolean;
  triggerUpdate: boolean;
  setExpand: () => void;
  saveUiSettings: (
    setting: Partial<TSettings<IManagementSettings>>,
    projectKey: string,
    componentKey: keyof IManagementSettings,
  ) => void;
  setTriggerUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskDetail = ({
  isUiSettingsLoading,
  settings,
  expand,
  triggerUpdate,
  setExpand,
  saveUiSettings,
  setTriggerUpdate,
}: TaskDetailProps) => {
  const dispatch = useDispatch();
  const params = useParams();

  const { statuses } = useStatuses();

  const [popupVisible, setPopupVisible] = useState(false);

  const { isLoading: isLoadingParams, formData: task } =
    useSelector(taskParamsSelector);

  const cardBtns = useMemo(
    () => [
      {
        id: 'expand',
        name: expand ? 'Свернуть' : 'Развернуть',
        icon: expand ? (
          <CloseSvg id={`_expand-icon${expand}`} />
        ) : (
          <OpenSvg id={`_expand-icon${expand}`} />
        ),
      },
    ],
    [expand],
  );

  const cardMenuList = useMemo(
    () => [
      {
        ...btnsInfo[BtnsId.info],
        id: BtnsId.info,
      },
    ],
    [],
  );

  useEffect(() => {
    if (params.id) {
      dispatch(getTask(params.id));
    } else {
      dispatch(setFormData());
    }
  }, [dispatch, params.id]);

  useEffect(
    () => () => {
      dispatch(clearTaskParams());
    },
    [dispatch],
  );

  const onButtonClick = useCallback(
    (id: string) => {
      switch (id) {
        case 'expand':
          setExpand();
          break;
      }
    },
    [setExpand],
  );

  const onModalConfirm = () => {
    dispatch(resetFormData());
    setPopupVisible(false);
  };

  const saveSetting = useCallback(
    (newSettings: Partial<IDetailSettings>) => {
      if (!isUiSettingsLoading) {
        saveUiSettings(newSettings, libName, 'taskDetail');
      }
    },
    [isUiSettingsLoading, saveUiSettings],
  );

  const footerButtonsHandler = async (action: string) => {
    const today = new Date().toISOString();

    let newTask: Task | null = { ...task };
    switch (action) {
      case 'onWork':
        newTask = {
          ...newTask,
          /* eslint-disable no-underscore-dangle */
          status: statuses.find((el: IdentifiedObj) => el.name === 'В работе'),
          startDateFact: today,
        };
        break;
      case 'onClose':
        newTask = {
          ...newTask,
          /* eslint-disable no-underscore-dangle */
          status: statuses.find((el: IdentifiedObj) => el.name === 'Завершена'),
          endDateFact: today,
        };
        break;
      case 'onNotAgree':
        newTask = {
          ...newTask,
          /* eslint-disable no-underscore-dangle */
          status: statuses.find(
            (el: IdentifiedObj) => el.name === 'Не согласована',
          ),
          endDateFact: today,
        };
        break;
      case 'onAgree':
        newTask = {
          ...newTask,
          /* eslint-disable no-underscore-dangle */
          status: statuses.find(
            (el: IdentifiedObj) => el.name === 'Согласована',
          ),
          endDateFact: today,
        };
        break;
      case 'onNotApprove':
        newTask = {
          ...newTask,
          /* eslint-disable no-underscore-dangle */
          status: statuses.find(
            (el: IdentifiedObj) => el.name === 'Не утверждена',
          ),
          endDateFact: today,
        };
        break;
      case 'onApprove':
        newTask = {
          ...newTask,
          /* eslint-disable no-underscore-dangle */
          status: statuses.find(
            (el: IdentifiedObj) => el.name === 'Утверждена',
          ),
          endDateFact: today,
        };
        break;

      default:
        break;
    }
    (
      dispatch(saveTask(newTask, action)) as unknown as Promise<null | Task>
    ).then(() => {
      setTriggerUpdate(!triggerUpdate);
      if (params.id) dispatch(getTask(params.id));
    });
  };

  return (
    <Card isContainer className="task-detail">
      <CardHeader>
        <CardHeaderDefault
          title="Детализация / Редактирование задачи"
          buttons={cardBtns}
          onButtonClick={onButtonClick}
          menuList={cardMenuList}
        />
      </CardHeader>
      <CardBody>
        {!isUiSettingsLoading && (
          <ScrollArea className="scroll-area">
            <GridLayout
              layouts={settings.taskDetail.layouts}
              saveLayoutSettings={saveSetting}
            >
              <TaskParams key="params" />
              <TaskInputForm key="inputForm" />
            </GridLayout>
          </ScrollArea>
        )}
      </CardBody>
      <CardFooter>
        <TaskDetailFooter
          type={task?.typeButton}
          status={task?.statusButton}
          buttonsHandler={footerButtonsHandler}
        />
        <TwoBtnsPopup
          visible={popupVisible}
          title="Вы уверены, что хотите завершить редактирование?"
          status="warning"
          icon={<AlertSvg />}
          firstBtnText="Отмена"
          secondBtnText="Уверен"
          onFirstBtnClick={() => setPopupVisible(false)}
          onSecondBtnClick={onModalConfirm}
        >
          Все несохранённые данные будут потеряны.
        </TwoBtnsPopup>
      </CardFooter>
    </Card>
  );
};

export default memo(TaskDetail);
