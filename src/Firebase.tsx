import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyBfb4RbPN60L9nmIEaSjINXwQKWtO3KrTg",
  databaseURL: "https://coronavirus-3a1c5.firebaseio.com"
};
firebase.initializeApp(config);

export default firebase;