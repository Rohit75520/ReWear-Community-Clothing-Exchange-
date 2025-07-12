# 🚀 Quick Firebase Setup for ReWear

## ✅ Step 1: Firebase Configuration (COMPLETED)
Your Firebase config has been updated with your project credentials:
- Project ID: `rewear-ef872`
- Auth Domain: `rewear-ef872.firebaseapp.com`

## 🔥 Step 2: Enable Firebase Services

### A. Enable Authentication
1. Go to: https://console.firebase.google.com/project/rewear-ef872/authentication
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"** provider
5. Click **"Save"**

### B. Enable Firestore Database
1. Go to: https://console.firebase.google.com/project/rewear-ef872/firestore
2. Click **"Create database"**
3. Choose **"Start in test mode"**
4. Select your preferred location
5. Click **"Done"**

### C. Enable Storage
1. Go to: https://console.firebase.google.com/project/rewear-ef872/storage
2. Click **"Get started"**
3. Choose **"Start in test mode"**
4. Use same location as Firestore
5. Click **"Done"**

## 📋 Step 3: Deploy Security Rules

### Option A: Using Firebase CLI (Recommended)
```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Firestore: Configure security rules and indexes files
# - Storage: Configure security rules file

# Deploy rules
firebase deploy --only firestore:rules,storage
```

### Option B: Manual Copy-Paste
**Firestore Rules:**
1. Go to: https://console.firebase.google.com/project/rewear-ef872/firestore/rules
2. Copy content from `firestore.rules` file
3. Paste and publish

**Storage Rules:**
1. Go to: https://console.firebase.google.com/project/rewear-ef872/storage/rules
2. Copy content from `storage.rules` file  
3. Paste and publish

## 🎯 Step 4: Test Your Application

Once services are enabled:

1. **Open your app**: http://localhost:5173/
2. **Register a new account**
3. **Login/logout**
4. **Upload a clothing item**
5. **Browse items**

## 🔧 Troubleshooting

### If you get authentication errors:
- Make sure Email/Password is enabled in Firebase Console
- Check that your project ID matches in the config

### If you get Firestore errors:
- Make sure Firestore is created and rules are deployed
- Check browser console for specific error messages

### If you get Storage errors:
- Make sure Storage is enabled
- Check that storage rules are deployed

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all Firebase services are enabled
3. Make sure security rules are deployed
4. Try refreshing the page

Your ReWear app is ready to go! 🎉
