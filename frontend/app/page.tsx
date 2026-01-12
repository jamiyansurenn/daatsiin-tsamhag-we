import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { getCompanyInfo, getServices, getProjects, getNews } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagePlaceholder';

// Force dynamic rendering to prevent build-time static generation errors
export const dynamic = 'force-dynamic';

export default async function Home() {
  const [companyInfo, services, projects, news] = await Promise.all([
    getCompanyInfo().catch(() => ({ data: null })),
    getServices().catch(() => ({ data: [] })),
    getProjects(true).catch(() => ({ data: [] })),
    getNews(true, 3).catch(() => ({ data: [] })),
  ]);

  return (
    <>
      <Header />
      <main>
        <section className="hero" style={{ 
          position: 'relative', 
          overflow: 'hidden',
          backgroundImage: `url(${getImageUrl(undefined, 'building', 0)})`,
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
              <h1>Тавтай морилно уу</h1>
              <p>Манай компанийн албан ёсны вэбсайтад тавтай морилно уу</p>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '2rem', fontWeight: 'normal', opacity: 0.9 }}>
                Бид заслын шинэлэг шийдлийг төслүүддээ шингээж орчин үеийн технологийг нэвтруүлээд байна
              </h4>
              <Link href="/contact" className="btn">
                Холбоо барих
              </Link>
            </AnimateOnScroll>
          </div>
        </section>

        {companyInfo.data && (
          <section>
            <div className="container">
              <AnimateOnScroll>
                <h2 className="section-title">Бидний тухай</h2>
              </AnimateOnScroll>
              <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <AnimateOnScroll delay={100}>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                    {companyInfo.data.aboutUs || 'Бидний тухай мэдээлэл...'}
                  </p>
                </AnimateOnScroll>
                {companyInfo.data.vision && (
                  <AnimateOnScroll delay={200}>
                    <div style={{ marginBottom: '2rem' }}>
                      <h3>Алсын хараа</h3>
                      <p>{companyInfo.data.vision}</p>
                    </div>
                  </AnimateOnScroll>
                )}
                {companyInfo.data.mission && (
                  <AnimateOnScroll delay={300}>
                    <div>
                      <h3>Зорилго</h3>
                      <p>{companyInfo.data.mission}</p>
                    </div>
                  </AnimateOnScroll>
                )}
              </div>
            </div>
          </section>
        )}

        {services.data && services.data.length > 0 && (
          <section style={{ background: '#fafafa' }}>
            <div className="container">
              <AnimateOnScroll>
                <h2 className="section-title">Үйлчилгээнүүд</h2>
              </AnimateOnScroll>
              <div className="grid">
                {services.data.slice(0, 3).map((service: any, index: number) => {
                  const imageUrl = getImageUrl(service.image, 'service', index);
                  return (
                  <AnimateOnScroll key={service.id} delay={index * 100}>
                    <div className="card">
                      <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
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
              <AnimateOnScroll delay={400}>
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <Link href="/services" className="btn btn-secondary">
                    Бүх үйлчилгээ
                  </Link>
                </div>
              </AnimateOnScroll>
            </div>
          </section>
        )}

        {projects.data && projects.data.length > 0 && (
          <section>
            <div className="container">
              <AnimateOnScroll>
                <h2 className="section-title">Төслүүд</h2>
              </AnimateOnScroll>
              <div className="grid">
                {projects.data.slice(0, 3).map((project: any, index: number) => {
                  const imageUrl = getImageUrl(project.image, 'building', index);
                  return (
                  <AnimateOnScroll key={project.id} delay={index * 100}>
                    <div className="card">
                      <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
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
              <AnimateOnScroll delay={400}>
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <Link href="/projects" className="btn btn-secondary">
                    Бүх төслүүд
                  </Link>
                </div>
              </AnimateOnScroll>
            </div>
          </section>
        )}

        {news.data && news.data.length > 0 && (
          <section style={{ background: '#fafafa' }}>
            <div className="container">
              <AnimateOnScroll>
                <h2 className="section-title">Сүүлийн мэдээ</h2>
              </AnimateOnScroll>
              <div className="grid">
                {news.data.map((item: any, index: number) => {
                  const imageUrl = getImageUrl(item.image, 'news', index);
                  return (
                  <AnimateOnScroll key={item.id} delay={index * 100}>
                    <div className="card">
                      <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
                        <Image
                          src={imageUrl}
                          alt={item.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{ marginBottom: '1rem' }}>{item.title}</h3>
                      {item.excerpt && (
                        <p style={{ marginBottom: '1rem', color: '#666' }}>{item.excerpt}</p>
                      )}
                      <Link href={`/news/${item.slug}`} className="btn">
                        Унших
                      </Link>
                    </div>
                  </div>
                  </AnimateOnScroll>
                  );
                })}
              </div>
              <AnimateOnScroll delay={400}>
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <Link href="/news" className="btn btn-secondary">
                    Бүх мэдээ
                  </Link>
                </div>
              </AnimateOnScroll>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
