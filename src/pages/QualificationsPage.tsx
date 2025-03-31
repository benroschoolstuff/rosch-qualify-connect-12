
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Hero from '@/components/shared/Hero';
import QualificationCard, { QualificationProps } from '@/components/shared/QualificationCard';

const qualifications: QualificationProps[] = [
  {
    id: 'roblox-teacher',
    title: 'Roblox Teacher Qualification',
    description: 'Learn to effectively use Roblox as an educational tool in the classroom environment. This comprehensive program covers curriculum integration, lesson planning, and student engagement strategies.',
    duration: '8 weeks',
    level: 'Intermediate',
    forWho: ['Teachers', 'Educators']
  },
  {
    id: 'inclusion-officer',
    title: 'Inclusion Officer Certification',
    description: 'Develop strategies for inclusive education using Roblox for diverse learning needs. Focus on accessibility, differentiated instruction, and creating supportive virtual learning environments.',
    duration: '10 weeks',
    level: 'Advanced',
    forWho: ['Inclusion Officers', 'Special Education Teachers']
  },
  {
    id: 'behavioral-staff',
    title: 'Behavioral Staff Training',
    description: 'Master behavioral management techniques using Roblox as an engagement tool. Learn to create structured environments that support positive behavior and social-emotional development.',
    duration: '6 weeks',
    level: 'Beginner to Intermediate',
    forWho: ['Pastoral Staff', 'Behavioral Specialists']
  },
  {
    id: 'advanced-roblox',
    title: 'Advanced Roblox Curriculum Design',
    description: 'For experienced educators who want to take their Roblox teaching to the next level. Learn to design comprehensive curricula and assessment strategies using the platform.',
    duration: '12 weeks',
    level: 'Advanced',
    forWho: ['Experienced Teachers', 'Curriculum Designers']
  },
  {
    id: 'digital-literacy',
    title: 'Digital Literacy Through Roblox',
    description: 'Teach essential digital literacy skills through engaging Roblox activities. Perfect for educators looking to integrate technology skills into their broader curriculum.',
    duration: '4 weeks',
    level: 'Beginner',
    forWho: ['All Educators', 'Technology Teachers']
  },
  {
    id: 'leadership',
    title: 'Educational Leadership in Virtual Environments',
    description: 'Designed for school leaders who want to implement Roblox-based programs across their institution. Focus on strategy, staff development, and measuring outcomes.',
    duration: '8 weeks',
    level: 'Advanced',
    forWho: ['School Leaders', 'Department Heads', 'Administrators']
  }
];

const QualificationsPage = () => {
  return (
    <MainLayout>
      <Hero
        title="Our Qualifications"
        subtitle="Specialized training programs designed for educational professionals using Roblox"
      />
      
      <section className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Available Training Programs</h2>
          <p className="max-w-3xl mx-auto">
            Each of our qualifications is carefully designed to meet the unique needs of different educational roles. Explore our offerings below to find the perfect program for your professional development.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {qualifications.map((qual) => (
            <QualificationCard key={qual.id} {...qual} />
          ))}
        </div>
      </section>
      
      <section className="bg-blue-50 py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-blue-900 mb-4">Qualification Structure</h2>
              <p className="mb-6">
                All our training programs include:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2 font-bold">•</span>
                  <span>Hands-on practical exercises in Roblox</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2 font-bold">•</span>
                  <span>Theoretical foundations of educational technology</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2 font-bold">•</span>
                  <span>Role-specific professional development</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2 font-bold">•</span>
                  <span>Assessment and certification</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2 font-bold">•</span>
                  <span>Ongoing community support</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Certification Process</h3>
              <ol className="space-y-4 list-decimal list-inside">
                <li>Complete all required modules</li>
                <li>Submit practical assignments</li>
                <li>Pass final assessment</li>
                <li>Receive digital certification</li>
                <li>Join alumni network</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default QualificationsPage;
