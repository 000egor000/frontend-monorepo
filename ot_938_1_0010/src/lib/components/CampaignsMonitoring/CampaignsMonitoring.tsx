import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Card,
  GridLayout,
  Presets,
  oDataFilterFormatter,
  http,
  CountControl,
  BtnControl,
  IPreset,
  popupHelpers,
} from '@atollis/ot_105_5_0070';

import { selectAccessToken } from '@atollis/ot_105_7_0010';
import manageRoutes from '@atollis/ot_938_5_0010';
import { AlertSvg, MdiClose } from '@atollis/ot_105_5_0080';
import SavePresetPopupCamping from '../Modal/SavePresetPopupCamping/SavePresetPopup';
import TwoBtnsPopupCamping from '../Modal/TwoBtnsPopupCamping/TwoBtnsPopupCamping';

import defaultSettings, {
  IMonitoringSettings,
} from '../../defaultSettings/defaultSettings';
import CampaignMonitoringTable from './CampaignsMonitoringTable';
import { BtnsId, btnsInfo } from '../buttons';
import libName from '../../constants';
import { ShowcaseCampaign } from '../../reducers/Campaigns/campaignFormReducer';
import { TabItemProps } from '../../Management/Management';
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

const CampaignMonitoring = ({
  tabName,
  currentTab,
  setBtnsHandler,
  setBtns,
  setMenuList,
  setMenuListHandler,
  setVisibleNoAccessPopup,
  uiSettings,
}: TabItemProps) => {
  const {
    isLoading,
    saveUiSettings,
    settings: { campaignMonitoring },
  } = uiSettings;

  const navigate = useNavigate();

  const accessToken = useSelector(selectAccessToken);
  const bearerRef = useRef(`Bearer ${accessToken}`);
  const [dataList, setData] = useState<any[]>([]);

  const dataGridRef = useRef(null);
  const requestParamsRef = useRef<{ [key: string]: string }>();
  const popupPromise = useRef<SavePopupPromise | RemovePopupPromise | null>(
    null,
  );
  const columnChooserToggleRef = useRef<boolean>(false);

  const selectedPresetQueryParamsRef = useRef<{ [key: string]: string } | null>(
    null,
  );

  const fetchData = async () => {
    const endpoint = Endpoints.showcaseCampaigns();
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

  const [selectedRows, setSelectedRows] = useState<ShowcaseCampaign[]>([]);
  const [removeCampaignsPopupVisible, setRemoveCampaignsPopupVisible] =
    useState(false);
  const [savePresetPopupVisible, setSavePresetPopupVisible] = useState(false);
  const [removePresetPopupVisible, setRemovePresetPopupVisible] =
    useState(false);
  const [presets, setPresets] = useState<PresetWithExtraParams[]>([]);
  const [presetForRemove, setPresetForRemove] =
    useState<PresetWithExtraParams | null>(null);

  const loadPresetsCount = async () => {
    const { presets: campaignPresets } = campaignMonitoring;
    const queries = campaignPresets.map(p =>
      http
        .get<{ d: { __count: string } }>(Endpoints.showcaseCampaigns(), {
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
      let activePreset = { ...data, requestParams };
      const newCampaignPresets: IPreset[] = campaignMonitoring.presets.map(
        preset => {
          if (preset.id === data.id) {
            isNew = false;
            activePreset = { ...preset, requestParams };
            return activePreset;
          }
          return preset;
        },
      );

      if (isNew) {
        newCampaignPresets.push(activePreset);
      }

      saveUiSettings(
        { presets: newCampaignPresets, activePreset },
        libName,
        'campaignMonitoring',
      );
    } catch {
      // continue regardless of error
    } finally {
      popupPromise.current = null;
      setSavePresetPopupVisible(false);
    }
  }, [campaignMonitoring, saveUiSettings]);

  const removePreset = useCallback(
    async preset => {
      try {
        await new Promise<void>((resolve, reject) => {
          popupPromise.current = { resolve, reject } as RemovePopupPromise;
          setRemovePresetPopupVisible(true);
          setPresetForRemove(preset);
        });

        const campaignPresets = campaignMonitoring.presets.filter(
          p => p.id !== preset.id,
        );

        const setting: Partial<IMonitoringSettings> = {
          presets: campaignPresets,
        };
        if (campaignMonitoring.activePreset?.id === preset.id)
          [setting.activePreset] = campaignPresets;

        saveUiSettings(setting, libName, 'campaignMonitoring');
      } catch {
        // continue regardless of error
      } finally {
        popupPromise.current = null;
        setRemovePresetPopupVisible(false);
        setPresetForRemove(null);
      }
    },

    [campaignMonitoring, saveUiSettings],
  );

  const onSelectionChanged = e => {
    setSelectedRows(e.selectedRowsData);
  };

  const onPopupCancel = () => {
    // TODO Popup Cancel
    setRemoveCampaignsPopupVisible(false);
  };
  const onPopupConfirm = () => {
    // TODO Popup Confirm
    setRemoveCampaignsPopupVisible(false);
  };

  const onSelectPreset = useCallback(
    activePreset => {
      saveUiSettings({ activePreset }, libName, 'campaignMonitoring');

      if (activePreset.id === campaignMonitoring.activePreset?.id)
        dataGridRef.current?.instance.state(activePreset?.gridState);
    },
    [campaignMonitoring.activePreset?.id, saveUiSettings],
  );

  const onBtnsHandler = useCallback(
    (id: string) => {
      switch (id) {
        case BtnsId.filter:
          savePreset();
          break;
        // case BtnsId.create:
        //   navigate(`${manageRoutes.campaigns}/${manageRoutes.create}`);
        //   break;
        case BtnsId.remove:
          setRemoveCampaignsPopupVisible(true);
          break;
        case BtnsId.play:
          // to progress
          break;
        case BtnsId.block:
          // complete
          break;
        case BtnsId.details:
          navigate(
            `${manageRoutes.campaigns}/${selectedRows[0].IDENTIFIKATOR_KAMPANII}`,
          );
          break;
        case BtnsId.export:
          if (dataGridRef.current) {
            dataGridRef.current.instance.exportToExcel(false);
          }
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
    [savePreset, navigate, selectedRows, columnChooserToggleRef.current],
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
        disabled: !(selectedRows.length === 1),
        name: 'Детализация кампании',
      },
      {
        ...btnsInfo[BtnsId.block],
        id: BtnsId.block,
        disabled: !(selectedRows.length === 1),
        name: 'Остановить кампанию',
      },
      {
        ...btnsInfo[BtnsId.play],
        id: BtnsId.play,
        disabled: !(selectedRows.length === 1),
        name: 'Запустить кампанию',
      },
      {
        ...btnsInfo[BtnsId.remove],
        id: BtnsId.remove,
        disabled: !selectedRows.length,
        name:
          selectedRows.length <= 1 ? 'Удалить кампанию' : 'Удалить кампании',
      },
      // {
      //   ...btnsInfo[BtnsId.create],
      //   id: BtnsId.create,
      //   disabled: false,
      //   name: 'Создать кампанию',
      // },
      {
        ...btnsInfo[BtnsId.filter],
        id: BtnsId.filter,
        disabled: false,
      },
    ],
    [columnChooserToggleRef.current, selectedRows],
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

  const contextMenuList = useMemo(
    () => [
      {
        ...btnsInfo[BtnsId.remove],
        disabled: !selectedRows.length,
        name:
          selectedRows.length <= 1 ? 'Удалить кампанию' : 'Удалить кампании',
        onItemClick: (): void => onBtnsHandler(BtnsId.remove),
      },
      {
        ...btnsInfo[BtnsId.play],
        disabled: !(selectedRows.length === 1),
        onItemClick: (): void => onBtnsHandler(BtnsId.play),
        name: 'Запустить кампанию',
      },
      {
        ...btnsInfo[BtnsId.block],
        disabled: !(selectedRows.length === 1),
        onItemClick: () => onBtnsHandler(BtnsId.block),
        name: 'Остановить кампанию',
      },
      {
        ...btnsInfo[BtnsId.details],
        disabled: !(selectedRows.length === 1),
        onItemClick: (): void => onBtnsHandler(BtnsId.details),
        name: 'Детализация кампании',
      },
    ],
    [onBtnsHandler, selectedRows.length],
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
  }, [campaignMonitoring]);

  useEffect(() => {
    dataGridRef.current?.instance.state(
      campaignMonitoring.activePreset?.gridState || null,
    );
  }, [campaignMonitoring.activePreset]);

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

  return (
    <>
      <Presets
        presets={presets}
        isLoading={isLoading}
        selected={campaignMonitoring.activePreset}
        onSelect={onSelectPreset}
        controls={presetControls}
      />
      <GridLayout layouts={defaultSettings.campaignMonitoring.layouts}>
        <Card key="table_campaign">
          <CampaignMonitoringTable
            data={dataList}
            tableRef={dataGridRef}
            contextMenuList={contextMenuList}
            onSelectionChanged={onSelectionChanged}
            setVisibleNoAccessPopup={setVisibleNoAccessPopup}
          />
        </Card>
      </GridLayout>

      <SavePresetPopupCamping
        defaultName={campaignMonitoring.activePreset?.name}
        visible={savePresetPopupVisible}
        onPopupConfirm={popupPromise.current?.resolve}
        onPopupCancel={popupPromise.current?.reject}
      />

      <TwoBtnsPopupCamping
        visible={removeCampaignsPopupVisible}
        title={popupHelpers.createDeleteTitle(
          selectedRows.map(i => i.NAIMENOVANIE_KAMPANII),
        )}
        icon={<AlertSvg />}
        firstBtnText="Отмена"
        secondBtnText="Удалить"
        onFirstBtnClick={onPopupCancel}
        onSecondBtnClick={onPopupConfirm}
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
    </>
  );
};

export default CampaignMonitoring;
