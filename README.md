# ДААЦЫН ЦАМХАГ Групп - Corporate Website

Full Stack Corporate Website with Admin Panel, Multi-language Support, and Content Management System.

## 🚀 Tech Stack

### Backend
- **NestJS** - Node.js framework
- **Prisma ORM** - Database toolkit
- **SQLite** - Database (development)
- **PostgreSQL** - Database (production ready)
- **JWT** - Authentication
- **Swagger** - API documentation

### Frontend
- **Next.js 14** - React framework with SSR
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling (via globals.css)
- **i18n** - Multi-language support (MN/EN/中文)

## 📁 Project Structure

```
.
├── backend/              # NestJS Backend API
│   ├── src/
│   │   ├── auth/        # Authentication module
│   │   ├── company-info/ # Company info CRUD
│   │   ├── services/    # Services CRUD
│   │   ├── projects/    # Projects CRUD
│   │   ├── news/       # News CRUD
│   │   ├── team-members/ # Team members CRUD
│   │   ├── partners/    # Partners CRUD
│   │   ├── contact/     # Contact messages
│   │   ├── upload/      # File upload
│   │   └── users/       # User management
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   └── migrations/  # Database migrations
│   └── uploads/         # Uploaded files
│
├── frontend/             # Next.js Frontend
│   ├── app/             # Pages & routes
│   │   ├── about/       # About pages
│   │   ├── services/    # Services pages
│   │   ├── projects/    # Projects pages
│   │   ├── news/        # News pages
│   │   ├── careers/     # Careers pages
│   │   ├── admin/       # Admin panel
│   │   └── ...
│   ├── components/      # React components
│   ├── lib/             # Utilities & API
│   └── contexts/        # React contexts
│
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git (for version control)

### 1. Clone Repository
```bash
git clone https://github.com/jamiyansurenn/daatsiin-tsamhag-we.git
cd daatsiin-tsamhag-we
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Setup environment
node setup-env.js

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Start development server
npm run dev
```

Backend will run on: `http://localhost:3001`
API Documentation: `http://localhost:3001/api`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:3000`

### 4. Admin Panel Access
- URL: `http://localhost:3000/admin`
- Email: `admin@moncon.mn`
- Password: `admin123`

## 📚 Features

### Public Website
- ✅ Home page with hero section
- ✅ About Us page
- ✅ Services listing & detail pages
- ✅ Projects portfolio & detail pages
- ✅ News/Blog listing & detail pages
- ✅ Careers/Job openings page
- ✅ Contact form
- ✅ Multi-language support (MN/EN/中文)
- ✅ Responsive design
- ✅ SEO optimized
- ✅ Smooth animations

### Admin Panel
- ✅ Secure login (JWT)
- ✅ Dashboard with statistics
- ✅ Content management (CRUD)
  - Company Info
  - Services
  - Projects
  - News
  - Team Members
  - Partners
- ✅ File/Image upload
- ✅ Publish/Draft status
- ✅ Role-based access (Admin/Editor)

## 🌍 Languages

- **Монгол (MN)** - Default
- **English (EN)**
- **中文 (ZH)** - Chinese

Language switcher in header navigation.

## 🗄️ Database Schema

### Entities
- `User` - Admin/Editor users
- `CompanyInfo` - Company information
- `Service` - Services offered
- `Project` - Completed projects
- `News` - News articles
- `TeamMember` - Team members
- `Partner` - Business partners
- `ContactMessage` - Contact form submissions

## 📝 API Endpoints

### Public Endpoints
- `GET /company-info/public` - Get company info
- `GET /services/public` - Get all services
- `GET /services/public/:slug` - Get service by slug
- `GET /projects/public` - Get all projects
- `GET /projects/public/:slug` - Get project by slug
- `GET /news/public` - Get all news
- `GET /news/public/:slug` - Get news by slug
- `GET /team-members/public` - Get team members
- `GET /partners/public` - Get partners
- `POST /contact` - Submit contact form

### Admin Endpoints (JWT Required)
- `POST /auth/login` - Admin login
- `GET /auth/profile` - Get user profile
- Full CRUD for all entities
- `POST /upload` - Upload file
- `DELETE /upload/:filename` - Delete file

See Swagger docs at `/api` for full API documentation.

## 🚀 Deployment

### Backend
1. Set environment variables
2. Use PostgreSQL for production
3. Run migrations: `npm run prisma:migrate deploy`
4. Build: `npm run build`
5. Start: `npm run start:prod`

### Frontend
1. Set `NEXT_PUBLIC_API_URL` to production API URL
2. Build: `npm run build`
3. Start: `npm run start`

Or deploy to Vercel/Netlify for automatic deployments.

## 📄 License

Private - All rights reserved

## 👥 Support

For issues or questions, please contact the development team.
