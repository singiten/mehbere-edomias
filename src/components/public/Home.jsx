import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Hero from '../../components/public/Hero';
import api from '../../services/api';

const Home = () => {
  const [homepageData, setHomepageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const response = await api.get('/public/homepage');
        setHomepageData(response.data.data);
      } catch (error) {
        console.error('Error fetching homepage:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomepage();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
        <Footer />
      </>
    );
  }

  const { summary, featuredBlogs, upcomingEvents } = homepageData || {};

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-900">{summary?.established || '2012'}</p>
              <p className="text-gray-600 mt-1">Established</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-900">{summary?.members || '200+'}</p>
              <p className="text-gray-600 mt-1">Members</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-900">{summary?.events || '50+'}</p>
              <p className="text-gray-600 mt-1">Events</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-900">{summary?.outreach || '500+'}</p>
              <p className="text-gray-600 mt-1">Families Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">✝</div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Faith</h3>
              <p className="text-gray-600">Rooted in the ancient tradition of the Ethiopian Orthodox Church</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Community</h3>
              <p className="text-gray-600">Supporting each other in spiritual and everyday life</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Service</h3>
              <p className="text-gray-600">Reaching out to those in need with love and compassion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-blue-900">Upcoming Events</h2>
            <Link to="/events" className="text-gold-600 hover:text-gold-700 font-semibold">
              View All →
            </Link>
          </div>
          {upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="p-6">
                    <div className="text-sm text-gold-600 font-semibold mb-2">{event.eventType}</div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{event.description?.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{event.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No upcoming events at this time.</p>
          )}
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-blue-900">Latest Blog Posts</h2>
            <Link to="/blog" className="text-gold-600 hover:text-gold-700 font-semibold">
              View All →
            </Link>
          </div>
          {featuredBlogs && featuredBlogs.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {featuredBlogs.map((blog) => (
                <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="p-6">
                    <div className="text-sm text-gold-600 font-semibold mb-2">{blog.category}</div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2">{blog.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{blog.excerpt?.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{blog.readTime || 3} min read</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No blog posts available.</p>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg text-gray-300 mb-8">
            Become part of a vibrant Orthodox community dedicated to faith, service, and fellowship.
          </p>
          <Link
            to="/register"
            className="bg-gold-500 text-blue-900 px-8 py-3 rounded-md font-semibold hover:bg-gold-400 transition inline-block"
          >
            Register Now
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;