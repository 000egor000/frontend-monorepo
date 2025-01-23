import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '@atollis/ot_105_7_0010';
import {
  BtnControl,
  Card,
  CardButton,
  CountControl,
  GridLayout,
  http,
  oDataFilterFormatter,
  Presets,
  IPreset,
  popupHelpers,
  OneBtnPopup,
} from '@atollis/ot_105_5_0070';
import { AlertSvg, MdiClose } from '@atollis/ot_105_5_0080';
import manageRoutes from '@atollis/ot_938_5_0010';
import { EButtonVariant } from '@atollis-ui/button';
import { ShowcaseReport } from '../../reducers/reportParamsReducer/reportParamsReducer';
import { TabItemProps } from '../../Management/Management';
import { BtnsId, btnsInfo } from '../buttons';
import ReportsTable from './ReportsTable';
import defaultSettings, {
  IMonitoringSettings,
} from '../../defaultSettings/defaultSettings';
import libName from '../../constants';
import Endpoints from '../../Endpoints';
import RunReportModal from '../RunReportModal/RunReportModal';
import './Reports.scss';

import SavePresetPopupCamping from '../Modal/SavePresetPopupCamping/SavePresetPopup';
import TwoBtnsPopupCamping from '../Modal/TwoBtnsPopupCamping/TwoBtnsPopupCamping';

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

const Reports = ({
  tabName,
  currentTab,
  setBtns,
  setBtnsHandler,
  setMenuList,
  setMenuListHandler,
  uiSettings,
}: TabItemProps) => {
  const {
    isLoading,
    saveUiSettings,
    settings: { reportMonitoring },
  } = uiSettings;
  const navigate = useNavigate();

  const accessToken = useSelector(selectAccessToken);
  const bearerRef = useRef(`Bearer ${accessToken}`);
  const [statusType, setStatusType] = useState<number | null>(null);
  const [isStatusModalVisible, setStatusModalVisible] = useState(false);
  const dataGridRef = useRef(null);
  const requestParamsRef = useRef<{ [key: string]: string }>();
  const popupPromise = useRef<SavePopupPromise | RemovePopupPromise | null>(
    null,
  );
  const columnChooserToggleRef = useRef<boolean>(false);
  const [dataList, setData] = useState<any[]>([]);

  const selectedPresetQueryParamsRef = useRef<{ [key: string]: string } | null>(
    null,
  );

  const fetchData = async () => {
    const endpoint = Endpoints.showcaseReports();
    const selectedPresetParams = selectedPresetQueryParamsRef.current;

    let queryParams: Record<string, string> = {
      $top: '10000000',
      $skip: '0',
    };

    if (selectedPresetParams) {
      const isFilterInSelectedParams = Boolean(selectedPresetParams.$filter);
      if (selectedPresetParams.$filter) {
        if (queryParams.$filter) {
          queryParams.$filter = isFilterInSelectedParams
            ? `(${oDataFilterFormatter(
                queryParams.$filter,
              )}) and (${oDataFilterFormatter(selectedPresetParams.$filter)})`
            : `${oDataFilterFormatter(queryParams.$filter)}`;
        } else {
          queryParams.$filter = selectedPresetParams.$filter;
        }
      }
      queryParams = { ...queryParams, ...selectedPresetParams };
    }

    const queryString = Object.entries(queryParams)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join('&');

    const url = `${endpoint}?${queryString}`;

    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: bearerRef.current,
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      setData(data?.d);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [selectedRows, setSelectedRows] = useState<ShowcaseReport[]>([]);

  const selectedCount = useMemo(
    () => selectedRows.length,
    [selectedRows.length],
  );
  const [popupVisible, setPopupVisible] = useState(false);
  const [savePresetPopupVisible, setSavePresetPopupVisible] = useState(false);
  const [removeReportsPopupVisible, setRemoveReportsPopupVisible] =
    useState(false);
  const [removePresetPopupVisible, setRemovePresetPopupVisible] =
    useState(false);

  const [presets, setPresets] = useState<PresetWithExtraParams[]>([]);
  const [presetForRemove, setPresetForRemove] =
    useState<PresetWithExtraParams | null>(null);

  const loadPresetsCount = async () => {
    const { presets: reportPresets } = reportMonitoring;
    const queries = reportPresets.map(p =>
      http
        .get<{ d: { __count: string } }>(Endpoints.showcaseReports(), {
          params: { ...p.requestParams, $top: 0 },
        })
        // eslint-disable-next-line no-underscore-dangle
        .then(({ data }) => ({ ...p, count: data.d.__count })),
    );

    const presetsWithCount = await Promise.all(queries);
    setPresets(presetsWithCount);
  };

  const savePreset = useCallback(async () => {
    try {
      const data = await new Promise<{ id: string; name: string }>(
        (resolve, reject) => {
          popupPromise.current = { resolve, reject } as SavePopupPromise;
          setSavePresetPopupVisible(true);
        },
      );

      const gridState = dataGridRef.current?.instance.state();
      const { current: requestParams } = requestParamsRef;

      let isNew = true;
      let activePreset = { ...data, gridState, requestParams };
      const newReportPresets: IPreset[] = reportMonitoring.presets.map(
        preset => {
          if (preset.id === data.id) {
            isNew = false;
            activePreset = { ...preset, gridState, requestParams };
            return activePreset;
          }
          return preset;
        },
      );

      if (isNew) {
        newReportPresets.push(activePreset);
      }

      saveUiSettings(
        { presets: newReportPresets, activePreset },
        libName,
        'reportMonitoring',
      );
    } catch {
      // continue regardless of error
    } finally {
      popupPromise.current = null;
      setSavePresetPopupVisible(false);
    }
  }, [reportMonitoring, saveUiSettings]);

  const removePreset = useCallback(
    async preset => {
      try {
        await new Promise<void>((resolve, reject) => {
          popupPromise.current = { resolve, reject } as RemovePopupPromise;
          setRemovePresetPopupVisible(true);
          setPresetForRemove(preset);
        });

        const reportPresets = reportMonitoring.presets.filter(
          p => p.id !== preset.id,
        );

        const setting: Partial<IMonitoringSettings> = {
          presets: reportPresets,
        };
        if (reportMonitoring.activePreset?.id === preset.id)
          [setting.activePreset] = reportPresets;

        saveUiSettings(setting, libName, 'reportMonitoring');
      } catch {
        // continue regardless of error
      } finally {
        popupPromise.current = null;
        setRemovePresetPopupVisible(false);
        setPresetForRemove(null);
      }
    },

    [reportMonitoring, saveUiSettings],
  );

  const onSelectionRowsChanged = e => {
    setSelectedRows(e.selectedRowsData);
  };

  const onSelectPreset = useCallback(
    activePreset => {
      saveUiSettings({ activePreset }, libName, 'reportMonitoring');

      if (activePreset.id === reportMonitoring.activePreset?.id)
        dataGridRef.current?.instance.state(activePreset?.gridState);
    },
    [reportMonitoring.activePreset?.id, saveUiSettings],
  );

  const onBtnsHandler = useCallback(
    (id: string) => {
      switch (id) {
        case BtnsId.filter:
          savePreset();
          break;
        case BtnsId.create:
          navigate(`${manageRoutes.reports}/${manageRoutes.create}`);
          break;
        case BtnsId.remove:
          setRemoveReportsPopupVisible(true);
          break;
        case BtnsId.play:
          setPopupVisible(true);
          break;
        case BtnsId.block:
          console.log(
            'Сделать не актуальными: ',
            selectedRows.map(i => i.NAIMENOVANIE_OTCHETA).join(),
          );
          break;
        case BtnsId.details:
          if (selectedCount === 1)
            navigate(
              `${manageRoutes.reports}/${selectedRows[0].IDENTIFIKATOR_OTCHETA}`,
            );
          break;
        case BtnsId.export:
          dataGridRef.current?.instance.exportToExcel(false);
          break;
        case BtnsId.columnChooser:
          if (!columnChooserToggleRef.current) {
            dataGridRef.current?.instance.showColumnChooser();
          } else {
            dataGridRef.current?.instance.hideColumnChooser();
          }
          columnChooserToggleRef.current = !columnChooserToggleRef.current;
          break;
      }
    },
    [
      navigate,
      selectedCount,
      selectedRows,
      columnChooserToggleRef.current,
      savePreset,
    ],
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
        ...btnsInfo[BtnsId.details],
        id: BtnsId.details,
        name: 'Детализация отчета',
        disabled: selectedCount !== 1,
      },
      {
        ...btnsInfo[BtnsId.block],
        id: BtnsId.block,
        name: 'Перевести в «Неактуальный»',
        disabled: !selectedCount,
      },
      {
        ...btnsInfo[BtnsId.play],
        id: BtnsId.play,
        name: 'Запустить кампанию для формирования отчёта',
        disabled: selectedCount !== 1,
      },
      {
        ...btnsInfo[BtnsId.remove],
        id: BtnsId.remove,
        name: 'Удалить отчет',
        disabled: !selectedCount,
      },
      {
        ...btnsInfo[BtnsId.create],
        id: BtnsId.create,
        name: 'Создать отчет',
        disabled: false,
      },
      {
        ...btnsInfo[BtnsId.filter],
        id: BtnsId.filter,
        disabled: false,
      },
    ],
    [columnChooserToggleRef.current, selectedCount],
  );

  const cardMenuList = useMemo(
    () => [{ ...btnsInfo[BtnsId.info], id: BtnsId.info }],
    [],
  );

  const contextMenuList = useMemo(
    () =>
      [
        BtnsId.remove,
        BtnsId.play,
        BtnsId.block,
        BtnsId.details,
      ].map<CardButton>(id => ({
        id,
        ...cardBtns.find(btn => btn.id === id),
        onItemClick: (): void => onBtnsHandler(id),
      })),
    [cardBtns, onBtnsHandler],
  );

  const presetControls = useMemo(
    () => [
      <CountControl />,
      <BtnControl onClick={removePreset}>
        <MdiClose />
      </BtnControl>,
    ],
    [removePreset],
  );

  useEffect(() => {
    bearerRef.current = `Bearer ${accessToken}`;
  }, [accessToken]);

  useEffect(() => {
    loadPresetsCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportMonitoring]);

  useEffect(() => {
    dataGridRef.current?.instance.state(
      reportMonitoring.activePreset?.gridState || null,
    );
  }, [reportMonitoring.activePreset]);

  useEffect(() => {
    dataGridRef.current?.instance.hideColumnChooser();
    columnChooserToggleRef.current = false;
  }, [currentTab]);

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

  const onClose = () => {
    setPopupVisible(false);
  };
  const statusTypeHandler = (status: number) => {
    setStatusType(status);
  };
  const statusModalClose = () => {
    setStatusModalVisible(false);
  };
  const statusModalOpen = () => {
    setStatusModalVisible(true);
  };
  return (
    <div>
      <Presets
        presets={presets}
        isLoading={isLoading}
        selected={reportMonitoring.activePreset}
        onSelect={onSelectPreset}
        controls={presetControls}
      />
      <GridLayout layouts={defaultSettings.reportMonitoring.layouts}>
        <Card key="table">
          <ReportsTable
            tableRef={dataGridRef}
            data={dataList}
            contextMenuList={contextMenuList}
            onSelectionChanged={onSelectionRowsChanged}
          />
        </Card>
      </GridLayout>
      <SavePresetPopupCamping
        defaultName={reportMonitoring.activePreset?.name}
        visible={savePresetPopupVisible}
        onPopupConfirm={popupPromise.current?.resolve}
        onPopupCancel={popupPromise.current?.reject}
      />
      <TwoBtnsPopupCamping
        visible={removeReportsPopupVisible}
        title={popupHelpers.createDeleteTitle(
          selectedRows.map(i => i.NAIMENOVANIE_OTCHETA),
        )}
        icon={<AlertSvg />}
        firstBtnText="Отмена"
        secondBtnText="Удалить"
        onFirstBtnClick={() => {
          setRemoveReportsPopupVisible(false);
        }}
        onSecondBtnClick={() => {
          setRemoveReportsPopupVisible(false);
        }}
        content={popupHelpers.deleteContent}
      />
      <TwoBtnsPopupCamping
        visible={removePresetPopupVisible}
        title={popupHelpers.createDeleteTitle(presetForRemove?.name)}
        icon={<AlertSvg />}
        firstBtnText="Отмена"
        secondBtnText="Удалить"
        onFirstBtnClick={popupPromise.current?.reject}
        onSecondBtnClick={popupPromise.current?.resolve as () => void}
        content={popupHelpers.deleteContent}
      />
      <OneBtnPopup
        visible={isStatusModalVisible}
        status={statusType === 200 ? 'success' : 'error'}
        icon={<AlertSvg />}
        btnText="Ок"
        onBtnClick={statusModalClose}
        btnVariant={EButtonVariant.PRIMARY}
      >
        {statusType === 200
          ? 'Кампания по формированию отчёта запущена'
          : 'Запуск кампании по формированию отчёта не возможен. Повторите попытку'}
      </OneBtnPopup>
      <RunReportModal
        reportData={{
          id: selectedRows[0]?.IDENTIFIKATOR_OTCHETA,
          name: selectedRows[0]?.NAIMENOVANIE_OTCHETA,
        }}
        visible={popupVisible}
        onCancel={onClose}
        statusModalOpen={statusModalOpen}
        setStatusType={statusTypeHandler}
      />
    </div>
  );
};

export default memo(Reports);
