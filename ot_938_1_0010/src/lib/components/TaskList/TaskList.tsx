import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { List } from '@atollis-ui/list';

import { selectAccessToken } from '@atollis/ot_105_7_0010';
import {
  Card,
  CardHeader,
  CardHeaderDefault,
  IPreset,
  PresetsSelectBox,
  TSettings,
} from '@atollis/ot_105_5_0070';
import { BackSvg } from '@atollis/ot_105_5_0080';
import manageRoutes from '@atollis/ot_938_5_0010';
import { ScrollArea } from '@atollis-ui/scroll-area';
import { BtnsId, btnsInfo } from '../buttons';
import { IManagementSettings } from '../../defaultSettings/defaultSettings';
import {
  BusinessObject,
  getTask,
  saveTask,
  taskParamsSelector,
} from '../../reducers/taskParamsReducer/taskParamsReducer';
import ChangingUserPopup from '../ChangingUserPopup/ChangingUserPopup';
import { createIdentifiedObjUser } from '../../helpers';
import TaskListItem from './TaskListItem';
import TaskListSearch from './TaskListSearch';

import useTasks from './useTasks';

import './TaskList.scss';
import libName from '../../constants';

interface TaskListProps {
  settings: IManagementSettings;
  triggerUpdate: boolean;
  saveUiSettings: (
    setting: Partial<TSettings<IManagementSettings>>,
    projectKey: string,
    componentKey: keyof IManagementSettings,
  ) => void;
}

const TaskList = ({
  settings,
  triggerUpdate,
  saveUiSettings,
}: TaskListProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const accessToken = useSelector(selectAccessToken);
  const [searchString, setSearch] = useState<string>('');

  const { formData } = useSelector(taskParamsSelector);

  const { items, isLoading, reload } = useTasks({
    search: searchString,
    settings,
  });

  const [changingUserPopupVisible, setChangingUserPopupVisible] =
    useState(false);

  const bearerRef = useRef(`Bearer ${accessToken}`);

  const cardBtns = useMemo(
    () => [
      {
        ...btnsInfo[BtnsId.changingUser],
        id: BtnsId.changingUser,
        disabled: !params.id,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const cardMenuList = useMemo(
    () => [
      {
        ...btnsInfo[BtnsId.info],
        id: BtnsId.info,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    bearerRef.current = `Bearer ${accessToken}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  useEffect(() => {
    // reload();
  }, [triggerUpdate]);

  const onListItemClick = useCallback(
    e => {
      if (e?.IDENTIFIKATOR_ZADACHI) navigate(`../${e?.IDENTIFIKATOR_ZADACHI}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate],
  );

  const onButtonClick = useCallback((id: string) => {
    switch (id) {
      case BtnsId.remove:
        console.log('removeTask');
        break;
      case BtnsId.play:
        console.log('inWork');
        break;
      case BtnsId.block:
        console.log('complete');
        break;
      case BtnsId.changingUser:
        setChangingUserPopupVisible(true);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPresetSelect = useCallback(
    (e: { selectedItem: string | Record<string, unknown> }) => {
      saveUiSettings(
        { activePreset: e.selectedItem as IPreset },
        libName,
        'taskMonitoring',
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [saveUiSettings],
  );

  const changingUserSave = async (newExecutor: BusinessObject) =>
    dispatch(
      saveTask(
        {
          ...formData,
          executor: createIdentifiedObjUser(newExecutor),
        },
        'onExecutorChange',
      ) as unknown as Promise<null | boolean>,
    ).then(e => {
      if (params.id) dispatch(getTask(params.id));
      setChangingUserPopupVisible(false);
      if (e) return false;
      return true;
    });

  const searchChangeHandler = (value: string) => {
    setSearch(value);
  };

  return (
    <Card isContainer className="task-list-card">
      <CardHeader>
        <CardHeaderDefault
          title="Задачи"
          buttons={cardBtns}
          onButtonClick={onButtonClick}
          menuList={cardMenuList}
          icon={
            <Link to={`${manageRoutes.base}/#Задачи`}>
              <BackSvg className="icon-accent" />
            </Link>
          }
        />
      </CardHeader>
      <div className="task-list-card__body">
        <PresetsSelectBox
          displayExpr="name"
          items={settings.taskMonitoring.presets}
          value={settings.taskMonitoring.activePreset?.id}
          onSelectionChanged={onPresetSelect}
        />
        <TaskListSearch value={searchString} onChange={searchChangeHandler} />
        <ScrollArea className="task-list-wrapper">
          <List
            className="task-list"
            loading={isLoading}
            data={items ?? []}
            renderItem={item => (
              <TaskListItem
                key={item.NAIMENOVANIE_ZADACHI}
                data={item}
                isActive={item.IDENTIFIKATOR_ZADACHI === params.id}
                onClick={onListItemClick}
              />
            )}
          />
        </ScrollArea>
      </div>
      <ChangingUserPopup
        visible={changingUserPopupVisible}
        onPopupCancel={() => {
          setChangingUserPopupVisible(false);
        }}
        onPopupConfirm={changingUserSave}
        actualExecutor={formData?.executor?.name ?? 'Исполнитель не выбран'}
      />
    </Card>
  );
};

export default memo(TaskList);
