<div align="center">

# 🖥️ OverClocked - E-Commerce Platform

### Full-Stack Multi-Role Computer Hardware Shopping Application

![PC Hardware Banner](https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=99&w=1200&h=400&auto=format&fit=crop)

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**OverClocked is a specialized e-commerce platform for PC components and hardware, built with the MERN stack. Shop for GPUs, CPUs, RAM, SSDs, cooling solutions, and more with secure authentication, role-based access, and seamless payment integration through Razorpay.**

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Contact](#-contact)

---

## 🎯 About The Project

<div align="center">
  <img src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&h=400&fit=crop" alt="PC Components Platform" />
</div>

<br>

This **PC Components E-Commerce Platform** is a specialized online marketplace for computer hardware enthusiasts, gamers, and PC builders. Built with modern web technologies, this platform allows users to browse and purchase PC components including **GPUs, CPUs, Motherboards, RAM, SSDs, Cooling Fans, PC Cases, Power Supplies, and more**. The platform implements a **three-tier role-based architecture** supporting Customers, Hardware Sellers, and Administrators, each with tailored functionalities.

### 🎪 User Roles

| Role            | Description                                  | Key Capabilities                                                |
| --------------- | -------------------------------------------- | --------------------------------------------------------------- |
| **👤 Customer** | PC builders and gamers purchasing components | Browse hardware, compare specs, cart management, order tracking |
| **🏪 Seller**   | Hardware vendors and component retailers     | List PC components, manage inventory, sales analytics           |
| **🛡️ Admin**    | Platform administrators with full control    | User management, seller approval, catalog oversight             |

### 🌟 Why This Project?

- **Specialized Marketplace**: Dedicated platform for PC hardware enthusiasts and builders
- **Component-Focused**: Optimized for technical specifications, compatibility checks, and hardware details
- **Scalable Architecture**: Follows industry-standard MERN stack patterns
- **Security-First**: Implements JWT authentication and role-based access control
- **Tech Specifications**: Detailed product specs for GPUs, CPUs, RAM modules, storage devices, etc.
- **Production-Ready**: Structured for easy deployment and maintenance

---

## ✨ Key Features

### 👥 Customer Features

- 🔐 **Secure Authentication** - JWT-based registration and login system
- 🔍 **Hardware Discovery** - Browse by component type (GPU, CPU, RAM, SSD, Cooling, PSU, Cases)
- 🏷️ **Brand Filtering** - Filter by popular brands (NVIDIA, AMD, Intel, Corsair, ASUS, MSI, etc.)
- 📱 **Detailed Specs Pages** - Technical specifications, compatibility info, performance benchmarks
- 🛒 **Smart Shopping Cart** - Build your PC setup with real-time cart updates
- 💳 **Seamless Checkout** - Multiple payment options (COD, online payments)
- 📦 **Order Tracking** - Complete order history with real-time status updates
- 🔎 **Advanced Filters** - Search by price, brand, specs (RAM capacity, GPU VRAM, CPU cores, etc.)
- � **Wishlist** - Save favorite components for later
- 🎫 **Coupon System** - Apply discount codes at checkout

### 🏪 Seller Features

- 📊 **Seller Dashboard** - Analytics, sales metrics, and performance insights
- ➕ **Hardware Listing** - Add PC components with detailed technical specifications
- 🏷️ **Component Categories** - Organize by type (GPU, CPU, RAM, SSD, Motherboard, PSU, Cooling, Case, Peripherals)
- 📋 **Order Management** - View and manage customer hardware orders
- 🚚 **Order Fulfillment** - Update order status (Placed → Shipped → Delivered)
- 📈 **Sales Reports** - Track best-selling components and revenue
- 📸 **Product Images** - Upload and crop images with Cloudinary integration
- 📊 **Inventory Control** - Real-time stock management for components
- 🔧 **Tech Specs Input** - Add detailed specifications (cores, clock speed, capacity, etc.)
- 📈 **Analytics Dashboard** - View sales trends and revenue insights
- 🔄 **Product Status** - Toggle product visibility (active/inactive)

### 🛡️ Admin Features

- 🎛️ **Admin Dashboard** - Comprehensive platform analytics and KPIs
- 👥 **User Management** - View, block, or remove users
- ✅ **Seller Approval** - Review and approve hardware vendor registrations
- 🗂️ **Component Categories** - Manage PC component categories and brands
- 🔍 **Product Oversight** - Verify specifications and manage all hardware listings
- 📦 **Order Monitoring** - Track all hardware orders across the platform
- 🔒 **User Control** - Ban/unban users, manage seller approvals
- 📊 **Platform Analytics** - Sales trends by component type, popular products, revenue reports

### 📦 Additional Features

- 📧 **Email Notifications** - Nodemailer integration for account verification and order updates
- 🔒 **Secure APIs** - JWT authentication with protected routes and role-based middleware
- 📱 **Responsive Design** - Mobile-first design optimized for all devices
- 🌐 **RESTful Architecture** - Clean, documented API endpoints following REST principles
- ⚡ **Performance Optimized** - Vite for lightning-fast builds, optimized MongoDB queries
- 💳 **Payment Gateway** - Razorpay integration for secure online payments
- ☁️ **Cloud Storage** - Cloudinary for image storage and CDN delivery
- 🎨 **Modern UI/UX** - shadcn/ui components with Framer Motion animations
- 🔄 **Real-time Updates** - Instant cart and wishlist synchronization
- 🛡️ **Security** - Password hashing with bcrypt, CORS configuration, environment variables

---

## 🛠️ Tech Stack

### Frontend Technologies

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.x-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.13-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.11-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.x-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Latest-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_Icons-0.575-F56565?style=for-the-badge&logo=lucide&logoColor=white)

</div>

### Backend Technologies

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-9.x-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-9.x-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Bcrypt](https://img.shields.io/badge/Bcrypt-3.x-3178C6?style=for-the-badge&logo=letsencrypt&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-8.x-0078D4?style=for-the-badge&logo=gmail&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-2.x-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-2.x-0C2451?style=for-the-badge&logo=razorpay&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-2.x-FF6600?style=for-the-badge&logoColor=white)

</div>

### Development & Deployment

<div align="center">

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## 🏗️ System Architecture

```
Frontend (React 19 + Vite)
├── 📱 Pages/Components (UI Layer)
│   ├── Customer Pages (Home, Products, Cart, Checkout, Orders)
│   ├── Seller Pages (Dashboard, Inventory, Orders, Analytics)
│   ├── Admin Pages (Dashboard, Users, Products, Orders)
│   └── Auth Pages (Login, Signup, Verify Email, Forgot Password)
│
├── 🔐 Context API (Authentication)
│   ├── User session management
│   ├── Login/Logout state
│   └── Token refresh handling
│
├── 🗂️ Redux Toolkit (Global State)
│   ├── cartSlice - Shopping cart management
│   ├── wishlistSlice - Wishlist operations
│   ├── userSlice - User data & preferences
│   └── productSlice - Product catalog
│
├── 🔌 Services Layer (API Communication)
│   ├── authService - Authentication & authorization
│   ├── productService - Product CRUD operations
│   ├── cartService - Cart management
│   ├── wishlistService - Wishlist operations
│   ├── orderService - Order processing
│   ├── couponService - Discount coupons
│   ├── adminService - Admin operations
│   └── userService - User profile management
│
├── 🎨 UI Components
│   ├── shadcn/ui components (Button, Card, Input, Label)
│   ├── Custom components (Navbar, Footer, Product Cards)
│   ├── Route Guards (Protected routes)
│   └── Auth Interceptor (Auto token refresh)
│
└── 🔧 Utilities
    ├── Axios Instance (API client with interceptors)
    ├── Image Cropper (react-easy-crop)
    └── Tailwind utilities

Backend (Node.js + Express 5)
├── 🛣️ API Routes
│   ├── /api/v1/users - User authentication & profile
│   ├── /api/v1/products - Product management
│   ├── /api/v1/cart - Shopping cart operations
│   ├── /api/v1/wishlist - Wishlist management
│   ├── /api/v1/orders - Order processing & tracking
│   ├── /api/v1/coupons - Coupon management
│   └── /api/v1/admin - Admin operations
│
├── 🔒 Middleware
│   ├── isAuthenticated - JWT verification
│   ├── Role-based access control
│   ├── Multer - File upload handling
│   └── CORS configuration
│
├── 🎮 Controllers
│   ├── userController - User logic
│   ├── productController - Product logic
│   ├── cartController - Cart operations
│   ├── wishlistController - Wishlist logic
│   ├── orderController - Order management
│   ├── couponController - Coupon validation
│   └── adminController - Admin operations
│
├── 📊 Models (MongoDB + Mongoose)
│   ├── User - User accounts (Customer, Seller, Admin)
│   ├── Product - Product catalog
│   ├── Cart - Shopping carts
│   ├── Wishlist - User wishlists
│   ├── Order - Order records
│   ├── Coupon - Discount coupons
│   └── Session - User sessions
│
└── 🔧 Utilities
    ├── Cloudinary - Image storage & CDN
    ├── Nodemailer - Email notifications
    ├── Razorpay - Payment gateway integration
    ├── JWT - Token generation & verification
    └── Bcrypt - Password hashing
```


## � Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Mann275/E-commerce.git
cd E-commerce

# Install dependencies for both client and server
cd server
npm install

cd ../client
npm install
```

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Mann275/E-commerce.git
cd E-commerce
```

### 2. Server Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (see Environment Variables section)
# Add your configuration

# Start development server
npm run dev
```

The backend server will start on `http://localhost:8000`

### 3. Client Setup

```bash
# Navigate to client directory (from root)
cd client

# Install dependencies
npm install

# Create .env file (see Environment Variables section)
# Add your configuration

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **MongoDB**: Your configured MongoDB URI

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**

   ```bash
   # Click the 'Fork' button at the top right of this page
   ```

2. **Clone your Fork**

   ```bash
   git clone https://github.com/your-username/E-commerce.git
   cd E-commerce
   ```

3. **Create a Feature Branch**

   ```bash
   git checkout -b feature/AmazingFeature
   ```

4. **Make your Changes**
   - Write clean, commented code
   - Follow the existing code style
   - Test your changes thoroughly

5. **Commit your Changes**

   ```bash
   git add .
   git commit -m "Add some AmazingFeature"
   ```

6. **Push to your Fork**

   ```bash
   git push origin feature/AmazingFeature
   ```

7. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Describe your changes in detail

### Contribution Guidelines

- 📝 Write clear commit messages
- 🧪 Test your code before submitting
- 📚 Update documentation if needed
- 🎨 Follow the existing code style
- 🐛 Report bugs with detailed information
- 💡 Suggest features with clear use cases

---

##�📞 Contact


**Mann Patel**

- 🐙 GitHub: [@Mann275](https://github.com/Mann275)
- 💼 LinkedIn: [mann27](https://www.linkedin.com/in/mann27/)
- 🌐 Portfolio: [patelmann.me](https://patelmann.me)
- 📧 Email:  patelmann2705@gmail.com

### Project Links

- 🔗 **Live Demo**: [over-clocked.vercel.app](https://over-clocked.vercel.app/)
- 📦 **Repository**: [github.com/Mann275/E-commerce](https://github.com/Mann275/E-commerce)
- 🐛 **Issues**: [Report a bug](https://github.com/Mann275/E-commerce/issues)

---

<div align="center">

### 🎉 Thank You for Visiting! 🎉

![Footer Banner](https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1200&h=200&fit=crop)

**Made with ❤️ and lots of ☕**

</div>

---

<div align="center">
  <sub>Built with passion by PC enthusiasts, for PC builders and gamers 🎮💻🚀</sub>
</div>
