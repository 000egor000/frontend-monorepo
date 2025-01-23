import { memo } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderDefault,
  LayoutComponentProps,
  findUrlInFunctionsList,
  useLayoutMaximizedPropsForCard,
} from '@atollis/ot_105_5_0070';
import { selectDrawerList, selectShortcutAuth } from '@atollis/ot_105_7_0010';
import { taskParamsSelector } from '../../reducers/taskParamsReducer/taskParamsReducer';

const TaskInputForm = ({
  isMaximized,
  switchLayoutMaximizedStatus,
}: Partial<LayoutComponentProps>) => {
  const { menuList, onMenuItemClick } = useLayoutMaximizedPropsForCard(
    isMaximized,
    switchLayoutMaximizedStatus,
  );

  const { formData } = useSelector(taskParamsSelector);
  const draverList = useSelector(selectDrawerList);
  const shortcutList = useSelector(selectShortcutAuth);

  return (
    <Card className="task-inputForm task-detail-card">
      <CardHeader>
        <CardHeaderDefault
          title="Форма ввода"
          menuList={menuList}
          onDoubleClick={switchLayoutMaximizedStatus}
          onMenuItemClick={onMenuItemClick}
        />
      </CardHeader>
      <CardBody>
        <iframe
          width="100%"
          height="100%"
          title={formData?.inputForm?.name}
          src={
            formData?.inputForm?.name
              ? findUrlInFunctionsList(
                  shortcutList,
                  draverList,
                  formData?.inputForm?.name,
                )
              : ''
          }
        />
      </CardBody>
    </Card>
  );
};

export default memo(TaskInputForm);
