import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, NavigateOptions, To } from 'react-router-dom';

import { List } from '@atollis-ui/list';
import { SearchField } from '@atollis-ui/search-field';
import { ScrollArea } from '@atollis-ui/scroll-area';

import {
  Card,
  CardHeaderDefault,
  CardHeader,
  PresetsSelectBox,
} from '@atollis/ot_105_5_0070';
import { Spin } from '@atollis-ui/spin';
import { InfoSvg, BackSvg } from '@atollis/ot_105_5_0080';
import adminRoutes from '@atollis/ot_105_5_0120';
import {
  clearUserPresets,
  loadUserPresets,
  setSelectedUserPreset,
  userPresetsSelector,
} from '../../../reducers/presets/userPresetsReducer';
import {
  changeUsersStatus,
  loadUsers,
  User,
  usersSelector,
  clearUsers,
} from '../../../reducers/users/usersReducer';
import {
  clearUserGroups,
  userGroupsIsChangedSelector,
} from '../../../reducers/userGroups/userGroups';
import { selectUserPoliciesIsChanged } from '../../../reducers/userPolicies/userPolicies';
import {
  clearUserFunctions,
  userFunctionsIsChangedSelector,
} from '../../../reducers/userFunctions/userFunctions';
import {
  clearUserRoles,
  userRolesIsChangedSelector,
} from '../../../reducers/userRoles/userRoles';
import {
  clearUserNotificationState,
  fetchUserNotification,
  fetchUserNotificationReglaments,
  userNotificationsIsChangedSelector,
} from '../../../reducers/userNotification/userNotificationReducer';
import {
  checkValidate,
  clearUserProfileState,
  getOrganizations,
  selectUserIsChanged,
} from '../../../reducers/userProfile/userProfileReducer';
import { clearAvailableGroups } from '../../../reducers/userGroups/availableGroups';
import { clearAvailableFunctions } from '../../../reducers/userFunctions/availableFunctions';
import { clearAvailablePolicies } from '../../../reducers/userPolicies/availablePolicies';
import { BtnsId, btnsInfo } from '../../../components/buttons';
import UserMonitoringPopup from '../../../UsersMonitoring/UserMonitoringPopup';
import CancelModal from '../UserDetail/CancelModal';
import UsersListItem from './UsersListItem';

import './UsersList.scss';

const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const usersData = useSelector(usersSelector);

  const [selectedUser, setSelectedItem] = useState<User>();
  const [blockedPopupVisible, setBlockedPopupVisible] = useState(false);
  const [editedPopupVisible, setEditedPopupVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<User[]>([]);

  const popupPromise = useRef<{ resolve: () => void; reject: () => void }>();
  const isMounted = useRef(false);

  const presets = useSelector(userPresetsSelector);
  const groupsIsChanged = useSelector(userGroupsIsChangedSelector);
  const rolesIsChanged = useSelector(userRolesIsChangedSelector);
  const functionsIsChanged = useSelector(userFunctionsIsChangedSelector);
  const userPoliciesIsChanged = useSelector(selectUserPoliciesIsChanged);
  const userNotificationsIsChanged = useSelector(
    userNotificationsIsChangedSelector,
  );
  const userIsChanged = useSelector(selectUserIsChanged);

  const dataChanged =
    userIsChanged ||
    groupsIsChanged ||
    rolesIsChanged ||
    functionsIsChanged ||
    userPoliciesIsChanged ||
    userNotificationsIsChanged;

  const [navigateParams, setNavigateParams] = useState<
    [to: To, options?: NavigateOptions] | null
  >(null);

  useEffect(() => {
    dispatch(loadUserPresets());
    return () => {
      if (
        !window.location.pathname.includes(
          `${adminRoutes.base}/${adminRoutes.users}`,
        )
      ) {
        dispatch(clearUsers());
        dispatch(clearUserPresets());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSelectedItem(usersData.data.find((user: User) => user.id === params.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersData.data]);

  useEffect(() => {
    if (
      usersData.data.length === 0 &&
      presets.selectedPreset?.id &&
      isMounted.current
    ) {
      dispatch(loadUsers(presets.selectedPreset));
    }

    isMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presets.selectedPreset?.id]);

  const onPresetSelect = (e: any) => {
    dispatch(setSelectedUserPreset(e.selectedItem));

    if (isMounted.current && e.selectedItem?.id) {
      dispatch(loadUsers(e.selectedItem));
    }
  };

  const onListItemClick = useCallback(
    args => {
      setSelectedItem(args);
      if (args?.id)
        navigate(`${adminRoutes.base}/${adminRoutes.users}/${args?.id}`);
    },
    [navigate],
  );

  const onMenuItemClick = useCallback((id: string) => {
    switch (id) {
      case 'info':
        break;
    }
  }, []);

  const changeUsersStatusHandler = useCallback(
    (status: boolean) => {
      const userLogin =
        selectedUser?.status !== 'UNKNOWN USER' ? selectedUser?.login : null;

      if (userLogin) {
        dispatch(changeUsersStatus({ userLogins: [userLogin], status }));
      }
    },
    [dispatch, selectedUser],
  );

  const openChangeUserStatusModal = useCallback(
    async (status: boolean) => {
      try {
        await new Promise<void>((resolve, reject) => {
          popupPromise.current = {
            resolve,
            reject,
          };

          setBlockedPopupVisible(true);
        });

        changeUsersStatusHandler(status);
        setBlockedPopupVisible(false);
      } catch (error) {
        setBlockedPopupVisible(false);
      }
    },
    [changeUsersStatusHandler],
  );

  const onButtonClick = useCallback(
    (id: string) => {
      switch (id) {
        case BtnsId.unblockUser:
          openChangeUserStatusModal(true);
          break;
        case BtnsId.blockUser:
          openChangeUserStatusModal(false);
          break;
        case BtnsId.addUser:
          if (params.id) {
            // from edit
            if (dataChanged) {
              setEditedPopupVisible(true);
              setNavigateParams([
                `${adminRoutes.base}/${adminRoutes.users}/${adminRoutes.create}`,
              ]);
            } else {
              navigate(
                `${adminRoutes.base}/${adminRoutes.users}/${adminRoutes.create}`,
              );
            }
          } else if (dataChanged) {
            // from create
            setEditedPopupVisible(true);
            setNavigateParams(null);
          }
      }
    },
    [params.id, openChangeUserStatusModal, navigate, dataChanged],
  );

  const cardBtns = [
    {
      ...btnsInfo[BtnsId.blockUser],
      id: BtnsId.blockUser,
      disabled: selectedUser ? selectedUser?.status === 'LOCKED' : true,
    },
    {
      ...btnsInfo[BtnsId.unblockUser],
      id: BtnsId.unblockUser,
      disabled: selectedUser ? selectedUser?.status === 'UNLOCKED' : true,
    },
    {
      ...btnsInfo[BtnsId.addUser],
      id: BtnsId.addUser,
      disabled: !params.id,
    },
  ];

  const resetCardsData = useCallback(() => {
    // clear
    dispatch(clearUserGroups());
    dispatch(clearUserRoles());
    dispatch(clearUserFunctions());
    dispatch(clearUserNotificationState());
    dispatch(clearUserProfileState());

    dispatch(clearAvailableFunctions());
    dispatch(clearAvailableGroups());
    dispatch(clearAvailablePolicies());
    // load
    dispatch(fetchUserNotification(params.id));
    dispatch(fetchUserNotificationReglaments());
    dispatch(getOrganizations());
  }, [dispatch, params.id]);

  const onConfirm = useCallback(() => {
    dispatch(checkValidate());
  }, [dispatch]);

  // modal
  const onModalCancel = useCallback(() => {
    setEditedPopupVisible(false);
  }, []);

  const onModalConfirm = useCallback(() => {
    if (params.id) {
      // from edit
      if (navigateParams) navigate(...navigateParams);
    } else {
      // from create
      resetCardsData();
    }

    setEditedPopupVisible(false);
  }, [navigate, params.id, navigateParams, resetCardsData]);

  const onModalSave = () => {
    onConfirm();
    setEditedPopupVisible(false);
  };

  const handleSearch = (value: string) => {
    if (value.trim() === '') {
      setFilteredData(usersData?.data);
    } else {
      const filtered = usersData?.data?.filter(item => {
        const itemName = (item?.initials as string)?.toLowerCase();
        return itemName?.includes?.(value.toLowerCase());
      });
      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    setFilteredData(usersData?.data);
  }, [usersData?.data]);

  return (
    <Card isContainer className="detail-left-list-container">
      <CardHeader>
        <CardHeaderDefault
          title="Список"
          buttons={cardBtns}
          icon={
            <div
              role="none"
              onClick={() => {
                navigate(`${adminRoutes.base}/${adminRoutes.users}`);
              }}
            >
              <BackSvg className="icon-accent" />
            </div>
          }
          menuList={cardMenuList}
          onButtonClick={onButtonClick}
          onMenuItemClick={onMenuItemClick}
        />
      </CardHeader>

      <div className="detail-left-list-container__body">
        <PresetsSelectBox
          value={presets.selectedPreset?.id}
          items={presets.data}
          onSelectionChanged={onPresetSelect}
          displayExpr="name"
        />
        {!usersData.isLoading ? (
          <>
            <SearchField
              onSearch={handleSearch}
              variant="outlined"
              placeholder="Поиск ."
              allowClear
            />
            <ScrollArea height="100%">
              <List
                itemLayout="horizontal"
                className="users-list"
                data={filteredData || []}
                renderItem={renderListItem(params?.id)}
                onItemClick={onListItemClick}
              />
            </ScrollArea>

            {selectedUser && (
              <UserMonitoringPopup
                popupVisible={blockedPopupVisible}
                selectedUsers={[selectedUser]}
                extraContent={extraContent}
                popupPromise={popupPromise}
              />
            )}
            <CancelModal
              visible={editedPopupVisible}
              onCancel={onModalCancel}
              onConfirm={onModalConfirm}
              onSave={onModalSave}
              content={modalContent}
            />
          </>
        ) : (
          <div className="spin">
            <Spin />
          </div>
        )}
      </div>
    </Card>
  );
};

export default memo(UsersList);

const renderListItem = (id?: string | number) => (userData: User) =>
  (
    <UsersListItem
      name={userData?.initials}
      post={userData?.post}
      avatar={userData?.image}
      blocked={userData?.status === 'LOCKED'}
      activeItem={id === userData?.id}
    />
  );
const cardMenuList = [{ id: 'info', name: 'Справка', icon: <InfoSvg /> }];

const extraContent =
  'После данной операции статус пользователя изменится на «Заблокированный», все его действия в системе сохранятся, но прав для продолжения работы не будет. Пользователю всегда можно будет вернуть статус «Активный».';

const modalContent =
  'Все не сохраненные данные будут потеряны. Вы уверены, что хотите покинуть данную страницу?';
