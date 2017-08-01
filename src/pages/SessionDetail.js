import React from 'react';
import { dateFormat } from '../utils/dateformat';
import SessionDetail from '../containers/SessionDetail';

function formatTime(dateString, formatString) {
  return dateFormat(new Date(dateString), formatString);
}

export default ({ match, location, history }) => {
  return (
    <SessionDetail>
      {({ sessions, speakers }) => {
        const session = sessions.find(s => s.id === parseInt(match.params.sessionId, 10));
        const sessionSpeakers = speakers.filter(s => session.speakerIds.contains(s.id));
        return (
          <ion-page>
            <ion-header>
              <ion-navbar>
                <ion-buttons slot="start">
                  <ion-button href="#" onClick={() => history.goBack()} color="primary">
                    <ion-icon slot="icon-only" name="arrow-back"></ion-icon>Back
                  </ion-button>
                </ion-buttons>
                <ion-title>{session.name}</ion-title>
              </ion-navbar>
            </ion-header>
            <ion-content padding>
              <div>
                <h1>{session.name}</h1>
                { sessionSpeakers.map(speaker => (
                  <h4 key={speaker.name}>
                    {speaker.name}
                  </h4>
                ))}
                <p>
                  {formatTime(session.dateTimeStart, "h:MM tt")} &mdash;&nbsp;
                  {formatTime(session.dateTimeEnd, "h:MM tt")}
                </p>
                <p>{session.location}</p>
                <p>{session.description}</p>
              </div>
            </ion-content>
          </ion-page>
        );
      }}
    </SessionDetail>
  );
}
