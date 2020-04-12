import { IonContent, 
    IonHeader, 
    IonPage, 
    IonTitle, 
    IonToolbar, 
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonLoading
   } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import firebase from '../Firebase';
import './List.css';

const List: React.FC = (props) => {

  const [data, setData] = useState<any[]>([])
  const [showLoading, setShowLoading] = useState(true);

  // load Firebase collection
  const dbref = firebase.database().ref('coronavirus/') 

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
     // Extract Firebase collection to array
    dbref.on('value', resp => {
      let cases = snapshotToArray(resp)

      let bycountry: any[] = []
      cases.reduce((res, value) => {
        if (!res[value.country]) {
          res[value.country] = { country: value.country, cases: 0, deaths: 0, recovered: 0 };
          bycountry.push(res[value.country])
        }
        res[value.country].cases += value.cases;
        res[value.country].deaths += value.deaths;
        res[value.country].recovered += value.recovered;
        return res;
      }, {});
      setData(bycountry)
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

  const showDetail = (params: any) => {
    let prop: any = props;
    prop.history.push({
      pathname: '/details/' + params
    })
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>List of Countries</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={'Loading...'}
        />
        <IonList>
          {data.map((item, idx) => (
            <IonItem key={idx} onClick={() => { showDetail(item.country) }}>
              <IonLabel>
                <h2>{item.country}</h2>
                <h3>Cases: {item.cases}</h3>
                <h3>Deaths: {item.deaths}</h3>
                <h3>Recovered: {item.recovered}</h3>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );

};

export default List;