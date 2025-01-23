import React, { memo, useEffect, useState, ChangeEvent } from 'react';

import { Modal } from '@atollis-ui/modal';
import { Button } from '@atollis-ui/button';
import { TextInput } from '@atollis-ui/input';
import '@atollis-ui/modal/dist/index.css';

import './SavePresetPopup.scss';

interface SavePresetPopupProps {
  visible?: boolean;
  onPopupCancel?: () => void;
  onPopupConfirm?: (data: { id: string; name: string }) => void;
  defaultName?: string;
}

const SavePresetPopupCamping = ({
  visible,
  onPopupCancel,
  onPopupConfirm,
  defaultName = '',
}: SavePresetPopupProps) => {
  const [name, setName] = useState(defaultName);

  useEffect(() => {
    setName(defaultName);
  }, [defaultName]);

  const onValueChanged = (e: ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value.trim();
    !inputValue && closeModal();
    setName(e.target.value);
  };

  const saveNewPreset = () => {
    onPopupConfirm?.({ id: name, name });
  };

  const closeModal = () => onPopupCancel();

  return (
    <Modal isOpen={visible}>
      <div className="body-modal">
        <h3>Сохранение набора</h3>
        <TextInput
          value={name}
          onChange={onValueChanged}
          placeholder="Наименование"
        />
        <div className="groupBtn">
          <Button variant="text" appearance="blue" onClick={closeModal}>
            Отмена
          </Button>

          <Button variant="primary" appearance="blue" onClick={saveNewPreset}>
            Сохранить
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(SavePresetPopupCamping);
