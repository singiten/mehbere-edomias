import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Navbar, Footer } from './church/Layout';

// Public Pages
import { 
  HomePage, 
  AboutPage, 
  ServicesPage, 
  EventsPage, 
  EventDetailPage,
  BlogPage, 
  BlogDetailPage, 
  SermonsPage, 
  DonatePage, 
  ContactPage 
} from './church/PublicPages';
import LoginPage from './pages/public/Login';
import RegisterPage from './pages/public/Register';

// Member Pages (without prayer features)
import { MemberDashboard, MemberProfile, MyDonations, SubmitDonation } from './church/MemberPages';

// Admin Pages - Make sure ServiceManagement is imported
import { 
  AdminDashboard, 
  MemberManagement, 
  DonationManagement, 
  ContentManagement, 
  ServiceManagement,  // ← Add this import
  Reports 
} from './church/AdminPages';

// Pages without footer (full-screen dashboards)
const NO_FOOTER = [
  '/dashboard',
  '/profile',
  '/my-donations',
  '/submit-donation',
  '/admin',
  '/admin/members',
  '/admin/donations',
  '/admin/content',
  '/admin/services',  // ← Add this
  '/admin/reports',
];

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <MainApp />
      </AuthProvider>
    </BrowserRouter>
  );
}

function MainApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState('home');
  const [role, setRole] = useState('guest');

  const path = location.pathname;
  const showFooter = !NO_FOOTER.some(p => path.startsWith(p));

  // Map path to page for Navbar
  useEffect(() => {
    const getPageFromPath = () => {
      if (path === '/') return 'home';
      if (path === '/about') return 'about';
      if (path === '/services' || path === '/what-we-do') return 'services';
      if (path === '/blog') return 'blog';
      if (path.startsWith('/blog/')) return 'blog';
      if (path === '/sermons') return 'sermons';
      if (path === '/events') return 'events';
      if (path.startsWith('/events/')) return 'events';
      if (path === '/donate') return 'donate';
      if (path === '/contact') return 'contact';
      if (path === '/login') return 'login';
      if (path === '/register') return 'register';
      if (path === '/dashboard') return 'member.dashboard';
      if (path === '/profile') return 'member.profile';
      if (path === '/my-donations') return 'member.donations';
      if (path === '/submit-donation') return 'member.donate';
      if (path === '/admin') return 'admin.dashboard';
      if (path.startsWith('/admin/members')) return 'admin.members';
      if (path.startsWith('/admin/donations')) return 'admin.donations';
      if (path.startsWith('/admin/content')) return 'admin.content';
      if (path.startsWith('/admin/services')) return 'admin.services';  // ← Add this
      if (path.startsWith('/admin/reports')) return 'admin.reports';
      return 'home';
    };
    setPage(getPageFromPath());
  }, [path]);

  // Update role based on user
  useEffect(() => {
    if (user) {
      if (user.role === 'super_admin' || user.role === 'admin') {
        setRole('admin');
      } else if (user.role === 'member') {
        setRole('member');
      } else {
        setRole('guest');
      }
    } else {
      setRole('guest');
    }
  }, [user]);

  // Handle navigation
  const handleSetPage = (newPage) => {
    setPage(newPage);
    const routes = {
      'home': '/',
      'about': '/about',
      'services': '/services',
      'whatwedo': '/what-we-do',
      'blog': '/blog',
      'sermons': '/sermons',
      'events': '/events',
      'donate': '/donate',
      'contact': '/contact',
      'login': '/login',
      'register': '/register',
      'member.dashboard': '/dashboard',
      'member.profile': '/profile',
      'member.donations': '/my-donations',
      'member.donate': '/submit-donation',
      'admin.dashboard': '/admin',
      'admin.members': '/admin/members',
      'admin.donations': '/admin/donations',
      'admin.content': '/admin/content',
      'admin.services': '/admin/services',  // ← Add this
      'admin.reports': '/admin/reports',
    };
    const targetPath = routes[newPage] || '/';
    navigate(targetPath);
  };

  // Helper to render pages with Navbar + Footer
  const PageWrapper = ({ children }) => (
    <>
      <Navbar page={page} setPage={handleSetPage} role={role} setRole={setRole} />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer setPage={handleSetPage} />}
    </>
  );

  // Helper for detail pages (always shows footer)
  const DetailPageWrapper = ({ children }) => (
    <>
      <Navbar page={page} setPage={handleSetPage} role={role} setRole={setRole} />
      <main className="flex-1">{children}</main>
      <Footer setPage={handleSetPage} />
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
        <Route path="/services" element={<PageWrapper><ServicesPage /></PageWrapper>} />
        <Route path="/what-we-do" element={<PageWrapper><ServicesPage /></PageWrapper>} />
        
        {/* Events Routes */}
        <Route path="/events" element={<PageWrapper><EventsPage /></PageWrapper>} />
        <Route path="/events/:eventId" element={<DetailPageWrapper><EventDetailPage /></DetailPageWrapper>} />
        
        {/* Blog Routes */}
        <Route path="/blog" element={<PageWrapper><BlogPage /></PageWrapper>} />
        <Route path="/blog/:slug" element={<DetailPageWrapper><BlogDetailPage /></DetailPageWrapper>} />
        
        {/* Other Routes */}
        <Route path="/sermons" element={<PageWrapper><SermonsPage /></PageWrapper>} />
        <Route path="/donate" element={<PageWrapper><DonatePage /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />

        {/* Member Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PageWrapper><MemberDashboard /></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <PageWrapper><MemberProfile /></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/my-donations" element={
          <ProtectedRoute>
            <PageWrapper><MyDonations /></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/submit-donation" element={
          <ProtectedRoute>
            <PageWrapper><SubmitDonation /></PageWrapper>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <PageWrapper><AdminDashboard /></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/admin/members" element={
          <ProtectedRoute requiredRole="admin">
            <PageWrapper><MemberManagement /></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/admin/donations" element={
          <ProtectedRoute requiredRole="admin">
            <PageWrapper><DonationManagement /></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/admin/content" element={
          <ProtectedRoute requiredRole="admin">
            <PageWrapper><ContentManagement /></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/admin/services" element={  // ← Add this route
          <ProtectedRoute requiredRole="admin">
            <PageWrapper><ServiceManagement /></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute requiredRole="admin">
            <PageWrapper><Reports /></PageWrapper>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;