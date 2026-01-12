import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { getProjects } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagePlaceholder';

// Force dynamic rendering to prevent build-time static generation errors
export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await getProjects().catch(() => ({ data: [] }));

  return (
    <>
      <Header />
      <main>
        <section className="hero" style={{ 
          position: 'relative', 
          overflow: 'hidden',
          backgroundImage: `url(${getImageUrl(undefined, 'building', 1)})`,
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
            <AnimateOnScroll>
              <h1>Хийсэн ажилууд</h1>
              <p>Манай компанийн хэрэгжүүлсэн төслүүд</p>
            </AnimateOnScroll>
          </div>
        </section>

        <section style={{ padding: '4rem 0' }}>
          <div className="container">
            {projects.data && projects.data.length > 0 ? (
              <div className="grid">
                {projects.data.map((project: any, index: number) => {
                  const imageUrl = getImageUrl(project.image, 'building', index);
                  
                  return (
                    <AnimateOnScroll key={project.id} delay={index * 100}>
                      <div className="card">
                        <div style={{ position: 'relative', width: '100%', height: '250px', overflow: 'hidden' }}>
                          <Image
                            src={imageUrl}
                            alt={project.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                          <h3 style={{ marginBottom: '1rem' }}>{project.title}</h3>
                          <p style={{ marginBottom: '1rem', color: '#666' }}>{project.description}</p>
                          <Link href={`/projects/${project.slug}`} className="btn">
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
                <AnimateOnScroll>
                  <p style={{ fontSize: '1.2rem', color: '#666' }}>Төсөл олдсонгүй</p>
                </AnimateOnScroll>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
