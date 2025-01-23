import { memo } from 'react';

import './Copyright.scss';

const text = `© ГК «АТОЛЛис» 2000-${new Date().getFullYear()}`;

const Copyright = () => (
  <div className="copyright">
    <span>{text}</span>
  </div>
);

export default memo(Copyright);
