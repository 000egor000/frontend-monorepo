import { memo } from 'react';
import { getAvatarPlaceholder } from '@atollis/ot_105_5_0070';
import './UserListItem.scss';

interface UsersListItemProps {
  name: string;
  post?: string;
  avatar?: string;
  blocked?: boolean;
  activeItem?: boolean;
}

const UsersListItem = ({
  name,
  post,
  avatar,
  blocked = false,
  activeItem,
}: UsersListItemProps) => {
  const avatarContent = getAvatarPlaceholder(name);
  const className = getClassName(blocked, activeItem);
  const rootImg = avatar ? avatar !== 'data:image/png;base64,' : false;
  const initialsArray = name?.split(' ');

  return (
    <div className={className}>
      <div
        className="avatar-container"
        data-content={avatar && rootImg ? '' : avatarContent}
      >
        {avatar && rootImg && <img src={avatar} alt="" />}
      </div>
      <div className="user-info-container">
        <div className="user-name">
          <div>{initialsArray[0]}</div>
          <div>{`${initialsArray[1]} ${initialsArray[2]}`}</div>
        </div>
        <div className="position">
          <span>{post}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(UsersListItem);

const getClassName = (blocked: boolean, activeItem?: boolean) => {
  const classes = ['users-list-item'];
  if (blocked) classes.push('is-blocked');
  if (activeItem) classes.push('active');

  return classes.join(' ');
};
