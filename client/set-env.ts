// Hämta miljövariabler från .env-filen
const firebaseApiKey = process.env['FIREBASE_API_KEY'];
const firebaseAuthDomain = process.env['FIREBASE_AUTH_DOMAIN'];
const firebaseProjectId = process.env['FIREBASE_PROJECT_ID'];
const firebaseStorageBucket = process.env['FIREBASE_STORAGE_BUCKET'];
const firebaseMessagingSenderId = process.env['FIREBASE_MESSAGING_SENDER_ID'];
const firebaseAppId = process.env['FIREBASE_APP_ID'];
const firebaseMeasurementId = process.env['FIREBASE_MEASUREMENT_ID'];
const googleApiKey = process.env['GOOGLE_API_KEY'];

// Kontrollera att alla miljövariabler är tillgängliga
if (
  !firebaseApiKey ||
  !firebaseAuthDomain ||
  !firebaseProjectId ||
  !firebaseStorageBucket ||
  !firebaseMessagingSenderId ||
  !firebaseAppId ||
  !firebaseMeasurementId ||
  !googleApiKey
) {
  throw new Error(
    'Missing Firebase or Google API key(s) in environment variables.'
  );
}

// Sätt dem i environment.ts
const environment = {
  production: false,
  firebaseConfig: {
    apiKey: firebaseApiKey,
    authDomain: firebaseAuthDomain,
    projectId: firebaseProjectId,
    storageBucket: firebaseStorageBucket,
    messagingSenderId: firebaseMessagingSenderId,
    appId: firebaseAppId,
    measurementId: firebaseMeasurementId,
  },
  googleBooksApi: {
    baseUrl: 'https://www.googleapis.com/books/v1/volumes?q=',
    maxResults: 40,
  },
};

// Exportera environment för användning i Angular
export { environment };
