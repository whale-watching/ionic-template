import React from 'react';
import SchedulePage from './SchedulePage';
import SessionDetail from './SessionDetail';
import SpeakerList from './SpeakerList';
import SpeakerDetail from './SpeakerDetail';
import MapView from './Map';
import About from './About';
import { IonTabs, IonTabButton, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonPage } from '@ionic/react';
import { Route, Redirect } from 'react-router';

const AppStack: React.SFC = () => (
  <IonPage>
    <Route exact path="/" render={() => <Redirect to="/schedule"/>}/>
    {
    /**
     * Only render exact matches.  Only destroy on back button click
     * On history.push keep previous route stored for back button
     *
     * TabBar does a push on iontabbutton click.
     * TabBar updates the tab links based on the current route path.
     */
    }

    <IonTabs>
      <IonRouterOutlet>
        <Route path="/:tab(schedule)" component={SchedulePage} exact={true} />
        <Route path="/:tab(speakers)" component={SpeakerList} exact={true} />
        <Route path="/:tab(speakers)/speaker/:id" component={SpeakerDetail} />
        <Route path="/:tab(schedule|speakers)/sessions/:id" component={SessionDetail} />
        <Route path="/:tab(map)" component={MapView} />
        <Route path="/:tab(about)" component={About} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="schedule" href="/schedule">
          <IonIcon name="calendar" />
          <IonLabel>Schedule</IonLabel>
        </IonTabButton>
        <IonTabButton tab="speakers" href="/speakers">
          <IonIcon name="contacts" />
          <IonLabel>Speakers</IonLabel>
        </IonTabButton>
        <IonTabButton tab="map" href="/map">
          <IonIcon name="map" />
          <IonLabel>Map</IonLabel>
        </IonTabButton>
        <IonTabButton tab="about" href="/about">
          <IonIcon name="information-circle" />
          <IonLabel>About</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonPage>
);

export default AppStack;
