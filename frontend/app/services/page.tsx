import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { getServices } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagePlaceholder';

// Force dynamic rendering to prevent build-time static generation errors
export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const services = await getServices().catch(() => ({ data: [] }));

  return (
    <>
      <Header />
      <main>
        <section className="hero" style={{ 
          position: 'relative', 
          overflow: 'hidden',
          backgroundImage: `url(${getImageUrl(undefined, 'service', 0)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            zIndex: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          }}></div>
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <h1>Үйлчилгээнүүд</h1>
          </div>
        </section>

        <section>
          <div className="container">
            {services.data && services.data.length > 0 ? (
              <div className="grid">
                {services.data.map((service: any, index: number) => {
                  const imageUrl = getImageUrl(service.image, 'service', index);
                  return (
                  <AnimateOnScroll key={service.id} delay={index * 100}>
                    <div className="card">
                      <div style={{ position: 'relative', width: '100%', height: '250px', overflow: 'hidden' }}>
                        <Image
                          src={imageUrl}
                          alt={service.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{ marginBottom: '1rem' }}>{service.title}</h3>
                      <p style={{ marginBottom: '1rem', color: '#666' }}>{service.description}</p>
                      <Link href={`/services/${service.slug}`} className="btn">
                        Дэлгэрэнгүй
                      </Link>
                    </div>
                  </div>
                  </AnimateOnScroll>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <p style={{ fontSize: '1.2rem', color: '#666' }}>Үйлчилгээ олдсонгүй</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
