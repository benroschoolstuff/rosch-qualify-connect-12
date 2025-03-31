
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBrand } from '@/contexts/BrandContext';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { brandName, logoUrl } = useBrand();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { text: 'Home', href: '/' },
    { text: 'Team', href: '/team' },
    { text: 'Qualifications', href: '/qualifications' },
    { text: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={`${brandName} logo`} 
                  className="h-8 w-auto mr-2" 
                />
              ) : (
                <div className="w-8 h-8 bg-rosch-DEFAULT rounded-full mr-2 flex items-center justify-center text-white font-bold">
                  {brandName.charAt(0)}
                </div>
              )}
              <span className="text-xl font-bold text-gray-900">{brandName}</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(link.href)
                      ? 'text-rosch-DEFAULT'
                      : 'text-gray-700 hover:text-rosch-DEFAULT'
                  }`}
                >
                  {link.text}
                </Link>
              ))}
            </div>

            <div className="ml-4 flex items-center">
              {user ? (
                <div className="flex items-center space-x-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/admin">Admin</Link>
                  </Button>
                  <Button onClick={logout} variant="outline" size="sm">
                    Logout
                  </Button>
                </div>
              ) : (
                <Button asChild size="sm">
                  <Link to="/login">Login</Link>
                </Button>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-rosch-DEFAULT focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? 'text-rosch-DEFAULT'
                    : 'text-gray-700 hover:text-rosch-DEFAULT'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.text}
              </Link>
            ))}
            
            {user && (
              <Link
                to="/admin"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-rosch-DEFAULT"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-rosch-DEFAULT"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-rosch-DEFAULT"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
