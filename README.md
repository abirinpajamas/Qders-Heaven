# Qaders Heaven - Property Management System

<div align="center">

![Qaders Heaven Logo](src/images/QH.avif)

**A comprehensive, modern property management system designed to streamline rental property operations for property managers and tenants.**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg)](https://reactjs.org/)
[![PHP](https://img.shields.io/badge/PHP-8.0+-777BB4.svg)](https://php.net/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.6-06B6D4.svg)](https://tailwindcss.com/)

[View Demo](#) · [Report Bug](https://github.com/abirinpajamas/Qders-Heaven/issues) · [Request Feature](https://github.com/abirinpajamas/Qders-Heaven/issues)

</div>

## 📖 About

**Qaders Heaven** is a full-stack property management solution that bridges the gap between property management needs and modern technology. Built with a React frontend and PHP backend, this system provides comprehensive tools for managing rental properties, tenants, finances, and operations in a unified platform.

### 🎯 Mission

To empower property managers and landlords with an intuitive, efficient, and scalable property management system that reduces administrative overhead, improves tenant satisfaction, and provides actionable insights for business growth.

### 🏢 Business Value

- **Operational Efficiency**: Automate routine tasks and reduce manual data entry by up to 80%
- **Financial Visibility**: Real-time tracking of revenue, payments, and outstanding balances
- **Tenant Experience**: Self-service portal for tenants to view bills, make payments, and manage their accounts
- **Scalable Growth**: Architecture designed to grow from single properties to large portfolios

### 🌟 Key Differentiators

- **Dual-Portal Architecture**: Separate interfaces for administrators and tenants with role-based access control
- **Comprehensive Feature Set**: End-to-end property lifecycle management from onboarding to billing
- **Modern Tech Stack**: Built with React 18, PHP 8+, and responsive design principles
- **Security-First**: Session-based authentication, CORS protection, and data isolation between tenants

## 🚀 Features

### 🏢 **Property Management**
- **Property Operations**: Complete CRUD operations for properties with multi-story support
- **Unit Management**: Individual unit tracking with meter integration and base rent management
- **Property Status**: Visual dashboard showing occupancy, maintenance, and availability status
- **Floor Management**: Hierarchical organization (Buildings → Floors → Units)

### 👥 **User Management**
- **Admin Portal**: Role-based access control (Super Admin vs Regular Admin)
- **Tenant Portal**: Dedicated interface for tenants with isolated data access
- **Session Management**: Secure authentication with proper timeout and CORS support
- **Account Creation**: Admin-managed tenant account provisioning

### 💰 **Financial Management**
- **Billing System**: Automated bill generation for multiple units with bulk processing
- **Payment Processing**: Comprehensive payment tracking with multiple payment methods
- **Financial Reports**: Revenue analytics, payment history, and outstanding balances
- **Maintenance Charges**: Separate tracking for maintenance and utility bills

### 📊 **Analytics & Reporting**
- **Dashboard Metrics**: Real-time KPIs for properties, tenants, and finances
- **Activity Tracking**: Recent system activities and change logs
- **Export Capabilities**: Data export in multiple formats for external analysis
- **Trend Analysis**: Occupancy rates, revenue trends, and tenant turnover

### 🔧 **Operations**
- **Service Provider Directory**: Centralized contact management for maintenance services
- **Communication Tools**: Integrated messaging and notification system
- **Settings Management**: Configurable system parameters and preferences
- **Document Management**: File uploads for tenant documents and property images

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern UI framework with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing with protected routes
- **TailwindCSS** - Utility-first CSS framework for responsive design
- **Lucide React** - Beautiful, consistent icon system
- **Framer Motion** - Smooth animations and transitions
- **Axios** - HTTP client for API communication

### **Backend**
- **PHP 8+** - Server-side logic and API endpoints
- **MySQL** - Relational database for data persistence
- **Firebase JWT** - Secure token-based authentication
- **Session Management** - Secure user session handling

### **Development Tools**
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Cross-browser compatibility
- **ESLint** - Code quality and consistency
- **TypeScript Support** - Type safety for better development experience

### **UI Components**
- **Radix UI** - Accessible, unstyled component primitives
- **Class Variance Authority** - Component variant management
- **Tailwind Merge** - Utility class conflict resolution

## 🏗️ Architecture

### **System Design**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React SPA     │    │   PHP Backend   │    │  MySQL Database │
│                 │    │                 │    │                 │
│ • Admin Portal  │◄──►│ • RESTful API   │◄──►│ • Properties    │
│ • Tenant Portal │    │ • Session Mgmt  │    │ • Tenants       │
│ • Dashboard     │    │ • Auth & CORS  │    │ • Payments      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Key Architectural Patterns**
- **Component-Based Architecture**: Modular, reusable React components
- **RESTful API Design**: Standard HTTP methods with proper status codes
- **Role-Based Access Control**: Granular permissions for different user types
- **Session-Based Authentication**: Secure user session management
- **Responsive Design**: Mobile-first approach with progressive enhancement

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- PHP 8+ with MySQL extension
- MySQL database server
- Web server (Apache/Nginx) with PHP support

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/abirinpajamas/Qders-Heaven.git
cd Qders-Heaven
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
composer install
```

4. **Database Setup**
```bash
# Import the database schema
mysql -u username -p database_name < database/schema.sql
```

5. **Environment Configuration**
```bash
# Copy environment files
cp .env.development .env.local
# Configure database credentials and other settings
```

### **Development**

Start the development servers:

```bash
# Frontend development server
npm run dev

# Backend (configure your web server to serve the /php directory)
```

### **Production Build**

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Responsive Design

Qaders Heaven is built with a mobile-first approach and provides optimal viewing experience across:

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## 🔒 Security Features

- **Session-Based Authentication**: Secure user session management with timeout
- **CORS Protection**: Cross-origin resource sharing configuration
- **Input Validation**: SQL injection prevention and data sanitization
- **Role-Based Access Control**: Granular permissions for different user types
- **Data Isolation**: Tenants can only access their own data

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Standards**

- Follow ESLint configuration for JavaScript
- Use semantic HTML5 elements
- Write meaningful commit messages
- Include tests for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **TailwindCSS** - For the utility-first CSS framework
- **Lucide Icons** - For the beautiful icon set
- **Open Source Community** - For inspiration and best practices

## 📞 Support

- **Documentation**: Check our [Wiki](https://github.com/abirinpajamas/Qders-Heaven/wiki) for detailed guides
- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/abirinpajamas/Qders-Heaven/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/abirinpajamas/Qders-Heaven/discussions) for community support

## 🗺️ Roadmap

### **Version 2.0 (Planned)**
- [ ] Mobile applications (iOS/Android)
- [ ] Real-time notifications (WebSocket)
- [ ] Advanced analytics dashboard
- [ ] Payment gateway integrations
- [ ] Multi-language support

### **Version 1.5 (In Progress)**
- [ ] Automated email/SMS notifications
- [ ] Advanced reporting features
- [ ] API documentation
- [ ] Performance optimizations

---

<div align="center">

**Built with ❤️ for property managers worldwide**

[⬆ Back to top](#qaders-heaven---property-management-system)

</div>
