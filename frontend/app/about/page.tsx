import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { getCompanyInfo, getTeamMembers } from '@/lib/api';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagePlaceholder';

// Force dynamic rendering to prevent build-time static generation errors
export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const [companyInfo, teamMembers] = await Promise.all([
    getCompanyInfo().catch(() => ({ data: null })),
    getTeamMembers().catch(() => ({ data: [] })),
  ]);

  return (
    <>
      <Header />
      <main>
        <section className="hero" style={{ 
          position: 'relative', 
          overflow: 'hidden',
          backgroundImage: `url(${getImageUrl(undefined, 'default', 1)})`,
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
              <h1>Бидний тухай</h1>
            </AnimateOnScroll>
          </div>
        </section>

        {companyInfo.data && (
          <section>
            <div className="container">
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {companyInfo.data.aboutUs && (
                  <AnimateOnScroll delay={100}>
                    <div style={{ marginBottom: '3rem' }}>
                      <h2 style={{ marginBottom: '1.5rem' }}>Бидний тухай</h2>
                      <p style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                        {companyInfo.data.aboutUs}
                      </p>
                    </div>
                  </AnimateOnScroll>
                )}

                {companyInfo.data.vision && (
                  <AnimateOnScroll delay={200}>
                    <div style={{ marginBottom: '3rem' }}>
                      <h2 style={{ marginBottom: '1.5rem' }}>Алсын хараа</h2>
                      <p style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                        {companyInfo.data.vision}
                      </p>
                    </div>
                  </AnimateOnScroll>
                )}

                {companyInfo.data.mission && (
                  <AnimateOnScroll delay={300}>
                    <div style={{ marginBottom: '3rem' }}>
                      <h2 style={{ marginBottom: '1.5rem' }}>Зорилго</h2>
                      <p style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                        {companyInfo.data.mission}
                      </p>
                    </div>
                  </AnimateOnScroll>
                )}

                {companyInfo.data.values && (
                  <AnimateOnScroll delay={400}>
                    <div style={{ marginBottom: '3rem' }}>
                      <h2 style={{ marginBottom: '1.5rem' }}>Үнэт зүйлс</h2>
                      <p style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                        {companyInfo.data.values}
                      </p>
                    </div>
                  </AnimateOnScroll>
                )}

                {companyInfo.data.history && (
                  <AnimateOnScroll delay={500}>
                    <div>
                      <h2 style={{ marginBottom: '1.5rem' }}>Түүх</h2>
                      <p style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                        {companyInfo.data.history}
                      </p>
                    </div>
                  </AnimateOnScroll>
                )}
              </div>
            </div>
          </section>
        )}

        {teamMembers.data && teamMembers.data.length > 0 && (
          <section style={{ background: '#fafafa' }}>
            <div className="container">
              <AnimateOnScroll>
                <h2 className="section-title">Манай баг</h2>
              </AnimateOnScroll>
              <div className="grid">
                {teamMembers.data.map((member: any, index: number) => {
                  const imageUrl = getImageUrl(member.image, 'team', index);
                  return (
                  <AnimateOnScroll key={member.id} delay={index * 100}>
                    <div className="card" style={{ textAlign: 'center' }}>
                      <div style={{ 
                        position: 'relative', 
                        width: '150px', 
                        height: '150px', 
                        borderRadius: '50%',
                        margin: '1.5rem auto',
                        overflow: 'hidden',
                      }}>
                        <Image
                          src={imageUrl}
                          alt={member.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="150px"
                        />
                      </div>
                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{ marginBottom: '0.5rem' }}>{member.name}</h3>
                      <p style={{ color: 'var(--primary-orange, #FF6B35)', marginBottom: '1rem', fontWeight: '500' }}>
                        {member.position}
                      </p>
                      {member.bio && <p style={{ color: '#666', fontSize: '0.9rem' }}>{member.bio}</p>}
                    </div>
                  </div>
                  </AnimateOnScroll>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
