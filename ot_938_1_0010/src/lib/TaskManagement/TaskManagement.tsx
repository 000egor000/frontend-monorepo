import { memo, useState } from 'react';
import {
  LoaderPage,
  useCardContainerExpand,
  useUiSettings,
} from '@atollis/ot_105_5_0070';
import TaskDetail from '../components/TaskDetail/TaskDetail';
import TaskList from '../components/TaskList/TaskList';
import defaultSettings from '../defaultSettings/defaultSettings';
import libName from '../constants';
import './TaskManagement.scss';

const TaskManagement = () => {
  const { isLoading, settings, saveUiSettings } = useUiSettings(
    defaultSettings,
    libName,
  );

  const [triggerUpdate, setTriggerUpdate] = useState(false);

  const {
    className: classNameExpand,
    expand,
    setExpand,
  } = useCardContainerExpand();
  const className = `task-management ${classNameExpand}`;

  return (
    <div className={className}>
      {isLoading && <LoaderPage />}
      {!isLoading && (
        <>
          <TaskList
            settings={settings}
            triggerUpdate={triggerUpdate}
            saveUiSettings={saveUiSettings}
          />
          <TaskDetail
            isUiSettingsLoading={isLoading}
            settings={settings}
            expand={expand}
            triggerUpdate={triggerUpdate}
            setExpand={setExpand}
            saveUiSettings={saveUiSettings}
            setTriggerUpdate={setTriggerUpdate}
          />
        </>
      )}
    </div>
  );
};

export default memo(TaskManagement);
