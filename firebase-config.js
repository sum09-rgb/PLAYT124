
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";

import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUdwhkBRVrrQkzRevu1Oj_a9nrpi7YgOc",
  authDomain: "playt124.firebaseapp.com",
  projectId: "playt124",
  storageBucket: "playt124.firebasestorage.app",
  messagingSenderId: "424300535615",
  appId: "1:424300535615:web:3b74bef6f147104c0b7d8a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export {
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
};
