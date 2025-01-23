import { memo, useCallback, useRef } from 'react';
import {
  LoaderPage,
  useCardContainerExpand,
  useUiSettings,
} from '@atollis/ot_105_5_0070';
import CampaignsList from '../CampaignsList/CampaignsList';
import CampaignsDetail from '../CampaignsDetail/CampaignsDetail';
import defaultSettings from '../../defaultSettings/defaultSettings';
import libName from '../../constants';

import './CampaignsManagement.scss';

const CampaignsManagement = () => {
  const { className, expand, setExpand } = useCardContainerExpand();

  const listDataSourceRef = useRef<any>(null);
  const getListDataSource = useCallback(() => listDataSourceRef.current, []);

  const { isLoading, settings, saveUiSettings } = useUiSettings(
    defaultSettings,
    libName,
  );

  return (
    <div className={className}>
      {isLoading && <LoaderPage />}
      {!isLoading && (
        <>
          <CampaignsList
            dataSourceRef={listDataSourceRef}
            settings={settings}
            saveUiSettings={saveUiSettings}
          />
          <CampaignsDetail
            isUiSettingsLoading={isLoading}
            settings={settings}
            expand={expand}
            setExpand={setExpand}
            getListDataSource={getListDataSource}
            saveUiSettings={saveUiSettings}
          />
        </>
      )}
    </div>
  );
};

export default memo(CampaignsManagement);
