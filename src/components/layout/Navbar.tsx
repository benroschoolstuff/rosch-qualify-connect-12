
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <div className="text-rosch-DEFAULT text-2xl font-bold">ROSCH.UK</div>
            </Link>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/qualifications" className="nav-link">Qualifications</Link>
              <Link to="/team" className="nav-link">Meet the Team</Link>
            </nav>
          </div>
          <div className="flex items-center">
            <Button asChild className="btn-primary">
              <Link to="/begin-training">Begin Training</Link>
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile menu for smaller screens */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
          <Link to="/" className="nav-link block py-2 px-3">Home</Link>
          <Link to="/qualifications" className="nav-link block py-2 px-3">Qualifications</Link>
          <Link to="/team" className="nav-link block py-2 px-3">Meet the Team</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
