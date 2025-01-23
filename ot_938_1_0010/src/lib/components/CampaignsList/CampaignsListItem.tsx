import { CampaignT } from './CampaignsList';

interface CampaignsListItemProps {
  data: CampaignT;
  activeItem?: boolean;
}

const CampaignsListItem = ({ data, activeItem }: CampaignsListItemProps) => (
  <div className={getClassName(activeItem)}>
    <span className="campaigns-item__name">{data?.NAIMENOVANIE_KAMPANII}</span>
    {data?.STATUS_KAMPANII && (
      <span className="campaigns-item__type">{data.STATUS_KAMPANII}</span>
    )}
  </div>
);
export default CampaignsListItem;

const getClassName = (activeItem?: boolean) => {
  const classes = ['campaigns-item'];
  if (activeItem) classes.push('active');

  return classes.join(' ');
};
