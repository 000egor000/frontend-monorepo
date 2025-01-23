import { memo } from 'react';
import classNames from 'classnames';
import { Task } from './types';

interface TaskListItemProps {
  data: Task;
  isActive: boolean;
  onClick: (task: Task) => void;
}

const TaskListItem = ({ data, isActive, onClick }: TaskListItemProps) => {
  const clickHandler = () => {
    onClick(data);
  };
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      className={classNames(['task-item', { 'task-item-active': isActive }])}
      onClick={clickHandler}
    >
      <div className="active-indicator" />
      <span className="task-item__name">{data.NAIMENOVANIE_ZADACHI}</span>
      <span className="task-item__type">{data.STATUS_ZADACHI}</span>
    </div>
  );
};

export default memo(TaskListItem);
