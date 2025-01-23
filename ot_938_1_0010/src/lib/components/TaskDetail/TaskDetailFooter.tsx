import { memo } from 'react';
import { Button } from '@atollis-ui/button';
import { UIDetailFooter } from '@atollis/ot_105_5_0070';

interface TaskDetailFooterProps {
  isLoading?: boolean;
  type: string | undefined;
  status: string | undefined;
  buttonsHandler: (action: string) => void;
}

const marginAttr = { class: 'margin-attr' };

const TaskDetailFooter = ({
  isLoading,
  type,
  status,
  buttonsHandler,
}: TaskDetailFooterProps) => (
  <UIDetailFooter isLoading={isLoading}>
    <div className="additional-buttons">
      <Button
        variant="primary"
        appearance="blue"
        disabled={status !== 'К исполнению'}
        onClick={() => buttonsHandler('onWork')}
      >
        Взять в работу
      </Button>
      {type === '0' && (
        <Button
          variant="primary"
          appearance="green"
          disabled={status !== 'В работе'}
          onClick={() => buttonsHandler('onClose')}
        >
          Завершить
        </Button>
      )}
      {type === '1' && (
        <>
          <Button
            variant="primary"
            appearance="red"
            disabled={status !== 'В работе'}
            onClick={() => buttonsHandler('onNotAgree')}
          >
            Не согласовать
          </Button>
          <Button
            variant="primary"
            // type="success"
            appearance="green"
            disabled={status !== 'В работе'}
            onClick={() => buttonsHandler('onAgree')}
          >
            Согласовать
          </Button>
        </>
      )}
      {type === '2' && (
        <>
          <Button
            variant="primary"
            appearance="red"
            disabled={status !== 'В работе'}
            onClick={() => buttonsHandler('onNotApprove')}
          >
            Не утвердить
          </Button>
          <Button
            variant="primary"
            appearance="green"
            disabled={status !== 'В работе'}
            onClick={() => buttonsHandler('onApprove')}
          >
            Утвердить
          </Button>
        </>
      )}
    </div>
  </UIDetailFooter>
);

export default memo(TaskDetailFooter);
