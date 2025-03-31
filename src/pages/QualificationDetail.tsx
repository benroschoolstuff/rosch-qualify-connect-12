
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Hero from '@/components/shared/Hero';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const qualificationsData = {
  'roblox-teacher': {
    title: 'Roblox Teacher Qualification',
    description: 'A comprehensive training program for educators looking to integrate Roblox into their teaching practices.',
    duration: '8 weeks',
    level: 'Intermediate',
    forWho: ['Teachers', 'Educators'],
    modules: [
      { title: 'Introduction to Roblox for Education', weeks: 1 },
      { title: 'Designing Learning Experiences in Roblox', weeks: 2 },
      { title: 'Assessment Strategies and Tools', weeks: 2 },
      { title: 'Classroom Management in Virtual Environments', weeks: 1 },
      { title: 'Final Project and Certification', weeks: 2 }
    ],
    outcomes: [
      'Design and implement curriculum-aligned Roblox activities',
      'Effectively manage student interactions in virtual environments',
      'Assess student learning through Roblox-based projects',
      'Troubleshoot common technical issues',
      'Create inclusive and engaging learning experiences'
    ]
  },
  'inclusion-officer': {
    title: 'Inclusion Officer Certification',
    description: 'Specialized training for inclusion and special education professionals using Roblox to support diverse learners.',
    duration: '10 weeks',
    level: 'Advanced',
    forWho: ['Inclusion Officers', 'Special Education Teachers'],
    modules: [
      { title: 'Accessibility Features in Roblox', weeks: 2 },
      { title: 'Adapting Environments for Diverse Needs', weeks: 2 },
      { title: 'Supporting Social Interactions', weeks: 2 },
      { title: 'Differentiated Instruction Strategies', weeks: 2 },
      { title: 'Case Studies and Certification', weeks: 2 }
    ],
    outcomes: [
      'Configure Roblox environments for accessibility',
      'Design adaptive learning experiences for diverse needs',
      'Support social skill development through guided interactions',
      'Implement differentiated teaching strategies',
      'Collaborate effectively with classroom teachers'
    ]
  },
  'behavioral-staff': {
    title: 'Behavioral Staff Training',
    description: 'Training program focused on using Roblox as a tool for positive behavioral support and development.',
    duration: '6 weeks',
    level: 'Beginner to Intermediate',
    forWho: ['Pastoral Staff', 'Behavioral Specialists'],
    modules: [
      { title: 'Roblox Basics for Behavioral Support', weeks: 1 },
      { title: 'Creating Structured Virtual Environments', weeks: 1 },
      { title: 'Positive Reinforcement Systems', weeks: 1 },
      { title: 'Managing Challenging Behaviors', weeks: 1 },
      { title: 'Social Skills Development', weeks: 1 },
      { title: 'Implementation and Certification', weeks: 1 }
    ],
    outcomes: [
      'Design behavior management systems using Roblox',
      'Create structured, predictable virtual environments',
      'Implement positive reinforcement strategies',
      'Address challenging behaviors effectively',
      'Develop students' social and emotional skills'
    ]
  },
  'advanced-roblox': {
    title: 'Advanced Roblox Curriculum Design',
    description: 'For experienced educators who want to take their Roblox teaching to the next level with comprehensive curriculum design.',
    duration: '12 weeks',
    level: 'Advanced',
    forWho: ['Experienced Teachers', 'Curriculum Designers'],
    modules: [
      { title: 'Advanced Roblox Features for Education', weeks: 2 },
      { title: 'Curriculum Mapping and Integration', weeks: 3 },
      { title: 'Advanced Assessment Design', weeks: 2 },
      { title: 'Research-Based Practices', weeks: 2 },
      { title: 'Capstone Project and Certification', weeks: 3 }
    ],
    outcomes: [
      'Design comprehensive, standards-aligned curricula',
      'Create sophisticated assessment systems',
      'Integrate research-based practices into Roblox teaching',
      'Lead professional development for colleagues',
      'Evaluate and iterate on educational experiences'
    ]
  },
  'digital-literacy': {
    title: 'Digital Literacy Through Roblox',
    description: 'A focused program for teaching essential digital skills through engaging Roblox activities.',
    duration: '4 weeks',
    level: 'Beginner',
    forWho: ['All Educators', 'Technology Teachers'],
    modules: [
      { title: 'Digital Citizenship Fundamentals', weeks: 1 },
      { title: 'Critical Thinking in Virtual Worlds', weeks: 1 },
      { title: 'Creative Production Skills', weeks: 1 },
      { title: 'Implementation and Certification', weeks: 1 }
    ],
    outcomes: [
      'Teach digital citizenship through Roblox activities',
      'Develop students' critical assessment of digital content',
      'Guide creative production using platform tools',
      'Integrate digital literacy across curriculum areas',
      'Assess students' digital competencies'
    ]
  },
  'leadership': {
    title: 'Educational Leadership in Virtual Environments',
    description: 'Strategic program for school leaders implementing Roblox across their institution.',
    duration: '8 weeks',
    level: 'Advanced',
    forWho: ['School Leaders', 'Department Heads', 'Administrators'],
    modules: [
      { title: 'Strategic Vision for Educational Technology', weeks: 1 },
      { title: 'Implementation Planning', weeks: 2 },
      { title: 'Staff Development and Support', weeks: 2 },
      { title: 'Measuring Impact and Outcomes', weeks: 2 },
      { title: 'Strategic Project and Certification', weeks: 1 }
    ],
    outcomes: [
      'Develop strategic plans for Roblox implementation',
      'Lead staff development initiatives',
      'Create evaluation frameworks for measuring impact',
      'Manage resources effectively',
      'Engage stakeholders in virtual learning initiatives'
    ]
  }
};

const QualificationDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Use the id to find the qualification data, or default to first one if not found
  const qualification = id && qualificationsData[id as keyof typeof qualificationsData] 
    ? qualificationsData[id as keyof typeof qualificationsData]
    : Object.values(qualificationsData)[0];
  
  return (
    <MainLayout>
      <Hero
        title={qualification.title}
        subtitle={qualification.description}
      />
      
      <section className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-rosch-DEFAULT mb-6">Program Overview</h2>
            <p className="mb-8">
              {qualification.description} This qualification is specifically designed for {qualification.forWho.join(', ')} who want to enhance their professional skills in using Roblox as an educational platform.
            </p>
            
            <h3 className="text-xl font-bold text-rosch-DEFAULT mb-4">Program Modules</h3>
            <div className="space-y-4 mb-8">
              {qualification.modules.map((module, index) => (
                <Card key={index}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{module.title}</h4>
                    </div>
                    <div className="text-sm text-gray-500">
                      {module.weeks} {module.weeks > 1 ? 'weeks' : 'week'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <h3 className="text-xl font-bold text-rosch-DEFAULT mb-4">Learning Outcomes</h3>
            <ul className="space-y-2 mb-8">
              {qualification.outcomes.map((outcome, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-rosch-accent mr-2 font-bold">•</span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-rosch-DEFAULT mb-4">Program Details</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-500">Duration</h4>
                    <p>{qualification.duration}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-gray-500">Level</h4>
                    <p>{qualification.level}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-gray-500">Designed for</h4>
                    <p>{qualification.forWho.join(', ')}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-gray-500">Certification</h4>
                    <p>Digital certificate upon successful completion</p>
                  </div>
                  
                  <Button asChild className="w-full btn-primary mt-4">
                    <Link to="/begin-training">Apply for This Program</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default QualificationDetail;
