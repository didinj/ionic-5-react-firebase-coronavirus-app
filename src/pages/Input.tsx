import { IonContent, 
    IonHeader, 
    IonPage, 
    IonTitle, 
    IonToolbar, 
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonInput,
    IonButton,
    IonButtons,
    IonBackButton,
    IonLoading,
    IonList,
    IonAlert
    } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import firebase from '../Firebase';
import './Input.css';

const Input: React.FC = (props) => {

  const [showLoading, setShowLoading] = useState(false);
  const countries = ['United States', 'Spain', 'Italy', 'Germany', 'France', 'China', 'United Kingdom', 'Iran', 'Turkey', 'Belgium', 'Netherlands', 'Switzerland']
  const [date, setDate] = useState<string>('')
  const [country, setCountry] = useState<string>('')
  const [cases, setCases] = useState<string>('')
  const [deaths, setDeaths] = useState<string>('')
  const [recovered, setRecovered] = useState<string>('')
  const [showAlert, setShowAlert] = useState(false);
  const dbref = firebase.database().ref('coronavirus/') 

  const addCases = () => {
    let dt = new Date(date)
    let df = dt.getFullYear() + '-' + pad(dt.getMonth() + 1, 2, 0) + '-' + pad(dt.getDate(), 2, 0)
    dbref.orderByChild('date').equalTo(df).once('value', resp => {
      let cdata = snapshotToArray(resp)
      let checkCtr = cdata.filter(d => d.country === country)
      if (checkCtr.length > 0) {
        setShowAlert(true)
        return
      } else {
        let casesdata = { date: df, country: country, cases: parseInt(cases), deaths: parseInt(deaths), recovered: parseInt(recovered) }
        dbref.push(casesdata, (error) =>{
          if (error) {
            console.log("Data could not be saved." + error);
          } else {
            setDate('')
            setCountry('')
            setCases('')
            setDeaths('')
            setRecovered('')
            let prop: any = props;
            prop.history.push({
              pathname: '/'
            })
          }
        })

      }
    })
  }

  const pad = (n: any, width: number, z: any) => {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  const snapshotToArray = (snapshot: any) => {
    const returnArr: any[] = []
  
    snapshot.forEach((childSnapshot: any) => {
      const item = childSnapshot.val()
      item.key = childSnapshot.key
      returnArr.push(item)
    });
  
    return returnArr;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Input Cases</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={'Loading...'}
        />
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Invalid'}
          message={'Country with this date is already exists!'}
          buttons={['OK']}
        />
        <IonList>
          <IonItem>
            <IonLabel>Date</IonLabel>
            <IonDatetime displayFormat="YYYY-MM-DD" value={date} onIonChange={e => setDate(e.detail.value!)}></IonDatetime>
          </IonItem>
          <IonItem>
            <IonLabel>Country</IonLabel>
            <IonSelect value={country} onIonChange={e => setCountry(e.detail.value)}>
              {countries.map((ctr, idx) => (
                <IonSelectOption key={idx} value={ctr}>{ctr}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>Cases</IonLabel>
            <IonInput value={cases} onIonChange={e => setCases(e.detail.value!)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>Deaths</IonLabel>
            <IonInput value={deaths} onIonChange={e => setDeaths(e.detail.value!)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>Recovered</IonLabel>
            <IonInput value={recovered} onIonChange={e => setRecovered(e.detail.value!)}></IonInput>
          </IonItem>
          <IonItem>
            <IonButton expand="block" fill="solid" color="secondary" onClick={() => { addCases() }}>Save</IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
}

export default Input;