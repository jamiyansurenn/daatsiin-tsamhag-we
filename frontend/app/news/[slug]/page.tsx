import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getNewsBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagePlaceholder';

// Force dynamic rendering to prevent build-time static generation errors
export const dynamic = 'force-dynamic';

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  let news: { data: any; error?: string; status?: number } = { data: null };
  
  try {
    const { slug } = await params;
    news = await getNewsBySlug(slug);
  } catch (error: any) {
    // Unexpected error - throw to error boundary
    throw new Error(`Failed to load news article: ${error.message}`);
  }

  // API error (network, timeout, 500, etc.) - throw to error boundary
  if (news.error) {
    throw new Error(`API Error: ${news.error}`);
  }

  // Data not found (404) - show not found page
  if (!news.data) {
    notFound();
  }

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="container">
            <h1>{news.data.title}</h1>
            {news.data.publishedAt && (
              <p style={{ marginTop: '1rem', opacity: 0.9 }}>
                {new Date(news.data.publishedAt).toLocaleDateString('mn-MN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>
        </section>

        <section>
          <div className="container">
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '8px', marginBottom: '2rem', overflow: 'hidden' }}>
                {news.data?.image && news.data?.title && (
                  <Image
                    src={getImageUrl(news.data.image, 'news')}
                    alt={news.data.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 900px"
                  />
                )}
              </div>
              {news.data.excerpt && (
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#666', marginBottom: '2rem', fontStyle: 'italic' }}>
                  {news.data.excerpt}
                </p>
              )}
              <div style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {news.data.content}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
