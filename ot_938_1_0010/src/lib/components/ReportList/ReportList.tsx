import {
  memo,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigateOptions, To, useNavigate, useParams } from 'react-router-dom';

import { List } from '@atollis-ui/list';
import { Select } from '@atollis-ui/input';
import { SearchField } from '@atollis-ui/search-field';
import { ScrollArea } from '@atollis-ui/scroll-area';
import {
  Card,
  CardHeader,
  CardHeaderDefault,
  oDataFilterFormatter,
  OneBtnPopup,
  popupHelpers,
  PresetsSelectBox,
  ThreeBtnsPopup,
  TSettings,
} from '@atollis/ot_105_5_0070';
import { AlertSvg, BackSvg } from '@atollis/ot_105_5_0080';
import manageRoutes from '@atollis/ot_938_5_0010';
import { selectAccessToken } from '@atollis/ot_105_7_0010';
import { btnsInfo, BtnsId } from '../buttons';
import ReportListItem from './ReportListItem';
import Endpoints from '../../Endpoints';
import libName from '../../constants';
import {
  Report,
  reportParamsSelector,
  saveReport,
  setIsCheckValid,
  setIsValid,
} from '../../reducers/reportParamsReducer/reportParamsReducer';
import { IManagementSettings } from '../../defaultSettings/defaultSettings';
import RunReportModal from '../RunReportModal/RunReportModal';
import { reportReglamentSelector } from '../../reducers/reportReglamentReducer/reportReglamentReducer';
import './ReportList.scss';

interface ReportListProp {
  settings: IManagementSettings;
  saveUiSettings: (
    setting: Partial<TSettings<IManagementSettings>>,
    projectKey: string,
    componentKey: keyof IManagementSettings,
  ) => void;
}

const ReportList = ({ settings, saveUiSettings }: ReportListProp) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const [dataList, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const [visiblePopup, setVisiblePopup] = useState(false);
  const [navigateParams, setNavigateParams] = useState<
    [to: To, options?: NavigateOptions] | null
  >(null);

  const { isLoading, isChanged, isValid, saveAction, formData } =
    useSelector(reportParamsSelector);
  const { intermediateReglament, identifikator } = useSelector(
    reportReglamentSelector,
  );
  const [isVisible, setIsVisible] = useState(false);
  const [isStatusModalVisible, setStatusModalVisible] = useState(false);
  const [statusType, setStatusType] = useState<number | null>(null);

  const accessToken = useSelector(selectAccessToken);

  const bearerRef = useRef(`Bearer ${accessToken}`);
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

  const handleSearch = (value: string) => {
    if (value.trim() === '') {
      setFilteredData(dataList);
    } else {
      const filtered = dataList.filter(item => {
        const itemName = (item?.NAIMENOVANIE_OTCHETA as string)?.toLowerCase();
        return itemName?.includes?.(value.toLowerCase());
      });
      setFilteredData(filtered);
    }
  };

  const onListItemClick = useCallback(
    e => {
      if (e.IDENTIFIKATOR_OTCHETA && isChanged) {
        setVisiblePopup(true);
        setNavigateParams([
          `${manageRoutes.base}/${manageRoutes.reports}/${e.IDENTIFIKATOR_OTCHETA}`,
        ]);
      } else {
        navigate(
          `${manageRoutes.base}/${manageRoutes.reports}/${e.IDENTIFIKATOR_OTCHETA}`,
        );
      }
    },
    [isChanged, navigate],
  );

  const onPresetSelect = useCallback(
    e => {
      saveUiSettings(
        { activePreset: e?.selectedItem },
        libName,
        'reportMonitoring',
      );
    },
    [saveUiSettings],
  );

  const cardBtns = useMemo(
    () => [
      {
        ...btnsInfo[BtnsId.block],
        id: BtnsId.block,
        name: 'Перевести в «Неактуальный»',
        disabled: !params.id || isLoading,
      },
      {
        ...btnsInfo[BtnsId.play],
        id: BtnsId.play,
        name: 'Запустить кампанию для формирования отчёта',
        disabled: !params.id || isLoading,
      },
      {
        ...btnsInfo[BtnsId.remove],
        id: BtnsId.remove,
        name: 'Удалить отчет',
        disabled: !params.id || isLoading,
      },
      {
        ...btnsInfo[BtnsId.create],
        id: BtnsId.create,
        name: 'Создать отчет',
        disabled: !params.id || isLoading,
      },
    ],
    [params?.id, isLoading],
  );

  const onBtnsHandler = useCallback(
    (id: string) => {
      switch (id) {
        case BtnsId.create:
          if (isChanged) {
            setVisiblePopup(true);
            setNavigateParams([
              `${manageRoutes.base}/${manageRoutes.reports}/${manageRoutes.create}`,
            ]);
          } else
            navigate(
              `${manageRoutes.base}/${manageRoutes.reports}/${manageRoutes.create}`,
            );
          break;
        case BtnsId.remove:
          console.log('Удалить: ', params?.id);
          break;
        case BtnsId.play:
          setIsVisible(true);
          break;
        case BtnsId.block:
          console.log('Сделать не актуальными: ', params?.id);
          break;
      }
    },
    [isChanged, navigate, params?.id],
  );

  const onModalClose = () => {
    setIsVisible(false);
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

  const cardMenuList = useMemo(
    () => [
      {
        ...btnsInfo[BtnsId.info],
        id: BtnsId.info,
      },
    ],
    [],
  );

  const confirmHandler = () => {
    setVisiblePopup(false);
    if (navigateParams) navigate(...navigateParams);
  };

  const saveHandler = () => {
    dispatch(setIsCheckValid({ isCheck: true, saveAction: 'saveAndGoRoute' }));
    setVisiblePopup(false);
  };

  const onClickBackIcon = useCallback(() => {
    if (isChanged) {
      setVisiblePopup(true);
      setNavigateParams([`${manageRoutes.base}/#Отчеты`]);
    } else {
      navigate(`${manageRoutes.base}/#Отчеты`);
    }
  }, [isChanged, navigate]);

  useEffect(() => {
    if (isValid && formData && saveAction === 'saveAndGoRoute') {
      dispatch(setIsValid(false));

      (
        dispatch(
          saveReport(formData, { ...intermediateReglament, identifikator }),
        ) as unknown as Promise<null | Report>
      )
        .then(data => {
          if (data && navigateParams) navigate(...navigateParams);
        })
        .finally(() => {
          dispatch(setIsCheckValid({ isCheck: false }));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  useEffect(() => {
    bearerRef.current = `Bearer ${accessToken}`;
  }, [accessToken]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredData(dataList);
  }, [dataList]);

  return (
    <Card isContainer className="report-list-card">
      <CardHeader>
        <CardHeaderDefault
          title="Отчеты"
          buttons={cardBtns}
          onButtonClick={onBtnsHandler}
          menuList={cardMenuList}
          icon={<BackSvg className="icon-accent" onClick={onClickBackIcon} />}
        />
      </CardHeader>
      <div className="report-list-card__body">
        <PresetsSelectBox
          displayExpr="name"
          items={settings.reportMonitoring.presets}
          value={settings.reportMonitoring.activePreset?.id}
          onSelectionChanged={onPresetSelect}
        />
        <SearchField onSearch={handleSearch} variant="outlined" allowClear />
        <ScrollArea height="100%">
          <List
            itemLayout="horizontal"
            className="report-list"
            data={filteredData || []}
            renderItem={ReportListItem}
            onItemClick={onListItemClick}
          />
        </ScrollArea>
      </div>
      <OneBtnPopup
        visible={isStatusModalVisible}
        status={statusType === 200 ? 'success' : 'error'}
        icon={<AlertSvg />}
        btnText="Ок"
        onBtnClick={statusModalClose}
      >
        {statusType === 200
          ? 'Кампания по формированию отчёта запущена'
          : 'Запуск кампании по формированию отчёта не возможен. Повторите попытку'}
      </OneBtnPopup>
      <RunReportModal
        reportData={{
          id: params.id,
          name: undefined,
        }}
        visible={isVisible}
        onCancel={onModalClose}
        statusModalOpen={statusModalOpen}
        setStatusType={statusTypeHandler}
      />

      <ThreeBtnsPopup
        visible={visiblePopup}
        title={popupHelpers.movePageTitle}
        icon={<AlertSvg />}
        status="warning"
        firstBtnText="Отмена"
        secondBtnText="Не сохранять"
        thirdBtnText="Сохранить"
        onFirstBtnClick={() => {
          setVisiblePopup(false);
        }}
        onSecondBtnClick={confirmHandler}
        onThirdBtnClick={saveHandler}
      >
        {popupHelpers.movePageContent}
      </ThreeBtnsPopup>
    </Card>
  );
};

export default memo(ReportList);
