const firebaseConfig = {
    apiKey: "AIzaSyAXH7T_obCBUuG4zXhY0qpwwBfb3JgMOrI",
    authDomain: "hayshop-b54ab.firebaseapp.com",
    databaseURL: "https://hayshop-b54ab-default-rtdb.firebaseio.com/",
    projectId: "hayshop-b54ab",
    storageBucket: "hayshop-b54ab.appspot.com",
    messagingSenderId: "342283633284",
    appId: "1:342283633284:web:7e2def7ad150124636f8d1"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
