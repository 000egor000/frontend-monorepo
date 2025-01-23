import { ChangeEvent, FC } from 'react';
import { TextInput } from '@atollis-ui/input';

type TaskListSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

const TaskListSearch: FC<TaskListSearchProps> = ({ value, onChange }) => {
  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <TextInput
      classNames={{ root: 'search-input' }}
      value={value}
      onChange={changeHandler}
    />
  );
};

export default TaskListSearch;
