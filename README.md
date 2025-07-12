# ReWear - Sustainable Fashion Exchange Platform

A comprehensive full-stack web application that promotes sustainable fashion through community-driven clothing exchanges. Built with React, TypeScript, Firebase, and Tailwind CSS.

## 🌟 Features

### Phase 1: Authentication & User Profiles
- Secure Firebase Authentication with email/password
- Role-based access control (user/admin)
- User profile management with points tracking
- Protected routes and middleware

### Phase 2: Clothing Item Listings
- Upload clothing items with multiple images
- Firebase Storage integration for image handling
- Advanced filtering and search functionality
- Category and size-based organization
- AI-powered placeholder image generation

### Phase 3: Swaps & Point Redemption
- Direct item swapping between users
- Points-based redemption system
- Transaction history and tracking
- Real-time swap request management

### Phase 4: Admin Controls & Moderation
- Comprehensive admin dashboard
- User management and role assignment
- Content moderation and approval workflows
- Analytics and reporting

### Phase 5: Advanced Features
- Firebase Storage for secure file uploads
- AI image generation integration
- Real-time notifications
- Responsive design for all devices

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Routing**: React Router v6
- **State Management**: React Context API
- **UI Components**: Lucide React icons
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   └── Navbar.tsx
│   ├── ItemCard.tsx
│   └── ProtectedRoute.tsx
├── context/
│   └── AuthContext.tsx
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── admin/
│   │   └── AdminDashboard.tsx
│   ├── BrowseItems.tsx
│   ├── Dashboard.tsx
│   ├── ItemDetail.tsx
│   ├── LandingPage.tsx
│   └── UploadItem.tsx
├── services/
│   └── firestore.ts
├── types/
│   └── index.ts
├── config/
│   └── firebase.ts
└── App.tsx
```

## 🔧 Setup Instructions

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Firebase Configuration**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication, Firestore, and Storage
   - Update `src/config/firebase.ts` with your Firebase config
   - Deploy the Firestore security rules from `firestore.rules`
   - Deploy the Storage security rules from `storage.rules`

3. **Environment Setup**
   ```bash
   # Update Firebase config in src/config/firebase.ts
   # No additional environment variables needed
   ```

4. **Development**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## 🔒 Security

- **Firestore Rules**: Comprehensive security rules ensuring users can only access their own data
- **Storage Rules**: Secure file upload permissions with authentication
- **Role-based Access**: Admin-only routes and functions
- **Input Validation**: Frontend and backend validation for all user inputs

## 🎨 Design Features

- **Sustainable Theme**: Earth-tone color palette promoting eco-consciousness
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Smooth Animations**: Micro-interactions and hover effects
- **Accessibility**: WCAG compliant color contrast and semantic HTML
- **Modern UI**: Clean cards, intuitive navigation, and professional layouts

## 📊 Data Schema

### Users Collection
```typescript
{
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  points: number;
  avatarUrl?: string;
  createdAt: Date;
}
```

### Items Collection
```typescript
{
  id: string;
  title: string;
  description: string;
  images: string[];
  category: 'Men' | 'Women' | 'Unisex' | 'Kids';
  size: string;
  condition: 'Excellent' | 'Good' | 'Fair';
  tags: string[];
  status: 'available' | 'pending' | 'swapped' | 'redeemed';
  uploaderId: string;
  uploaderName: string;
  pointValue: number;
  createdAt: Date;
}
```

### Swaps Collection
```typescript
{
  id: string;
  itemId: string;
  requesterId: string;
  uploaderId: string;
  requesterItemId?: string;
  type: 'swap' | 'points';
  status: 'pending' | 'accepted' | 'completed' | 'declined';
  message?: string;
  createdAt: Date;
}
```

## 🌐 Deployment

### Frontend (Vercel)
```bash
# Connect your GitHub repo to Vercel
# Automatic deployments on push to main branch
```

### Backend (Firebase)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and deploy
firebase login
firebase deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔮 Future Enhancements

- [ ] Mobile app development
- [ ] Integration with shipping services
- [ ] Advanced AI recommendations
- [ ] Social features and user reviews
- [ ] Sustainability impact tracking
- [ ] Multi-language support

---

Built with ❤️ for sustainable fashion and environmental consciousness.