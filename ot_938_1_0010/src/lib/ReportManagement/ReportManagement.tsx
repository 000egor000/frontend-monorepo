import { memo } from 'react';
import {
  LoaderPage,
  useCardContainerExpand,
  useUiSettings,
} from '@atollis/ot_105_5_0070';
import ReportDetail from '../components/ReportDetail/ReportDetail';
import ReportList from '../components/ReportList/ReportList';
import defaultSettings from '../defaultSettings/defaultSettings';
import libName from '../constants';
import './ReportManagement.scss';

const ReportManagement = () => {
  const {
    className: classNameExpand,
    expand,
    setExpand,
  } = useCardContainerExpand();
  const className = `report-management ${classNameExpand}`;

  const { isLoading, settings, saveUiSettings } = useUiSettings(
    defaultSettings,
    libName,
  );

  return (
    <div className={className}>
      {isLoading && <LoaderPage />}
      {!isLoading && (
        <>
          <ReportList settings={settings} saveUiSettings={saveUiSettings} />
          <ReportDetail
            isUiSettingsLoading={isLoading}
            settings={settings}
            expand={expand}
            setExpand={setExpand}
            saveUiSettings={saveUiSettings}
          />
        </>
      )}
    </div>
  );
};

export default memo(ReportManagement);
