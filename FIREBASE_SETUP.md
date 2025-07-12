# Firebase Setup Guide for ReWear

## Option 1: Real Firebase Project (Recommended for Production)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Name it "ReWear" or similar
4. Enable Google Analytics (optional)
5. Wait for project creation

### Step 2: Enable Services
1. **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
   - Click Save

2. **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in "test mode" for now
   - Choose a location close to your users

3. **Storage**:
   - Go to Storage
   - Click "Get started"
   - Start in "test mode"
   - Choose same location as Firestore

### Step 3: Get Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web app" icon (</>)
4. Register app with name "ReWear Web"
5. Copy the firebaseConfig object

### Step 4: Update Configuration
Replace the config in `src/config/firebase.ts`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### Step 5: Deploy Security Rules
1. **Firestore Rules**: Copy content from `firestore.rules` to Firestore Rules tab
2. **Storage Rules**: Copy content from `storage.rules` to Storage Rules tab

---

## Option 2: Firebase Emulators (Development Only)

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login and Initialize
```bash
firebase login
firebase init
```

Select:
- Firestore
- Storage
- Emulators

### Step 3: Configure Emulators
Edit `firebase.json`:
```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "storage": {
      "port": 9199
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  }
}
```

### Step 4: Start Emulators
```bash
firebase emulators:start
```

### Step 5: Enable Emulator Code
Uncomment the emulator connection code in `src/config/firebase.ts`

---

## Recommended Approach

For **development and testing**: Use Option 1 (Real Firebase Project) with test mode rules
For **production**: Use Option 1 with proper security rules

The real Firebase project is easier to set up and doesn't require running additional services locally.
