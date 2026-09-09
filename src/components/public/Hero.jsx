import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-blue-900 text-white">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Mahbere Edomias
          </h1>
          <p className="text-xl md:text-2xl text-gold-300 mb-2">
            Orthodox Tewahdo Spiritual Association
          </p>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Walking Together in Faith, Love, and Service
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/register"
              className="bg-gold-500 text-blue-900 px-8 py-3 rounded-md font-semibold hover:bg-gold-400 transition"
            >
              Join Our Community
            </Link>
            <Link
              to="/about"
              className="bg-white/10 text-white px-8 py-3 rounded-md font-semibold hover:bg-white/20 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;