# Vercel Deployment Fix

## ❌ Асуудал

```
npm error Missing script: "build"
```

Vercel root directory-аас build хийж байна, гэхдээ root-д build script байхгүй.

---

## ✅ ШИЙДЭЛ

### Vercel Project Settings дээр:

1. **Root Directory** тохируулах:
   - ❌ `./` (root) биш
   - ✅ `frontend` гэж бичих

2. **Environment Variables:**
   - **NEXT_PUBLIC_API_URL** = Backend URL
   - ❌ `http://localhost:3001` биш (production-д ажиллахгүй)
   - ✅ `https://your-backend.onrender.com` (Backend URL)

### Тохиргоо:

**Project Settings:**
- **Framework Preset:** `Next.js` (эсвэл `Other`)
- **Root Directory:** `frontend` ⬅️ **ЭНЭ ЧУХАЛ!**
- **Build Command:** (Vercel автоматаар тохируулна)
- **Output Directory:** `.next` (Vercel автоматаар тохируулна)

**Environment Variables:**
- **NEXT_PUBLIC_API_URL** = `https://daatsiin-tsamhag-backend.onrender.com` (Backend URL)

---

## 🔧 Хэрэв Project аль хэдийн үүссэн бол:

1. **Settings** → **General** → **Root Directory**
2. `frontend` гэж бичих
3. **Save**
4. **Deployments** → **Redeploy**

---

## ✅ Шалгах

Deploy хийсний дараа:
- ✅ Build амжилттай
- ✅ Site ажиллаж байна
- ✅ API calls амжилттай (localhost алдаа байхгүй)

---

## 📝 Environment Variables Checklist

**Production:**
- `NEXT_PUBLIC_API_URL` = `https://your-backend.onrender.com`

**Preview/Development:**
- `NEXT_PUBLIC_API_URL` = `http://localhost:3001` (local dev-д)
