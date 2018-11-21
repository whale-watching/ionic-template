import React from 'react';
import { IonTabBar, IonIcon } from '../ionic';

const TabNav = ({ childViews, urlMatchHandler, childViewProps, onClickHandler }) => [
  <div key={1}>
    { childViews.map(childView => {
      const ChildComponent = childView.getView();
      const path = childView.basePath;
      const match = urlMatchHandler(childView.basePath);
      return (
        <div key={path} style={(match) ? {} : { display: 'none' }}>
          <ChildComponent {...childViewProps} basePath={childView.basePath} visible={!!(match)}/>
        </div>
      );
    })}
  </div>,
  <div key={2} className="tabs-ios">
    <IonTabBar>
      { childViews.map((childView, index) => {
        const path = childView.basePath;
        return (
          <a
            key={childView.basePath}
            className="tab-button has-title has-icon"
            href={childView.basePath}
            aria-selected={urlMatchHandler(childView.basePath) ? 'true' : 'false'}
            onClick={onClickHandler(path)}
          >
            <IonIcon class="tab-button-icon" name={childView.icon}></IonIcon>
            <span className="tab-button-text">{childView.title}</span>
            <div className="button-effect"></div>
          </a>
        );
      }) }
    </IonTabBar>
  </div>
];

export default TabNav;
