#!/usr/bin/env node

/**
 * Quick Firebase Setup Script for ReWear
 * 
 * This script helps you quickly set up Firebase configuration.
 * Run with: node setup-firebase.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔥 Firebase Setup for ReWear\n');
console.log('Please get your Firebase config from:');
console.log('https://console.firebase.google.com > Your Project > Project Settings > General > Your apps\n');

const questions = [
  'API Key: ',
  'Auth Domain (project-id.firebaseapp.com): ',
  'Project ID: ',
  'Storage Bucket (project-id.appspot.com): ',
  'Messaging Sender ID: ',
  'App ID: '
];

const answers = [];

function askQuestion(index) {
  if (index >= questions.length) {
    updateFirebaseConfig();
    return;
  }
  
  rl.question(questions[index], (answer) => {
    answers.push(answer.trim());
    askQuestion(index + 1);
  });
}

function updateFirebaseConfig() {
  const [apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId] = answers;
  
  const configContent = `import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "${apiKey}",
  authDomain: "${authDomain}",
  projectId: "${projectId}",
  storageBucket: "${storageBucket}",
  messagingSenderId: "${messagingSenderId}",
  appId: "${appId}"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
`;

  const configPath = path.join(__dirname, 'src', 'config', 'firebase.ts');
  
  try {
    fs.writeFileSync(configPath, configContent);
    console.log('\n✅ Firebase configuration updated successfully!');
    console.log('\nNext steps:');
    console.log('1. Make sure Authentication (Email/Password) is enabled in Firebase Console');
    console.log('2. Make sure Firestore Database is created in test mode');
    console.log('3. Make sure Storage is enabled in test mode');
    console.log('4. Deploy the security rules from firestore.rules and storage.rules');
    console.log('\nYour app should now work with Firebase! 🎉');
  } catch (error) {
    console.error('❌ Error updating configuration:', error.message);
  }
  
  rl.close();
}

console.log('Enter your Firebase configuration values:\n');
askQuestion(0);
