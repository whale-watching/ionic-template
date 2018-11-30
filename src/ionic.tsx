import React from 'react';
import ReactDOM from 'react-dom';
import { Components } from '@ionic/core';
import { Components as IoniconsComponents } from 'ionicons';

const dashToPascalCase = (str: string) => {
  str.toLowerCase().split('-').map(segment => segment.charAt(0).toUpperCase() + segment.slice(1)).join('');
}

function createReactComponent<T>(tagName: string) {
  const displayName = dashToPascalCase(tagName);

  return class ReactComponent extends React.Component<T> {
    static get displayName() {
      return displayName;
    }
    componentDidMount() {
      this.componentWillReceiveProps(this.props);
    }
    componentWillReceiveProps(props: any) {
      const node = ReactDOM.findDOMNode(this);

      if (node === null) {
        return;
      }

      Object.keys(props).forEach(name => {
        if (name === 'children' || name === 'style') {
          return;
        }

        if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {

          // syncEvent(node, name.substring(2), props[name]);
        } else {
          (node as any)[name] = props[name];
        }
      });
    }
    render() {
      const { children, ...cProps } = this.props as any;
      return React.createElement(tagName, cProps, children);
    }
  }
}

export const IonIcon = createReactComponent<IoniconsComponents.IonIconAttributes>('ion-icon');
export const IonApp = createReactComponent<Components.IonAppAttributes>('ion-app');
export const IonPage = createReactComponent<{}>('ion-page');
export const IonMenu = createReactComponent<Components.IonMenuAttributes>('ion-menu');
export const IonHeader = createReactComponent<Components.IonHeaderAttributes>('IonHeader');
export const IonTitle = createReactComponent<Components.IonTitleAttributes>('IonHeader');
export const IonNav = createReactComponent<Components.IonNavAttributes>('ion-nav');
export const IonToolbar = createReactComponent<Components.IonToolbarAttributes>('ion-toolbar');
export const IonButtons = createReactComponent<Components.IonButtonsAttributes>('ion-buttons');
export const IonSelect = createReactComponent<Components.IonSelectAttributes>('ion-select');
export const IonSelectOption = createReactComponent<Components.IonSelectOptionAttributes>('ion-select-option');
export const IonButton = createReactComponent<Components.IonButtonAttributes>('ion-button');
export const IonContent = createReactComponent<Components.IonContentAttributes>('ion-content');
export const IonList = createReactComponent<Components.IonListAttributes>('ion-list');
export const IonListHeader = createReactComponent<Components.IonListHeaderAttributes>('ion-list-header');
export const IonItem = createReactComponent<Components.IonItemAttributes>('ion-item');
export const IonLabel = createReactComponent<Components.IonLabelAttributes>('ion-label');
export const IonDatetime = createReactComponent<Components.IonDatetimeAttributes>('ion-datetime');
export const IonMenuButton = createReactComponent<Components.IonMenuButtonAttributes>('ion-menu-button');
export const IonItemGroup = createReactComponent<Components.IonItemGroupAttributes>('ion-item-group');
export const IonItemDivider = createReactComponent<Components.IonItemDividerAttributes>('ion-item-divider');
export const IonItemSliding = createReactComponent<Components.IonItemSlidingAttributes>('ion-item-sliding');
export const IonItemOption = createReactComponent<Components.IonItemOptionAttributes>('ion-item-option');
export const IonItemOptions = createReactComponent<Components.IonItemOptionsAttributes>('ion-item-options');
export const IonInput = createReactComponent<Components.IonInputAttributes>('ion-input');
export const IonGrid = createReactComponent<Components.IonGridAttributes>('ion-grid');
export const IonRow = createReactComponent<Components.IonRowAttributes>('ion-row');
export const IonCol = createReactComponent<Components.IonColAttributes>('ion-col');
export const IonSegment= createReactComponent<Components.IonSegmentAttributes>('ion-segment');
export const IonSegmentButton= createReactComponent<Components.IonSegmentButtonAttributes>('ion-segment-button');
export const IonSearchbar= createReactComponent<Components.IonSearchbarAttributes>('ion-searchbar');
export const IonRefresher= createReactComponent<Components.IonRefresherAttributes>('ion-refresher');
export const IonRefresherContent= createReactComponent<Components.IonRefresherContentAttributes>('ion-refresher-content');
export const IonFab= createReactComponent<Components.IonFabAttributes>('ion-fab');
export const IonFabList = createReactComponent<Components.IonFabListAttributes>('ion-fab-list');
export const IonFabButton= createReactComponent<Components.IonFabButtonAttributes>('ion-fab-button');
export const IonAvatar = createReactComponent<Components.IonAvatarAttributes>('ion-avatar');
export const IonCard = createReactComponent<Components.IonCardAttributes>('ion-card');
export const IonCardHeader = createReactComponent<Components.IonCardHeaderAttributes>('ion-card-header');
export const IonCardContent = createReactComponent<Components.IonCardContentAttributes>('ion-card-content');
export const IonTextarea = createReactComponent<Components.IonTextareaAttributes>('ion-textarea');
export const IonTabs = createReactComponent<Components.IonTabsAttributes>('ion-tabs');
export const IonTab = createReactComponent<Components.IonTabAttributes>('ion-tab');
export const IonTabBar = createReactComponent<Components.IonTabBarAttributes>('ion-tab-bar');
export const IonTabButton = createReactComponent<Components.IonTabButtonAttributes>('ion-tab-button');
export const IonSlides = createReactComponent<Components.IonSlidesAttributes>('ion-slides');
export const IonSlide = createReactComponent<Components.IonSlideAttributes>('ion-slide');
