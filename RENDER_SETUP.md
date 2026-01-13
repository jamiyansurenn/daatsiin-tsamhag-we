# Render Deployment Setup Guide

## Render Dashboard дээр тохируулах

### 1. Build & Deploy Settings

**Одоогийн тохиргоо (Docker ашиглах):**
- ✅ **Dockerfile Path:** `./Dockerfile` (зөв)
- ✅ **Docker Build Context Directory:** `.` (root directory, зөв)
- ✅ **Root Directory:** Хоосон байх (Docker mode-д шаардлагагүй)

**Эсвэл Node.js Build ашиглах (Docker-гүй):**
- **Environment:** `Node` сонгох
- **Root Directory:** `frontend` гэж бичих
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start`

### 2. Environment Variables (ХАМГИЙН ЧУХАЛ!)

**Settings** → **Environment** руу ороод дараах variable-ууд нэмэх:

#### Required:
1. **NEXT_PUBLIC_API_URL**
   - **Value:** Backend API URL
   - **Жишээ:** `https://your-backend.onrender.com` эсвэл `https://your-backend.railway.app`
   - **Анхаар:** `http://localhost:3001` зөвхөн local development-д ашиглана

#### Optional (Render автоматаар тохируулна):
- **PORT** - Render автоматаар тохируулна
- **NODE_ENV** - `production` гэж тохируулна

### 3. Health Check

**Settings** → **Health Checks:**
- **Health Check Path:** `/healthz` эсвэл `/` (Next.js-д зөв ажиллана)

### 4. Auto-Deploy

**Settings** → **Build & Deploy:**
- **Auto-Deploy:** `On Commit` (default, зөв)
- **Branch:** `main` (зөв)

## Deployment Process

1. **Environment Variables тохируулах** (дээрх заавар)
2. **Manual Deploy** хийх эсвэл **GitHub-д commit** хийх (auto-deploy)
3. Build logs шалгах
4. Deployment амжилттай болсон эсэхийг шалгах

## Troubleshooting

### Build алдаа гарч байвал:
1. **Dockerfile Path** зөв эсэхийг шалгах (`./Dockerfile`)
2. **Docker Build Context** зөв эсэхийг шалгах (`.`)
3. Build logs дээр алдааны мэдээлэл шалгах

### 404 алдаа гарч байвал:
1. **NEXT_PUBLIC_API_URL** тохируулсан эсэхийг шалгах
2. Backend server ажиллаж байгаа эсэхийг шалгах
3. Environment variable-ийг дахин deploy хийх (redeploy хэрэгтэй)

### Network алдаа гарч байвал:
1. Backend URL зөв эсэхийг шалгах
2. Backend CORS тохиргоо зөв эсэхийг шалгах
3. Backend server online эсэхийг шалгах

## Backend Deployment

Backend-ийг тусдаа deploy хийх шаардлагатай:

### Render.com дээр:
1. **New** → **Web Service** сонгох
2. Repository сонгох (ижил repo, гэхдээ backend directory ашиглах)
3. **Root Directory:** `backend` гэж тохируулах
4. **Build Command:** `npm install && npm run prisma:generate && npm run build`
5. **Start Command:** `npm run start:prod`
6. Environment Variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Random secret key
   - `FRONTEND_URL` - Frontend URL (CORS-д зориулсан)
   - `PORT` - Render автоматаар тохируулна

### Backend URL-ийг авах:
Backend deploy хийсний дараа Render URL-ийг авна:
- Жишээ: `https://daatsin-tsamkhag-backend.onrender.com`
- Энэ URL-ийг frontend-ийн `NEXT_PUBLIC_API_URL` variable-д оруулах
