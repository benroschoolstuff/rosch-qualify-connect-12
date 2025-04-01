
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Hero from '@/components/shared/Hero';
import TeamMember from '@/components/shared/TeamMember';

interface TeamMemberType {
  id: string;
  name: string;
  role: string;
  bio: string;
  email: string;
  imageSrc: string;
}

const defaultTeamMembers: TeamMemberType[] = [
  {
    id: '1',
    name: 'Rob Hastings',
    role: 'Lead Trainer & Founder',
    bio: 'With over 10 years of experience in education technology, Rob specializes in integrating gaming platforms like Roblox into educational settings.',
    email: 'rob@rosch.uk',
    imageSrc: '/assets/rob-hastings.jpg'
  }
];

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMemberType[]>([]);
  
  useEffect(() => {
    // Load team members from localStorage
    const storedMembers = localStorage.getItem('teamMembers');
    if (storedMembers) {
      setTeamMembers(JSON.parse(storedMembers));
    } else {
      setTeamMembers(defaultTeamMembers);
    }
  }, []);
  
  return (
    <MainLayout>
      <Hero
        title="Meet Our Team"
        subtitle="Get to know the experts behind ROSCH.UK's training programs"
      />
      
      <section className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <TeamMember
              key={member.id}
              name={member.name}
              role={member.role}
              bio={member.bio}
              imageSrc={member.imageSrc}
            />
          ))}
        </div>
      </section>
      
      <section className="bg-gray-50 py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-blue-700 mb-6">Join Our Team</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Passionate about Roblox and education? We're always looking for talented 
            individuals to join our growing team of trainers and education specialists.
          </p>
          <p className="text-xl font-medium text-blue-900">
            Contact us at <a href="mailto:careers@rosch.uk" className="text-blue-500 hover:underline">careers@rosch.uk</a>
          </p>
        </div>
      </section>
    </MainLayout>
  );
};

export default TeamPage;
