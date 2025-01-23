import { memo } from 'react';
import {
  Card,
  CardHeader,
  CardHeaderDefault,
  CardBody,
  LayoutComponentProps,
  useLayoutMaximizedPropsForCard,
} from '@atollis/ot_105_5_0070';
import { Link } from 'react-router-dom';
import manageRoutes from '@atollis/ot_938_5_0010';
import { useSelector } from 'react-redux';
import RelatedTasksTable from './RelatedTasksTable';
import { campaignFormSelector } from '../../reducers/Campaigns/campaignFormReducer';

const RelatedTasks = ({
  isMaximized,
  switchLayoutMaximizedStatus,
}: Partial<LayoutComponentProps>) => {
  const { menuList, onMenuItemClick } = useLayoutMaximizedPropsForCard(
    isMaximized,
    switchLayoutMaximizedStatus,
  );

  const { formData } = useSelector(campaignFormSelector);

  return (
    <Card className="campaigns-detail-card">
      <CardHeader>
        <CardHeaderDefault
          onDoubleClick={switchLayoutMaximizedStatus}
          menuList={menuList}
          onMenuItemClick={onMenuItemClick}
        >
          <Link
            className={
              formData.name
                ? 'related-tasks-header'
                : 'related-tasks-header disabled'
            }
            to={`${manageRoutes.base}?name=${formData.name}#Задачи`}
          >
            Связанные задачи
          </Link>
        </CardHeaderDefault>
      </CardHeader>
      <CardBody>
        <RelatedTasksTable />
      </CardBody>
    </Card>
  );
};
export default memo(RelatedTasks);
