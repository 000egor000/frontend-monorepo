import { memo, useCallback, useEffect, useState } from 'react';
import { TwoBtnsPopup } from '@atollis/ot_105_5_0070';
import { TextInput, TreeSelect } from '@atollis-ui/input';
import { Spin } from '@atollis-ui/spin';
import {
  BusinessObject,
  Task,
} from '../../reducers/taskParamsReducer/taskParamsReducer';
import './ChangingUserPopup.scss';
import { useDivisionsWithEmployees } from '../../dataSources';

interface SavePresetPopupProps {
  visible: boolean;
  actualExecutor?: string;
  requestTask?: () => Promise<Task | null>;
  onPopupCancel: () => void;
  onPopupConfirm: (data: BusinessObject, task?: Task) => Promise<boolean>;
}

interface INewEmployee extends BusinessObject {
  value: string;
  title: string;
}

interface INewDivision extends BusinessObject {
  NAIMENOVANIE: string;
  SOTRUDNIKIs: BusinessObject[];
}

interface IStaffs {
  value: string;
  title: string;
  children: INewEmployee[];
}

export const isEmpty = (value: any) => value == null || value.length === 0;

const ChangingUserPopup = ({
  visible,
  actualExecutor,
  requestTask,
  onPopupCancel,
  onPopupConfirm,
}: SavePresetPopupProps) => {
  const [newExecutor, setNewExecutor] = useState<INewEmployee | null>(null);
  const [staffs, setStaffs] = useState<IStaffs[]>([]);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setErorr] = useState(false);

  const { divisionsWithEmployees } = useDivisionsWithEmployees();

  const uploadEmployee = useCallback(async () => {
    /* eslint-disable no-underscore-dangle */
    const data = divisionsWithEmployees.reduce(
      // @ts-ignore
      (accDivisions: INewDivision[], division: INewDivision) => {
        // eslint-disable-next-line camelcase
        const { NAIMENOVANIE, SOTRUDNIKIs, obj_id } = division;

        const children: INewEmployee[] = [];

        for (const employee of SOTRUDNIKIs) {
          children.push({
            // eslint-disable-next-line camelcase
            value: `${obj_id} ${employee.obj_id}`,
            title: employee.NAIMENOVANIE,
            IDENTIFIKATOR: employee.IDENTIFIKATOR,
            NAIMENOVANIE: employee.NAIMENOVANIE,
            bo_id: employee.bo_id,
            obj_id: employee.obj_id,
          });
        }

        return [
          ...accDivisions,
          {
            // eslint-disable-next-line camelcase
            value: obj_id,
            title: NAIMENOVANIE,
            children,
          },
        ];
      },
      [],
    );

    setStaffs(data);
  }, []);

  useEffect(() => {
    uploadEmployee();
  }, []);

  const onItemClick = (e: string) => {
    const [divisionId, employeeId] = e.split(' ');
    const division = staffs?.find(el => el?.value === divisionId) || null;
    const employee =
      (!isEmpty(division) &&
        division?.children?.find(el => el.obj_id === employeeId)) ||
      null;

    if (employee) {
      setNewExecutor(employee);
      setIsSaveButtonDisabled(false);
      setErorr(false);
    }
  };

  const handleSaveButton = async () => {
    if (requestTask) {
      setLoading(true);

      try {
        const task: Task | null = await requestTask();
        if (newExecutor && task)
          await onPopupConfirm(newExecutor, task)
            .then(e => setErorr(e))
            .catch(e => setErorr(e));
        else setErorr(true);
      } catch (err) {
        setErorr(true);
      }

      setLoading(false);
    }
    if (!requestTask && newExecutor) {
      setLoading(true);
      await onPopupConfirm(newExecutor)
        .then(e => setErorr(e))
        .catch(e => setErorr(e));
      setLoading(false);
    }
  };

  return (
    <TwoBtnsPopup
      visible={visible}
      title="Сменить исполнителя"
      firstBtnText="Отмена"
      secondBtnText="Сохранить"
      onFirstBtnClick={() => {
        onPopupCancel();
        setErorr(false);
      }}
      onSecondBtnClick={handleSaveButton}
      secondBtnOptions={{ disabled: isSaveButtonDisabled }}
      withoutScroll
    >
      <div className="changing-user-popup-content">
        <TextInput
          label="Текущий исполнитель"
          value={actualExecutor}
          disabled
        />
        <TreeSelect
          treeData={staffs}
          value={newExecutor?.value}
          onSelect={onItemClick}
        />
        {error && (
          <h4 className="changing-user-popup-error">
            Что-то пошло не так. Попробуйте снова или обратитесь к системному
            администратору
          </h4>
        )}
        {loading && <Spin />}
      </div>
    </TwoBtnsPopup>
  );
};

export default memo(ChangingUserPopup);
