
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { publicApi, events, blog, sermons, services } from '../services/api';
import toast from 'react-hot-toast';
import { C, Btn, Badge, Card, SectionHeading, Input, Textarea, OrthodoxCross, Divider } from './Layout';

const img = (id, w = 800, h = 500) => `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format`;

// Helper function to extract data from API response
const extractData = (response) => {
  if (!response) return null;
  if (response.data?.data !== undefined) return response.data.data;
  if (response.data !== undefined) return response.data;
  return response;
};

const extractArray = (response, defaultValue = []) => {
  const data = extractData(response);
  return Array.isArray(data) ? data : defaultValue;
};

const extractObject = (response, defaultValue = {}) => {
  const data = extractData(response);
  return typeof data === 'object' && data !== null && !Array.isArray(data) ? data : defaultValue;
};

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

export function HomePage() {
  const [homepageData, setHomepageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [testimonial, setTestimonial] = useState(0);
  const [services, setServices] = useState([]);

  // Helper function for image URLs
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('/')) {
      return `${process.env.VITE_API_URL || 'http://localhost:5000'}${imageUrl}`;
    }
    return imageUrl;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await publicApi.getHomepage();
        const data = extractObject(response);
        console.log('📊 Homepage data:', data);
        setHomepageData(data);
      } catch (error) {
        console.error('Error fetching homepage:', error);
        toast.error('Failed to load homepage data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await publicApi.getServices();
        const data = extractArray(response);
        console.log('📋 Homepage services:', data);
        setServices(data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  const testimonials = [
    { name: 'Selamawit Haile', role: 'Member since 2018', text: 'Mehbere Edomias has been a spiritual home for me since I arrived in Addis. The community prayer sessions and feast day celebrations have deepened my faith immensely.', img: img('photo-1725245997924-632b5673e18a', 100, 100) },
    { name: 'Tesfaye Bekele', role: 'Founding Member', text: 'Watching this association grow from a small prayer group to a vibrant community is a blessing I thank God for every day. The service to others here is truly Christ-like.', img: img('photo-1610455902773-f913b9d5a7d1', 100, 100) },
    { name: 'Alem Girma', role: 'Youth Ministry Leader', text: "The youth programs here have transformed so many young lives. We're not just preserving our Orthodox tradition — we're passing it on with love and joy.", img: img('photo-1725245997915-f9ef3912267f', 100, 100) },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.gray50 }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  const { summary, featuredBlogs, upcomingEvents } = homepageData || {};

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(to bottom, rgba(15,26,46,0.88) 0%, rgba(26,54,93,0.75) 100%), url(${img('photo-1732655398369-24cff6302efb', 1920, 1080)}) center/cover no-repeat` }}>
        <div className="text-center px-4 max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <OrthodoxCross size={56} color={C.gold} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight" style={{ color: '#fff', fontFamily: "'Playfair Display', serif", textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
            ማኅበረ ኤዶምያስ 
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#fff', fontFamily: "'Playfair Display', serif", textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
            Mahbere Edomias
          </h2>
          
         
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register">
              <Btn variant="gold">Join Our Community</Btn>
            </Link>
            <Link to="/about">
              <Btn variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-[#1a365d]">Learn More</Btn>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center pt-2">
            <div className="w-1 h-3 rounded-full" style={{ background: C.gold }} />
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20" style={{ background: C.gray50 }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading 
                eyebrow="ማን ነን / Who We Are" 
                title="በኦርቶዶክስ እምነት የተባበረ ቤተሰብ" 
                sub="ማኅበረ ኤዶምያስ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን የተመዘገበ መንፈሳዊ ማኅበር ነው — ጥንታዊ እምነትን በዘመናዊ ቁርጠኝነት ለመኖር የተገደሉ አማኞች ማኅበረሰብ ነን።"
              />
              <p className="text-sm leading-relaxed mb-6" style={{ color: C.gray600 }}>
                Mehbere Edomias is a registered spiritual association of the Ethiopian Orthodox Tewahdo Church — a community of believers committed to living the ancient faith with modern intentionality.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  ['✝️', 'እምነት / Faith', 'በኢትዮጵያ ኦርቶዶክስ ቤተ ክርስቲያን ጥንታዊ ትውፊት የተመሠረተ'],
                  ['🤝', 'ማኅበረሰብ / Community', 'በመንፈሳዊ እና በዕለት ተዕለት ሕይወት እርስ በርስ መደጋገፍ'],
                  ['🌍', 'አገልግሎት / Service', 'በፍቅር እና በርህራሄ ለተቸገሩ መድረስ']
                ].map(([icon, title, desc]) => (
                  <div key={title} className="text-center p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow" style={{ background: '#fff', border: `1px solid ${C.gray100}` }}>
                    <p className="text-2xl mb-2">{icon}</p>
                    <p className="text-sm font-semibold mb-1" style={{ color: C.blue }}>{title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: C.gray600 }}>{desc}</p>
                  </div>
                ))}
              </div>
              <Link to="/about">
                <Btn variant="primary">ሙሉ ታሪካችን ያንብቡ / Read Our Full Story →</Btn>
              </Link>
            </div>
            <div className="relative">
              <img 
  src="https://res.cloudinary.com/dfvmoabzt/image/upload/v1788976592/chruch3_vfzysw.jpg" 
  alt="Ethiopian Orthodox Church Ceremony / የኢትዮጵያ ኦርቶዶክስ ቤተ ክርስቲያን ሥርዓተ አምልኮ" 
  className="rounded-2xl w-full object-cover shadow-xl" 
  style={{ height: '400px' }}
/>
              <div className="absolute -bottom-4 -left-4 rounded-xl p-4 shadow-lg" style={{ background: C.blue }}>
                <p className="text-2xl font-bold" style={{ color: C.gold }}>ከ 2012 ጀምሮ</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>ከ6 ዓመታት በላይ አገልግሎት</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Over 6 years of service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20" style={{ background: '#fff' }}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading 
            eyebrow="አገልግሎታችን / Our Ministry" 
            title="መንፈሳዊ አገልግሎቶች" 
            sub="በኢትዮጵያ ኦርቶዶክስ ባሕል የተመሠረቱ የተለያዩ የማኅበረሰብ አገልግሎቶችን እናቀርባለን" 
            center 
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {services.length > 0 ? (
              services.map((service, index) => (
                <Card key={service._id || index} hover className="text-center shadow-md hover:shadow-xl transition-shadow">
                  <p className="text-3xl mb-3">{service.icon || '⛪'}</p>
                  <h3 className="text-base font-semibold mb-2" style={{ color: C.blue }}>{service.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: C.gray600 }}>
                    {service.description?.substring(0, 60)}...
                  </p>
                </Card>
              ))
            ) : (
              [
                ['⛪', 'Divine Liturgy / ቅዳሴ', 'Weekly Qiddase (Holy Eucharist) celebrated with reverence and tradition'],
                ['🕯️', 'Fasting / ጾም', "Observing the Church's 250+ fasting days as a community in prayer"],
                ['🎊', 'Feast Days / በዓላት', 'Celebrating the rich calendar of Ethiopian Orthodox feasts together'],
                ['🤲', 'Community Outreach / ማኅበረሰባዊ አገልግሎት', 'Serving the poor and marginalized as an act of faith and love'],
              ].map(([icon, title, desc]) => (
                <Card key={title} hover className="text-center shadow-md hover:shadow-xl transition-shadow">
                  <p className="text-3xl mb-3">{icon}</p>
                  <h3 className="text-base font-semibold mb-2" style={{ color: C.blue }}>{title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: C.gray600 }}>{desc}</p>
                </Card>
              ))
            )}
          </div>
          <div className="text-center">
            <Link to="/services">
              <Btn variant="outline">ሁሉንም አገልግሎቶች ይመልከቱ / View All Services</Btn>
            </Link>
          </div>
        </div>
      </section>

      

      {/* Blog Posts */}
      <section className="py-20" style={{ background: '#fff' }}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading eyebrow="Teachings & News / ትምህርቶች እና ዜናዎች" title="Latest from Our Blog / ከብሎጋችን የቅርብ ጊዜ" center />
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {featuredBlogs && featuredBlogs.length > 0 ? (
              featuredBlogs.slice(0, 3).map(p => {
                const imageUrl = getImageUrl(p.featuredImage);
                return (
                  <Link key={p._id} to={`/blog/${p.slug}`} className="block hover:no-underline">
                    <Card hover className="!p-0 overflow-hidden transition-shadow hover:shadow-xl shadow-md">
                      <div className="h-44 overflow-hidden bg-gray-100">
                        <img 
                          src={imageUrl || img('photo-1509021436665-8f07dbf5bf1d')} 
                          alt={p.title} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            e.target.src = img('photo-1509021436665-8f07dbf5bf1d');
                          }}
                        />
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-xs" style={{ color: C.gray400 }}>{new Date(p.publishedAt || p.createdAt).toLocaleDateString()}</p>
                          <span style={{ color: C.gray400 }}>·</span>
                          <p className="text-xs" style={{ color: C.gray400 }}>{p.readTime || 3} min read</p>
                        </div>
                        <h4 className="font-semibold text-sm leading-snug mb-2" style={{ color: C.blue }}>{p.title}</h4>
                        <p className="text-xs leading-relaxed line-clamp-3" style={{ color: C.gray600 }}>{p.excerpt || p.content?.substring(0, 100)}</p>
                      </div>
                    </Card>
                  </Link>
                );
              })
            ) : (
              <p className="text-center col-span-3" style={{ color: C.gray400 }}>No blog posts available.</p>
            )}
          </div>
          <div className="text-center">
            <Link to="/blog">
              <Btn variant="outline">Read All Posts / ሁሉንም ያንብቡ</Btn>
            </Link>
          </div>
        </div>
      </section>

      

      {/* Newsletter */}
      <section className="py-16" style={{ background: C.goldLight }}>
        <div className="max-w-xl mx-auto px-4 text-center">
          <OrthodoxCross size={36} color={C.blue} />
          <h2 className="text-2xl font-bold mt-4 mb-2" style={{ color: C.blue }}>Stay Spiritually Connected </h2>
          <p className="text-sm mb-6" style={{ color: C.gray600 }}>
            Subscribe to receive updates on events, feast days, spiritual teachings, and association news.
            <br />
            ስለ ዝግጅቶች፣ የበዓላት ቀናት፣ መንፈሳዊ ትምህርቶች እና የማኅበር ዜናዎች መረጃ ለማግኘት ይመዝገቡ።
          </p>
          {subscribed ? (
            <div className="py-4 px-6 rounded-xl" style={{ background: C.success, color: '#fff' }}>
              ✓ Thank you for subscribing! May God bless you.
              <br />
              ✓ ለደንብ ምዝገባዎ እናመሰግናለን! እግዚአብሔር ይባርክዎ!
            </div>
          ) : (
            <div className="flex gap-2">
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address / የኢሜል አድራሻዎ"
                className="flex-1 rounded-xl px-4 py-3 text-sm outline-none border"
                style={{ borderColor: 'rgba(26,54,93,0.2)', background: '#fff', color: C.blue }} />
              <Btn variant="primary" onClick={() => email && setSubscribed(true)}>Subscribe / ይመዝገቡ</Btn>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────

export function AboutPage() {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await publicApi.getHistory();
        const data = extractObject(response);
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.gray50 }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative py-28 flex items-center justify-center text-center"
        style={{ background: `linear-gradient(to bottom, rgba(15,26,46,0.85) 0%, rgba(26,54,93,0.8) 100%), url(${img('photo-1564732465131-478a336a21ad')}) center/cover` }}>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: C.gold }}>ታሪካችን / Our Story</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: '#fff' }}>የእምነት ጉዟችን</h1>
          <p className="text-lg" style={{ color: C.goldLight }}>የማኅበረ ኤዶምያስ ታሪክ / The Story of Mehbere Edomias</p>
        </div>
      </section>

      <section className="py-20" style={{ background: '#fff' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: C.gold }}>ስለ እኛ / About Us</p>
            <h2 className="text-3xl font-bold mb-4" style={{ color: C.blue, fontFamily: "'Playfair Display', serif" }}>
              ማኅበረ ኤዶምያስ ጠቅላላ ማኅበር
            </h2>
            <p className="text-sm max-w-3xl mx-auto leading-relaxed" style={{ color: C.gray600 }}>
              {history?.description || 'Mehbere Edomias is a registered spiritual association of the Ethiopian Orthodox Tewahdo Church — a community of believers committed to living the ancient faith with modern intentionality.'}
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-l-4" style={{ borderLeftColor: C.gold }}>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: C.gold }}>ተልዕኳችን / Our Mission</p>
              <h3 className="text-xl font-bold mb-3" style={{ color: C.blue }}>ለማገልገል፣ ለማምለክ እና በአንድነት ለማደግ</h3>
              <p className="text-sm leading-relaxed mb-3" style={{ color: C.gray600 }}>
                {history?.mission_amharic || 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያንን እምነትና ሥርዓት በመጠበቅ ከትውልድ ወደ ትውልድ ማስተላለፍ፣ የገጠር ገዳማትና አብያተ ክርስቲያናት አገልጋዮችን በቁሳቁስ፣ በገንዘብ እና በስልጠና መደገፍ፣ መንፈሳዊ ትምህርት ለሁሉም ማድረስ ነው።'}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: C.gray600 }}>
                {history?.mission || 'To preserve and transmit the faith and traditions of the Ethiopian Orthodox Tewahdo Church from generation to generation; to support rural clergy, monks, and priests through material, financial, and training assistance; and to ensure religious education reaches all.'}
              </p>
            </Card>

            <Card className="border-l-4" style={{ borderLeftColor: C.blue }}>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: C.blue }}>ራዕያችን / Our Vision</p>
              <h3 className="text-xl font-bold mb-3" style={{ color: C.blue }}>የበለጸገ የኦርቶዶክስ ማኅበረሰብ</h3>
              <p className="text-sm leading-relaxed mb-3" style={{ color: C.gray600 }}>
                {history?.vision_amharic || 'ምእመናን በእምነታቸው ጽኑዎች፣ ኃጢአትን የሚጸየፉ፣ ንስሐ የሚገቡ እንዲሆኑ ማድረግ፤ አባላትም ዕውቀታቸውንና ሀብታቸውን በማቀናጀት ለገጠር አብያተ ክርስቲያናት፣ ገዳማት እና ትምህርት ቤቶች አገልግሎት የሚሰጡበት የተባበረ ማኅበረሰብ መፍጠር ነው።'}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: C.gray600 }}>
                {history?.vision || 'To cultivate a community of faithful believers devoted to their faith, rejecting sin and practicing repentance; and to create a united community where members combine their knowledge and resources to serve rural churches, monasteries, and schools.'}
              </p>
            </Card>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {history?.values && history.values.length > 0 ? (
              history.values.map((v, i) => (
                <Card key={i} className="text-center">
                  <p className="text-3xl mb-3">{i === 0 ? '✝️' : i === 1 ? '🤝' : '🌍'}</p>
                  <h4 className="font-bold text-lg mb-2" style={{ color: C.blue }}>
                    {v.title_amharic || v.title}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: C.gray600 }}>
                    {v.description_amharic || v.description}
                  </p>
                </Card>
              ))
            ) : (
              <>
                <Card className="text-center">
                  <p className="text-3xl mb-3">✝️</p>
                  <h4 className="font-bold text-lg mb-2" style={{ color: C.blue }}>እምነት / Faith</h4>
                  <p className="text-sm leading-relaxed" style={{ color: C.gray600 }}>
                    በኢትዮጵያ ኦርቶዶክስ ቤተ ክርስቲያን ጥንታዊ ትውፊት የተመሠረተ / Rooted in the ancient tradition of the Ethiopian Orthodox Church
                  </p>
                </Card>
                <Card className="text-center">
                  <p className="text-3xl mb-3">🤝</p>
                  <h4 className="font-bold text-lg mb-2" style={{ color: C.blue }}>ማኅበረሰብ / Community</h4>
                  <p className="text-sm leading-relaxed" style={{ color: C.gray600 }}>
                    በመንፈሳዊ እና በዕለት ተዕለት ሕይወት እርስ በርስ መደጋገፍ / Supporting each other in spiritual and everyday life
                  </p>
                </Card>
                <Card className="text-center">
                  <p className="text-3xl mb-3">🌍</p>
                  <h4 className="font-bold text-lg mb-2" style={{ color: C.blue }}>አገልግሎት / Service</h4>
                  <p className="text-sm leading-relaxed" style={{ color: C.gray600 }}>
                    በፍቅር እና በርህራሄ ለተቸገሩ መድረስ / Reaching out to those in need with love and compassion
                  </p>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* License / Certificate Section */}
      <section className="py-20" style={{ background: C.gray50 }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: C.gold }}>
              ፍቃድ / License & Certification
            </p>
            <h2 className="text-3xl font-bold" style={{ color: C.blue, fontFamily: "'Playfair Display', serif" }}>
              የተመዘገበ ማኅበር
            </h2>
            <p className="text-sm mt-2" style={{ color: C.gray600 }}>
              በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን የማህበራት አስተዳዳር ደንብ ቁጥር 3/2015 መሠረት የተመዘገበ
            </p>
            <p className="text-sm" style={{ color: C.gray600 }}>
              Registered under the Ethiopian Orthodox Tewahdo Church Associations Administration Regulation No. 3/2015
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* License Image */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl" style={{ border: `4px solid ${C.gold}` }}>
                <img 
                  src="https://res.cloudinary.com/dfvmoabzt/image/upload/v1788966669/licence_svwxbg.jpg" 
                  alt="Mehbere Edomias License / ፍቃድ" 
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.src = img('photo-1611513940806-80d6ed9fd7cc', 600, 800);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-white text-xs font-semibold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    የማኅበረ ኤዶምያስ ምዝገባ የምስክር ወረቀት
                  </p>
                  <p className="text-white text-xs opacity-80" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    Mehbere Edomias Registration Certificate
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate Info */}
            <div className="text-left space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: C.goldLight }}>
                  <span className="text-lg">📜</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm" style={{ color: C.blue }}>የተመዘገበ ማኅበር / Registered Association</h4>
                  <p className="text-xs" style={{ color: C.gray600 }}>
                    ማኅበራችን በሕጋዊ መንገድ የተመዘገበ እና እውቅና ያገኘ መንፈሳዊ ማኅበር ነው።
                  </p>
                  <p className="text-xs" style={{ color: C.gray600 }}>
                    Our association is a legally registered and recognized spiritual association.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: C.goldLight }}>
                  <span className="text-lg">⛪</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm" style={{ color: C.blue }}>በቤተ ክርስቲያን እውቅና / Church Recognition</h4>
                  <p className="text-xs" style={{ color: C.gray600 }}>
                    በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን የማህበራት አስተዳዳር ደንብ መሠረት እውቅና ያገኘ ማኅበር ነው።
                  </p>
                  <p className="text-xs" style={{ color: C.gray600 }}>
                    Recognized under the Ethiopian Orthodox Tewahdo Church Associations Administration Regulation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: C.goldLight }}>
                  <span className="text-lg">🤝</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm" style={{ color: C.blue }}>ታማኝ አገልግሎት / Trusted Service</h4>
                  <p className="text-xs" style={{ color: C.gray600 }}>
                    በተለያዩ ሀገረ ስብከቶች እና አብያተ ክርስቲያናት እውቅና ያገኘ አገልግሎት እየሰጠን እንገኛለን።
                  </p>
                  <p className="text-xs" style={{ color: C.gray600 }}>
                    We provide trusted service recognized by various dioceses and churches.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl" style={{ background: C.goldLight, border: `1px solid ${C.gold}` }}>
                <p className="text-xs font-medium text-center" style={{ color: C.blue }}>
                  ⚜️ ማኅበረ ኤዶምያስ በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን የተመዘገበ እና እውቅና ያገኘ ጠቅላላ ማኅበር ነው።
                </p>
                <p className="text-xs text-center mt-1" style={{ color: C.blue }}>
                  ⚜️ Mehbere Edomias is a registered and recognized general association of the Ethiopian Orthodox Tewahdo Church.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


// ─── SERVICES PAGE ────────────────────────────────────────────────────────────

export function ServicesPage() {
  const [tab, setTab] = useState('All');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await publicApi.getServices();
        const data = extractArray(response);
        console.log('📋 Services from database:', data);
        setServices(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to load services');
        toast.error('Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Get unique service types from the data
  const getServiceTypes = () => {
    const types = services.map(s => s.type).filter(Boolean);
    return ['All', ...new Set(types)];
  };

  const tabs = getServiceTypes();
  const filtered = tab === 'All' ? services : services.filter(s => s.type === tab);

  const schedule = [
    { day: 'Sunday', time: '6:00 – 10:00 AM', name: 'Divine Liturgy (Qiddase)', location: 'Main Church Hall' },
    { day: 'Wednesday', time: '6:00 – 7:30 AM', name: 'Fasting Prayer', location: 'Prayer Room' },
    { day: 'Wednesday', time: '6:00 – 7:30 PM', name: 'Scripture Study', location: 'Conference Room' },
    { day: 'Friday', time: '6:00 – 7:30 AM', name: 'Fasting Prayer', location: 'Prayer Room' },
    { day: 'Saturday', time: '3:00 – 5:00 PM', name: 'Ge\'ez Language Class', location: 'Classroom A' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.gray50 }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.gray50 }}>
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-5xl mb-4">⚠️</p>
          <h2 className="text-2xl font-bold mb-2" style={{ color: C.blue }}>Unable to Load Services</h2>
          <p className="text-sm mb-6" style={{ color: C.gray600 }}>
            There was an error loading the services. Please try again later.
          </p>
          <Btn variant="primary" onClick={() => window.location.reload()}>
            Retry
          </Btn>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative py-24 text-center"
        style={{ background: `linear-gradient(rgba(15,26,46,0.85), rgba(26,54,93,0.8)), url(${img('photo-1697926156905-c4fcd0504936')}) center/cover` }}>
        <h1 className="text-4xl font-bold mb-3" style={{ color: '#fff' }}>Our Spiritual Services</h1>
        <p className="text-lg" style={{ color: C.goldLight }}>Growing Together in Orthodox Faith</p>
      </section>

      <section className="py-16" style={{ background: '#fff' }}>
        <div className="max-w-6xl mx-auto px-4">
          {/* Tabs */}
          {tabs.length > 1 && (
            <div className="flex gap-2 flex-wrap justify-center mb-10">
              {tabs.map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all capitalize"
                  style={{
                    background: tab === t ? C.blue : C.gray50,
                    color: tab === t ? C.gold : C.gray600,
                    border: `1px solid ${tab === t ? C.blue : C.gray100}`,
                  }}>
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Services Grid */}
          {filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filtered.map((s, index) => (
                <Card key={s._id || index} hover className="transition-all hover:shadow-xl">
                  <div className="text-4xl mb-3">{s.icon || '⛪'}</div>
                  {s.type && <Badge color="blue">{s.type}</Badge>}
                  <h3 className="font-bold text-lg mt-3 mb-2" style={{ color: C.blue }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: C.gray600 }}>{s.description}</p>
                  {s.schedule && (
                    <div className="flex items-center gap-2 text-xs font-medium mt-2 pt-2 border-t" style={{ color: C.gold, borderColor: C.gray100 }}>
                      <span>🕐</span>
                      <span>{s.schedule}</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No services found for this category.</p>
            </div>
          )}

          {/* Schedule Table - Keep this as static content */}
          
        </div>
      </section>
    </div>
  );
}

// ─── EVENTS PAGE ──────────────────────────────────────────────────────────────

export function EventsPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [typeFilter, setTypeFilter] = useState('All');
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await events.getAll({ limit: 100 });
        const data = extractArray(response);
        console.log('📅 Events:', data);
        setEventsList(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const types = ['All', 'liturgy', 'fasting', 'feast', 'seminar', 'conference', 'community_service', 'fundraising', 'other'];
  const filtered = typeFilter === 'All' ? eventsList : eventsList.filter(e => e.eventType === typeFilter);

  // Get image URL helper
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('/')) {
      return `${process.env.VITE_API_URL || 'http://localhost:5000'}${imageUrl}`;
    }
    return imageUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.gray50 }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative py-24 text-center"
        style={{ background: `linear-gradient(rgba(15,26,46,0.85), rgba(26,54,93,0.8)), url(${img('photo-1531058020387-3be344556be6')}) center/cover` }}>
        <h1 className="text-4xl font-bold mb-3" style={{ color: '#fff' }}>Upcoming Events</h1>
        <p className="text-lg" style={{ color: C.goldLight }}>Join Us in Worship and Fellowship</p>
      </section>

      <section className="py-16" style={{ background: '#fff' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex gap-2 flex-wrap">
              {types.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize"
                  style={{ background: typeFilter === t ? C.blue : C.gray50, color: typeFilter === t ? C.gold : C.gray600, border: `1px solid ${typeFilter === t ? C.blue : C.gray100}` }}>
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {(['grid', 'list']).map(v => (
                <button key={v} onClick={() => setViewMode(v)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ background: viewMode === v ? C.blue : C.gray50, color: viewMode === v ? C.gold : C.gray600 }}>
                  {v === 'grid' ? '⊞ Grid' : '☰ List'}
                </button>
              ))}
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.length > 0 ? (
                filtered.map(e => {
                  const imageUrl = getImageUrl(e.featuredImage);
                  return (
                    <Link key={e._id} to={`/events/${e._id}`} className="block hover:no-underline">
                      <Card hover className="!p-0 overflow-hidden transition-shadow hover:shadow-xl">
                        {imageUrl && (
                          <div className="h-48 overflow-hidden bg-gray-100">
                            <img 
                              src={imageUrl} 
                              alt={e.title}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              onError={(img) => {
                                img.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="p-5">
                          <div className="flex items-start gap-4 mb-3">
                            <div className="rounded-xl text-center py-2 px-3 shrink-0" style={{ background: C.blue, minWidth: '52px' }}>
                              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{new Date(e.date).toLocaleDateString('en', { month: 'short' })}</p>
                              <p className="text-2xl font-bold leading-none" style={{ color: C.gold }}>{new Date(e.date).getDate()}</p>
                            </div>
                            <div className="flex-1">
                              <Badge color={e.status === 'ongoing' ? 'gold' : 'blue'}>{e.status || 'Upcoming'}</Badge>
                              <h4 className="font-semibold text-sm mt-1 leading-snug" style={{ color: C.blue }}>{e.title}</h4>
                            </div>
                          </div>
                          <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: C.gray600 }}>{e.description?.substring(0, 100)}...</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs" style={{ color: C.gray400 }}>📍 {e.location?.name || 'TBD'}</p>
                            <p className="text-xs" style={{ color: C.gold }}>{e.eventType?.replace('_', ' ')}</p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })
              ) : (
                <p className="text-center col-span-3" style={{ color: C.gray400 }}>No events found</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.length > 0 ? (
                filtered.map(e => {
                  const imageUrl = getImageUrl(e.featuredImage);
                  return (
                    <Link key={e._id} to={`/events/${e._id}`} className="block hover:no-underline">
                      <div className="flex items-center gap-6 p-4 rounded-xl transition-all hover:shadow-md" style={{ background: C.gray50, border: `1px solid ${C.gray100}` }}>
                        {imageUrl && (
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                            <img 
                              src={imageUrl} 
                              alt={e.title}
                              className="w-full h-full object-cover"
                              onError={(img) => {
                                img.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="text-center py-2 px-3 rounded-xl shrink-0" style={{ background: C.blue, minWidth: '60px' }}>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{new Date(e.date).toLocaleDateString('en', { month: 'short' })}</p>
                          <p className="text-xl font-bold" style={{ color: C.gold }}>{new Date(e.date).getDate()}</p>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm" style={{ color: C.blue }}>{e.title}</h4>
                          <p className="text-xs mt-1" style={{ color: C.gray600 }}>📍 {e.location?.name || 'TBD'} · {e.eventType?.replace('_', ' ')}</p>
                        </div>
                        <Badge color={e.status === 'ongoing' ? 'gold' : 'blue'}>{e.status || 'Upcoming'}</Badge>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-center" style={{ color: C.gray400 }}>No events found</p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ─── EVENT DETAIL PAGE ────────────────────────────────────────────────────────

export function EventDetailPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await events.getById(eventId);
        const data = extractObject(response);
        console.log('📅 Event Detail:', data);
        setEvent(data);
        setError(null);

        if (data && data.eventType) {
          try {
            const relatedResponse = await events.getAll({ 
              type: data.eventType, 
              limit: 3 
            });
            const relatedData = extractArray(relatedResponse);
            setRelatedEvents(relatedData.filter(e => e._id !== eventId));
          } catch (err) {
            console.error('Error fetching related events:', err);
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Event not found');
        toast.error('Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }

    window.scrollTo(0, 0);
  }, [eventId]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('/')) {
      return `${process.env.VITE_API_URL || 'http://localhost:5000'}${imageUrl}`;
    }
    return imageUrl;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time) => {
    if (!time) return 'TBD';
    return time;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.gray50 }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.gray50 }}>
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-5xl mb-4">📅</p>
          <h2 className="text-2xl font-bold mb-2" style={{ color: C.blue }}>Event Not Found</h2>
          <p className="text-sm mb-6" style={{ color: C.gray600 }}>
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/events">
            <Btn variant="primary">Back to Events</Btn>
          </Link>
        </div>
      </div>
    );
  }

  const featuredImageUrl = getImageUrl(event.featuredImage);
  const fallbackImage = img('photo-1531058020387-3be344556be6');

  const statusColors = {
    upcoming: 'blue',
    ongoing: 'gold',
    completed: 'gray',
    cancelled: 'red',
  };

  return (
    <div>
      <section 
        className="relative py-24 flex items-center justify-center text-center"
        style={{ 
          background: `linear-gradient(rgba(15,26,46,0.85), rgba(26,54,93,0.8)), url(${featuredImageUrl || fallbackImage}) center/cover` 
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <Badge color={statusColors[event.status] || 'blue'}>{event.status || 'Upcoming'}</Badge>
          <h1 className="text-3xl md:text-5xl font-bold mt-4 mb-4 leading-tight" style={{ color: '#fff' }}>
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <span>📅 {formatDate(event.date)}</span>
            <span>·</span>
            <span>🕐 {formatTime(event.time)}</span>
            <span>·</span>
            <span>📍 {event.location?.name || 'TBD'}</span>
          </div>
        </div>
      </section>

      {featuredImageUrl && (
        <div className="relative w-full max-h-[500px] overflow-hidden bg-gray-100" style={{ marginTop: '-2px' }}>
          <img 
            src={featuredImageUrl} 
            alt={event.title}
            className="w-full h-full max-h-[500px] object-contain"
            onError={(e) => {
              e.target.src = fallbackImage;
              e.target.onerror = null;
            }}
          />
        </div>
      )}

      <section className="py-16" style={{ background: '#fff' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold mb-4" style={{ color: C.blue }}>About This Event</h2>
              <div className="text-base leading-relaxed" style={{ color: C.gray700 }}>
                {event.description?.split('\n').map((paragraph, index) => {
                  if (paragraph.trim()) {
                    return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>;
                  }
                  return null;
                })}
              </div>

              {(event.organizer || event.contactEmail || event.contactPhone) && (
                <div className="mt-8 p-4 rounded-xl" style={{ background: C.gray50 }}>
                  <h3 className="font-semibold text-sm mb-3" style={{ color: C.blue }}>Organizer Information</h3>
                  <div className="space-y-2 text-sm">
                    {event.organizer && <p><span className="font-medium">Organizer:</span> {event.organizer}</p>}
                    {event.contactEmail && <p><span className="font-medium">Email:</span> {event.contactEmail}</p>}
                    {event.contactPhone && <p><span className="font-medium">Phone:</span> {event.contactPhone}</p>}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Card>
                <h3 className="font-semibold text-sm mb-3" style={{ color: C.blue }}>Event Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs font-medium" style={{ color: C.gray400 }}>Date & Time</p>
                    <p style={{ color: C.gray700 }}>{formatDate(event.date)}</p>
                    {event.time && <p style={{ color: C.gray700 }}>⏰ {event.time}</p>}
                    {event.endDate && (
                      <p style={{ color: C.gray700 }}>Until {formatDate(event.endDate)}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: C.gray400 }}>Location</p>
                    <p style={{ color: C.gray700 }}>{event.location?.name || 'TBD'}</p>
                    {event.location?.address && (
                      <p className="text-xs" style={{ color: C.gray600 }}>{event.location.address}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: C.gray400 }}>Type</p>
                    <Badge color="blue">{event.eventType?.replace('_', ' ') || 'Other'}</Badge>
                  </div>
                  {event.isVirtual && (
                    <div>
                      <p className="text-xs font-medium" style={{ color: C.gray400 }}>Virtual Event</p>
                      {event.meetingLink && (
                        <a 
                          href={event.meetingLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Join Meeting →
                        </a>
                      )}
                    </div>
                  )}
                  {event.capacity && (
                    <div>
                      <p className="text-xs font-medium" style={{ color: C.gray400 }}>Capacity</p>
                      <p style={{ color: C.gray700 }}>{event.registeredCount || 0} / {event.capacity} registered</p>
                    </div>
                  )}
                </div>
              </Card>

              <Btn variant="primary" className="w-full">
                Register for Event
              </Btn>

              <Link to="/events">
                <Btn variant="outline" className="w-full">← Back to Events</Btn>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {relatedEvents.length > 0 && (
        <section className="py-16" style={{ background: C.gray50 }}>
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-2xl font-bold mb-8 text-center" style={{ color: C.blue }}>
              Similar Events
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedEvents.map(e => {
                const imageUrl = getImageUrl(e.featuredImage);
                return (
                  <Link key={e._id} to={`/events/${e._id}`} className="block hover:no-underline">
                    <Card hover className="!p-0 overflow-hidden transition-shadow hover:shadow-xl">
                      {imageUrl && (
                        <div className="h-40 overflow-hidden bg-gray-100">
                          <img 
                            src={imageUrl} 
                            alt={e.title} 
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            onError={(img) => {
                              img.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <Badge color={e.status === 'ongoing' ? 'gold' : 'blue'}>{e.status || 'Upcoming'}</Badge>
                        <h4 className="font-semibold text-sm mt-2 mb-1 leading-snug" style={{ color: C.blue }}>
                          {e.title}
                        </h4>
                        <p className="text-xs line-clamp-2" style={{ color: C.gray600 }}>
                          {e.description?.substring(0, 80)}...
                        </p>
                        <div className="flex items-center gap-2 text-xs mt-2" style={{ color: C.gray400 }}>
                          <span>📅 {new Date(e.date).toLocaleDateString()}</span>
                          <span>·</span>
                          <span>📍 {e.location?.name || 'TBD'}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ─── BLOG PAGE ────────────────────────────────────────────────────────────────

export function BlogPage() {
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await blog.getPublished({ limit: 100 });
        const data = extractArray(response);
        console.log('📝 Blog Posts:', data);
        setBlogPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        toast.error('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const cats = ['All', 'spiritual_teaching', 'association_news', 'event_recap', 'announcement'];
  const filtered = blogPosts
    .filter(p => cat === 'All' || p.category === cat)
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.gray50 }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  const featured = blogPosts.find(p => p.isFeatured) || blogPosts[0];

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('/')) {
      return `${process.env.VITE_API_URL || 'http://localhost:5000'}${imageUrl}`;
    }
    return imageUrl;
  };

  return (
    <div>
      <section className="relative py-24 text-center"
        style={{ background: `linear-gradient(rgba(15,26,46,0.85), rgba(26,54,93,0.8)), url(${img('photo-1497621122273-f5cfb6065c56')}) center/cover` }}>
        <h1 className="text-4xl font-bold mb-3" style={{ color: '#fff' }}>Blog & News</h1>
        <p className="text-lg" style={{ color: C.goldLight }}>Spiritual Teachings and Association Updates</p>
      </section>

      <section className="py-16" style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4">
          {featured && (
            <div className="mb-12 rounded-2xl overflow-hidden grid md:grid-cols-2 gap-0 shadow-xl">
              <div className="h-64 md:h-auto overflow-hidden bg-gray-100">
                <img 
                  src={getImageUrl(featured.featuredImage) || img('photo-1509021436665-8f07dbf5bf1d')} 
                  alt={featured.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.src = img('photo-1509021436665-8f07dbf5bf1d');
                  }}
                />
              </div>
              <div className="p-8 flex flex-col justify-center" style={{ background: C.blue }}>
                <Badge color="gold">Featured · {featured.category?.replace('_', ' ')}</Badge>
                <h2 className="text-2xl font-bold mt-3 mb-3 leading-snug" style={{ color: '#fff' }}>{featured.title}</h2>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.7)' }}>{featured.excerpt || featured.content?.substring(0, 150)}</p>
                <div className="flex items-center gap-2 text-xs mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <span>{featured.authorId?.fullName || 'Admin'}</span>
                  <span>·</span>
                  <span>{new Date(featured.publishedAt || featured.createdAt).toLocaleDateString()}</span>
                  <span>·</span>
                  <span>{featured.readTime || 3} min read</span>
                </div>
                <Link to={`/blog/${featured.slug}`}>
                  <Btn variant="gold">Read Full Article →</Btn>
                </Link>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-3">
              <div className="flex gap-2 flex-wrap mb-8">
                {cats.map(c => (
                  <button key={c} onClick={() => setCat(c)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize"
                    style={{ background: cat === c ? C.blue : C.gray50, color: cat === c ? C.gold : C.gray600, border: `1px solid ${cat === c ? C.blue : C.gray100}` }}>
                    {c.replace('_', ' ')}
                  </button>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {filtered.length > 0 ? (
                  filtered.map(p => {
                    const imageUrl = getImageUrl(p.featuredImage);
                    return (
                      <Link key={p._id} to={`/blog/${p.slug}`} className="block hover:no-underline">
                        <Card hover className="!p-0 overflow-hidden transition-shadow hover:shadow-xl">
                          <div className="h-40 overflow-hidden bg-gray-100">
                            <img 
                              src={imageUrl || img('photo-1509021436665-8f07dbf5bf1d')} 
                              alt={p.title} 
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              onError={(e) => {
                                e.target.src = img('photo-1509021436665-8f07dbf5bf1d');
                              }}
                            />
                          </div>
                          <div className="p-5">
                            <Badge color="blue">{p.category?.replace('_', ' ')}</Badge>
                            <h4 className="font-semibold text-sm mt-2 mb-2 leading-snug" style={{ color: C.blue }}>{p.title}</h4>
                            <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: C.gray600 }}>{p.excerpt || p.content?.substring(0, 100)}</p>
                            <div className="flex items-center gap-2 text-xs" style={{ color: C.gray400 }}>
                              <span>{p.authorId?.fullName || 'Admin'}</span>
                              <span>·</span>
                              <span>{new Date(p.publishedAt || p.createdAt).toLocaleDateString()}</span>
                              <span>·</span>
                              <span>{p.readTime || 3} min read</span>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })
                ) : (
                  <p className="text-center col-span-2" style={{ color: C.gray400 }}>No blog posts found</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <Card>
                <p className="font-semibold text-sm mb-3" style={{ color: C.blue }}>Search</p>
                <input 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  placeholder="Search posts…"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                  style={{ borderColor: C.gray100, color: C.gray800 }} 
                />
              </Card>
              <Card>
                <p className="font-semibold text-sm mb-3" style={{ color: C.blue }}>Categories</p>
                {cats.filter(c => c !== 'All').map(c => (
                  <button 
                    key={c} 
                    onClick={() => setCat(c)} 
                    className="block w-full text-left py-1.5 text-sm border-b last:border-0 capitalize"
                    style={{ color: cat === c ? C.gold : C.gray600, borderColor: C.gray100 }}
                  >
                    {c.replace('_', ' ')}
                  </button>
                ))}
              </Card>
              <Card>
                <p className="font-semibold text-sm mb-3" style={{ color: C.blue }}>Recent Posts</p>
                {blogPosts.slice(0, 3).map(p => {
                  const imageUrl = getImageUrl(p.featuredImage);
                  return (
                    <Link key={p._id} to={`/blog/${p.slug}`} className="block hover:no-underline">
                      <div className="flex gap-3 py-2 border-b last:border-0 hover:bg-gray-50 px-2 -mx-2 rounded transition-colors" style={{ borderColor: C.gray100 }}>
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <img 
                            src={imageUrl || img('photo-1509021436665-8f07dbf5bf1d', 100, 100)} 
                            alt={p.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = img('photo-1509021436665-8f07dbf5bf1d', 100, 100);
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium leading-snug mb-0.5 line-clamp-2" style={{ color: C.blue }}>{p.title}</p>
                          <p className="text-xs" style={{ color: C.gray400 }}>{new Date(p.publishedAt || p.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── BLOG DETAIL PAGE ─────────────────────────────────────────────────────────

export function BlogDetailPage() {
  const { slug } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        const response = await blog.getBySlug(slug);
        const data = extractObject(response);
        console.log('📝 Blog Post Data:', data);
        setBlogPost(data);
        setError(null);

        if (data && data.category) {
          try {
            const relatedResponse = await blog.getPublished({ 
              category: data.category, 
              limit: 3 
            });
            const relatedData = extractArray(relatedResponse);
            setRelatedPosts(relatedData.filter(p => p.slug !== slug));
          } catch (err) {
            console.error('Error fetching related posts:', err);
          }
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('Blog post not found');
        toast.error('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogPost();
    }

    window.scrollTo(0, 0);
  }, [slug]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('/')) {
      return `${process.env.VITE_API_URL || 'http://localhost:5000'}${imageUrl}`;
    }
    return imageUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.gray50 }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.gray50 }}>
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-5xl mb-4">📄</p>
          <h2 className="text-2xl font-bold mb-2" style={{ color: C.blue }}>Blog Post Not Found</h2>
          <p className="text-sm mb-6" style={{ color: C.gray600 }}>
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blog">
            <Btn variant="primary">Back to Blog</Btn>
          </Link>
        </div>
      </div>
    );
  }

  const featuredImageUrl = getImageUrl(blogPost.featuredImage);
  const fallbackImage = img('photo-1509021436665-8f07dbf5bf1d');

  return (
    <div>
      <section 
        className="relative py-24 flex items-center justify-center text-center"
        style={{ 
          background: `linear-gradient(rgba(15,26,46,0.85), rgba(26,54,93,0.8)), url(${featuredImageUrl || fallbackImage}) center/cover` 
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <Badge color="gold">{blogPost.category?.replace('_', ' ') || 'Blog Post'}</Badge>
          <h1 className="text-3xl md:text-5xl font-bold mt-4 mb-4 leading-tight" style={{ color: '#fff' }}>
            {blogPost.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <span>By {blogPost.authorId?.fullName || 'Admin'}</span>
            <span>·</span>
            <span>{new Date(blogPost.publishedAt || blogPost.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
            <span>·</span>
            <span>{blogPost.readTime || 3} min read</span>
            <span>·</span>
            <span>👁 {blogPost.views || 0} views</span>
          </div>
        </div>
      </section>

      {featuredImageUrl && (
        <div className="relative w-full max-h-[500px] overflow-hidden bg-gray-100" style={{ marginTop: '-2px' }}>
          <img 
            src={featuredImageUrl} 
            alt={blogPost.title}
            className="w-full h-full max-h-[500px] object-contain"
            onError={(e) => {
              e.target.src = fallbackImage;
              e.target.onerror = null;
            }}
          />
        </div>
      )}

      <section className="py-16" style={{ background: '#fff' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-base leading-relaxed" style={{ color: C.gray700 }}>
            {blogPost.content?.split('\n').map((paragraph, index) => {
              if (paragraph.trim()) {
                return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>;
              }
              return null;
            })}
          </div>

          {blogPost.tags && blogPost.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t" style={{ borderColor: C.gray100 }}>
              <p className="text-sm font-semibold mb-3" style={{ color: C.blue }}>Tags</p>
              <div className="flex flex-wrap gap-2">
                {blogPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{ background: C.gray50, color: C.gray600 }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t" style={{ borderColor: C.gray100 }}>
            <p className="text-sm font-semibold mb-3" style={{ color: C.blue }}>Share this article</p>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: '📘', name: 'Facebook', color: '#1877f2' },
                { icon: '🐦', name: 'Twitter', color: '#1da1f2' },
                { icon: '💼', name: 'LinkedIn', color: '#0a66c2' },
                { icon: '📧', name: 'Email', color: '#ea4335' },
              ].map((social) => (
                <button
                  key={social.name}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                  style={{ 
                    background: C.gray50, 
                    border: `1px solid ${C.gray100}`,
                    color: C.gray600 
                  }}
                  onClick={() => {
                    const url = window.location.href;
                    const text = `Check out this article: ${blogPost.title}`;
                    let shareUrl = '';
                    switch(social.name) {
                      case 'Facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                        break;
                      case 'Twitter':
                        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                        break;
                      case 'LinkedIn':
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                        break;
                      case 'Email':
                        shareUrl = `mailto:?subject=${encodeURIComponent(blogPost.title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
                        break;
                      default:
                        return;
                    }
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                  }}
                >
                  {social.icon} {social.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 pt-6 border-t flex flex-wrap items-center justify-between gap-4" style={{ borderColor: C.gray100 }}>
            <Link to="/blog">
              <Btn variant="outline">← Back to Blog</Btn>
            </Link>
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="py-16" style={{ background: C.gray50 }}>
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-2xl font-bold mb-8 text-center" style={{ color: C.blue }}>
              Related Articles
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map(post => {
                const imageUrl = getImageUrl(post.featuredImage);
                return (
                  <Link key={post._id} to={`/blog/${post.slug}`} className="block hover:no-underline">
                    <Card hover className="!p-0 overflow-hidden transition-shadow hover:shadow-xl">
                      <div className="h-48 overflow-hidden bg-gray-100">
                        <img 
                          src={imageUrl || img('photo-1509021436665-8f07dbf5bf1d')} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            e.target.src = img('photo-1509021436665-8f07dbf5bf1d');
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <Badge color="blue">{post.category?.replace('_', ' ')}</Badge>
                        <h4 className="font-semibold text-sm mt-2 mb-1 leading-snug" style={{ color: C.blue }}>
                          {post.title}
                        </h4>
                        <p className="text-xs line-clamp-2" style={{ color: C.gray600 }}>
                          {post.excerpt || post.content?.substring(0, 80)}...
                        </p>
                        <div className="flex items-center gap-2 text-xs mt-2" style={{ color: C.gray400 }}>
                          <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                          <span>·</span>
                          <span>{post.readTime || 3} min read</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ─── SERMONS PAGE ─────────────────────────────────────────────────────────────

export function SermonsPage() {
  const [typeFilter, setTypeFilter] = useState('All');
  const [sermonsList, setSermonsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const response = await sermons.getPublic({ limit: 100 });
        const data = extractArray(response);
        setSermonsList(data);
      } catch (error) {
        console.error('Error fetching sermons:', error);
        toast.error('Failed to load sermons');
      } finally {
        setLoading(false);
      }
    };
    fetchSermons();
  }, []);

  const types = ['All', 'video', 'audio', 'text', 'pdf'];
  const filtered = sermonsList.filter(s => typeFilter === 'All' || s.sermonType === typeFilter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.gray50 }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative py-24 text-center"
        style={{ background: `linear-gradient(rgba(15,26,46,0.88), rgba(26,54,93,0.82)), url(${img('photo-1437603568260-1950d3ca6eab')}) center/cover` }}>
        <h1 className="text-4xl font-bold mb-3" style={{ color: '#fff' }}>Sermon Library</h1>
        <p className="text-lg" style={{ color: C.goldLight }}>Growing in God's Word</p>
      </section>

      <section className="py-16" style={{ background: '#fff' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <div className="flex gap-2 flex-wrap">
              {types.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all capitalize"
                  style={{ background: typeFilter === t ? C.blue : C.gray50, color: typeFilter === t ? C.gold : C.gray600, border: `1px solid ${typeFilter === t ? C.blue : C.gray100}` }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {filtered.length > 0 && (
            <div className="mb-10 rounded-2xl overflow-hidden grid md:grid-cols-2 shadow-xl" style={{ border: `1px solid ${C.gray100}` }}>
              <div className="relative h-56 md:h-auto overflow-hidden">
                <img src={filtered[0].thumbnail || img('photo-1564732465131-478a336a21ad', 640, 360)} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="p-8">
                <Badge color="gold">Featured Sermon</Badge>
                <h3 className="text-xl font-bold mt-3 mb-2" style={{ color: C.blue }}>{filtered[0].title}</h3>
                <p className="text-sm mb-1" style={{ color: C.gray600 }}>By {filtered[0].preacher}</p>
                <p className="text-xs mb-4" style={{ color: C.gray400 }}>{filtered[0].dateDelivered ? new Date(filtered[0].dateDelivered).toLocaleDateString() : 'N/A'} · 👁 {filtered[0].views || 0} views</p>
                <div className="flex gap-3">
                  <Btn variant="primary">▶ Play</Btn>
                  <Btn variant="outline">⬇ Download</Btn>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(1).length > 0 ? (
              filtered.slice(1).map(s => (
                <Card key={s._id} hover className="!p-0 overflow-hidden">
                  <div className="h-36 relative overflow-hidden">
                    <img src={s.thumbnail || img('photo-1509021436665-8f07dbf5bf1d', 640, 360)} alt={s.title} className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(15,26,46,0.35)' }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: C.gold, color: C.blue }}>
                        {s.sermonType === 'pdf' ? '📋' : s.sermonType === 'text' ? '📄' : '▶'}
                      </div>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge color="blue">{s.sermonType}</Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-sm mb-1 leading-snug" style={{ color: C.blue }}>{s.title}</h4>
                    <p className="text-xs mb-2" style={{ color: C.gray600 }}>{s.preacher}</p>
                    <div className="flex items-center justify-between text-xs" style={{ color: C.gray400 }}>
                      <span>{s.dateDelivered ? new Date(s.dateDelivered).toLocaleDateString() : 'N/A'} · {s.duration || 'N/A'}</span>
                      <span>👁 {s.views || 0}</span>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center col-span-3" style={{ color: C.gray400 }}>No sermons found</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── DONATE PAGE ──────────────────────────────────────────────────────────────

export function DonatePage() {
  const [faqOpen, setFaqOpen] = useState(null);
  const [copied, setCopied] = useState(false);

  const faqs = [
    { q: 'Is my donation tax deductible?', a: 'Mehbere Edomias is a registered spiritual association. Please consult your local tax authority regarding deductibility. We can provide official receipts for all verified donations.' },
    { q: 'How long does verification take?', a: 'Our team reviews and verifies donation receipts within 1–3 business days. You will receive a notification in your member account once verified.' },
    { q: 'Can I donate anonymously?', a: 'Yes. When submitting your receipt, you may mark it as anonymous and your name will not appear in public acknowledgements.' },
    { q: 'What if my receipt is rejected?', a: 'You will receive a notification explaining the reason. Common issues include unclear images or mismatched amounts. You may resubmit a corrected receipt.' },
  ];

  return (
    <div>
      <section className="relative py-24 text-center"
        style={{ background: `linear-gradient(rgba(15,26,46,0.88), rgba(26,54,93,0.82)), url(${img('photo-1611513940806-80d6ed9fd7cc')}) center/cover` }}>
        <h1 className="text-4xl font-bold mb-3" style={{ color: '#fff' }}>Support Our Mission</h1>
        <p className="text-lg" style={{ color: C.goldLight }}>Your Generosity Makes a Difference</p>
      </section>

      <section className="py-20" style={{ background: '#fff' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10">
            <Card style={{ border: `2px solid ${C.gold}` }}>
              <div className="flex items-center gap-2 mb-5">
                <OrthodoxCross size={24} color={C.gold} />
                <h3 className="text-lg font-bold" style={{ color: C.blue }}>Bank Transfer Details</h3>
              </div>
              <div className="flex flex-col gap-3 text-sm">
                {[
                  ['Bank Name', 'Commercial Bank of Ethiopia'],
                  ['Account Name', 'Mehbere Edomias Spiritual Association'],
                  ['Account Number', '1000-XXXX-XXXX-XX'],
                  ['Reference', 'Your Full Name + Phone Number'],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between py-2 border-b" style={{ borderColor: C.gray100 }}>
                    <span className="font-medium" style={{ color: C.gray600 }}>{label}</span>
                    <span className="font-semibold text-right max-w-[55%]" style={{ color: C.blue }}>{val}</span>
                  </div>
                ))}
              </div>
              <Btn variant="gold" className="w-full mt-5" onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                {copied ? '✓ Copied!' : '📋 Copy Details'}
              </Btn>
            </Card>

            <div>
              <h3 className="text-lg font-bold mb-5" style={{ color: C.blue }}>How to Donate</h3>
              {[
                { step: 1, title: 'Transfer to Our Bank Account', desc: 'Use the bank details on the left to make your transfer. Include your name and phone as reference.' },
                { step: 2, title: 'Take a Screenshot', desc: 'Capture a clear screenshot or photo of your transaction confirmation from your banking app.' },
                { step: 3, title: 'Upload Your Receipt', desc: 'Log in to your member account and submit your receipt under "My Donations → Submit Donation."', note: 'Member login required' },
              ].map(s => (
                <div key={s.step} className="flex gap-4 mb-6 last:mb-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5"
                    style={{ background: C.blue, color: C.gold }}>{s.step}</div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1" style={{ color: C.blue }}>{s.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: C.gray600 }}>{s.desc}</p>
                    {s.note && <p className="text-xs mt-1 font-medium" style={{ color: C.gold }}>⚠ {s.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <SectionHeading eyebrow="Questions" title="Donation FAQ" center />
            <div className="flex flex-col gap-2">
              {faqs.map((f, i) => (
                <div key={i} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.gray100}` }}>
                  <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-left"
                    style={{ color: C.blue, background: faqOpen === i ? C.gray50 : '#fff' }}>
                    {f.q}
                    <span style={{ color: C.gold }}>{faqOpen === i ? '−' : '+'}</span>
                  </button>
                  {faqOpen === i && (
                    <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: C.gray600 }}>{f.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await publicApi.submitContact(formData);
      setSubmitted(true);
      toast.success('Message sent successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send message';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="relative py-24 text-center"
        style={{ background: `linear-gradient(rgba(15,26,46,0.85), rgba(26,54,93,0.8)), url(${img('photo-1650897166539-21e92ba28bbc')}) center/cover` }}>
        <h1 className="text-4xl font-bold mb-3" style={{ color: '#fff' }}>Get in Touch</h1>
        <p className="text-lg" style={{ color: C.goldLight }}>We'd Love to Hear From You</p>
      </section>

      <section className="py-20" style={{ background: '#fff' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card>
              <h3 className="text-xl font-bold mb-5" style={{ color: C.blue }}>Send Us a Message</h3>
              {submitted ? (
                <div className="text-center py-10">
                  <p className="text-4xl mb-3">✉️</p>
                  <h4 className="font-bold text-lg mb-2" style={{ color: C.blue }}>Message Sent!</h4>
                  <p className="text-sm" style={{ color: C.gray600 }}>Thank you for reaching out. We will respond within 2 business days.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Full Name" name="name" required placeholder="Your name" value={formData.name} onChange={handleChange} />
                    <Input label="Phone" name="phone" placeholder="+251 9XX XXX XXX" value={formData.phone} onChange={handleChange} />
                  </div>
                  <Input label="Email Address" name="email" required type="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} />
                  <Input label="Subject" name="subject" required placeholder="What is this about?" value={formData.subject} onChange={handleChange} />
                  <Textarea label="Message" name="message" required rows={5} placeholder="Write your message here…" value={formData.message} onChange={handleChange} />
                  <Btn variant="primary" type="submit" disabled={loading} className="w-full">
                    {loading ? 'Sending...' : 'Send Message'}
                  </Btn>
                </form>
              )}
            </Card>

            <div>
              <h3 className="text-xl font-bold mb-6" style={{ color: C.blue }}>Contact Information</h3>
              {[
                { icon: '📞', label: 'Phone', val: '+251 967722490', note: 'Mon–Fri, 9 AM – 5 PM' },
                { icon: '📞', label: 'Phone', val: '+251 904199155', note: 'Mon–Fri, 9 AM – 5 PM' },
                { icon: '📞', label: 'Phone', val: '+251 944067097', note: 'Mon–Fri, 9 AM – 5 PM' },
                { icon: '✉️', label: 'Email', val: 'singiten2127@gmail.com', note: 'Response within 48 hours' },
                { icon: '📍', label: 'Address', val: '4Kilo Abenezer blg 4th floor office No-19, Addis Ababa, Ethiopia', note: 'Near St. Gabriel Church' },
              ].map(c => (
                <div key={c.label} className="flex gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
                    style={{ background: C.goldLight }}>{c.icon}</div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: C.gold }}>{c.label}</p>
                    <p className="font-medium text-sm" style={{ color: C.blue }}>{c.val}</p>
                    <p className="text-xs" style={{ color: C.gray400 }}>{c.note}</p>
                  </div>
                </div>
              ))}

              <Divider />

              <div className="mt-6 rounded-xl overflow-hidden" style={{ height: '200px', background: C.gray100 }}>
                <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.blue}20, ${C.goldLight})` }}>
                  <div className="text-center">
                    <p className="text-3xl mb-2">🗺️</p>
                    <p className="text-sm font-medium" style={{ color: C.blue }}>4Kilo Abenezer blg 4th floor office No-19, Addis Ababa</p>
                    <p className="text-xs" style={{ color: C.gray600 }}>Google Maps integration coming soon</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold mb-3" style={{ color: C.blue }}>Follow Us</p>
                <div className="flex gap-3">
                  {['📘 Facebook', '📷 Instagram', '▶️ YouTube', '📱 Telegram'].map(s => (
                    <button key={s} className="flex-1 py-2 rounded-lg text-xs font-medium" style={{ background: C.gray50, border: `1px solid ${C.gray100}`, color: C.gray600 }}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

