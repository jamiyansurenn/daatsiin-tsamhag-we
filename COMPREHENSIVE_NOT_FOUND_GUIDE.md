# Comprehensive NOT_FOUND Error Guide

## 1. ✅ The Fix (Already Applied)

**What was changed:**
Added `export const dynamic = 'force-dynamic';` to all three dynamic route pages:
- `frontend/app/projects/[slug]/page.tsx` ✅
- `frontend/app/services/[slug]/page.tsx` ✅
- `frontend/app/news/[slug]/page.tsx` ✅

**Why this fixes the error:**
This configuration explicitly tells Next.js to render these pages **dynamically at request time** instead of attempting **static generation at build time**. This prevents build failures when:
- The API is unavailable during build
- The API returns 404 for slugs during build
- `notFound()` is called during static generation

**Status:** ✅ Fix is correctly applied. Make sure to commit and deploy these changes.

---

## 2. 🔍 Root Cause Analysis

### What was the code actually doing vs. what it needed to do?

#### What it was doing (BEFORE the fix):

1. **Next.js 14 App Router default behavior:**
   - When Next.js encounters a dynamic route like `[slug]`, it attempts to **statically generate** pages at build time
   - During `npm run build`, Next.js tries to pre-render all possible pages
   - It calls your page component's `async` function during build

2. **Build-time execution:**
   ```typescript
   // This code ran DURING BUILD TIME (not when user visits)
   export default async function ProjectDetailPage({ params }) {
     const project = await getProjectBySlug(slug); // API call during build
     if (!project.data) {
       notFound(); // ❌ This caused the build to fail!
     }
   }
   ```

3. **The failure chain:**
   - Build process tries to generate static pages
   - Makes API call to `NEXT_PUBLIC_API_URL` during build
   - API might be unavailable OR returns 404 for unknown slugs
   - `notFound()` is called during build
   - Next.js treats this as a build error → **NOT_FOUND error**

#### What it needed to do (AFTER the fix):

1. **Dynamic rendering:**
   - Pages should be rendered **on-demand** when users visit them
   - API calls should happen at **request time**, not build time
   - `notFound()` should only be called at **runtime**, not build time

2. **Request-time execution:**
   ```typescript
   export const dynamic = 'force-dynamic'; // ✅ Forces runtime rendering
   
   export default async function ProjectDetailPage({ params }) {
     const project = await getProjectBySlug(slug); // API call at request time
     if (!project.data) {
       notFound(); // ✅ Safe - only runs when user visits
     }
   }
   ```

### What conditions triggered this specific error?

1. **Build-time static generation attempt:**
   - Next.js tried to pre-generate pages during `npm run build`
   - No explicit `dynamic` or `generateStaticParams` configuration existed
   - Next.js defaulted to attempting static generation

2. **API unavailability or 404 responses:**
   - Your backend API (`NEXT_PUBLIC_API_URL`) might not be available during Vercel build
   - Or API returned 404 for slugs that don't exist yet
   - Build process can't distinguish between "slug doesn't exist" vs "API is down"

3. **`notFound()` during build:**
   - When `notFound()` is called during static generation, Next.js treats it as a build failure
   - This is different from calling `notFound()` at runtime (which shows 404 page)

4. **Missing route segment configuration:**
   - No `export const dynamic = 'force-dynamic'`
   - No `export async function generateStaticParams()`
   - Next.js had to guess the rendering strategy

### What misconception or oversight led to this?

#### Misconception #1: "Next.js will automatically handle dynamic routes"
- **Reality:** Next.js defaults to static generation for performance
- **Truth:** Dynamic routes need explicit configuration to render dynamically
- **Lesson:** Always explicitly configure rendering strategy for dynamic routes

#### Misconception #2: "Build-time and runtime are the same"
- **Reality:** Build happens once on Vercel servers; runtime happens on every request
- **Truth:** APIs might not be available during build, but are available at runtime
- **Lesson:** Consider when your code executes (build vs runtime)

#### Misconception #3: "`notFound()` always shows a 404 page"
- **Reality:** `notFound()` during build = build error; `notFound()` at runtime = 404 page
- **Truth:** Context matters - build-time vs request-time behavior differs
- **Lesson:** Understand the execution context of your code

#### Oversight #1: Missing route segment config
- **What was missing:** `export const dynamic = 'force-dynamic'`
- **Why it mattered:** Without this, Next.js attempts static generation
- **How to avoid:** Always configure dynamic routes explicitly

#### Oversight #2: Not considering build-time constraints
- **What was missing:** Consideration that API might not be available during build
- **Why it mattered:** Build fails if dependencies aren't available
- **How to avoid:** Use dynamic rendering when APIs aren't available at build time

---

## 3. 📚 Teaching the Concept

### Why does this error exist and what is it protecting you from?

#### Purpose of NOT_FOUND error during build:

1. **Build integrity:**
   - Prevents incomplete or broken static pages from being generated
   - Ensures all pre-rendered pages have valid data
   - Fails fast if a page can't be generated properly

2. **Deployment safety:**
   - Protects against deploying pages with missing content
   - Prevents broken static assets that users can access
   - Catches errors before they reach production

3. **Developer feedback:**
   - Makes build-time issues visible immediately
   - Forces you to handle edge cases explicitly
   - Encourages proper error handling

#### What it's protecting you from:

- ❌ Deploying pages that look correct but have missing content
- ❌ Creating broken static assets that users can access
- ❌ Silent failures that only show up in production
- ❌ Inconsistent behavior between build and runtime

### What's the correct mental model for this concept?

#### Next.js Rendering Strategies:

```
┌─────────────────────────────────────────────────────────┐
│              Next.js Rendering Strategies                │
└─────────────────────────────────────────────────────────┘

1. STATIC GENERATION (Build-time)
   ├─ When: Pages generated at BUILD TIME
   ├─ How: HTML pre-rendered and cached
   ├─ Speed: ⚡⚡⚡ Fastest (pre-rendered)
   ├─ Use when: Content doesn't change often, data available at build
   └─ Example: Blog posts, documentation pages

2. DYNAMIC RENDERING (Request-time) ⭐ YOUR FIX
   ├─ When: Pages generated at REQUEST TIME
   ├─ How: HTML created when user visits
   ├─ Speed: ⚡ Slower per request (but always fresh)
   ├─ Use when: Content changes frequently, API not available at build
   └─ Example: User profiles, real-time data, your dynamic routes

3. INCREMENTAL STATIC REGENERATION (ISR) (Hybrid)
   ├─ When: Pages generated at build, revalidated periodically
   ├─ How: Static + on-demand updates
   ├─ Speed: ⚡⚡ Fast (static after first request)
   ├─ Use when: Content changes occasionally, want static performance
   └─ Example: Product pages, news articles with updates
```

#### Route Segment Config (Next.js 14 App Router):

```typescript
// Option 1: Force Dynamic Rendering (What you used)
export const dynamic = 'force-dynamic';
// ✅ Always renders at request time
// ✅ No build-time dependencies
// ✅ Always fresh content

// Option 2: Allow Dynamic Params
export const dynamicParams = true; // default
// ✅ Allows routes not in generateStaticParams
// ✅ Falls back to dynamic rendering

// Option 3: Revalidate (ISR)
export const revalidate = 60; // seconds
// ✅ Revalidates every 60 seconds
// ✅ Hybrid approach

// Option 4: Generate Static Params
export async function generateStaticParams() {
  return [{ slug: 'example-1' }, { slug: 'example-2' }];
}
// ✅ Pre-generates these specific routes
// ✅ Others fall back to dynamic
```

#### The Build vs Runtime Timeline:

```
┌─────────────────────────────────────────────────────────┐
│                    EXECUTION TIMELINE                     │
└─────────────────────────────────────────────────────────┘

BUILD TIME (on Vercel servers, once per deployment)
├─ npm run build
├─ Next.js analyzes routes
├─ Attempts static generation (if no config)
├─ ❌ Your API calls happen HERE (if static)
├─ ❌ notFound() called HERE = BUILD ERROR
└─ Generates static HTML files

───────────────────────────────────────────────────────────

RUNTIME (on Vercel edge/serverless, per request)
├─ User visits /projects/my-slug
├─ Next.js checks if page is static or dynamic
├─ ✅ Your API calls happen HERE (if dynamic)
├─ ✅ notFound() called HERE = Shows 404 page
└─ Returns HTML to user
```

### How does this fit into the broader framework/language design?

#### Next.js Design Philosophy:

1. **Performance by default:**
   - Next.js optimizes for speed (static generation)
   - Assumes you want pre-rendered pages
   - Requires explicit opt-out for dynamic rendering

2. **Developer experience:**
   - Sensible defaults that work for most cases
   - File-based routing (no config needed for basic routes)
   - TypeScript support built-in

3. **Flexibility:**
   - Multiple rendering strategies available
   - Route segment config for fine-grained control
   - Can mix static and dynamic in same app

#### Why App Router is different from Pages Router:

**Pages Router (old):**
```typescript
// Explicit functions - clear what happens when
export async function getStaticProps() { } // Build time
export async function getServerSideProps() { } // Request time
export async function getStaticPaths() { } // Build time
```

**App Router (new):**
```typescript
// File-based with config exports - more declarative
export const dynamic = 'force-dynamic'; // Request time
export async function generateStaticParams() { } // Build time
```

**Benefits of App Router:**
- ✅ Less boilerplate
- ✅ Better TypeScript support
- ✅ More flexible
- ✅ Better performance options

**Trade-off:**
- ⚠️ Need to understand rendering strategies
- ⚠️ Default behavior might not match your needs
- ⚠️ Requires explicit configuration for edge cases

---

## 4. 🚨 Warning Signs

### What should I look out for that might cause this again?

#### Code Smells (Red Flags):

1. **✅ Dynamic routes without config:**
   ```typescript
   // ⚠️ WARNING: No route segment config
   // File: app/posts/[slug]/page.tsx
   export default async function PostPage({ params }) {
     const data = await fetchData(params.slug);
     if (!data) notFound();
     return <div>{data.title}</div>;
   }
   ```

2. **✅ API calls in page components:**
   ```typescript
   // ⚠️ WARNING: API might not be available at build time
   const data = await fetch(process.env.API_URL + '/posts');
   ```

3. **✅ `notFound()` without dynamic config:**
   ```typescript
   // ⚠️ WARNING: Could be called during build
   if (!data) notFound();
   ```

4. **✅ Missing environment variables:**
   ```typescript
   // ⚠️ WARNING: Might be undefined during build
   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
   ```

5. **✅ Build errors mentioning "NOT_FOUND":**
   ```
   Error: Failed to generate static page
   Error: NOT_FOUND
   ```

#### Patterns to Watch For:

- ❌ Using `async` page components that fetch data without route config
- ❌ Assuming APIs are always available during build
- ❌ Not distinguishing between build-time and runtime behavior
- ❌ Missing error boundaries for API failures
- ❌ Dynamic routes with `[slug]` or `[id]` without explicit config

#### Red Flags in Build Logs:

```
❌ "Error occurred prerendering page"
❌ "Failed to generate static page"
❌ "NOT_FOUND"
❌ Build succeeds but deployment fails
❌ Errors only in production, not development
```

### Are there similar mistakes I might make in related scenarios?

#### Similar Issue #1: Missing `generateStaticParams` for static generation

```typescript
// ❌ WRONG: Trying static generation without params
export default async function Page({ params }) {
  const data = await fetchData(params.slug);
  return <div>{data.title}</div>;
}

// ✅ CORRECT: Provide params for static generation
export async function generateStaticParams() {
  const posts = await fetchAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function Page({ params }) {
  const data = await fetchData(params.slug);
  return <div>{data.title}</div>;
}
```

#### Similar Issue #2: API routes that don't exist

```typescript
// ❌ Creating links to non-existent API routes
<Link href="/api/posts">Posts</Link>
// But no file: app/api/posts/route.ts
// Results in 404 errors
```

#### Similar Issue #3: Environment variable issues

```typescript
// ❌ WRONG: Won't work on client-side
const apiUrl = process.env.API_URL;

// ✅ CORRECT: Client-accessible
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ❌ WRONG: Might be undefined during build
const data = await fetch(process.env.API_URL);

// ✅ CORRECT: Provide fallback
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
```

#### Similar Issue #4: Missing metadata exports

```typescript
// ⚠️ Not critical, but related oversight
// Missing SEO metadata for dynamic routes

// ✅ BETTER: Export metadata
export async function generateMetadata({ params }) {
  const data = await fetchData(params.slug);
  return {
    title: data.title,
    description: data.description,
  };
}
```

### What code smells or patterns indicate this issue?

#### Pattern 1: Dynamic Route Without Config

```typescript
// ⚠️ WARNING SIGN: Dynamic route without config
// File: app/posts/[slug]/page.tsx
export default async function PostPage({ params }) {
  const data = await fetchData(params.slug); // Could fail at build time
  if (!data) notFound(); // Problematic during build
  return <div>{data.title}</div>;
}

// ✅ FIX: Add explicit dynamic config
export const dynamic = 'force-dynamic';
export default async function PostPage({ params }) {
  const data = await fetchData(params.slug);
  if (!data) notFound(); // Safe - runs at request time
  return <div>{data.title}</div>;
}
```

#### Pattern 2: Build-Time API Dependencies

```typescript
// ⚠️ WARNING SIGN: API dependency during build
export default async function Page() {
  // This runs during build if page is static
  const data = await fetch('https://api.example.com/data');
  return <div>{data.title}</div>;
}

// ✅ FIX: Make it dynamic or handle build-time gracefully
export const dynamic = 'force-dynamic';
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <div>{data.title}</div>;
}
```

#### Pattern 3: Conditional `notFound()` Without Context

```typescript
// ⚠️ WARNING SIGN: notFound() that could run during build
export default async function Page({ params }) {
  const data = await fetchData(params.slug);
  if (!data) notFound(); // When does this run?
  return <div>{data.title}</div>;
}

// ✅ FIX: Explicitly configure when notFound() runs
export const dynamic = 'force-dynamic'; // Ensures runtime execution
export default async function Page({ params }) {
  const data = await fetchData(params.slug);
  if (!data) notFound(); // Now we know: runs at request time
  return <div>{data.title}</div>;
}
```

---

## 5. 🔄 Alternatives & Trade-offs

### Alternative 1: Static Generation with `generateStaticParams`

**When to use:**
- You have a known, finite set of slugs
- Content doesn't change frequently
- You want maximum performance (pre-rendered pages)
- API is available at build time

**Implementation:**
```typescript
export async function generateStaticParams() {
  // Fetch all slugs at build time
  const projects = await getProjects();
  return projects.map(project => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({ params }) {
  const project = await getProjectBySlug(params.slug);
  if (!project.data) notFound();
  return <div>{project.data.title}</div>;
}
```

**Trade-offs:**
- ✅ **Fastest for users** (pre-rendered HTML)
- ✅ **Better SEO** (fully static HTML)
- ✅ **Lower server load** (served from CDN)
- ✅ **Works offline** (static files)
- ❌ **Requires all slugs known at build time**
- ❌ **Rebuild needed when new content added**
- ❌ **Build time increases** with number of pages
- ❌ **API must be available** during build

**Best for:** Blogs, documentation, product catalogs with known items

---

### Alternative 2: Incremental Static Regeneration (ISR)

**When to use:**
- You want static performance but dynamic content
- Content changes occasionally
- You're okay with slightly stale content
- Mix of popular and long-tail pages

**Implementation:**
```typescript
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(project => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({ params }) {
  const project = await getProjectBySlug(params.slug);
  if (!project.data) notFound();
  return <div>{project.data.title}</div>;
}
```

**Trade-offs:**
- ✅ **Fast** (static after first request)
- ✅ **Updates automatically** on schedule
- ✅ **Works for new slugs** (on-demand generation)
- ✅ **Good SEO** (mostly static)
- ❌ **More complex setup**
- ❌ **Slightly stale content** possible (up to revalidate time)
- ❌ **Requires understanding** revalidation
- ❌ **Cache invalidation** complexity

**Best for:** News sites, product pages, content that updates periodically

---

### Alternative 3: Dynamic Rendering (What You Chose) ⭐

**When to use:**
- Content changes frequently
- API not available at build time
- Unknown or infinite number of slugs
- Simplicity is priority
- Always need fresh content

**Implementation:**
```typescript
export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }) {
  const project = await getProjectBySlug(params.slug);
  if (!project.data) notFound();
  return <div>{project.data.title}</div>;
}
```

**Trade-offs:**
- ✅ **Simplest implementation** (one line of config)
- ✅ **Always fresh content** (no stale data)
- ✅ **Works with any number of slugs** (infinite scalability)
- ✅ **No build-time dependencies** (API doesn't need to be available)
- ✅ **Easy to understand** (straightforward flow)
- ❌ **Slower per request** (no pre-rendering)
- ❌ **Higher server load** (renders on every request)
- ❌ **Requires API available** at runtime
- ❌ **Worse SEO** (not pre-rendered, but Next.js handles this)

**Best for:** User-generated content, real-time data, admin panels, your use case

---

### Alternative 4: Hybrid Approach

**When to use:**
- You have popular pages and long-tail pages
- Want to optimize common pages while supporting all pages
- Mix of static and dynamic needs

**Implementation:**
```typescript
export async function generateStaticParams() {
  // Only generate popular/featured pages statically
  const featuredProjects = await getProjects({ featured: true });
  return featuredProjects.map(project => ({ slug: project.slug }));
}

export const dynamicParams = true; // Allow dynamic generation for others

export default async function ProjectDetailPage({ params }) {
  const project = await getProjectBySlug(params.slug);
  if (!project.data) notFound();
  return <div>{project.data.title}</div>;
}
```

**Trade-offs:**
- ✅ **Best of both worlds** (fast popular pages, accessible all pages)
- ✅ **Popular pages are fast** (pre-rendered)
- ✅ **All pages still accessible** (dynamic fallback)
- ✅ **Optimized performance** (where it matters most)
- ❌ **More complex logic** (need to decide what to pre-generate)
- ❌ **Need to maintain** featured/popular list
- ❌ **Two rendering paths** (more to test)

**Best for:** E-commerce (featured products static, all products dynamic), news sites (featured articles static)

---

### Decision Matrix

| Scenario | Recommended Approach | Why |
|----------|---------------------|-----|
| Known, finite slugs | Static Generation | Fastest, best SEO |
| Unknown/infinite slugs | Dynamic Rendering ⭐ | Your current choice |
| Content updates occasionally | ISR | Balance of speed and freshness |
| Mix of popular + long-tail | Hybrid | Optimize where it matters |
| API unavailable at build | Dynamic Rendering | No build dependencies |
| Real-time data | Dynamic Rendering | Always fresh |
| User-generated content | Dynamic Rendering | Infinite scalability |

---

## Summary & Key Takeaways

### ✅ The Fix
Added `export const dynamic = 'force-dynamic';` to dynamic route pages to force runtime rendering instead of build-time static generation.

### 🔍 Why It Works
Prevents Next.js from attempting static generation at build time, which was failing when APIs were unavailable or returned 404. Now pages render on-demand when users visit them.

### 📚 Key Concepts
1. **Build-time vs Runtime:** Understand when your code executes
2. **Rendering Strategies:** Static, Dynamic, ISR - choose based on your needs
3. **Route Segment Config:** Always configure dynamic routes explicitly
4. **`notFound()` Context:** Behavior differs at build vs runtime

### 🚨 Warning Signs
- Dynamic routes without config
- API calls that might fail during build
- `notFound()` without understanding context
- Build errors mentioning "NOT_FOUND"

### 🔄 When to Reconsider
- If you have a known set of pages → Consider `generateStaticParams`
- If content updates occasionally → Consider ISR
- If you have popular + long-tail pages → Consider hybrid approach
- If you need maximum performance → Consider static generation

### 💡 Mental Model
```
Build Time (once) → Static Generation → Fast but requires data
Request Time (per visit) → Dynamic Rendering → Slower but always works
```

**Your choice (dynamic rendering) is perfect for:**
- Unknown/infinite number of slugs
- API not available at build time
- Always fresh content
- Simplicity

---

## Next Steps

1. ✅ **Verify fix is committed:**
   ```powershell
   git status
   git add frontend/app/projects/[slug]/page.tsx
   git add frontend/app/services/[slug]/page.tsx
   git add frontend/app/news/[slug]/page.tsx
   git commit -m "Fix NOT_FOUND: Add force-dynamic to dynamic routes"
   ```

2. ✅ **Deploy to Vercel:**
   ```powershell
   git push origin main
   ```

3. ✅ **Monitor deployment:**
   - Check Vercel dashboard for build status
   - Verify build logs show no NOT_FOUND errors
   - Test dynamic routes after deployment

4. ✅ **Future prevention:**
   - Always add `export const dynamic = 'force-dynamic'` to new dynamic routes
   - Consider rendering strategy when creating new routes
   - Test builds locally before deploying

---

**Remember:** The fix is already in your code. Just commit and deploy! 🚀
