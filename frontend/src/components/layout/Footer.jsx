import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                CareerPortal
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Connecting talented professionals with top employers worldwide. Your journey to success starts here.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white flex items-center">
              <span className="w-8 h-0.5 bg-blue-500 mr-2"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white flex items-center">
              <span className="w-8 h-0.5 bg-blue-500 mr-2"></span>
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Resume Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Interview Prep
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Career Advice
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Salary Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white flex items-center">
              <span className="w-8 h-0.5 bg-blue-500 mr-2"></span>
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="bg-gray-800 p-2 rounded-lg mr-3 group-hover:bg-blue-600 transition-colors duration-200">
                  <MapPin className="h-5 w-5 text-gray-400 group-hover:text-white" />
                </div>
                <span className="text-gray-400 group-hover:text-white transition-colors duration-200">
                Darbhanga, Bihar <br />
                </span>
              </li>
              <li className="flex items-center group">
                <div className="bg-gray-800 p-2 rounded-lg mr-3 group-hover:bg-blue-600 transition-colors duration-200">
                  <Phone className="h-5 w-5 text-gray-400 group-hover:text-white" />
                </div>
                <a href="tel:+15551234567" className="text-gray-400 group-hover:text-white transition-colors duration-200">
                  (555) 123-4567
                </a>
              </li>
              <li className="flex items-center group">
                <div className="bg-gray-800 p-2 rounded-lg mr-3 group-hover:bg-blue-600 transition-colors duration-200">
                  <Mail className="h-5 w-5 text-gray-400 group-hover:text-white" />
                </div>
                <a href="mailto:info@careerportal.com" className="text-gray-400 group-hover:text-white transition-colors duration-200">
                  info@careerportal.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} CareerPortal. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex flex-wrap justify-center md:justify-end gap-6">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Cookie Policy</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;