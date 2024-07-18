import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBXzipUgxfslX-QEejyRAZ_SG79s4MLx2M",
  authDomain: "speaksphere-db501.firebaseapp.com",
  projectId: "speaksphere-db501",
  storageBucket: "speaksphere-db501.appspot.com",
  messagingSenderId: "309013003712",
  appId: "1:309013003712:web:6b5eaba8f8b10443e61c25",
  measurementId: "G-91EYQP1YLL"
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export  { storage };

