
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Hero from '@/components/shared/Hero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const defaultFAQs: FAQ[] = [
  {
    id: '1',
    question: 'When will applications reopen?',
    answer: 'We expect to begin accepting new applications for our next cohort in the coming months. Join our waiting list to be notified.',
    category: 'Applications'
  },
  {
    id: '2',
    question: 'Do I need prior Roblox experience?',
    answer: 'While some basic familiarity is helpful, our beginner programs include introductory modules for those new to the platform.',
    category: 'Requirements'
  }
];

const BeginTraining = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  
  useEffect(() => {
    // Load FAQs from localStorage
    const storedFaqs = localStorage.getItem('faqs');
    if (storedFaqs) {
      setFaqs(JSON.parse(storedFaqs));
    } else {
      setFaqs(defaultFAQs);
    }
  }, []);
  
  return (
    <MainLayout>
      <Hero
        title="Begin Your Training Journey"
        subtitle="Take the first step towards becoming a certified Roblox education professional"
      />
      
      <section className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-6">Enrollment Process</h2>
            <p className="mb-8">
              Ready to enhance your professional skills with our specialized Roblox education qualifications? Follow these simple steps to begin your training journey with ROSCH.UK.
            </p>
            
            <div className="space-y-8">
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold">1</div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Complete the Interest Form</h3>
                  <p>Once applications open, you'll be able to fill out an interest form with your details and the qualification you're interested in.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold">2</div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Discord Contact</h3>
                  <p>We'll contact you directly via Discord DM to discuss your application and next steps.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold">3</div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Begin Your Training</h3>
                  <p>Gain access to your program materials and start your learning journey.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700">Applications Currently Closed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertTitle className="text-lg font-semibold">Applications Temporarily Paused</AlertTitle>
                  <AlertDescription>
                    We are not currently accepting new applications for our training programs. Please check back later or join our waiting list to be notified when applications reopen.
                  </AlertDescription>
                </Alert>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium mb-3">Want to be notified when applications reopen?</h3>
                  <p className="mb-4">Join our waiting list to receive updates about our programs and be the first to know when applications are being accepted again.</p>
                  <Button asChild className="w-full btn-primary">
                    <Link to="/contact">Join the Waiting List</Link>
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Have questions?</h3>
                  <p className="mb-4">If you have any questions about our programs or the application process, please don't hesitate to reach out to our team.</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="bg-gray-100 py-16">
        <div className="section-container">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-700 mb-8">Frequently Asked Questions</h2>
            <div className="max-w-4xl mx-auto mt-8 text-left">
              <Accordion type="multiple" className="w-full space-y-4">
                {faqs.map((faq) => (
                  <AccordionItem 
                    key={faq.id} 
                    value={faq.id}
                    className="bg-white rounded-lg border shadow-sm"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <span className="font-medium text-left">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default BeginTraining;
