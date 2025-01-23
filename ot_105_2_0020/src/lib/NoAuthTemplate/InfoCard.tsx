import { memo } from 'react';

interface InfoCardProps {
  title: string;
  description: string;
}

const InfoCard = ({ title, description }: InfoCardProps) => (
  <div className="info-card">
    <div />
    <p className="info-card__title">{title}</p>
    <p className="info-card__description">{description}</p>
  </div>
);

export default memo(InfoCard);
