import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  TelegramIcon
} from '../../utils/icons';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Mahbere Edomias</h3>
            <p className="text-gray-400 text-sm">
              Orthodox Tewahdo Spiritual Association - A community of believers 
              committed to living the ancient faith with modern intentionality.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <YoutubeIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <TelegramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/services" className="hover:text-white transition">Services</Link></li>
              <li><Link to="/events" className="hover:text-white transition">Events</Link></li>
              <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link to="/donate" className="hover:text-white transition">Donate</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start space-x-2">
                <PhoneIcon className="h-5 w-5 mt-0.5" />
                <span>+251 9XX XXX XXX</span>
              </li>
              <li className="flex items-start space-x-2">
                <EnvelopeIcon className="h-5 w-5 mt-0.5" />
                <span>info@mehbereedomias.org</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPinIcon className="h-5 w-5 mt-0.5" />
                <span>Bole Sub-City, Woreda 03, Addis Ababa</span>
              </li>
            </ul>
          </div>

          
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Mahbere Edomias. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;