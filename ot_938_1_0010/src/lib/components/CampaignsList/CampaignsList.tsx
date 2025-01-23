import {
  memo,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { NavigateOptions, To, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { List } from '@atollis-ui/list';
import { SearchField } from '@atollis-ui/search-field';
import { ScrollArea } from '@atollis-ui/scroll-area';
import { Spin } from '@atollis-ui/spin';
import {
  Card,
  CardHeader,
  CardHeaderDefault,
  oDataFilterFormatter,
  popupHelpers,
  PresetsSelectBox,
  ThreeBtnsPopup,
  TSettings,
} from '@atollis/ot_105_5_0070';
import { AlertSvg, BackSvg } from '@atollis/ot_105_5_0080';
import manageRoutes from '@atollis/ot_938_5_0010';
import { selectAccessToken } from '@atollis/ot_105_7_0010';
import CampaignsListItem from './CampaignsListItem';
import { BtnsId, btnsInfo } from '../buttons';
import Endpoints from '../../Endpoints';
import { IManagementSettings } from '../../defaultSettings/defaultSettings';
import libName from '../../constants';
import {
  Campaign,
  campaignFormSelector,
  saveCampaign,
  setIsCheckValid,
  setIsValid,
} from '../../reducers/Campaigns/campaignFormReducer';
import './CampaignsList.scss';

interface CampaignsListProp {
  dataSourceRef: MutableRefObject<any>;
  settings: IManagementSettings;
  saveUiSettings: (
    setting: Partial<TSettings<IManagementSettings>>,
    projectKey: string,
    componentKey: keyof IManagementSettings,
  ) => void;
}

export interface CampaignT {
  IDENTIFIKATOR: string;
  IDENTIFIKATOR_KAMPANII: string;
  KOD_KAMPANII: string;
  NAIMENOVANIE_KAMPANII: string;
  IDENTIFIKATOR_OTCHETA: string;
  OTCHET: string;
  IDENTIFIKATOR_FORMY_VVODA: string;
  FORMA_VVODA: string;
  'SSY`LKA_NA_FORMU_VVODA': string;
  OTCHETNAYA_DATA: string;
  DATA_NACHALA_PLAN: string;
  DATA_ZAVERSHENIYA_PLAN: string;
  STATUS_KAMPANII: string;
  KURATOR: string;
  ' OTVETSTVENNY`J_IOGV': string;
  UCHASTNIKI: string;
}

const CampaignsList = ({
  dataSourceRef: dataSourceRefProp,
  settings,
  saveUiSettings,
}: CampaignsListProp) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const [visiblePopup, setVisiblePopup] = useState(false);
  const [navigateParams, setNavigateParams] = useState<
    [to: To, options?: NavigateOptions] | null
  >(null);

  const { isLoading, isChanged, isValid, formData, saveAction } =
    useSelector(campaignFormSelector);

  const accessToken = useSelector(selectAccessToken);

  const bearerRef = useRef(`Bearer ${accessToken}`);
  const selectedPresetQueryParamsRef = useRef<{ [key: string]: string } | null>(
    null,
  );

  const [dataList, setData] = useState<CampaignT[]>([]);
  const [filteredData, setFilteredData] = useState<CampaignT[]>([]);

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

  useEffect(() => {
    setFilteredData(dataList);
  }, [dataList]);

  useEffect(() => {
    bearerRef.current = `Bearer ${accessToken}`;
  }, [accessToken]);

  useEffect(() => {
    selectedPresetQueryParamsRef.current =
      settings.campaignMonitoring.activePreset?.requestParams || null;
  }, [settings.campaignMonitoring.activePreset]);

  useEffect(() => {
    if (isValid && formData && saveAction === 'saveAndGoRoute') {
      dispatch(setIsValid(false));

      (dispatch(saveCampaign(formData)) as unknown as Promise<null | Campaign>)
        .then(data => {
          if (data && navigateParams) navigate(...navigateParams);
        })
        .finally(() => {
          dispatch(setIsCheckValid({ isCheck: false }));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  const onPresetSelect = useCallback(
    (e: any) => {
      saveUiSettings(
        { activePreset: e.selectedItem },
        libName,
        'campaignMonitoring',
      );
    },
    [saveUiSettings],
  );

  const cardBtns = useMemo(
    () => [
      {
        ...btnsInfo[BtnsId.block],
        id: BtnsId.block,
        disabled: isLoading,
        name: 'Остановить кампанию',
      },
      {
        ...btnsInfo[BtnsId.play],
        id: BtnsId.play,
        disabled: isLoading,
        name: 'Запустить кампанию',
      },
      {
        ...btnsInfo[BtnsId.remove],
        id: BtnsId.remove,
        disabled: isLoading,
        name: 'Удалить кампанию',
      },
      // {
      //   ...btnsInfo[BtnsId.create],
      //   id: BtnsId.create,
      //   disabled: isLoading,
      //   name: 'Создать кампанию',
      // },
    ],
    [isLoading],
  );

  const handleSearch = (value: string) => {
    if (value.trim() === '') {
      setFilteredData(dataList);
    } else {
      const filtered = dataList.filter(item => {
        const itemName = (item?.OTCHET as string)?.toLowerCase();
        return itemName?.includes?.(value.toLowerCase());
      });
      setFilteredData(filtered);
    }
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
      setNavigateParams([`${manageRoutes.base}/#Кампании`]);
    } else {
      navigate(`${manageRoutes.base}/#Кампании`);
    }
  }, [isChanged, navigate]);

  const onListItemClick = useCallback(
    e => {
      if (e?.IDENTIFIKATOR_KAMPANII && isChanged) {
        setVisiblePopup(true);
        setNavigateParams([
          `${manageRoutes.base}/${manageRoutes.campaigns}/${e.IDENTIFIKATOR_KAMPANII}`,
        ]);
      } else {
        navigate(
          `${manageRoutes.base}/${manageRoutes.campaigns}/${e.IDENTIFIKATOR_KAMPANII}`,
        );
      }
    },
    [isChanged, navigate],
  );

  const onButtonClick = useCallback(
    (id: string) => {
      switch (id) {
        // case BtnsId.create:
        //   if (isChanged) {
        //     setVisiblePopup(true);
        //     setNavigateParams([
        //       `${manageRoutes.base}/${manageRoutes.campaigns}/${manageRoutes.create}`,
        //     ]);
        //   } else
        //     navigate(
        //       `${manageRoutes.base}/${manageRoutes.campaigns}/${manageRoutes.create}`,
        //     );
        //   break;
        case BtnsId.remove:
          console.log('remove');
          break;
        case BtnsId.play:
          console.log('inWork');
          break;
        case BtnsId.block:
          console.log('complete');
          break;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [isChanged, navigate],
  );

  return (
    <Card isContainer className="detail-content__left-card campaigns-list-card">
      <CardHeader>
        <CardHeaderDefault
          title="Кампании"
          buttons={cardBtns}
          onButtonClick={onButtonClick}
          menuList={cardMenuList}
          icon={<BackSvg className="icon-accent" onClick={onClickBackIcon} />}
        />
      </CardHeader>
      <div className="campaigns-list-card__body">
        <PresetsSelectBox
          displayExpr="name"
          items={settings.campaignMonitoring.presets}
          value={settings.campaignMonitoring.activePreset?.id}
          onSelectionChanged={onPresetSelect}
        />
        {dataList?.length > 0 ? (
          <>
            <SearchField
              onSearch={handleSearch}
              variant="outlined"
              allowClear
              placeholder="Поиск ."
            />
            <ScrollArea height="100%">
              <List
                itemLayout="horizontal"
                className="campaigns-list"
                data={filteredData || []}
                renderItem={renderListItem(params?.id)}
                onItemClick={onListItemClick}
              />
            </ScrollArea>
          </>
        ) : (
          <div className="spin">
            <Spin />
          </div>
        )}
      </div>
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

export default memo(CampaignsList);

const renderListItem = (id?: string | number) => (userData: CampaignT) =>
  (
    <CampaignsListItem
      data={userData}
      activeItem={id === userData?.IDENTIFIKATOR_KAMPANII}
    />
  );
