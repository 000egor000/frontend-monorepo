import { memo } from 'react';

import { Modal } from '@atollis-ui/modal';
import { Button } from '@atollis-ui/button';
import './TwoBtnsPopupCamping.scss';
import '@atollis-ui/modal/dist/index.css';

interface TwoBtnsPopupCampingI {
  visible?: boolean;

  title?: string;
  firstBtnText?: string;
  secondBtnText?: string;
  content?: string;
  icon?: JSX.Element;
  onFirstBtnClick?: () => void;
  onSecondBtnClick?: () => void;
  appearance: 'red' | 'blue' | 'green' | undefined;
}

const TwoBtnsPopupCamping = ({
  visible,
  firstBtnText,
  secondBtnText,
  title,
  icon,
  content,
  onFirstBtnClick,
  onSecondBtnClick,
  appearance,
}: TwoBtnsPopupCampingI) => (
  <Modal isOpen={visible}>
    <div className="body-modal">
      <h3>
        {icon}
        <span> {title}</span>
      </h3>
      <p>{content}</p>
      <div className="groupBtn">
        <Button variant="text" appearance="blue" onClick={onFirstBtnClick}>
          {firstBtnText}
        </Button>

        <Button
          variant="primary"
          appearance={appearance || 'red'}
          onClick={onSecondBtnClick}
        >
          {secondBtnText}
        </Button>
      </div>
    </div>
  </Modal>
);

export default memo(TwoBtnsPopupCamping);
