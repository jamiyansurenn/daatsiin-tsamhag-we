# Backend 404 Error Fix

## ❌ Асуудал

```
API Error: {
  url: '/company-info/public',
  baseURL: 'https://daatsin-tsamkhag-backend.onrender.com',
  status: 404,
  message: 'Request failed with status code 404'
}
```

Backend server ажиллаж байгаа боловч endpoint-ууд 404 буцааж байна.

---

## ✅ Шалгах алхмууд

### 1. Backend Server ажиллаж байгаа эсэхийг шалгах

Browser эсвэл Postman дээр:

```
https://daatsin-tsamkhag-backend.onrender.com/api
```

✅ **Хэрэв Swagger UI харагдаж байвал** → Backend server ажиллаж байна
❌ **Хэрэв 404 эсвэл connection error** → Backend server ажиллахгүй байна

### 2. Backend Logs шалгах

**Render Dashboard** → Backend service → **Logs** руу орох:

✅ **Зөв:**
```
Application is running on: http://localhost:10000
Swagger documentation: http://localhost:10000/api
```

❌ **Буруу:**
```
Error: Cannot connect to database
Error: Prisma Client not generated
```

### 3. Database Migration шалгах

**Render Dashboard** → Backend service → **Shell** руу орох:

```bash
cd backend
npm run prisma:migrate deploy
```

Эсвэл **Pre-Deploy Command** ашиглах:

**Settings** → **Build & Deploy** → **Pre-Deploy Command:**
```
cd backend && npm run prisma:migrate deploy
```

### 4. Prisma Client Generate шалгах

Build command дээр `prisma:generate` байгаа эсэхийг шалгах:

**Settings** → **Build & Deploy** → **Build Command:**
```
npm install && npm run prisma:generate && npm run build
```

---

## 🔧 Шийдэл

### Сонголт 1: Pre-Deploy Command нэмэх

**Render Dashboard** → Backend service → **Settings** → **Build & Deploy:**

**Pre-Deploy Command:**
```
cd backend && npm run prisma:migrate deploy
```

### Сонголт 2: Build Command-д migration нэмэх

**Build Command:**
```
cd backend && npm install && npm run prisma:generate && npm run prisma:migrate deploy && npm run build
```

### Сонголт 3: Manual Migration

1. **Render Dashboard** → Backend service → **Shell** руу орох
2. Дараах командууд ажиллуулах:

```bash
cd backend
npm run prisma:migrate deploy
npm run prisma:seed
```

---

## 🗄️ Database Setup

### PostgreSQL Database үүсгэх (хэрэв хийгээгүй бол):

1. **Render Dashboard** → **New** → **PostgreSQL**
2. Database name, region сонгох
3. **Create Database**
4. Database URL-ийг авна
5. Backend service-ийн `DATABASE_URL` variable-д оруулах

### Database URL Format:

```
postgresql://user:password@host:5432/dbname
```

---

## ✅ Шалгах

### 1. Swagger Docs:

```
https://daatsin-tsamkhag-backend.onrender.com/api
```

✅ Swagger UI харагдах ёстой

### 2. API Endpoint:

```
https://daatsin-tsamkhag-backend.onrender.com/company-info/public
```

✅ JSON response буцаах ёстой (эсвэл `null` хэрэв data байхгүй бол)

### 3. Backend Logs:

✅ Алдаа байхгүй
✅ "Application is running" мэссэж харагдах ёстой

---

## ⚠️ Анхаар

- Database migration хийгээгүй бол routes ажиллахгүй
- Prisma Client generate хийгээгүй бол database connection алдаа гарна
- Environment variables зөв тохируулсан эсэхийг шалгах

---

## 📝 Environment Variables Checklist

Backend service дээр дараах variable-ууд байх ёстой:

- ✅ `DATABASE_URL` - PostgreSQL connection string
- ✅ `JWT_SECRET` - Random secret key
- ✅ `FRONTEND_URL` - Frontend URL (CORS)
- ✅ `NODE_ENV` - `production`
- ✅ `PORT` - Render автоматаар тохируулна
