
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Hero from '@/components/shared/Hero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BeginTraining = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would handle the form submission
    alert("Thank you for your interest! We'll contact you soon with more information about your selected qualification.");
  };

  return (
    <MainLayout>
      <Hero
        title="Begin Your Training Journey"
        subtitle="Take the first step towards becoming a certified Roblox education professional"
      />
      
      <section className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-rosch-DEFAULT mb-6">Enrollment Process</h2>
            <p className="mb-8">
              Ready to enhance your professional skills with our specialized Roblox education qualifications? Follow these simple steps to begin your training journey with ROSCH.UK.
            </p>
            
            <div className="space-y-8">
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full bg-rosch-DEFAULT text-white flex items-center justify-center font-bold">1</div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Complete the Interest Form</h3>
                  <p>Fill out the form on this page with your details and the qualification you're interested in.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full bg-rosch-DEFAULT text-white flex items-center justify-center font-bold">2</div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Consultation Call</h3>
                  <p>Our team will contact you to discuss your goals and confirm your eligibility for the program.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full bg-rosch-DEFAULT text-white flex items-center justify-center font-bold">3</div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Formal Registration</h3>
                  <p>Complete the registration process and make payment arrangements.</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full bg-rosch-DEFAULT text-white flex items-center justify-center font-bold">4</div>
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
                <CardTitle className="text-rosch-DEFAULT">Express Your Interest</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution/School</Label>
                    <Input id="institution" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Current Role</Label>
                    <Input id="role" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="qualification">Interested Qualification</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="roblox-teacher">Roblox Teacher Qualification</SelectItem>
                        <SelectItem value="inclusion-officer">Inclusion Officer Certification</SelectItem>
                        <SelectItem value="behavioral-staff">Behavioral Staff Training</SelectItem>
                        <SelectItem value="advanced-roblox">Advanced Roblox Curriculum Design</SelectItem>
                        <SelectItem value="digital-literacy">Digital Literacy Through Roblox</SelectItem>
                        <SelectItem value="leadership">Educational Leadership in Virtual Environments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Information</Label>
                    <Textarea id="message" placeholder="Tell us about your experience and goals" />
                  </div>
                  
                  <Button type="submit" className="w-full btn-primary">Submit Your Interest</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="bg-rosch-light py-16">
        <div className="section-container">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-rosch-DEFAULT mb-4">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8 text-left">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Do I need prior Roblox experience?</h3>
                  <p>While some basic familiarity is helpful, our beginner programs include introductory modules for those new to the platform.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">How much time will I need to commit weekly?</h3>
                  <p>Most of our programs require 3-5 hours per week of study and practical work.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Are the qualifications recognized?</h3>
                  <p>Our qualifications are industry-recognized certifications specifically for educational applications of Roblox.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Can my school enroll multiple staff members?</h3>
                  <p>Yes, we offer institutional packages for schools wanting to train multiple staff members. Contact us for details.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default BeginTraining;
