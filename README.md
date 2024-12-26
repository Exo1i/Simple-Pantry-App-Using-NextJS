
# Inventory Management System

A modern, full-stack inventory management application built with Next.js and Firebase, featuring real-time updates, barcode scanning, and AI-powered recipe suggestions.

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Components**: 
  - Material-UI (MUI) v5
  - MUI Joy Design System
  - MUI X-Data-Grid for inventory tables
  - Tailwind CSS for utility styling
- **State Management**: React Hooks
- **Authentication**: NextAuth.js with Google provider

### Backend & Database
- **Backend Service**: Firebase
  - Firestore for real-time database
  - Firebase Storage for image uploads
  - Firebase Authentication
- **API Integration**:
  - OpenFoodFacts API for product information
  - Mistral AI (7B model) for recipe generation

### Development Tools
- **Package Manager**: npm
- **Code Quality**: ESLint
- **Environment Variables**: dotenv
- **Image Processing**: Native Web APIs
- **Unique IDs**: nanoid

## ✨ Core Features

### 1. Inventory Management
- Real-time CRUD operations with Firestore
- Batch operations support
- Automatic ID generation
- Quantity tracking
- Product information management
- Brand and nutrition facts storage

### 2. Smart Features
- Barcode scanning integration
- Camera-based product detection
- AI-powered recipe suggestions
- Real-time search and filtering
- Automatic product information fetching

### 3. User Interface
- Dark mode support
- Responsive design
- Loading animations
- Toast notifications
- Modal-based forms
- Interactive data grid

## 🚀 Getting Started

1. **Clone and Install**
```bash
git clone <repository-url>
cd inventory-management
npm install
```

2. **Environment Setup**

Create a `.env.local` file with the following variables:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

3. **Development Server**
```bash
npm run dev
```

4. **Build for Production**
```bash
npm run build
npm start
```

## 📱 Features Explained

### Inventory Management
The core inventory management system provides:

- Add new items with EAN codes
- Edit existing items
- Delete items
- Increment/decrement quantities
- Automatic data validation

### Product Information Fetching
Automatic product information retrieval from OpenFoodFacts:

### Recipe Generation
AI-powered recipe suggestions using Mistral AI:

## 🔒 Security

- Firebase Authentication integration
- Protected routes
- Secure API endpoints
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Material-UI team for the comprehensive component library
- Firebase team for the robust backend services
- OpenFoodFacts for their extensive product database
- Mistral AI for the recipe generation capabilities
