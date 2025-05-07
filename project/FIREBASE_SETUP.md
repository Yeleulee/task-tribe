# Firebase Setup Guide for TaskTribe

This guide will help you set up Firebase for your TaskTribe application.

## Firebase Configuration with Environment Variables

For security reasons, Firebase credentials should be stored in environment variables, not in your source code. The Firebase configuration in `src/config/firebase.ts` uses environment variables:

```js
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
```

## Setting Up Environment Variables

1. Create a file named `.env.local` in the project root (this file should NOT be committed to git)
2. Add your Firebase configuration values:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Firebase Services Used

TaskTribe uses the following Firebase services:

1. **Authentication**: For user sign-up, sign-in, and profile management
2. **Firestore Database**: For storing user profiles, tasks, and other application data
3. **Analytics**: For tracking application usage (optional)

## Firebase Rules

For security, you should set up proper Firestore security rules. Here's a basic example:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Tasks
    match /tasks/{taskId} {
      allow read: if request.auth != null && 
                  (resource.data.userId == request.auth.uid || 
                   resource.data.sharedWith[request.auth.uid] == true);
      allow write: if request.auth != null && 
                   request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## Setting Up Your Own Firebase Project

If you want to set up your own Firebase project:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the steps to create a new project
3. Add a web app to your project
4. Copy the configuration object
5. Use those values in your `.env.local` file

## Enable Authentication

1. In the Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable Email/Password authentication
3. (Optional) Enable other authentication methods like Google, GitHub, etc.

## Create Firestore Database

1. In the Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose a starting mode (test mode or production mode)
4. Set up security rules as shown above

## Security Best Practices

- Never commit your `.env.local` file to Git (it should be in your `.gitignore` file)
- Restrict your Firebase API keys in the Firebase Console by setting up application restrictions
- Use proper Firebase security rules to protect your data
- Consider setting up Firebase App Check for additional security

## Deploying to Firebase Hosting (Optional)

To deploy your app to Firebase Hosting:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase: `firebase init`
4. Select Hosting and any other services
5. Make sure to set up environment variables in your hosting environment
6. Build your app: `npm run build`
7. Deploy: `firebase deploy`

## Testing Authentication

You can test the authentication by:

1. Creating a new user on the Sign Up page
2. Signing in with the created user on the Login page
3. Setting up a profile on the Profile Setup page
4. Verifying that you can access protected routes 