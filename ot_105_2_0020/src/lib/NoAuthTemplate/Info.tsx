import { memo } from 'react';
import { InfoCardItem } from './types';
import GroupInfoCards from './GroupInfoCards';
import './Info.scss';

interface InfoProps {
  description: string;
  cardsData: InfoCardItem[][];
}

const Info = ({ description, cardsData }: InfoProps) => (
  <div className="info">
    <p>{description}</p>
    <GroupInfoCards data={cardsData} />
  </div>
);

export default memo(Info);
