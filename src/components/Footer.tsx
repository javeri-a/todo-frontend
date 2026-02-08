import React from 'react';
import Link from 'next/link';
import { 
  FiMail, 
  FiTwitter, 
  FiFacebook, 
  FiInstagram,
  FiGithub,
  FiLinkedin,
  FiMapPin,
  FiPhone
} from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">TodoApp</h3>
            <p className="text-gray-300 mb-4">
              The ultimate task management solution designed to help you organize, prioritize, and accomplish more in less time.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiTwitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiFacebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiInstagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiGithub className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiLinkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/tasks" className="text-gray-300 hover:text-white transition-colors">Tasks</Link></li>
              <li><Link href="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link></li>
              <li><Link href="/signup" className="text-gray-300 hover:text-white transition-colors">Sign Up</Link></li>
              <li><Link href="/profile" className="text-gray-300 hover:text-white transition-colors">Profile</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FiMapPin className="h-5 w-5 mt-0.5 mr-2 text-blue-400" />
                <span className="text-gray-300">123 Productivity St, San Francisco, CA</span>
              </li>
              <li className="flex items-start">
                <FiPhone className="h-5 w-5 mt-0.5 mr-2 text-blue-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <FiMail className="h-5 w-5 mt-0.5 mr-2 text-blue-400" />
                <span className="text-gray-300">support@todoapp.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 w-full rounded-l-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} TodoApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;