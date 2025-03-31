
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Hero from '@/components/shared/Hero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Send } from 'lucide-react';

// Define the form schema with zod
const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  institution: z.string().optional(),
  role: z.string().min(2, { message: "Please enter your current role" }),
  qualification: z.string({ required_error: "Please select a qualification" }),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const BeginTraining = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      institution: '',
      role: '',
      qualification: '',
      message: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate sending data to a server with a timeout
    try {
      console.log("Form data submitted:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success notification
      toast({
        title: "Application submitted successfully!",
        description: "Thank you for your interest. We'll contact you soon with more information.",
      });
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      
      // Error notification
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="institution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institution/School</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Role</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="qualification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interested Qualification</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a qualification" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="roblox-teacher">Roblox Teacher Qualification</SelectItem>
                              <SelectItem value="inclusion-officer">Inclusion Officer Certification</SelectItem>
                              <SelectItem value="behavioral-staff">Behavioral Staff Training</SelectItem>
                              <SelectItem value="advanced-roblox">Advanced Roblox Curriculum Design</SelectItem>
                              <SelectItem value="digital-literacy">Digital Literacy Through Roblox</SelectItem>
                              <SelectItem value="leadership">Educational Leadership in Virtual Environments</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your experience and goals" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Submit Your Interest <Send className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                </Form>
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
                  <p>Most of our programs require 3-5 hours per day of study and practical work during the training period.</p>
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
