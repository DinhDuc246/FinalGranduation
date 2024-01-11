// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    // apiKey: 'AIzaSyCbKQ37mcXzG8VlPUYBVMqUvq1WU4t9FTQ',
    // authDomain: 'twtcinema.firebaseapp.com',
    // projectId: 'twtcinema',
    // storageBucket: 'twtcinema.appspot.com',
    // messagingSenderId: '630122826959',
    // appId: '1:630122826959:web:b776e34aa5cd00d2cf7bba',
    apiKey: 'AIzaSyBSt8OncrOtAf6cZBTCDF-dcj3xsECi7sg',
    authDomain: 'twtcinema-bc950.firebaseapp.com',
    projectId: 'twtcinema-bc950',
    storageBucket: 'twtcinema-bc950.appspot.com',
    messagingSenderId: '386178708537',
    appId: '1:386178708537:web:7e1f4bf1473085ac25c9e8',
};

// Initialize Firebase
export const firebaseConnect = initializeApp(firebaseConfig);
