import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  BtnControl,
  Card,
  CountControl,
  GridLayout,
  http,
  IPreset,
  popupHelpers,
  Presets,
  SavePresetPopup,
  TwoBtnsPopup,
} from '@atollis/ot_105_5_0070';
import { selectAccessToken } from '@atollis/ot_105_7_0010';
import manageRoutes from '@atollis/ot_938_5_0010';
import { AlertSvg, MdiClose } from '@atollis/ot_105_5_0080';
import defaultSettings from '../../defaultSettings/defaultSettings';
import TaskMonitoringTable from './TaskMonitoringTable';
import { TabItemProps } from '../../Management/Management';
import { BtnsId, btnsInfo } from '../buttons';
import { ShowcaseTask } from '../../reducers/taskParamsReducer/taskParamsReducer';
import Endpoints from '../../Endpoints';

interface PresetWithExtraParams extends IPreset {
  count: string;
}

interface SavePopupPromise {
  resolve: (data: { id: string; name: string }) => PromiseLike<{
    id: string;
    name: string;
  }>;
  reject: () => void;
}

interface RemovePopupPromise {
  resolve: () => void;
  reject: () => void;
}

const TaskMonitoring = ({
  tabName,
  currentTab,
  setBtns,
  setBtnsHandler,
  setMenuList,
  setMenuListHandler,
  setVisibleNoAccessPopup,
  uiSettings,
}: TabItemProps) => {
  const {
    isLoading,
    settings: { taskMonitoring },
  } = uiSettings;
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const accessToken = useSelector(selectAccessToken);
  const bearerRef = useRef(`Bearer ${accessToken}`);
  const popupPromise = useRef<SavePopupPromise | RemovePopupPromise | null>(
    null,
  );
  const columnChooserToggleRef = useRef<boolean>(false);

  const [selectedTasks, setSelectedTasks] = useState<ShowcaseTask[]>([]);

  const [removeTasksPopupVisible, setRemoveTasksPopupVisible] = useState(false);
  const [savePresetPopupVisible, setSavePresetPopupVisible] = useState(false);
  const [removePresetPopupVisible, setRemovePresetPopupVisible] =
    useState(false);

  const [presets, setPresets] = useState<PresetWithExtraParams[]>([]);
  const [presetForRemove, setPresetForRemove] =
    useState<PresetWithExtraParams | null>(null);

  const loadPresetsCount = async () => {
    const { presets: taskPresets } = taskMonitoring;
    const queries = taskPresets.map(p =>
      http
        .get<{ d: { __count: string } }>(Endpoints.showcaseTasks(), {
          params: { ...p.requestParams, $top: 0 },
        })
        // eslint-disable-next-line no-underscore-dangle
        .then(({ data }) => ({ ...p, count: data.d.__count })),
    );

    const presetsWithCount = await Promise.all(queries);
    setPresets(presetsWithCount);
  };

  const onSelectionChanged = (e: unknown) => {
    // @ts-ignore
    setSelectedTasks(e.selectedRowsData);
  };

  const removeTasksPopupCancel = useCallback(() => {
    setRemoveTasksPopupVisible(false);
  }, []);

  const removeTasksPopupConfirm = () => {
    // TODO запрос на удаление
    setRemoveTasksPopupVisible(false);
  };

  const onBtnsHandler = useCallback(
    (id: string) => {
      switch (id) {
        case BtnsId.details:
          navigate(`${manageRoutes.tasks}/${selectedTasks[0].IDENTIFIKATOR}`);
          break;
      }
    },
    [navigate, selectedTasks, columnChooserToggleRef.current],
  );

  const cardBtns = useMemo(
    () => [
      {
        ...btnsInfo[BtnsId.columnChooser],
        id: BtnsId.columnChooser,
        active: columnChooserToggleRef.current,
      },
      {
        ...btnsInfo[BtnsId.export],
        id: BtnsId.export,
        name: 'Экспорт в Excel',
        disabled: false,
      },
      {
        ...btnsInfo[BtnsId.filter],
        id: BtnsId.filter,
        disabled: false,
        name: 'Сохранить набор',
      },
      {
        ...btnsInfo[BtnsId.details],
        id: BtnsId.details,
        name: 'Детализация задачи',
        disabled: !(selectedTasks.length === 1),
      },
      {
        ...btnsInfo[BtnsId.changingUser],
        id: BtnsId.changingUser,
        disabled: !(selectedTasks.length === 1),
      },
    ],
    [columnChooserToggleRef.current, selectedTasks.length],
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

  const presetControls = useMemo(
    () => [
      <CountControl />,
      <BtnControl>
        <MdiClose />
      </BtnControl>,
    ],
    [],
  );

  useEffect(() => {
    bearerRef.current = `Bearer ${accessToken}`;
  }, [accessToken]);

  useEffect(() => {
    loadPresetsCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskMonitoring]);

  useEffect(() => {
    if (tabName === currentTab) setBtns?.(cardBtns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, cardBtns, tabName]);

  useEffect(() => {
    if (tabName === currentTab) setMenuList?.(cardMenuList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, cardMenuList, tabName]);

  if (tabName === currentTab) setBtnsHandler?.(onBtnsHandler);
  if (tabName === currentTab) setMenuListHandler?.(onBtnsHandler);

  return (
    <>
      <Presets
        presets={presets}
        isLoading={isLoading}
        selected={search.get('name') ? undefined : taskMonitoring.activePreset}
        // onSelect={onSelectPreset}
        controls={presetControls}
      />
      <GridLayout layouts={defaultSettings.taskMonitoring.layouts}>
        <Card key="table_tasks">
          <TaskMonitoringTable
            onSelectionChanged={onSelectionChanged}
            setVisibleNoAccessPopup={setVisibleNoAccessPopup}
          />
        </Card>
      </GridLayout>
      <SavePresetPopup
        defaultName={
          search.get('name') ? '' : taskMonitoring.activePreset?.name
        }
        visible={savePresetPopupVisible}
        onPopupConfirm={popupPromise.current?.resolve}
        onPopupCancel={popupPromise.current?.reject}
      />
      <TwoBtnsPopup
        visible={removeTasksPopupVisible}
        title={popupHelpers.createDeleteTitle(
          selectedTasks.map(i => i.NAIMENOVANIE_ZADACHI),
        )}
        status="warning"
        icon={<AlertSvg />}
        firstBtnText="Отмена"
        secondBtnText="Удалить"
        onFirstBtnClick={removeTasksPopupCancel}
        onSecondBtnClick={removeTasksPopupConfirm}
      >
        {popupHelpers.deleteContent}
      </TwoBtnsPopup>
      <TwoBtnsPopup
        visible={removePresetPopupVisible}
        title={popupHelpers.createDeleteTitle(presetForRemove?.name)}
        status="warning"
        icon={<AlertSvg />}
        firstBtnText="Отмена"
        secondBtnText="Удалить"
        onFirstBtnClick={popupPromise.current?.reject}
        onSecondBtnClick={popupPromise.current?.resolve as () => void}
      >
        {popupHelpers.deleteContent}
      </TwoBtnsPopup>
    </>
  );
};

export default TaskMonitoring;
