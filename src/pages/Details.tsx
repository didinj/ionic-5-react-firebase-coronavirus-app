import { IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonBackButton,
  IonLoading
  } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import firebase from '../Firebase';

const Details: React.FC = (props) => {

  let prop: any = props;
  let match: any = prop.match;

  const dbref = firebase.database().ref('coronavirus/') 
  const [caseChart, setCaseChart] = useState({})
  const [deathChart, setDeathChart] = useState({})
  const [recovChart, setRecovChart] = useState({})
  const [showLoading, setShowLoading] = useState(true);
  const [cases, setCases] = useState(0)
  const [deaths, setDeaths] = useState(0)
  const [recov, setRecov] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    console.log(match.params.name) 
    // Extract Firebase collection to array
    dbref.orderByChild('country').equalTo(match.params.name).on('value', resp => {
      let respdata = snapshotToArray(resp)
      let caseDate: any[] = []
      let caseAmount: any[] = []
      let deathAmount: any[] = []
      let recovAmount: any[] = []
      let caseCount = 0
      let deathCount = 0
      let recovCount = 0
      respdata.forEach((dt) => {
        caseDate.push(dt.date)
        caseAmount.push(dt.cases)
        deathAmount.push(dt.deaths)
        recovAmount.push(dt.recovered)
        caseCount = caseCount + dt.cases
        deathCount = deathCount + dt.deaths
        recovCount = recovCount + dt.recovered
      })
      setCases(caseCount)
      setDeaths(deathCount)
      setRecov(recovCount)
      setCaseChart({
        labels: caseDate,
        datasets: [
          {
            label: 'Cases Chart',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: caseAmount
          }
        ]
      })
      setDeathChart({
        labels: caseDate,
        datasets: [
          {
            label: 'Cases Chart',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: deathAmount
          }
        ]
      })
      setRecovChart({
        labels: caseDate,
        datasets: [
          {
            label: 'Cases Chart',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: recovAmount
          }
        ]
      })
      setShowLoading(false);
    });
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
            <IonBackButton defaultHref="/list" />
          </IonButtons>
          <IonTitle>Country Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={'Loading...'}
        />
        <IonCard color="light">
          <IonCardHeader>
            <IonCardTitle>{match.params.name}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="12" size-sm>
                  Confirmed Cases: <strong>{cases}</strong>
                </IonCol>
                <IonCol size="12" size-sm>
                  <Bar
                    data={caseChart}
                    width={100}
                    height={100}
                    options={{
                      maintainAspectRatio: true
                    }}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12" size-sm>
                  Death: <strong>{deaths}</strong>
                </IonCol>
                <IonCol size="12" size-sm>
                  <Bar
                    data={deathChart}
                    width={100}
                    height={100}
                    options={{
                      maintainAspectRatio: true
                    }}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12" size-sm>
                  Recovered: <strong>{recov}</strong>
                </IonCol>
                <IonCol size="12" size-sm>
                  <Bar
                    data={recovChart}
                    width={100}
                    height={100}
                    options={{
                      maintainAspectRatio: true
                    }}
                  />
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );

}

export default Details;