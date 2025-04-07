
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-rosch-DEFAULT text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ROSCH.UK</h3>
            <p className="text-rosch-light">
              Providing professional training for Roblox school teachers, inclusion officers, and behavioral/pastoral staff.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-rosch-accent transition-colors">Home</Link></li>
              <li><Link to="/qualifications" className="hover:text-rosch-accent transition-colors">Qualifications</Link></li>
              <li><Link to="/team" className="hover:text-rosch-accent transition-colors">Meet the Team</Link></li>
              <li><Link to="/begin-training" className="hover:text-rosch-accent transition-colors">Begin Training</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="text-rosch-light">
              Have questions about our training programs?
            </p>
            <a 
              href="mailto:rob.hastingsroblox@outlook.com" 
              className="inline-block mt-4 text-rosch-accent hover:underline"
            >
              rob.hastingsroblox@outlook.com
            </a>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-rosch-light/20 text-center">
          <p>© {new Date().getFullYear()} ROSCH.UK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
