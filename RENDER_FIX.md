# Render Deployment Fix

## Алдаа: "Empty build command; skipping build" & "Publish directory build does not exist"

Энэ алдаа нь **Static Site** service ашиглаж байгаатай холбоотой. Next.js app-д **Web Service** ашиглах хэрэгтэй.

## Шийдэл:

### Сонголт 1: Docker ашиглах (Зөвлөмж)

1. **Render Dashboard** → **Settings** → **Build & Deploy**
2. **Environment** сонгох:
   - **Docker** сонгох (одоо Dockerfile байгаа)
3. Тохиргоо:
   - **Dockerfile Path:** `./Dockerfile`
   - **Docker Build Context Directory:** `.`
   - **Root Directory:** Хоосон байх

### Сонголт 2: Node.js Build ашиглах (Docker-гүй)

1. **Render Dashboard** → **Settings** → **Build & Deploy**
2. **Environment** сонгох:
   - **Node** сонгох
3. Тохиргоо:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`

### Сонголт 3: Service Type солих

Хэрэв одоо **Static Site** service байвал:

1. **Settings** → **Delete Web Service** (эсвэл шинэ service үүсгэх)
2. **New** → **Web Service** сонгох (Static Site биш!)
3. Repository сонгох
4. Дээрх тохиргоонуудыг хийх

## Environment Variables

**Settings** → **Environment** руу ороод:

- **NEXT_PUBLIC_API_URL** = Backend URL (жишээ: `https://your-backend.onrender.com`)

## Build Logs шалгах

Deploy хийсний дараа build logs дээр:
- ✅ `npm install` амжилттай
- ✅ `npm run build` амжилттай
- ✅ Server эхэлсэн

## Анхаар:

- **Static Site** = Зөвхөн static files (HTML, CSS, JS) - Next.js-д тохирохгүй
- **Web Service** = Node.js server ажиллуулна - Next.js-д зөв

## Хэрэв буруу repository-д deploy хийж байвал:

Error log дээр: `==> Cloning from https://github.com/jamiyansurenn/food-del-back`

Энэ нь буруу repository байна. Зөв repository сонгох:
- **Settings** → **Build & Deploy** → **Repository**
- **Edit** → `jamiyansurenn/daatsiin-tsamhag-we` сонгох
