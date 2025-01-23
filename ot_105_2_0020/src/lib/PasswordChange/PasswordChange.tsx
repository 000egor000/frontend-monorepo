import {
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RequiredRule } from 'devextreme-react/validator';
import {
  ButtonItem,
  ButtonOptions,
  CompareRule,
  Form,
  GroupItem,
  Label,
  SimpleItem,
} from 'devextreme-react/form';
import { eyeSvg } from '@atollis/ot_105_5_0080';
import {
  changePassword,
  clearAuthMessaggeError,
  clearExpirePassword,
  clearPasswordChanged,
  selectAuth,
} from '@atollis/ot_105_7_0010';
import { ButtonFormLoader, FormMessage } from '@atollis/ot_105_5_0070';
import mainFormRoutes from '@atollis/ot_105_5_0110';
import NoAuthTemplate from '../NoAuthTemplate/NoAuthTemplate';

import './Login.scss';

const PasswordChange = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [passwordHide, setPasswordHide] = useState(true);
  const { isLoadingChangePassword, message, passwordChanged } =
    useSelector(selectAuth);
  const formData = useRef({
    login: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  });
  const formRef = useRef<Form>(null);

  const passwordOptions = useMemo(
    () => ({
      mode: passwordHide ? 'password' : 'text',
      buttons: [
        {
          name: 'eye',
          location: 'after',
          options: {
            tabIndex: -1,
            stylingMode: 'text',
            icon: eyeSvg,
            onClick: () => setPasswordHide(prev => !prev),
          },
        },
      ],
    }),
    [passwordHide],
  );

  useEffect(
    () => () => {
      dispatch(clearAuthMessaggeError());
      dispatch(clearExpirePassword());
    },
    [dispatch],
  );

  const onCancel = useCallback(() => {
    navigate(mainFormRoutes.noAuth.login);
  }, [navigate]);

  useEffect(() => {
    if (passwordChanged) {
      dispatch(clearPasswordChanged());
      onCancel();
    }
  }, [dispatch, passwordChanged, onCancel]);

  const passwordComparison = () => formData.current.newPassword;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationData = formRef?.current?.instance?.validate();
    if (validationData?.isValid) {
      dispatch(
        changePassword({
          login: formData.current.login,
          password: formData.current.password,
          newPassword: formData.current.newPassword,
        }),
      );
    }
  };

  return (
    <NoAuthTemplate headerText="Какой-то текст">
      <form onSubmit={onSubmit} className="login">
        {message.success && <FormMessage data={message.success} modifier />}
        {message.error && <FormMessage data={message.error} modifier={false} />}
        <Form ref={formRef} labelMode="floating" formData={formData.current}>
          <GroupItem colCount={2}>
            <SimpleItem dataField="login" isRequired colSpan={2}>
              <Label text="Логин" />
              <RequiredRule message="Поле обязательно для заполнения" />
            </SimpleItem>
            <SimpleItem
              dataField="password"
              isRequired
              colSpan={2}
              editorOptions={passwordOptions}
            >
              <Label text="Старый пароль" />
              <RequiredRule message="Поле обязательно для заполнения" />
            </SimpleItem>
            <SimpleItem
              dataField="newPassword"
              isRequired
              colSpan={2}
              editorOptions={passwordOptions}
            >
              <Label text="Новый пароль" />
              <RequiredRule message="Поле обязательно для заполнения" />
            </SimpleItem>
            <SimpleItem
              dataField="confirmPassword"
              isRequired
              colSpan={2}
              editorOptions={passwordOptions}
            >
              <Label text="Повторите новый пароль" />
              <RequiredRule message="Поле обязательно для заполнения" />
              <CompareRule
                message="Новый пароль и подтверждение пароля не совпадают"
                comparisonTarget={passwordComparison}
              />
            </SimpleItem>
          </GroupItem>
          <GroupItem colCount={3} cssClass="login__btns">
            <ButtonItem colSpan={2}>
              <ButtonOptions
                text="Отмена"
                stylingMode="text"
                elementAttr={{ class: 'dx-button-link' }}
                onClick={onCancel}
              />
            </ButtonItem>
            <ButtonItem>
              <ButtonOptions
                type="default"
                useSubmitBehavior
                render={() => (
                  <ButtonFormLoader
                    isLoading={isLoadingChangePassword}
                    text="Сохранить"
                  />
                )}
              />
            </ButtonItem>
          </GroupItem>
        </Form>
      </form>
    </NoAuthTemplate>
  );
};

export default memo(PasswordChange);
