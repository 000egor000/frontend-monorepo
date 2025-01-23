import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Tabs } from '@atollis-ui/tabs';
import { CardButton } from '@atollis/ot_105_5_0070/src/lib/components/CardGridLayout/Card/CardHeaderDefault';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderDefault,
  OneBtnPopup,
  popupHelpers,
  useUiSettings,
} from '@atollis/ot_105_5_0070';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserFunctions } from '@atollis/ot_105_7_0010';
import { AlertSvg } from '@atollis/ot_105_5_0080';
import { ScrollArea } from '@atollis-ui/scroll-area';
import Reports from '../components/Reports/Reports';
import TaskMonitoring from '../components/TaskMonitoring/TaskMonitoring';
import CampaignMonitoring from '../components/CampaignsMonitoring/CampaignsMonitoring';
import libName from '../constants';
import defaultSettings, {
  IManagementSettings,
} from '../defaultSettings/defaultSettings';
import '@atollis-ui/tabs/dist/index.css';
import './Management.scss';

export interface TabItemProps {
  tabName: string; // tabName in order. starts from Задачи
  currentTab: string; // selected tabName
  setBtns?: (btns: CardButton[]) => void;
  setBtnsHandler?: (fn?: (id: string) => void) => void;
  setMenuList?: (btns: CardButton[]) => void;
  setMenuListHandler?: (fn?: (id: string) => void) => void;
  setVisibleNoAccessPopup?: (val: boolean) => void;
  uiSettings: ReturnType<typeof useUiSettings<IManagementSettings>>;
}

const managementRules = {
  'OT.105.APP.SF.006.003': 'Задачи',
  'OT.105.APP.SF.006.002': 'Кампании',
  'OT.105.APP.SF.006.001': 'Отчеты',
};

const Management = () => {
  const location = useLocation();

  const userFunctions = useSelector(selectUserFunctions);

  const [visiblePopup, setVisiblePopup] = useState(false);

  const tabs = useMemo(
    () =>
      Object.entries(managementRules)
        .map((el: string[]) => {
          if (userFunctions.includes(el[0])) {
            return el[1];
          }
          return '';
        })
        .filter(str => str !== ''),
    [userFunctions],
  );

  const actualTab = tabs.find(
    el => el === decodeURI(location.hash).replace(/^./, ''),
  )
    ? decodeURI(location.hash).replace(/^./, '')
    : tabs[0];

  const [buttons, setButtons] = useState<CardButton[]>([]);
  const [menuList, setMenuList] = useState<CardButton[]>([]);

  const btnsHandlerRef = useRef<(id: string) => void>();
  const menuListHandlerRef = useRef<(id: string) => void>();

  const uiSettings = useUiSettings(defaultSettings, libName);

  const setBtnsHandler = useCallback((fn?: (id: string) => void) => {
    btnsHandlerRef.current = fn;
  }, []);

  const setMenuListHandler = useCallback((fn?: (id: string) => void) => {
    menuListHandlerRef.current = fn;
  }, []);

  const cardBtnsHandler = useCallback((id: string) => {
    btnsHandlerRef.current?.(id);
  }, []);

  const cardMenuListHandler = useCallback((id: string) => {
    menuListHandlerRef.current?.(id);
  }, []);

  const tabsData = [
    {
      id: managementRules['OT.105.APP.SF.006.003'],
      title: managementRules['OT.105.APP.SF.006.003'],
      child: (
        <TaskMonitoring
          tabName={managementRules['OT.105.APP.SF.006.003']}
          currentTab={actualTab}
          setBtns={setButtons}
          setBtnsHandler={setBtnsHandler}
          setMenuList={setMenuList}
          setMenuListHandler={setMenuListHandler}
          setVisibleNoAccessPopup={setVisiblePopup}
          uiSettings={uiSettings}
        />
      ),
    },
    {
      id: managementRules['OT.105.APP.SF.006.002'],
      title: managementRules['OT.105.APP.SF.006.002'],
      child: (
        <CampaignMonitoring
          tabName={managementRules['OT.105.APP.SF.006.002']}
          currentTab={actualTab}
          setBtns={setButtons}
          setBtnsHandler={setBtnsHandler}
          setMenuList={setMenuList}
          setMenuListHandler={setMenuListHandler}
          setVisibleNoAccessPopup={setVisiblePopup}
          uiSettings={uiSettings}
        />
      ),
    },
    {
      id: managementRules['OT.105.APP.SF.006.001'],
      title: managementRules['OT.105.APP.SF.006.001'],
      child: (
        <Reports
          tabName={managementRules['OT.105.APP.SF.006.001']}
          currentTab={actualTab}
          setBtns={setButtons}
          setBtnsHandler={setBtnsHandler}
          setMenuList={setMenuList}
          setMenuListHandler={setMenuListHandler}
          setVisibleNoAccessPopup={setVisiblePopup}
          uiSettings={uiSettings}
        />
      ),
    },
  ];

  return (
    <Card isContainer>
      <div className="header-wrapper">
        <CardHeader>
          <CardHeaderDefault
            buttons={buttons}
            menuList={menuList}
            onButtonClick={cardBtnsHandler}
            onMenuItemClick={cardMenuListHandler}
          />
        </CardHeader>
      </div>

      <CardBody>
        <ScrollArea height="100%" width="100%">
          <Tabs
            classNames={{ tabs: 'tabs' }}
            data={tabsData}
            activeTab={actualTab}
          />
        </ScrollArea>
      </CardBody>
      <OneBtnPopup
        visible={visiblePopup}
        title={popupHelpers.noAccessTitle}
        status="warning"
        icon={<AlertSvg />}
        btnText="Закрыть"
        onBtnClick={() => setVisiblePopup(false)}
      >
        {popupHelpers.noAccessContent}
      </OneBtnPopup>
    </Card>
  );
};
export default memo(Management);
