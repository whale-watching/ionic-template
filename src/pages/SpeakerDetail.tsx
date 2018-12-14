import React from 'react';
import { IonIcon, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonButton } from '@ionic/react'
import { Speaker } from '../store/speakers/types';
import './SpeakerDetail.css';

interface Props {
  nav: any;
  params: any;
  speakers: Speaker[];
}

export default ({ nav, params, speakers }: Props) => {
  const speaker = speakers.find(s => s.id === parseInt(params.id, 10));
  if (!speaker) {
    return;
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton href="#" onClick={() => nav.pop()} color="primary">
              <IonIcon slot="icon-only" name="arrow-back"></IonIcon>Back
            </IonButton>
          </IonButtons>
          <IonTitle>{speaker.name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent padding class="speaker-detail speaker-page-list">
        <div>
          <img src={speaker.profilePic} alt={speaker.name}/>
          <br/>
          <IonButton icon-only color="twitter">
            <IonIcon name="logo-twitter"></IonIcon>
          </IonButton>
          <IonButton icon-only color="github">
            <IonIcon name="logo-github"></IonIcon>
          </IonButton>
          <IonButton icon-only color="instagram">
            <IonIcon name="logo-instagram"></IonIcon>
          </IonButton>
        </div>

        <p>{speaker.about}</p>
      </IonContent>
    </>
  );
};
