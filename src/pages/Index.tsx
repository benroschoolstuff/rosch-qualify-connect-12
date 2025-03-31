
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Hero from '@/components/shared/Hero';
import { Card, CardContent } from '@/components/ui/card';
import QualificationCard, { QualificationProps } from '@/components/shared/QualificationCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const qualifications: QualificationProps[] = [
  {
    id: 'roblox-teacher',
    title: 'Roblox Teacher Qualification',
    description: 'Learn to effectively use Roblox as an educational tool in the classroom environment.',
    duration: '8 weeks',
    level: 'Intermediate',
    forWho: ['Teachers', 'Educators']
  },
  {
    id: 'inclusion-officer',
    title: 'Inclusion Officer Certification',
    description: 'Develop strategies for inclusive education using Roblox for diverse learning needs.',
    duration: '10 weeks',
    level: 'Advanced',
    forWho: ['Inclusion Officers', 'Special Education Teachers']
  },
  {
    id: 'behavioral-staff',
    title: 'Behavioral Staff Training',
    description: 'Master behavioral management techniques using Roblox as an engagement tool.',
    duration: '6 weeks',
    level: 'Beginner to Intermediate',
    forWho: ['Pastoral Staff', 'Behavioral Specialists']
  }
];

const Index = () => {
  return (
    <MainLayout>
      <Hero
        title="Specialized Training for Roblox Educators"
        subtitle="Unlock the potential of Roblox as an educational platform with our professional qualifications for teachers and educational staff."
        ctaText="Begin Your Training Journey"
        ctaLink="/begin-training"
      />
      
      <section className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-rosch-DEFAULT mb-4">Our Mission</h2>
          <p className="max-w-3xl mx-auto text-lg">
            At ROSCH.UK, we're dedicated to providing specialized training for educators who want to harness the power of Roblox in their teaching practices. Our qualifications are designed to equip teachers, inclusion officers, and behavioral staff with the skills they need to create engaging and effective learning experiences.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Card className="text-center p-6 card-hover">
            <CardContent className="pt-6">
              <div className="rounded-full bg-rosch-light p-4 inline-flex mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-rosch-DEFAULT">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Expert-Led Training</h3>
              <p>Learn from industry experts who understand both education and Roblox technology.</p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 card-hover">
            <CardContent className="pt-6">
              <div className="rounded-full bg-rosch-light p-4 inline-flex mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-rosch-DEFAULT">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Recognized Qualifications</h3>
              <p>Earn professional certifications that validate your expertise in educational gaming.</p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 card-hover">
            <CardContent className="pt-6">
              <div className="rounded-full bg-rosch-light p-4 inline-flex mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-rosch-DEFAULT">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Specialized Focus</h3>
              <p>Programs tailored for teachers, inclusion officers, and behavioral staff.</p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section className="bg-rosch-light py-16">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rosch-DEFAULT mb-4">Featured Qualifications</h2>
            <p className="max-w-3xl mx-auto">Discover our specialized training programs designed for education professionals.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {qualifications.map((qual) => (
              <QualificationCard key={qual.id} {...qual} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild className="btn-primary">
              <Link to="/qualifications">View All Qualifications</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-rosch-DEFAULT mb-4">Why Choose ROSCH.UK?</h2>
            <p className="mb-6">
              We understand the unique challenges faced by educational professionals in integrating modern gaming platforms like Roblox into the learning environment. Our training programs are:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-rosch-accent mr-2">✓</span>
                <span>Designed by educators for educators</span>
              </li>
              <li className="flex items-start">
                <span className="text-rosch-accent mr-2">✓</span>
                <span>Focused on practical applications in the classroom</span>
              </li>
              <li className="flex items-start">
                <span className="text-rosch-accent mr-2">✓</span>
                <span>Updated regularly to keep pace with platform changes</span>
              </li>
              <li className="flex items-start">
                <span className="text-rosch-accent mr-2">✓</span>
                <span>Supported by a community of educational gaming professionals</span>
              </li>
            </ul>
            <Button asChild className="btn-primary mt-8">
              <Link to="/team">Meet Our Expert Team</Link>
            </Button>
          </div>
          <div className="bg-rosch-DEFAULT rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Teaching?</h3>
            <p className="mb-6">
              Join the growing community of educators using Roblox to create engaging, interactive learning experiences for their students.
            </p>
            <Button asChild className="btn-secondary w-full">
              <Link to="/begin-training">Begin Your Training Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
