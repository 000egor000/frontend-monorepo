import { memo } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@atollis-ui/button';

import { UIDetailFooter } from '@atollis/ot_105_5_0070';
import './CampaignsDetail.scss';

interface CampaignsDetailFooterProps {
  onConfirm: () => void;
  onCancel: () => void;
  onDanger?: () => void;
  disabledCancel?: boolean;
  disabledConfirm?: boolean;
  disabledDanger?: boolean;
}

const CampaignsDetailFooter = ({
  onConfirm,
  onCancel,
  onDanger,
  disabledCancel,
  disabledConfirm,
  disabledDanger,
}: CampaignsDetailFooterProps) => {
  const params = useParams();

  return (
    <UIDetailFooter
      btnText={params.id ? 'Сохранить' : 'Запустить'}
      onConfirm={onConfirm}
      onCancel={onCancel}
      disabledConfirm={disabledConfirm}
      disabledCancel={disabledCancel}
    >
      {params.id && (
        <Button
          variant="primary"
          appearance="red"
          disabled={disabledDanger}
          onClick={onDanger}
        >
          Завершить
        </Button>
      )}
    </UIDetailFooter>
  );
};

export default memo(CampaignsDetailFooter);
