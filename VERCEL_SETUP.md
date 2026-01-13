# Vercel Deployment Setup

## Environment Variables

Vercel dashboard дээр дараах environment variable-ийг тохируулах хэрэгтэй:

### Required Environment Variables

1. **NEXT_PUBLIC_API_URL**
   - Backend API-ийн URL
   - Жишээ: `https://your-backend-url.onrender.com` эсвэл `https://your-backend-url.railway.app`
   - **Анхаар:** `http://localhost:3001` зөвхөн local development-д ашиглана

### Vercel дээр тохируулах:

1. Vercel Dashboard руу орох
2. Project-оо сонгох (`daatsiin-tsamhag-we`)
3. **Settings** → **Environment Variables** руу орох
4. Дараах variable нэмэх:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** Backend URL (жишээ: `https://daatsin-tsamkhag-backend.onrender.com`)
   - **Environment:** Production, Preview, Development (бүгдийг сонгох)
5. **Save** дарж хадгалах
6. **Deployments** → **Redeploy** хийх (environment variable өөрчлөгдсөн тул)

## Backend Deployment

Backend-ийг дараах platform-ууд дээр deploy хийж болно:

### Render.com
- Free tier дэмжих
- PostgreSQL database үнэгүй
- Auto-deploy from GitHub

### Railway.app
- Free tier байна
- PostgreSQL database
- Auto-deploy from GitHub

### Heroku
- Paid платформ
- PostgreSQL database

## Backend Environment Variables

Backend deploy хийхдээ дараах environment variables тохируулах:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Random secret key (JWT token-д зориулсан)
- `PORT` - Server port (ихэвчлэн platform автоматаар тохируулна)
- `FRONTEND_URL` - Frontend URL (CORS-д зориулсан)
  - Жишээ: `https://daatsiin-tsamhag-we.vercel.app`

## Testing

Environment variable тохируулсны дараа:

1. Vercel дээр redeploy хийх
2. Browser console-д шалгах (F12 → Console)
3. Network tab дээр API requests шалгах
4. 404 алдаа байхгүй эсэхийг шалгах

## Troubleshooting

### 404 алдаа гарч байвал:
1. `NEXT_PUBLIC_API_URL` зөв тохируулсан эсэхийг шалгах
2. Backend server ажиллаж байгаа эсэхийг шалгах
3. CORS тохиргоо зөв эсэхийг шалгах
4. Browser console дээр алдааны мэдээлэл шалгах

### Network алдаа гарч байвал:
1. Backend URL зөв эсэхийг шалгах
2. Backend server online эсэхийг шалгах
3. CORS тохиргоо зөв эсэхийг шалгах
