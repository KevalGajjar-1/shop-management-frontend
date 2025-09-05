# Shop Management System

A modern, responsive restaurant management system built with React and TypeScript for managing sweet shops and product inventory efficiently.

## 🌟 Overview

**Shop management** is a comprehensive frontend application designed for restaurant and sweet shop management. Built with modern React practices, it provides an intuitive interface for managing multiple shop locations, product catalogs, and inventory with real-time search, filtering, and pagination capabilities.

## 🚀 Getting Started

### **Prerequisites**
- Node.js (Latest LTS version)
- npm or yarn package manager
- Backend API server running

### **Installation**

#### **Environment Setup**

Create a `.env` file in the root directory and add the following:

```env
VITE_API_URL=http://localhost:5000
```

#### **Install Dependencies**

```bash
npm install
```

### **Running the Application**

```bash
npm run dev
```


# 🏗️ Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Button, Input, etc.)
│   ├── forms/           # Form components (ProductForm, ShopForm)
│   └── layout/          # Layout components (Header, Sidebar)
├── pages/               # Page components
│   ├── auth/            # Authentication pages
│   ├── shops/           # Shop management pages
│   └── products/        # Product management pages
├── store/               # Redux store configuration
│   ├── api/             # RTK Query API slices
│   │   ├── baseApi.ts
│   │   ├── authApi.ts
│   │   ├── shopsApi.ts
│   │   └── productsApi.ts
│   └── slices/          # Redux slices
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── routes/              # Route definitions
└── styles/              # Global styles and Tailwind config
```

## ✨ Key Features

### 🔐 Authentication & Security
- **JWT-based Authentication** with secure login/logout
- **Protected Routes** with automatic redirection
- **Token Management** with auto-refresh capabilities
- **User Session Persistence** across browser sessions

### 🏪 Shop Management
- **Multi-location Support** - Manage multiple shop branches
- **Complete CRUD Operations** for shops
- **Real-time Search** with instant results
- **Advanced Pagination** with customizable page sizes
- **Shop Analytics** showing product counts and inventory values
- **Responsive Card Layout** for optimal viewing on all devices

### 🍰 Product Management
- **Comprehensive Product Catalog** with detailed information
- **Smart Category Filtering**:
  - "All Categories" shows all products (no filter)
  - Specific category filtering
  - Dynamic category extraction from products
- **Advanced Search Functionality**:
  - Real-time search with debouncing
  - Multi-field search (name & description)
  - Case-insensitive matching
- **Inventory Tracking** with stock level monitoring
- **Bulk Operations** for efficient product management

### 🎯 Advanced User Experience
- **Smart Pagination** with page number navigation and ellipsis
- **Loading States** with skeleton loaders and spinners
- **Error Handling** with user-friendly messages
- **Toast Notifications** for all user actions
- **Modal Dialogs** for forms and confirmations
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Form Validation** with real-time feedback

## 🛠️ Technology Stack

### **Core Framework**
- **React** - Modern functional components with hooks
- **TypeScript** - Type-safe development with strict configuration
- **Vite** - Lightning-fast build tool and development server

### **Routing & State Management**
- **TanStack Router** - Type-safe routing with modern patterns
- **Redux Toolkit** - Predictable state management
- **RTK Query** - Powerful data fetching and caching

### **UI Framework & Styling**
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **Radix UI** - Headless UI primitives for complex components
- **Lucide React** - Beautiful, customizable icons
- **Class Variance Authority** - Component variant management

### **Form Management & Validation**
- **React Hook Form** - Performant forms with minimal re-renders
- **Zod** - TypeScript-first schema validation
- **Hookform Resolvers** - Seamless integration between forms and validation

### **Developer Experience**
- **ESLint** - Code linting and best practices
- **Prettier** - Code formatting
- **TypeScript Strict Mode** - Enhanced type checking
- **Hot Module Replacement** - Instant development feedback

### **Utilities & Enhancements**
- **clsx** - Conditional CSS class management
- **Sonner** - Beautiful toast notifications
- **use-debounce** - Input debouncing for search optimization

## 🎨 UI Components & Design

### **shadcn/ui Integration**
Built with **shadcn/ui** components for a consistent, professional design:

- **Form Components**: Input, Textarea, Select, Button
- **Layout Components**: Card, Badge, Dialog, Alert Dialog
- **Navigation**: Dropdown Menu, Pagination
- **Feedback**: Toast notifications, Loading spinners
- **Data Display**: Tables, Cards with proper spacing


### **Design System**
- **Consistent Color Palette** with semantic color usage
- **Typography Scale** with proper font hierarchy
- **Spacing System** using Tailwind's spacing tokens
- **Component Variants** for different use cases
- **Accessibility First** with proper contrast and focus states

## 📱 Core Functionality

### **Shop Management Flow**
1. **View All Shops** - Paginated grid with search functionality
2. **Create New Shop** - Modal form with validation
3. **Edit Shop Details** - In-place editing with real-time updates
4. **Delete Shop** - Confirmation dialog with cascade deletion
5. **View Shop Products** - Direct navigation to shop's product catalog

### **Product Management Flow**
1. **Browse Products** - Grid view with filtering and search
2. **Category Filtering** - Dynamic categories with "All" option
3. **Add New Product** - Smart shop selection based on context
4. **Edit Product** - Pre-filled forms with shop auto-selection
5. **Delete Product** - Safe deletion with confirmation
6. **Stock Management** - Real-time inventory tracking

### **Smart Features**
- **Context-Aware Forms**: Shop auto-selection when adding products from shop page
- **Debounced Search**: 500ms delay for optimal API calls
- **Cache Management**: RTK Query automatic caching and invalidation
- **Error Handling**: Automatic retry with user-friendly error messages

## 🔄 API Integration

### **RTK Query Implementation**
- **Automatic Caching** with tag-based invalidation
- **Background Refetching** for fresh data
- **Optimistic Updates** for instant user feedback
- **Error Handling** with retry logic
- **Loading States** management

### **API Endpoints**
```javascript
// Authentication
POST /auth/login
POST /auth/register

// Shops
GET /shops (with pagination & search)
GET /shops/:id
POST /shops
PUT /shops/:id
DELETE /shops/:id

// Products
GET /products (with pagination, search & category filter)
GET /products/shop/:shopId
GET /products/:id
POST /products
PUT /products/:id
DELETE /products/:id
```

## 📊 State Management Architecture

### **Redux Store Structure**
### **Caching Strategy**
- **Tag-based Invalidation**: Efficient cache management
- **Optimistic Updates**: Immediate UI response
- **Background Sync**: Keep data fresh automatically
- **Selective Refetching**: Only update when necessary

## 🎯 User Experience Features

### **Performance Optimizations**
- **Debounced Search** prevents excessive API calls
- **Lazy Loading** for route-based code splitting
- **Memoized Components** to prevent unnecessary re-renders
- **Efficient Pagination** with smart data fetching

### **Accessibility**
- **Keyboard Navigation** support throughout the application
- **Screen Reader Friendly** with proper ARIA labels
- **Focus Management** with logical tab order
- **High Contrast** color schemes for better readability

### **Mobile Experience**
- **Touch-Friendly** buttons and interactive elements
- **Responsive Typography** that scales appropriately
- **Mobile-First Design** approach
- **Swipe Gestures** support (where applicable)

## 🔧 Component Architecture

### **Reusable Components**
- **UI Components**: Built on shadcn/ui foundation
- **Form Components**: Integrated with React Hook Form
- **Layout Components**: Consistent page structures
- **Business Components**: Shop and product specific logic


## 🔧 Development Features

### **Developer Experience**
- **TypeScript Integration** with strict type checking
- **Hot Module Replacement** for instant feedback
- **ESLint Configuration** with React and TypeScript rules
- **Prettier Integration** for consistent code formatting
- **Path Mapping** for clean imports (`@/components/...`)

### **Build Optimization**
- **Code Splitting** by routes for smaller bundles
- **Tree Shaking** to eliminate unused code  
- **Asset Optimization** with Vite's built-in optimizations
- **Development/Production** environment configurations