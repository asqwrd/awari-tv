import firebase from 'firebase'
const config = {
  apiKey: "AIzaSyAuccXGpEWjAMVkDYQsi7ewFAVmDXIGjRQ",
  authDomain: "awaritv-2b373.firebaseapp.com",
  databaseURL: "https://awaritv-2b373.firebaseio.com",
  projectId: "awaritv-2b373",
  storageBucket: "awaritv-2b373.appspot.com",
  messagingSenderId: "533309421994"
};
firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;
