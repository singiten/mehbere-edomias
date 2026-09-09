import { useState } from 'react';

// ─── Design tokens ────────────────────────────────────────────────────────────
export const C = {
  blue:       '#1a365d',
  blueDark:   '#0f1a2e',
  blueLight:  '#2a4a7f',
  gold:       '#c9a84c',
  goldLight:  '#e8d5a3',
  goldDark:   '#a07830',
  white:      '#ffffff',
  gray50:     '#f7fafc',
  gray100:    '#e2e8f0',
  gray400:    '#94a3b8',
  gray600:    '#4a5568',
  gray800:    '#1e293b',
  success:    '#38a169',
  warning:    '#d69e2e',
  error:      '#e53e3e',
};

// ─── Shared components ────────────────────────────────────────────────────────

export function Btn({ children, variant = 'primary', onClick, className = '', type = 'button', small = false }) {
  const base = `inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 ${small ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'} cursor-pointer`;
  const styles = {
    primary:   `bg-[#1a365d] text-[#c9a84c] hover:bg-[#0f1a2e]`,
    secondary: `bg-[#c9a84c] text-[#1a365d] hover:bg-[#a07830]`,
    gold:      `bg-gradient-to-r from-[#c9a84c] to-[#e8d5a3] text-[#1a365d] hover:from-[#a07830] hover:to-[#c9a84c]`,
    outline:   `border-2 border-[#1a365d] text-[#1a365d] hover:bg-[#1a365d] hover:text-white`,
    danger:    `bg-[#e53e3e] text-white hover:bg-[#c53030]`,
    ghost:     `text-[#1a365d] hover:bg-[#e2e8f0]`,
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function Badge({ children, color = 'blue' }) {
  const styles = {
    blue:   'bg-[#1a365d] text-[#c9a84c]',
    gold:   'bg-[#c9a84c] text-[#1a365d]',
    green:  'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red:    'bg-red-100 text-red-700',
    gray:   'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[color]}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = '', hover = false }) {
  return (
    <div className={`bg-white rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] p-6 ${hover ? 'transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, sub, center = false }) {
  return (
    <div className={`mb-10 ${center ? 'text-center' : ''}`}>
      {eyebrow && <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: C.gold }}>{eyebrow}</p>}
      <h2 className="text-3xl font-bold" style={{ color: C.blue }}>{title}</h2>
      {sub && <p className="mt-3 text-base max-w-2xl leading-relaxed" style={{ color: C.gray600, ...(center ? { margin: '12px auto 0' } : {}) }}>{sub}</p>}
    </div>
  );
}

export function OrthodoxCross({ size = 32, color = C.gold }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 50" fill="none">
      <rect x="17" y="0" width="6" height="50" fill={color} rx="1"/>
      <rect x="4" y="10" width="32" height="6" fill={color} rx="1"/>
      <rect x="8" y="34" width="24" height="4" fill={color} rx="1" transform="rotate(-15 8 34)"/>
    </svg>
  );
}

export function Divider() {
  return (
    <div className="flex items-center gap-4 my-2">
      <div className="flex-1 h-px" style={{ background: C.gray100 }} />
      <OrthodoxCross size={20} color={C.gold} />
      <div className="flex-1 h-px" style={{ background: C.gray100 }} />
    </div>
  );
}

export function Input({ label, required, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium" style={{ color: C.gray600 }}>{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <input
        {...props}
        className="w-full rounded-lg px-3 py-2.5 text-sm outline-none border transition-colors"
        style={{ borderColor: C.gray100, background: '#fff', color: C.gray800 }}
        onFocus={e => (e.currentTarget.style.borderColor = C.gold)}
        onBlur={e => (e.currentTarget.style.borderColor = C.gray100)}
      />
    </div>
  );
}

export function Textarea({ label, required, rows = 4, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium" style={{ color: C.gray600 }}>{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <textarea
        rows={rows}
        {...props}
        className="w-full rounded-lg px-3 py-2.5 text-sm outline-none border transition-colors resize-none"
        style={{ borderColor: C.gray100, background: '#fff', color: C.gray800 }}
        onFocus={e => (e.currentTarget.style.borderColor = C.gold)}
        onBlur={e => (e.currentTarget.style.borderColor = C.gray100)}
      />
    </div>
  );
}

export function Select({ label, children, required, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium" style={{ color: C.gray600 }}>{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <select
        {...props}
        className="w-full rounded-lg px-3 py-2.5 text-sm outline-none border transition-colors"
        style={{ borderColor: C.gray100, background: '#fff', color: C.gray800 }}>
        {children}
      </select>
    </div>
  );
}

export function StatCard({ icon, value, label, color = C.gold }) {
  return (
    <Card className="text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color }}>{value}</p>
      <p className="text-sm" style={{ color: C.gray600 }}>{label}</p>
    </Card>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
export function Navbar({ page = 'home', setPage = () => {}, role = 'guest', setRole = () => {} }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ PUBLIC NAV LINKS ONLY - Removed Admin links
  const publicLinks = [
    { label: 'Home', page: 'home' },
    { label: 'About', page: 'about' },
    { label: 'Services', page: 'services' },
    { label: 'Blog', page: 'blog' },
    { label: 'Donate', page: 'donate' },
    { label: 'Contact', page: 'contact' },
  ];

  function handleLogin(r) {
    setRole(r);
    if (r === 'member') setPage('member.dashboard');
    if (r === 'admin') setPage('admin.dashboard');
    setMenuOpen(false);
  }

  // Safe check for page.startsWith
  const isPage = (path) => {
    if (!page) return false;
    return page.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full" style={{ background: C.blue, boxShadow: '0 2px 12px rgba(0,0,0,0.25)' }}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <button onClick={() => setPage('home')} className="flex items-center gap-2.5">
          <OrthodoxCross size={28} color={C.gold} />
          <div className="text-left">
            <p className="text-sm font-bold leading-tight" style={{ color: C.gold, fontFamily: "'Playfair Display', serif" }}>Mehbere Edomias</p>
            <p className="text-xs leading-tight" style={{ color: 'rgba(255,255,255,0.6)' }}>Orthodox Tewahdo Spiritual Assoc.</p>
          </div>
        </button>

        {/* Desktop nav - Public only */}
        <div className="hidden lg:flex items-center gap-1">
          {publicLinks.map(l => (
            <button key={l.page} onClick={() => setPage(l.page)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{ 
                color: page === l.page ? C.gold : 'rgba(255,255,255,0.8)', 
                background: page === l.page ? 'rgba(201,168,76,0.15)' : 'transparent' 
              }}>
              {l.label}
            </button>
          ))}
        </div>

        {/* Auth section - Removed Admin button, only Member Login */}
        <div className="flex items-center gap-2">
          {role === 'guest' ? (
            <div className="flex gap-1.5">
              <button onClick={() => handleLogin('member')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ background: 'rgba(201,168,76,0.15)', color: C.gold, border: '1px solid rgba(201,168,76,0.3)' }}>
                Member Login
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {role === 'member' ? (
                  <>
                    <button onClick={() => setPage('member.dashboard')} 
                      className="px-2.5 py-1.5 rounded text-xs font-medium" 
                      style={{ 
                        color: isPage('member') ? C.gold : 'rgba(255,255,255,0.7)', 
                        background: isPage('member') ? 'rgba(201,168,76,0.15)' : 'transparent' 
                      }}>
                      Dashboard
                    </button>
                    <button onClick={() => setPage('member.donations')} 
                      className="px-2.5 py-1.5 rounded text-xs font-medium" 
                      style={{ color: 'rgba(255,255,255,0.7)' }}>
                      My Donations
                    </button>
                    <button onClick={() => setPage('member.profile')} 
                      className="px-2.5 py-1.5 rounded text-xs font-medium" 
                      style={{ color: 'rgba(255,255,255,0.7)' }}>
                      Profile
                    </button>
                  </>
                ) : null}
              </div>
              <button onClick={() => { setRole('guest'); setPage('home') }}
                className="px-2.5 py-1 rounded text-xs font-medium"
                style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.2)' }}>
                Logout
              </button>
            </div>
          )}
          <button onClick={() => setMenuOpen(m => !m)} className="lg:hidden text-white text-xl">☰</button>
        </div>
      </div>

      {/* Mobile menu - Public only */}
      {menuOpen && (
        <div className="lg:hidden border-t" style={{ borderColor: 'rgba(255,255,255,0.1)', background: C.blueDark }}>
          {publicLinks.map(l => (
            <button key={l.page} onClick={() => { setPage(l.page); setMenuOpen(false) }}
              className="block w-full text-left px-5 py-3 text-sm border-b"
              style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.06)' }}>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export function Footer({ setPage }) {
  // Updated footer links - Removed admin-related links
  const links = [
    { label: 'About Us', page: 'about' },
    { label: 'Services', page: 'services' },
    { label: 'Blog', page: 'blog' },
    { label: 'Contact', page: 'contact' },
    { label: 'Donate', page: 'donate' },
  ];

  return (
    <footer style={{ background: C.blueDark, color: 'rgba(255,255,255,0.7)' }}>
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <OrthodoxCross size={28} color={C.gold} />
            <div>
              <p className="font-bold text-sm" style={{ color: C.gold, fontFamily: "'Playfair Display', serif" }}>Mehbere Edomias</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Spiritual Association</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Walking Together in Faith, Love, and Service — a community rooted in the Ethiopian Orthodox Tewahdo tradition.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold mb-4" style={{ color: C.gold }}>Quick Links</p>
          <div className="flex flex-col gap-2">
            {links.map(l => (
              <button key={l.page} onClick={() => setPage(l.page)}
                className="text-left text-sm transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.6)' }}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-4" style={{ color: C.gold }}>Contact</p>
          <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <p>📞 +251 967722490</p>
            <p>📞 +251 904199155</p>
            <p>📞 +251 944067097</p>
            <p>✉️ singiten2127@gmail.com</p>
            <p>📍 4Kilo Abenezer blg 4th floor office No-19, Addis Ababa, Ethiopia</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-4" style={{ color: C.gold }}>Connect</p>
          <div className="flex gap-3">
            {['📘', '📷', '▶️', '📱'].map((icon, i) => (
              <div key={i} className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:opacity-80"
                style={{ background: 'rgba(201,168,76,0.15)', fontSize: '16px' }}>
                {icon}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Newsletter</p>
            <div className="flex gap-2">
              <input placeholder="Your email" className="flex-1 rounded-lg px-3 py-2 text-xs outline-none" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }} />
              <button className="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: C.gold, color: C.blue }}>→</button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t text-center py-4 text-xs" style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}>
        © {new Date().getFullYear()} Mehbere Edomias Orthodox Tewahdo Spiritual Association. All rights reserved.
      </div>
    </footer>
  );
}