# Render Environment Variable Fix

## ❌ Асуудал

```
API Error: {
  url: '/company-info/public',
  baseURL: 'http://localhost:3001',
  message: 'connect ECONNREFUSED ::1:3001'
}
```

**Шалтгаан:** `NEXT_PUBLIC_API_URL` environment variable тохируулаагүй байна.

---

## ✅ ШИЙДЭЛ

### 1. Render Dashboard дээр Environment Variable нэмэх

1. **Render Dashboard** → **daatsiin-tsamhag-we** service сонгох
2. **Settings** → **Environment** руу орох
3. **Add Environment Variable** дарж:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** Backend URL (жишээ: `https://your-backend.onrender.com`)
   - **Apply Changes**

### 2. Backend Deploy хийх (хэрэв хийгээгүй бол)

Backend-ийг тусдаа Render service болгон deploy хийх:

1. **New** → **Web Service**
2. Repository: `jamiyansurenn/daatsiin-tsamhag-we`
3. **Root Directory:** `backend`
4. **Build Command:** `npm install && npm run prisma:generate && npm run build`
5. **Start Command:** `npm run start:prod`
6. Environment Variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Random secret key
   - `FRONTEND_URL` - `https://daatsiin-tsamhag-we.onrender.com`
   - `PORT` - Render автоматаар тохируулна

### 3. Backend URL-ийг авах

Backend deploy хийсний дараа:
- Backend service-ийн URL-ийг авна (жишээ: `https://daatsin-tsamkhag-backend.onrender.com`)
- Энэ URL-ийг frontend-ийн `NEXT_PUBLIC_API_URL` variable-д оруулах

### 4. Frontend Redeploy

1. Environment variable нэмсний дараа
2. **Manual Deploy** хийх эсвэл
3. GitHub-д commit хийх (auto-deploy)

---

## 🔍 Шалгах

Deploy хийсний дараа logs дээр:

✅ **Зөв:**
```
API Base URL: https://your-backend.onrender.com
```

❌ **Буруу:**
```
baseURL: 'http://localhost:3001'
```

---

## ⚠️ Анхаар

- `NEXT_PUBLIC_API_URL` нь **build time** болон **runtime** дээр ашиглагдана
- Environment variable өөрчлөгдсөний дараа **redeploy** хийх шаардлагатай
- `NEXT_PUBLIC_` prefix нь client-side дээр харагдах тул public байна

---

## 📝 Жишээ Environment Variables

### Frontend Service:
```
NEXT_PUBLIC_API_URL=https://daatsin-tsamkhag-backend.onrender.com
```

### Backend Service:
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-random-secret-key-here
FRONTEND_URL=https://daatsiin-tsamhag-we.onrender.com
PORT=10000
```
