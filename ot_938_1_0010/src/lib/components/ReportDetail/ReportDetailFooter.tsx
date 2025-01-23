import { memo } from 'react';
import { Button } from '@atollis-ui/button';

interface ReportDetailFooterProps {
  onConfirm?: () => void;
  onCancel?: () => void;
  disabledCancel?: boolean;
  disabledConfirm?: boolean;
}

const ReportDetailFooter = ({
  onConfirm,
  onCancel,
  disabledCancel,
  disabledConfirm,
}: ReportDetailFooterProps) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
    <Button variant="secondary" onClick={onCancel} disabled={disabledCancel}>
      Отмена
    </Button>

    <Button
      variant="primary"
      onClick={onConfirm}
      disabled={disabledConfirm}
      appearance="blue"
    >
      Сохранить
    </Button>
  </div>
);

export default memo(ReportDetailFooter);
