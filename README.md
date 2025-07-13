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


- **User Authentication** - Secure sign-up and login with Supabase Auth
- **Item Listings** - Upload and showcase clothing items with detailed descriptions
- **Smart Browse** - Filter and search through available items by category, size, and style
- **User Profiles** - Personalized dashboards to manage listings and swap history
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Real-time Updates** - Live notifications and updates using Supabase real-time features
- **Sustainable Fashion** - Promote circular fashion and reduce textile waste

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/closet-swap-platform.git
   cd closet-swap-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local

   # Add your Supabase credentials to .env.local
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080` (or the port shown in your terminal)

## 🛠️ Tech Stack

### Frontend
- **[React 18](https://reactjs.org/)** - Modern UI library with hooks and concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript for better development experience
- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool and development server
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework for rapid styling
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible component library
- **[React Router](https://reactrouter.com/)** - Declarative routing for React applications

### Backend & Services
- **[Supabase](https://supabase.com/)** - Open-source Firebase alternative
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication & authorization
  - File storage
- **[React Query](https://tanstack.com/query)** - Powerful data synchronization for React

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[React Hook Form](https://react-hook-form.com/)** - Performant forms with easy validation
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

## 📁 Project Structure

```
closet-swap-platform/
├── public/                 # Static assets
│   ├── favicon.ico
│   └── placeholder.svg
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── Layout.tsx     # App layout wrapper
│   │   ├── ItemCard.tsx   # Clothing item display card
│   │   └── ...
│   ├── pages/             # Route components
│   │   ├── Index.tsx      # Home page
│   │   ├── Browse.tsx     # Item browsing page
│   │   ├── Dashboard.tsx  # User dashboard
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.tsx    # Authentication hook
│   │   └── use-toast.ts   # Toast notifications
│   ├── lib/               # Utility functions
│   │   └── utils.ts       # Common utilities
│   ├── integrations/      # External service integrations
│   │   └── supabase/      # Supabase client and types
│   ├── App.tsx            # Main app component
│   └── main.tsx           # App entry point
├── supabase/              # Supabase configuration
│   ├── config.toml        # Supabase project config
│   └── migrations/        # Database migrations
└── ...config files
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build the app for production |
| `npm run build:dev` | Build the app in development mode |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check code quality |

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics, monitoring, etc.
VITE_ANALYTICS_ID=your_analytics_id
```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key to your `.env.local` file
3. Run the database migrations:
   ```bash
   npx supabase db push
   ```

## 🎨 Customization

### Styling
- **Tailwind CSS**: Modify `tailwind.config.ts` for custom design tokens
- **Components**: Update shadcn/ui components in `src/components/ui/`
- **Global Styles**: Edit `src/index.css` for global styling

### Adding New Features
1. Create new components in `src/components/`
2. Add new pages in `src/pages/`
3. Update routing in `src/App.tsx`
4. Add database schemas in `supabase/migrations/`

## 🚀 Deployment

### Quick Deploy Script
```bash
# Make the script executable (Linux/Mac)
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

### Method 1: Vercel (Recommended)
**Automatic GitHub Deployment:**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your GitHub repository
4. Vercel auto-detects Vite configuration
5. Add environment variables:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
6. Deploy! 🎉

**Manual CLI Deployment:**
```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npm run build
vercel

# Follow the prompts to configure your project
```

### Method 2: Netlify
**Drag & Drop Deployment:**
```bash
# Build the project
npm run build

# Go to netlify.com and drag the 'dist' folder to deploy
```

**GitHub Integration:**
1. Push code to GitHub
2. Connect repository at [netlify.com](https://netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in Netlify dashboard

### Method 3: GitHub Pages
```bash
# Deploy to GitHub Pages
npm run deploy

# Your site will be available at:
# https://yourusername.github.io/closet-swap-platform/
```

### Method 4: Other Platforms
The app can be deployed to any static hosting service:
- **Firebase Hosting**: `firebase deploy`
- **Surge.sh**: `surge dist/`
- **AWS S3**: Upload `dist` folder contents
- **DigitalOcean App Platform**: Connect GitHub repository

### Environment Variables
Make sure to set these environment variables in your hosting platform:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Build Commands
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18+ recommended

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Supabase](https://supabase.com/)** - For providing an excellent backend-as-a-service
- **[shadcn/ui](https://ui.shadcn.com/)** - For beautiful, accessible components
- **[Tailwind CSS](https://tailwindcss.com/)** - For making styling enjoyable
- **[React](https://reactjs.org/)** - For the amazing UI library

## 📞 Support

If you have any questions or need help:

- 📧 Email: support@closetswap.com
- 💬 Discord: [Join our community](https://discord.gg/closetswap)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/closet-swap-platform/issues)
- 📖 Documentation: [Wiki](https://github.com/your-username/closet-swap-platform/wiki)

---

<div align="center">
  <p>Made with ❤️ for sustainable fashion</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>

Built with ❤️ for sustainable fashion and environmental consciousness.
