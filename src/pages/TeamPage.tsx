
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Hero from '@/components/shared/Hero';
import TeamMember from '@/components/shared/TeamMember';
import { Card, CardContent } from '@/components/ui/card';

const TeamPage = () => {
  return (
    <MainLayout>
      <Hero
        title="Meet Our Team"
        subtitle="The experts behind ROSCH.UK's specialized Roblox education qualifications."
      />
      
      <section className="section-container">
        <div className="mb-16">
          <div className="max-w-4xl mx-auto">
            <TeamMember
              name="Rob Hastings"
              role="CEO & Founder"
              bio="Rob brings over 15 years of experience in both education and gaming technology. With a background in computer science and education policy, he founded ROSCH.UK to bridge the gap between innovative gaming platforms like Roblox and traditional education. His vision is to empower educators with the skills needed to create engaging, interactive learning experiences."
              imageSrc="/assets/rob-hastings.jpg"
            />
          </div>
        </div>
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-rosch-DEFAULT mb-4">Our Philosophy</h2>
          <p className="max-w-3xl mx-auto">
            At ROSCH.UK, we believe that modern education requires innovative approaches. Our team is committed to developing high-quality training programs that help educators harness the full potential of Roblox as an educational tool.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Card className="text-center p-6 card-hover">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4 text-rosch-DEFAULT">Innovation</h3>
              <p>
                We continuously explore new ways to integrate Roblox into educational contexts, staying ahead of technological advancements.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 card-hover">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4 text-rosch-DEFAULT">Excellence</h3>
              <p>
                Our qualifications are developed to the highest standards, ensuring educators receive top-quality training.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 card-hover">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4 text-rosch-DEFAULT">Accessibility</h3>
              <p>
                We design our programs to be accessible to educators at all levels of technical proficiency.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
};

export default TeamPage;
