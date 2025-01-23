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
import { campaignFormSelector } from '../../reducers/Campaigns/campaignFormReducer';

const InputForm = ({
  isMaximized,
  switchLayoutMaximizedStatus,
}: Partial<LayoutComponentProps>) => {
  const { menuList, onMenuItemClick } = useLayoutMaximizedPropsForCard(
    isMaximized,
    switchLayoutMaximizedStatus,
  );
  const { formData, isLoading } = useSelector(campaignFormSelector);
  const draverList = useSelector(selectDrawerList);
  const shortcutList = useSelector(selectShortcutAuth);

  return (
    <Card className="input-form campaigns-detail-card">
      <CardHeader>
        <CardHeaderDefault
          title="Форма ввода"
          onDoubleClick={switchLayoutMaximizedStatus}
          menuList={menuList}
          onMenuItemClick={onMenuItemClick}
        />
      </CardHeader>
      <CardBody>
        {!isLoading && (
          <iframe
            width="100%"
            height="100%"
            title="gwt Форма ввода"
            src={
              formData.inputForm?.name
                ? findUrlInFunctionsList(
                    shortcutList,
                    draverList,
                    formData.inputForm?.name,
                  )
                : ''
            }
          />
        )}
      </CardBody>
    </Card>
  );
};

export default memo(InputForm);
