# Render "npm: executable file not found" Fix

## ❌ Асуудал

```
==> There was a problem starting your server: "`npm": executable file not found in $PATH
```

Render Docker mode ашиглаж байгаа боловч `npm` command олдож байхгүй.

---

## ✅ ШИЙДЭЛ

### Сонголт 1: Node Build Mode ашиглах (ХАМГИЙН ЗӨВЛӨМЖ)

Render дээр backend-д **Docker биш, Node build mode** ашиглах нь илүү найдвартай.

**Render Dashboard** → Backend service → **Settings** → **Build & Deploy:**

1. **Environment:** `Node` сонгох (Docker биш)
2. **Root Directory:** `backend`
3. **Build Command:** `npm install && npm run prisma:generate && npm run build`
4. **Start Command:** `node dist/main.js` (эсвэл `npm run start:prod`)

### Сонголт 2: Dockerfile засах

Хэрэв Docker ашиглахыг хүсвэл, Dockerfile-ийг засах:

**backend/Dockerfile:**
```dockerfile
# Start the application (use node directly instead of npm)
CMD ["node", "dist/main.js"]
```

`npm run start:prod` биш, `node dist/main.js` шууд ашиглах.

---

## 🔧 Dockerfile-ийг засах

Dockerfile дээр:

**Өмнө:**
```dockerfile
CMD ["npm", "run", "start:prod"]
```

**Дараа:**
```dockerfile
CMD ["node", "dist/main.js"]
```

---

## ✅ Шалгах

Deploy хийсний дараа:

1. **Logs** шалгах:
   ```
   Application is running on: http://localhost:10000
   ```

2. **Swagger Docs:**
   ```
   https://your-backend.onrender.com/api
   ```

---

## 📝 Товч заавар

**Хамгийн хялбар:**
1. **Environment:** `Node` (Docker биш)
2. **Root Directory:** `backend`
3. **Build Command:** `npm install && npm run prisma:generate && npm run build`
4. **Start Command:** `node dist/main.js`
5. Deploy
