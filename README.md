# 🏥 CareCircle - Cancer Support Portal

A comprehensive, self-contained local demo application for managing cancer support circles. Built with Next.js, TypeScript, and modern UI components.

## ✨ Features

### 🔐 **Authentication & User Management**
- Email-based sign-in system
- Join existing circles with invite codes
- Role-based access control (Admin, Caregiver, Patient)

### 🏠 **Dashboard & Navigation**
- Comprehensive dashboard with overview cards
- Easy navigation with back buttons and clickable logos
- Dark mode toggle
- Interactive walkthrough tour for first-time users

### 📝 **Updates & Communication**
- Daily mood tracking and updates
- Bad day alerts with email notifications
- Support circle communication hub

### 📅 **Task Management**
- Calendar-based task scheduling
- Task claiming and management
- ICS calendar file generation
- Location and time tracking

### 👥 **Member Management**
- Add/remove circle members
- Role management and permissions
- Invite code generation and sharing

### 💰 **Donation Tracking**
- Local donation recording
- Receipt generation
- Support circle funding management

### 📧 **Developer Mailbox**
- Simulated email system for local development
- Bad day alerts, task notifications, and receipts
- No external email service required

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn

### **Installation**
```bash
# Clone the repository
git clone https://github.com/Utkarsh0825/CareCircle.git
cd CareCircle

# Install dependencies
npm install

# Run the development server
npm run dev
```

### **Access the Application**
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ **Architecture**

### **Local Storage System**
- Uses `localStorage` with in-memory fallback for SSR
- Single `Root` object containing all application data
- No external database required

### **Session Management**
- Custom session system with group selection
- Persistent user authentication
- Role-based permissions

### **Component Structure**
- Built with Shadcn/ui components
- Responsive design with mobile support
- Theme-aware components (light/dark mode)

## 📱 **Pages & Routes**

- `/` - Landing page
- `/auth/signin` - Sign in page
- `/join` - Join existing circle
- `/dashboard` - Main dashboard
- `/dashboard/updates` - Daily updates and mood tracking
- `/dashboard/calendar` - Task management
- `/dashboard/members` - Circle member management
- `/dashboard/settings` - User settings and preferences
- `/donate` - Donation recording
- `/dev-mailbox` - Simulated email system

## 🎨 **UI Components**

- **Cards** - Information display and organization
- **Buttons** - Actions and navigation
- **Forms** - Data input and validation
- **Dialogs** - Modal interactions
- **Navigation** - Sidebar and header components
- **Theme** - Light/dark mode support

## 🔧 **Development**

### **Key Technologies**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Modern component library
- **next-themes** - Theme management

### **Local Development**
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### **Project Structure**
```
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── lib/                # Utility functions and services
├── hooks/              # Custom React hooks
├── public/             # Static assets
└── styles/             # Global styles
```

## 🌟 **Demo Data**

The application comes pre-populated with demo data:
- Sample users and support circles
- Example tasks and updates
- Demo donations and notifications

## 📋 **Tour System**

Interactive walkthrough for first-time users:
- Step-by-step guidance through all features
- Skip option available
- Highlights key functionality
- Responsive tooltips and navigation

## 🔒 **Security Features**

- Route protection based on authentication
- Role-based access control
- Session validation
- Secure local storage handling

## 🚀 **Deployment**

This is a local demo application designed for development and testing. For production deployment:

1. Set up proper authentication (NextAuth.js, Auth0, etc.)
2. Configure a production database
3. Set up email services
4. Configure environment variables
5. Deploy to Vercel, Netlify, or your preferred platform

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

## 🆘 **Support**

For questions or issues:
- Create an issue on GitHub
- Check the documentation
- Review the demo data and examples

---

**Built with ❤️ for cancer support communities**
