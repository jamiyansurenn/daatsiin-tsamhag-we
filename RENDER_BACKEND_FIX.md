# Render Backend Docker Build Fix

## ❌ Асуудал

```
Error: Could not find Prisma Schema that is required for this command.
Checked following paths:
schema.prisma: file not found
prisma/schema.prisma: file not found
```

Render Docker mode ашиглаж байгаа боловч backend-д зориулсан Dockerfile зөв ажиллахгүй байна.

---

## ✅ ШИЙДЭЛ: Node Build Mode ашиглах (Зөвлөмж)

Render дээр backend deploy хийхдээ **Docker биш, Node build mode** ашиглах нь илүү хялбар.

### Render Dashboard дээр тохируулах:

1. **Settings** → **Build & Deploy**
2. **Environment** сонгох:
   - ❌ **Docker** биш
   - ✅ **Node** сонгох
3. Тохиргоо:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run prisma:generate && npm run build`
   - **Start Command:** `npm run start:prod`

### Environment Variables:

**Settings** → **Environment:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Random secret key
- `FRONTEND_URL` - Frontend URL (CORS)
- `NODE_ENV` - `production`
- `PORT` - Render автоматаар тохируулна

---

## 🔧 Хэрэв Docker ашиглахыг хүсвэл:

### Dockerfile Path тохируулах:

**Settings** → **Build & Deploy:**
- **Dockerfile Path:** `backend/Dockerfile`

### Эсвэл Root Directory-г backend болгох:

- **Root Directory:** `backend`
- **Dockerfile Path:** `./Dockerfile` (backend directory доторх Dockerfile)

---

## ✅ Шалгах

Deploy хийсний дараа:

1. **Logs** шалгах:
   ```
   Application is running on: http://localhost:10000
   Swagger documentation: http://localhost:10000/api
   ```

2. **Swagger Docs:**
   ```
   https://your-backend.onrender.com/api
   ```

3. **API Endpoint:**
   ```
   https://your-backend.onrender.com/company-info/public
   ```

---

## 📝 Товч заавар

**Хамгийн хялбар арга:**
1. **Environment:** `Node` (Docker биш)
2. **Root Directory:** `backend`
3. **Build Command:** `npm install && npm run prisma:generate && npm run build`
4. **Start Command:** `npm run start:prod`
5. Environment variables тохируулах
6. Deploy
