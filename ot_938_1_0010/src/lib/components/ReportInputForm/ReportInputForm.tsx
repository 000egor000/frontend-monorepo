import { memo } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderDefault,
  LayoutComponentProps,
  findUrlInFunctionsList,
  useLayoutMaximizedPropsForCard,
} from '@atollis/ot_105_5_0070';
import { selectDrawerList, selectShortcutAuth } from '@atollis/ot_105_7_0010';
import './ReportInputForm.scss';

interface ReportInputFormProps extends Partial<LayoutComponentProps> {
  data?: {
    link?: string;
    name?: string;
  };
}

const ReportInputForm = ({
  isMaximized,
  switchLayoutMaximizedStatus,
  data,
}: ReportInputFormProps) => {
  const { menuList, onMenuItemClick } = useLayoutMaximizedPropsForCard(
    isMaximized,
    switchLayoutMaximizedStatus,
  );

  const draverList = useSelector(selectDrawerList);
  const shortcutList = useSelector(selectShortcutAuth);

  // TODO баг. в режиме создания подгружает кешированные данные последнего открытого iframe
  return (
    <Card className="report-input-form">
      <CardHeader>
        <CardHeaderDefault
          title="Форма ввода"
          onDoubleClick={switchLayoutMaximizedStatus}
          menuList={menuList}
          onMenuItemClick={onMenuItemClick}
        />
      </CardHeader>
      <CardBody>
        {data && (
          <iframe
            width="100%"
            height="100%"
            title={data?.name}
            src={
              data?.name
                ? findUrlInFunctionsList(shortcutList, draverList, data?.name)
                : ''
            }
          />
        )}
      </CardBody>
    </Card>
  );
};

export default memo(ReportInputForm);
