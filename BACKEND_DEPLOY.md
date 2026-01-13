# Backend Deploy Guide - Render.com

## 🚀 Render дээр Backend Deploy хийх

### 1. Render Dashboard дээр шинэ service үүсгэх

1. **Render Dashboard** → **New** → **Web Service** сонгох
2. **Connect GitHub** → Repository сонгох: `jamiyansurenn/daatsiin-tsamhag-we`
3. **Service Settings:**

   - **Name:** `daatsiin-tsamhag-backend` (эсвэл өөр нэр)
   - **Region:** Singapore (эсвэл ойрхон region)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run prisma:generate && npm run build`
   - **Start Command:** `npm run start:prod`

### 2. Environment Variables тохируулах

**Settings** → **Environment** руу ороод дараах variable-ууд нэмэх:

#### Required Variables:

1. **DATABASE_URL**
   - PostgreSQL connection string
   - Render дээр **PostgreSQL** database үүсгэх:
     - **New** → **PostgreSQL**
     - Database name, region сонгох
     - Database URL-ийг авна (жишээ: `postgresql://user:pass@host:5432/dbname`)
   - Энэ URL-ийг `DATABASE_URL` variable-д оруулах

2. **JWT_SECRET**
   - Random secret key (JWT token-д зориулсан)
   - Жишээ: `your-super-secret-jwt-key-here-min-32-chars`
   - Generate хийх: https://generate-secret.vercel.app/32

3. **FRONTEND_URL**
   - Frontend URL (CORS-д зориулсан)
   - Value: `https://daatsiin-tsamhag-we.vercel.app`

#### Optional Variables:

4. **NODE_ENV**
   - Value: `production`

5. **PORT**
   - Render автоматаар тохируулна (ихэвчлэн `10000`)

### 3. Database Setup

#### PostgreSQL Database үүсгэх:

1. **Render Dashboard** → **New** → **PostgreSQL**
2. Database name, region сонгох
3. **Create Database**
4. Database URL-ийг авна
5. Энэ URL-ийг backend service-ийн `DATABASE_URL` variable-д оруулах

#### Database Migrations:

Backend deploy хийсний дараа:

1. **Render Dashboard** → Backend service → **Shell** руу орох
2. Дараах командууд ажиллуулах:

```bash
cd backend
npm run prisma:migrate deploy
npm run prisma:seed
```

Эсвэл **Pre-Deploy Command** ашиглах:

**Settings** → **Build & Deploy** → **Pre-Deploy Command:**
```
cd backend && npm run prisma:migrate deploy
```

### 4. Deploy

1. Бүх environment variables тохируулсны дараа
2. **Manual Deploy** хийх эсвэл
3. GitHub-д commit хийх (auto-deploy)

### 5. Backend URL-ийг авах

Deploy амжилттай болсны дараа:
- Backend service-ийн URL-ийг авна
- Жишээ: `https://daatsiin-tsamhag-backend.onrender.com`

### 6. Frontend-д Backend URL-ийг тохируулах

#### Vercel дээр:

1. **Vercel Dashboard** → `daatsiin-tsamhag-we` project
2. **Settings** → **Environment Variables**
3. **Add:**
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** Backend URL (жишээ: `https://daatsiin-tsamhag-backend.onrender.com`)
   - **Environment:** Production, Preview, Development
4. **Save**
5. **Deployments** → **Redeploy** хийх

#### Render дээр (хэрэв frontend Render дээр байвал):

1. **Render Dashboard** → Frontend service
2. **Settings** → **Environment**
3. **NEXT_PUBLIC_API_URL** variable-д backend URL оруулах
4. **Redeploy**

---

## ✅ Шалгах

### Backend:

1. Backend URL + `/api` руу орох (Swagger docs)
   - Жишээ: `https://daatsiin-tsamhag-backend.onrender.com/api`
2. Swagger UI харагдах ёстой

### Frontend:

1. Frontend URL руу орох
2. Browser console дээр (F12):
   - ✅ API calls амжилттай
   - ❌ `localhost:3001` алдаа байхгүй

---

## 🔧 Troubleshooting

### Database connection алдаа:

- `DATABASE_URL` зөв эсэхийг шалгах
- Database service online эсэхийг шалгах
- Migrations ажиллуулсан эсэхийг шалгах

### CORS алдаа:

- `FRONTEND_URL` зөв тохируулсан эсэхийг шалгах
- Frontend URL-ийг backend-ийн CORS whitelist-д байгаа эсэхийг шалгах

### Build алдаа:

- Build logs шалгах
- `prisma:generate` амжилттай эсэхийг шалгах
- Dependencies суусан эсэхийг шалгах

---

## 📝 Environment Variables Summary

### Backend Service:
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-random-secret-key-min-32-chars
FRONTEND_URL=https://daatsiin-tsamhag-we.vercel.app
NODE_ENV=production
PORT=10000 (auto)
```

### Frontend Service (Vercel):
```
NEXT_PUBLIC_API_URL=https://daatsiin-tsamhag-backend.onrender.com
```

### Frontend Service (Render):
```
NEXT_PUBLIC_API_URL=https://daatsiin-tsamhag-backend.onrender.com
NODE_ENV=production
PORT=10000 (auto)
```
