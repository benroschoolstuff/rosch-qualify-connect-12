
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, ctaText, ctaLink }) => {
  return (
    <div className="hero-section">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in">{title}</h1>
        <p className="text-xl md:text-2xl mb-8 text-rosch-light max-w-3xl mx-auto animate-fade-in">
          {subtitle}
        </p>
        {ctaText && ctaLink && (
          <Button asChild className="btn-secondary text-lg px-8 py-3 shadow-md animate-fade-in">
            <Link to={ctaLink}>{ctaText}</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Hero;
