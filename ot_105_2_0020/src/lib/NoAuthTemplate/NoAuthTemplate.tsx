import { memo } from 'react';
import Info from './Info';
import Copyright from './Copyright';
import mock from './mock.json';

import './NoAuthTemplate.scss';

export interface NoAuthTemplateProps {
  headerText?: string;
  children: JSX.Element;
}

const NoAuthTemplate = ({ headerText, children }: NoAuthTemplateProps) => (
  <div className="page">
    <h1 className="page__title">{headerText}</h1>
    <div className="page__content container">
      <div className="container__item">{children}</div>
      <div className="container__item">
        <Info description={mock.description} cardsData={mock.cardsData} />
      </div>
    </div>
    <div className="page__copyright">
      <Copyright />
    </div>
  </div>
);

export default memo(NoAuthTemplate);
