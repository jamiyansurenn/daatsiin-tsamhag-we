import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getProjectBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagePlaceholder';

// Force dynamic rendering to prevent build-time static generation errors
export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  let project: { data: any; error?: string; status?: number } = { data: null };
  
  try {
    const { slug } = await params;
    project = await getProjectBySlug(slug);
  } catch (error: any) {
    // Unexpected error - throw to error boundary
    throw new Error(`Failed to load project: ${error.message}`);
  }

  // API error (network, timeout, 500, etc.) - throw to error boundary
  if (project.error) {
    throw new Error(`API Error: ${project.error}`);
  }

  // Data not found (404) - show not found page
  if (!project.data) {
    notFound();
  }

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="container">
            <h1>{project.data.title}</h1>
          </div>
        </section>

        <section>
          <div className="container">
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '8px', marginBottom: '2rem', overflow: 'hidden' }}>
                <Image
                  src={getImageUrl(project.data.image, 'building')}
                  alt={project.data.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 900px"
                />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#666' }}>
                  {project.data.description}
                </p>
              </div>
              {project.data.content && (
                <div style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-line', marginBottom: '2rem' }}>
                  {project.data.content}
                </div>
              )}
              {project.data.images && (
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Зурагнууд</h3>
                  <div className="grid">
                    {(typeof project.data.images === 'string' 
                      ? JSON.parse(project.data.images || '[]') 
                      : (project.data.images || [])
                    ).map((image: string, index: number) => (
                      <div key={index} style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden' }}>
                        <Image
                          src={getImageUrl(image, 'building', index)}
                          alt={`${project.data.title} - ${index + 1}`}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
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
