# NOT_FOUND Алдааны Бүрэн Тайлбар - Next.js App Router

## 📋 Агуулга

1. [Засвар санал болгох](#1-засвар-санал-болгох)
2. [Үндсэн шалтгааныг тайлбарлах](#2-үндсэн-шалтгааныг-тайлбарлах)
3. [Үзэл баримтлалыг заах](#3-үзэл-баримтлалыг-заах)
4. [Анхааруулах тэмдгийг харуулах](#4-анхааруулах-тэмдгийг-харуулах)
5. [Хувилбаруудын талаар хэлэлцэх](#5-хувилбаруудын-талаар-хэлэлцэх)

---

## 1. Засвар санал болгох

### 🔴 Одоогийн асуудал

Кодод `notFound()` функцийг дараах байдлаар ашиглаж байна:

```typescript
// frontend/app/news/[slug]/page.tsx
if (!news.data) {
  notFound(); // ⚠️ Энэ нь build time дээр алдаа үүсгэж болно
}
```

### ✅ Зөв засвар

`notFound()` функцийг зөвхөн **runtime** дээр, мөн **data үнэхээр байхгүй** үед л дуудах хэрэгтэй. API алдаа болон data байхгүй байхыг ялгах хэрэгтэй.

#### Засвар 1: API алдаа болон data байхгүй байхыг ялгах

```typescript
// frontend/app/news/[slug]/page.tsx
export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  let news = { data: null };
  let hasError = false;
  
  try {
    const { slug } = await params;
    const result = await getNewsBySlug(slug);
    
    // API алдаа эсвэл network error шалгах
    if (result.error) {
      hasError = true;
      console.error('API Error:', result.error);
    } else {
      news = result;
    }
  } catch (error) {
    hasError = true;
    console.error('Unexpected error:', error);
  }

  // Зөвхөн data үнэхээр байхгүй үед notFound() дуудах
  // API алдаа бол error.tsx харуулах
  if (hasError) {
    // API алдаа - error boundary руу шилжүүлэх
    throw new Error('Failed to load news article');
  }
  
  if (!news.data) {
    // Data үнэхээр байхгүй - 404 харуулах
    notFound();
  }

  // ... rest of component
}
```

#### Засвар 2: API response-д error field нэмэх

`api.ts` файлд error мэдээллийг илүү тодорхой буцаах:

```typescript
// frontend/lib/api.ts
export const getNewsBySlug = async (slug: string) => {
  try {
    const response = await api.get(`/news/public/${slug}`);
    const data = safeGetData(response);
    
    // Response-д error байвал тэмдэглэх
    if (response.error) {
      return { 
        data: null, 
        error: response.error,
        status: response.status 
      };
    }
    
    return { data };
  } catch (error: any) {
    return { 
      data: null, 
      error: error.message || 'Network error',
      status: 500 
    };
  }
};
```

#### Засвар 3: Build time дээр notFound() дуудахаас сэргийлэх

```typescript
// frontend/app/news/[slug]/page.tsx
export const dynamic = 'force-dynamic'; // ✅ Аль хэдийн байна

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // ... data fetch logic
  
  // Runtime дээр л notFound() дуудах
  // Build time дээр дуудагдахгүй байхын тулд dynamic = 'force-dynamic' байх хэрэгтэй
  if (!news.data) {
    notFound();
  }
}
```

---

## 2. Үндсэн шалтгааныг тайлбарлах

### 🔍 Код үнэндээ юу хийж байсан бэ?

#### Одоогийн код:

```typescript
// 1. API-аас data татах
news = await getNewsBySlug(slug).catch(() => ({ data: null }));

// 2. Data байхгүй бол notFound() дуудах
if (!news.data) {
  notFound();
}
```

**Асуудал:**
- API алдаа гарвал → `{ data: null }` буцаана
- Data байхгүй бол → `{ data: null }` буцаана
- **Хоёр тохиолдолд ижил үр дүн** → `notFound()` дуудагдана

#### Юу хийх шаардлагатай байсан бэ?

```typescript
// 1. API алдаа болон data байхгүй байхыг ялгах
if (apiError) {
  // API алдаа - error boundary руу шилжүүлэх
  throw new Error('API connection failed');
}

if (!dataExists) {
  // Data үнэхээр байхгүй - 404 харуулах
  notFound();
}
```

### ⚡ Энэ тодорхой алдааг ямар нөхцөл байдал үүсгэсэн бэ?

#### Нөхцөл байдал 1: Build Time Static Generation

**Асуудал:**
- Next.js App Router нь default-оор **static generation** хийхийг оролддог
- Build time дээр API дуудаж, data байхгүй бол `notFound()` дуудагдана
- Build time дээр `notFound()` дуудахад → **Build алдаа** гарна

**Жишээ:**
```bash
# Build time дээр
npm run build

# Next.js: /news/some-slug хуудас generate хийх гэж байна
# API дуудаж байна → 404 эсвэл timeout
# notFound() дуудагдана
# ❌ Error: NOT_FOUND - Build failed
```

#### Нөхцөл байдал 2: Runtime API алдаа

**Асуудал:**
- Runtime дээр API алдаа гарвал → `{ data: null }` буцаана
- `notFound()` дуудагдана → 404 page харуулна
- Гэхдээ энэ нь **API алдаа**, **data байхгүй биш**

**Жишээ:**
```typescript
// User: /news/existing-article руу орж байна
// API: Network timeout эсвэл 500 error
// Code: { data: null } буцаана
// Code: notFound() дуудагдана
// User: 404 page харна (гэхдээ article үнэхээр байна!)
```

#### Нөхцөл байдал 3: Environment Variable уншдаггүй

**Асуудал:**
- `NEXT_PUBLIC_API_URL` undefined байвал
- API call → `http://localhost:3001` руу явана
- Production дээр backend байхгүй → 404
- `notFound()` дуудагдана

### 🤔 Ямар буруу ойлголт эсвэл алдаа үүнд хүргэсэн бэ?

#### Буруу ойлголт 1: "notFound() = API алдаа"

**Буруу:**
```typescript
// API алдаа = notFound() дуудах
if (!data) {
  notFound(); // ❌ API алдаа болон data байхгүй байхыг ялгахгүй
}
```

**Зөв:**
```typescript
// API алдаа = error throw хийх
// Data байхгүй = notFound() дуудах
if (apiError) {
  throw new Error('API failed');
}
if (!data) {
  notFound();
}
```

#### Буруу ойлголт 2: "Static Generation = Dynamic Content"

**Буруу:**
- Next.js App Router нь default-оор static generation хийхийг оролддог
- Dynamic content (API-аас data татах) static generate хийх боломжгүй
- `export const dynamic = 'force-dynamic'` заавал шаардлагатай

#### Буруу ойлголт 3: "Build time = Runtime"

**Буруу:**
- Build time дээр `notFound()` дуудахад → Build алдаа
- Runtime дээр `notFound()` дуудахад → 404 page харуулна

---

## 3. Үзэл баримтлалыг заах

### 🎯 Энэ алдаа яагаад байгаа вэ? Энэ нь намайг юунаас хамгаалж байна вэ?

#### Next.js-ийн хамгаалалт:

1. **Build Time Validation:**
   - Next.js build time дээр бүх route-уудыг validate хийдэг
   - Хэрэв route generate хийх боломжгүй бол → Build алдаа
   - Энэ нь **production дээр алдаа гархаас сэргийлдэг**

2. **Static Generation Optimization:**
   - Static page-ууд илүү хурдан ажиллана
   - CDN дээр cache хийх боломжтой
   - Server load бага

3. **Type Safety:**
   - TypeScript-тэй хамт ажиллахдаа route-ууд зөв байхыг баталгаажуулна

### 🧠 Энэ үзэл баримтлалын зөв сэтгэцийн загвар юу вэ?

#### Mental Model 1: Build Time vs Runtime

```
┌─────────────────┬──────────────────┬─────────────────┐
│   Phase         │   notFound()      │   Result        │
├─────────────────┼──────────────────┼─────────────────┤
│ Build Time      │ ❌ Build алдаа    │ Build failed    │
│ Runtime         │ ✅ 404 page       │ User sees 404   │
└─────────────────┴──────────────────┴─────────────────┘
```

**Ойлголт:**
- Build time = Code compile хийх үе
- Runtime = User request ирэх үе
- `notFound()` зөвхөн runtime дээр ашиглах

#### Mental Model 2: Static vs Dynamic Rendering

```
Static Generation (SSG):
├── Build time дээр page generate хийх
├── HTML файл үүсгэх
└── CDN дээр serve хийх

Dynamic Rendering (SSR):
├── User request ирэх үе
├── Server дээр render хийх
└── HTML буцаах
```

**Ойлголт:**
- Static = Build time дээр бэлтгэх
- Dynamic = Runtime дээр бэлтгэх
- API data = Dynamic (runtime дээр л татагдана)

#### Mental Model 3: Error Types

```
API Error (Network/Server):
├── Connection failed
├── Timeout
├── 500 Internal Server Error
└── → Error Boundary (error.tsx)

Data Not Found (404):
├── Resource үнэхээр байхгүй
├── Slug буруу
└── → notFound() (not-found.tsx)

Build Error:
├── Build time дээр notFound()
├── Route generate хийх боломжгүй
└── → Build failed
```

### 🔗 Энэ нь илүү өргөн хүрээний хүрээ/хэлний дизайнд хэрхэн нийцэж байна вэ?

#### Next.js App Router Design Philosophy:

1. **File-based Routing:**
   - File structure = Route structure
   - `app/news/[slug]/page.tsx` = `/news/:slug`

2. **Server Components by Default:**
   - Default-оор server component
   - Client component хэрэгтэй үед `'use client'` нэмэх

3. **Progressive Enhancement:**
   - Static generation → Dynamic rendering
   - ISR (Incremental Static Regeneration)
   - Edge runtime

4. **Error Handling Hierarchy:**
   ```
   error.tsx (Client-side errors)
   ├── not-found.tsx (404 errors)
   └── global-error.tsx (Root errors)
   ```

#### React Server Components:

- Server Components нь build time болон runtime дээр ажиллана
- `notFound()` нь Server Component-ийн хэсэг
- Build time дээр дуудахад → Build алдаа

---

## 4. Анхааруулах тэмдгийг харуулах

### ⚠️ Үүнийг дахин үүсгэж болзошгүй зүйлийг би юунаас анхаарах ёстой вэ?

#### Анхаарах зүйл 1: Build Time дээр notFound() дуудахаас сэргийлэх

**Тэмдэг:**
```typescript
// ❌ Буруу - Build time дээр алдаа гарна
export default async function Page() {
  const data = await fetchData();
  if (!data) {
    notFound(); // ⚠️ Build time дээр дуудагдаж болно
  }
}
```

**Зөв:**
```typescript
// ✅ Зөв - Dynamic rendering
export const dynamic = 'force-dynamic'; // Заавал нэмэх

export default async function Page() {
  const data = await fetchData();
  if (!data) {
    notFound(); // ✅ Runtime дээр л дуудагдана
  }
}
```

#### Анхаарах зүйл 2: API алдаа болон data байхгүй байхыг ялгах

**Тэмдэг:**
```typescript
// ❌ Буруу - API алдаа = 404
const data = await fetchData().catch(() => null);
if (!data) {
  notFound(); // ⚠️ API алдаа болон data байхгүй байхыг ялгахгүй
}
```

**Зөв:**
```typescript
// ✅ Зөв - API алдаа болон data байхгүй байхыг ялгах
try {
  const result = await fetchData();
  if (result.error) {
    throw new Error('API failed'); // Error boundary
  }
  if (!result.data) {
    notFound(); // 404 page
  }
} catch (error) {
  throw error; // Error boundary
}
```

#### Анхаарах зүйл 3: Environment Variable шалгах

**Тэмдэг:**
```typescript
// ❌ Буруу - Env variable шалгахгүй
const apiUrl = process.env.NEXT_PUBLIC_API_URL; // undefined байж болно
```

**Зөв:**
```typescript
// ✅ Зөв - Env variable шалгах
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_API_URL) {
  console.error('NEXT_PUBLIC_API_URL is not set!');
}
```

### 🔍 Холбогдох нөхцөл байдалд би ижил төстэй алдаа гаргаж болох уу?

#### Нөхцөл байдал 1: ISR (Incremental Static Regeneration)

**Алдаа:**
```typescript
// ❌ Буруу
export const revalidate = 60; // ISR
export default async function Page() {
  const data = await fetchData();
  if (!data) {
    notFound(); // ⚠️ Revalidation time дээр алдаа гарна
  }
}
```

**Зөв:**
```typescript
// ✅ Зөв
export const dynamic = 'force-dynamic'; // ISR-ийг идэвхгүй болгох
// эсвэл
export const revalidate = 60;
export default async function Page() {
  const data = await fetchData();
  if (!data) {
    // Error handling сайжруулах
    return <ErrorComponent />;
  }
}
```

#### Нөхцөл байдал 2: Parallel Routes

**Алдаа:**
```typescript
// ❌ Буруу
export default async function Layout({ children, modal }) {
  const data = await fetchData();
  if (!data) {
    notFound(); // ⚠️ Layout дээр notFound() дуудахад бүх route алдаа гарна
  }
}
```

**Зөв:**
```typescript
// ✅ Зөв - Page дээр л notFound() дуудах
export default async function Layout({ children, modal }) {
  // Layout дээр notFound() дуудахгүй
  return <>{children}</>;
}
```

#### Нөхцөл байдал 3: generateStaticParams

**Алдаа:**
```typescript
// ❌ Буруу
export async function generateStaticParams() {
  const items = await fetchAllItems();
  return items.map(item => ({ slug: item.slug }));
}

export default async function Page({ params }) {
  const data = await fetchItem(params.slug);
  if (!data) {
    notFound(); // ⚠️ Build time дээр алдаа гарна
  }
}
```

**Зөв:**
```typescript
// ✅ Зөв
export const dynamic = 'force-dynamic'; // Static generation идэвхгүй болгох
// эсвэл
export async function generateStaticParams() {
  // Зөвхөн баталгаатай slug-ууд буцаах
  return [{ slug: 'known-slug' }];
}
```

### 🚨 Энэ асуудлыг ямар кодын үнэр эсвэл хэв маяг харуулж байна вэ?

#### Code Smell 1: "Silent Failure"

```typescript
// ❌ Буруу - Алдааг нуух
const data = await fetchData().catch(() => null);
if (!data) {
  notFound(); // Алдааны шалтгааныг мэдэхгүй
}
```

**Анхаарах:**
- `.catch(() => null)` - Алдааг нуух
- Error logging байхгүй
- Debug хийхэд хэцүү

#### Code Smell 2: "Magic Values"

```typescript
// ❌ Буруу - Magic value
if (!data) {
  notFound(); // "data" гэж юу вэ? Яагаад null вэ?
}
```

**Анхаарах:**
- `null` гэж юу гэсэн үг вэ?
- API алдаа эсвэл data байхгүй эсэх?
- Type safety байхгүй

#### Code Smell 3: "Missing Error Boundaries"

```typescript
// ❌ Буруу - Error handling байхгүй
export default async function Page() {
  const data = await fetchData(); // ⚠️ Error гарвал?
  if (!data) {
    notFound();
  }
}
```

**Анхаарах:**
- Try-catch байхгүй
- Error boundary байхгүй
- User-д error message харуулахгүй

---

## 5. Хувилбаруудын талаар хэлэлцэх

### 🎯 Арга 1: Dynamic Rendering (Одоогийн шийдэл)

**Дэлгэрэнгүй:**
```typescript
export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await fetchData();
  if (!data) {
    notFound();
  }
}
```

**Давуу тал:**
- ✅ Энгийн
- ✅ Build time алдаа гарахгүй
- ✅ Runtime дээр л ажиллана

**Сул тал:**
- ❌ Static generation-ийн давуу талгүй
- ❌ CDN cache хийх боломжгүй
- ❌ Server load их

**Хэзээ ашиглах:**
- Data байнга өөрчлөгдөж байвал
- User-specific content байвал
- Real-time data байвал

---

### 🎯 Арга 2: Error Boundary + Conditional Rendering

**Дэлгэрэнгүй:**
```typescript
export const dynamic = 'force-dynamic';

export default async function Page() {
  try {
    const result = await fetchData();
    
    if (result.error) {
      // API алдаа - Error boundary
      throw new Error(`API Error: ${result.error}`);
    }
    
    if (!result.data) {
      // Data байхгүй - 404
      notFound();
    }
    
    return <Content data={result.data} />;
  } catch (error) {
    // Unexpected error - Error boundary
    throw error;
  }
}
```

**Давуу тал:**
- ✅ API алдаа болон data байхгүй байхыг ялгана
- ✅ Error handling тодорхой
- ✅ User-д зөв мэдээлэл өгнө

**Сул тал:**
- ❌ Код илүү төвөгтэй
- ❌ Error boundary шаардлагатай

**Хэзээ ашиглах:**
- API алдаа болон data байхгүй байхыг ялгах шаардлагатай үед
- Error handling сайжруулах шаардлагатай үед

---

### 🎯 Арга 3: ISR (Incremental Static Regeneration)

**Дэлгэрэнгүй:**
```typescript
export const revalidate = 60; // 60 секунд тутамд revalidate

export async function generateStaticParams() {
  // Зөвхөн баталгаатай slug-ууд
  const items = await fetchAllItems();
  return items.map(item => ({ slug: item.slug }));
}

export default async function Page({ params }) {
  const data = await fetchItem(params.slug);
  
  // generateStaticParams-д байгаа slug-ууд л ирнэ
  // Тиймээс data байхгүй байх магадлал бага
  if (!data) {
    notFound();
  }
  
  return <Content data={data} />;
}
```

**Давуу тал:**
- ✅ Static generation-ийн давуу тал
- ✅ CDN cache хийх боломжтой
- ✅ Server load бага
- ✅ Хурдан ажиллана

**Сул тал:**
- ❌ Төвөгтэй
- ❌ generateStaticParams шаардлагатай
- ❌ Revalidation time хүлээх хэрэгтэй

**Хэзээ ашиглах:**
- Data удаан өөрчлөгдөж байвал
- Performance чухал үед
- CDN cache хийх шаардлагатай үед

---

### 🎯 Арга 4: Client-side Data Fetching

**Дэлгэрэнгүй:**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page({ params }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    fetchData(params.slug)
      .then(result => {
        if (!result.data) {
          router.push('/404'); // эсвэл notFound() ашиглах
        } else {
          setData(result.data);
        }
      })
      .catch(error => {
        // Error handling
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.slug]);
  
  if (loading) return <Loading />;
  if (!data) return null; // Router already handled 404
  
  return <Content data={data} />;
}
```

**Давуу тал:**
- ✅ Build time алдаа гарахгүй
- ✅ Client-side error handling хялбар
- ✅ Loading state харуулах боломжтой

**Сул тал:**
- ❌ SEO муу
- ❌ Initial load удаан
- ❌ JavaScript идэвхгүй бол ажиллахгүй

**Хэзээ ашиглах:**
- SEO чухал биш үед
- Interactive content байвал
- Real-time updates шаардлагатай үед

---

### 🎯 Арга 5: Hybrid Approach (Одоогийн + Error Handling)

**Дэлгэрэнгүй:**
```typescript
export const dynamic = 'force-dynamic';

export default async function Page({ params }) {
  let data = null;
  let error = null;
  
  try {
    const result = await fetchData(params.slug);
    
    if (result.error) {
      error = result.error;
    } else {
      data = result.data;
    }
  } catch (err) {
    error = err.message;
  }
  
  // API алдаа - Error boundary
  if (error) {
    throw new Error(`Failed to load: ${error}`);
  }
  
  // Data байхгүй - 404
  if (!data) {
    notFound();
  }
  
  return <Content data={data} />;
}
```

**Давуу тал:**
- ✅ API алдаа болон data байхгүй байхыг ялгана
- ✅ Error handling тодорхой
- ✅ Build time алдаа гарахгүй
- ✅ SEO сайн (Server-side rendering)

**Сул тал:**
- ❌ Код бага зэрэг төвөгтэй

**Хэзээ ашиглах:**
- **Энэ нь хамгийн сайн хувилбар** - ихэнх тохиолдолд ашиглах боломжтой

---

## 📊 Хувилбаруудын харьцуулалт

| Арга | Build Time Алдаа | SEO | Performance | Төвөгтэй байдал | Зөвлөмж |
|------|----------------|-----|-------------|-----------------|---------|
| Dynamic Rendering | ❌ Гарахгүй | ✅ Сайн | ⚠️ Дунд | ✅ Энгийн | ✅ Зөвлөмж |
| Error Boundary | ❌ Гарахгүй | ✅ Сайн | ⚠️ Дунд | ⚠️ Дунд | ✅ Зөвлөмж |
| ISR | ⚠️ Боломжтой | ✅ Сайн | ✅ Сайн | ❌ Төвөгтэй | ⚠️ Тусгай тохиолдолд |
| Client-side | ❌ Гарахгүй | ❌ Муу | ❌ Муу | ✅ Энгийн | ❌ Зөвлөмж биш |
| Hybrid | ❌ Гарахгүй | ✅ Сайн | ⚠️ Дунд | ⚠️ Дунд | ✅ Хамгийн сайн |

---

## ✅ Дүгнэлт

### Одоо хийх зүйл:

1. **API response-д error field нэмэх** - API алдаа болон data байхгүй байхыг ялгах
2. **Error boundary сайжруулах** - API алдааг зөв handle хийх
3. **notFound() зөвхөн data байхгүй үед дуудах** - API алдаа биш

### Ирээдүйд анхаарах зүйл:

1. **Build time vs Runtime** - `notFound()` зөвхөн runtime дээр
2. **Error types ялгах** - API алдаа vs Data байхгүй
3. **Environment variables шалгах** - Production дээр зөв тохируулах

### Хамгийн сайн практик:

- **Hybrid Approach** ашиглах - Dynamic rendering + Error handling
- API response-д error field нэмэх
- Error boundary сайжруулах
- `export const dynamic = 'force-dynamic'` заавал нэмэх
