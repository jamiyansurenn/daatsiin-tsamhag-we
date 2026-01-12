import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getServiceBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagePlaceholder';

// Force dynamic rendering to prevent build-time static generation errors
export const dynamic = 'force-dynamic';

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  let service: { data: any; error?: string; status?: number } = { data: null };
  
  try {
    const { slug } = await params;
    service = await getServiceBySlug(slug);
  } catch (error: any) {
    // Unexpected error - throw to error boundary
    throw new Error(`Failed to load service: ${error.message}`);
  }

  // API error (network, timeout, 500, etc.) - throw to error boundary
  if (service.error) {
    throw new Error(`API Error: ${service.error}`);
  }

  // Data not found (404) - show not found page
  if (!service.data) {
    notFound();
  }

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="container">
            <h1>{service.data.title}</h1>
          </div>
        </section>

        <section>
          <div className="container">
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '8px', marginBottom: '2rem', overflow: 'hidden' }}>
                <Image
                  src={getImageUrl(service.data.image, 'service')}
                  alt={service.data.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 900px"
                />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#666' }}>
                  {service.data.description}
                </p>
              </div>
              {service.data.content && (
                <div style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                  {service.data.content}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
