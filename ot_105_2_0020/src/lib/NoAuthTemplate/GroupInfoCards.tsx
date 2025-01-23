import { memo } from 'react';
import Box, { Item } from 'devextreme-react/box';
import { InfoCardItem } from './types';
import InfoCard from './InfoCard';

import './GroupInfoCards.scss';

interface GroupInfoCardsProps {
  data: InfoCardItem[][];
}

const GroupInfoCards = ({ data }: GroupInfoCardsProps) => {
  const getItem = (item: InfoCardItem) => (
    <Item key={item.id} ratio={1}>
      <InfoCard title={item.title} description={item.description} />
    </Item>
  );

  const getRow = (row: InfoCardItem[]) => (
    <Box key={row[0].id} direction="row" width="100%" height={110}>
      {row.map(getItem)}
    </Box>
  );

  return <div className="group-info-cards">{data.map(getRow)}</div>;
};

export default memo(GroupInfoCards);
