import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"danotes-4e5ed","appId":"1:821189857849:web:299efd64a2be547076b3e8","storageBucket":"danotes-4e5ed.appspot.com","apiKey":"AIzaSyDOhUUK-JB4sGAgxlxWUnMx-X4AJjyehWk","authDomain":"danotes-4e5ed.firebaseapp.com","messagingSenderId":"821189857849"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({"projectId":"danotes-4e5ed","appId":"1:821189857849:web:299efd64a2be547076b3e8","storageBucket":"danotes-4e5ed.appspot.com","apiKey":"AIzaSyDOhUUK-JB4sGAgxlxWUnMx-X4AJjyehWk","authDomain":"danotes-4e5ed.firebaseapp.com","messagingSenderId":"821189857849"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
