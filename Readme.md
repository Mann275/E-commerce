<div align="center">

# 🖥️ E-Commerce Platform

### Full-Stack Multi-Role Computer Hardware Shopping Application

![PC Hardware Banner](https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=99&w=1200&h=400&auto=format&fit=crop)

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**A specialized e-commerce platform for PC components and hardware, built with the MERN stack. Shop for GPUs, CPUs, RAM, SSDs, cooling solutions, and more with secure authentication and role-based access.**

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [📚 Architecture Documentation](#-architecture-documentation)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
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
- 🔧 **Compatibility Checker** - Verify component compatibility _(coming soon)_
- ⭐ **Product Reviews** - Rate and review PC components _(coming soon)_

### 🏪 Seller Features

- 📊 **Seller Dashboard** - Analytics, sales metrics, and performance insights
- ➕ **Hardware Listing** - Add PC components with detailed technical specifications
- 🏷️ **Component Categories** - Organize by type (GPU, CPU, RAM, SSD, Motherboard, PSU, Cooling, Case, Peripherals)
- 📋 **Order Management** - View and manage customer hardware orders
- 🚚 **Order Fulfillment** - Update order status (Placed → Shipped → Delivered)
- 📈 **Sales Reports** - Track best-selling components and revenue
- 📸 **Product Images** - Upload multiple images of hardware products
- 📊 **Inventory Control** - Real-time stock management for components
- 🔧 **Tech Specs Input** - Add detailed specifications (cores, clock speed, capacity, etc.)

### 🛡️ Admin Features

- 🎛️ **Admin Dashboard** - Comprehensive platform analytics and KPIs
- 👥 **User Management** - View, block, or remove users
- ✅ **Seller Approval** - Review and approve hardware vendor registrations
- 🗂️ **Component Categories** - Manage PC component categories and brands (Intel, AMD, NVIDIA, Corsair, etc.)
- 🔍 **Product Oversight** - Verify specifications and manage all hardware listings
- 📦 **Order Monitoring** - Track all hardware orders across the platform
- 📊 **Platform Analytics** - Sales trends by component type, popular products, revenue reports
- 🚨 **Content Moderation** - Review reports and manage disputes

### 📦 Additional Features

- 📧 **Email Notifications** - Account creation, order confirmation, and updates
- 🔒 **Secure APIs** - Protected routes with role-based middleware
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🌐 **RESTful Architecture** - Clean, documented API endpoints
- ⚡ **Performance Optimized** - Fast loading times and efficient queries

---

## 🛠️ Tech Stack

### Frontend Technologies

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</div>

### Backend Technologies

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Bcrypt](https://img.shields.io/badge/Bcrypt-3178C6?style=for-the-badge&logo=letsencrypt&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-0078D4?style=for-the-badge&logo=gmail&logoColor=white)

</div>

### Development & Deployment

<div align="center">

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

</div>

---

## 📚 Architecture Documentation

This project follows **industry-standard architecture** with complete separation of concerns. Detailed documentation available:

### 📖 Complete Documentation Suite

| Document                  | Description                                                                                      | Link                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------- |
| 🔄 **DATA_FLOW_GUIDE.md** | **Complete data flow with diagrams** <br/>Login flow, Cart flow, Order flow, Authentication flow | [View Guide](./DATA_FLOW_GUIDE.md)     |
| 🏗️ **ARCHITECTURE.md**    | **Industry-standard architecture explanation** <br/>Services, Redux, Context API, Best practices | [View Architecture](./ARCHITECTURE.md) |
| 🚀 **QUICK_START.md**     | **Ready-to-use code examples** <br/>Common tasks, Usage patterns, Decision tree                  | [View Quick Start](./QUICK_START.md)   |
| 🔄 **MIGRATION_GUIDE.md** | **Migrate old code to new architecture** <br/>Before/After examples, Step-by-step process        | [View Migration](./MIGRATION_GUIDE.md) |

### 🎯 Quick Navigation

**Need to understand:**

- **How data flows?** → Read [DATA_FLOW_GUIDE.md](./DATA_FLOW_GUIDE.md) - Complete visual diagrams
- **Architecture theory?** → Read [ARCHITECTURE.md](./ARCHITECTURE.md) - Layer-by-layer explanation
- **Quick examples?** → Read [QUICK_START.md](./QUICK_START.md) - Copy-paste ready code
- **Migrate old code?** → Read [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Before/After patterns

### 🏛️ Architecture Overview

```
Frontend (React)
├── Pages/Components (UI Layer)
│   └── User interactions
├── Context API (Auth state)
│   └── login, logout, signup
├── Redux Store (Global state)
│   └── cart, wishlist, user, products
├── Services Layer (API calls)
│   ├── authService
│   ├── productService
│   ├── cartService
│   ├── orderService
│   └── adminService
└── Axios Instance
    └── Token management, interceptors

Backend (Node.js + Express)
├── Routes (API endpoints)
├── Middleware (Authentication)
├── Controllers (Business logic)
├── Models (MongoDB schemas)
└── Database (MongoDB)
```

### ✨ Key Features

✅ **Services Layer** - All API calls centralized  
✅ **Redux Slices** - State management with async thunks  
✅ **Context API** - Authentication state  
✅ **Auto Token Refresh** - Seamless user experience  
✅ **Optimistic Updates** - Instant UI feedback  
✅ **Error Handling** - Consistent across layers

---

## 📞 Contact

### Project Maintainer

**Your Name**

- 📧 Email: your.email@example.com
- 🐙 GitHub: [@mann275](https://github.com/Mann275)
- 💼 LinkedIn: [mann27](https://www.linkedin.com/in/mann27/)
- 🐦 portfolio: [PatelMann](https://patelmann.me)

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
