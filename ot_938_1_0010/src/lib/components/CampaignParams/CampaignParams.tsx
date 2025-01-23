import { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Card,
  CardHeader,
  CardHeaderDefault,
  CardBody,
  LayoutComponentProps,
  useLayoutMaximizedPropsForCard,
} from '@atollis/ot_105_5_0070';
import CampaignParamsForm from './CampaignParamsForm';
import { campaignFormSelector } from '../../reducers/Campaigns/campaignFormReducer';

const CampaignsParams = ({
  isMaximized,
  switchLayoutMaximizedStatus,
}: Partial<LayoutComponentProps>) => {
  const { menuList, onMenuItemClick } = useLayoutMaximizedPropsForCard(
    isMaximized,
    switchLayoutMaximizedStatus,
  );

  const params = useParams();

  const { formData, isLoading } = useSelector(campaignFormSelector);
  const [isFormReady, setIsFormReady] = useState(true);

  useEffect(() => {
    // for reset form validation
    setIsFormReady(false);
    const id = setTimeout(() => setIsFormReady(true));

    return () => {
      clearTimeout(id);
    };
  }, [params.id]);

  return (
    <Card className="campaigns-detail-card campaign-params">
      <CardHeader>
        <CardHeaderDefault
          title="Параметры"
          onDoubleClick={switchLayoutMaximizedStatus}
          menuList={menuList}
          onMenuItemClick={onMenuItemClick}
        />
      </CardHeader>
      <CardBody>
        {isFormReady && !isLoading && formData && (
          <CampaignParamsForm formData={formData} />
        )}
      </CardBody>
    </Card>
  );
};
export default memo(CampaignsParams);
