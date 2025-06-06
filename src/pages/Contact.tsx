import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Hero from '@/components/shared/Hero';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    discordId: '',
    qualification: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Discord webhook URL from Supabase
    let webhook: string | null = null;
    
    try {
      // First get Discord webhook URL from database
      const { data: discordSettings } = await supabase
        .from('discord_settings')
        .select('webhook_url')
        .maybeSingle();
      
      webhook = discordSettings?.webhook_url || "https://discord.com/api/webhooks/1356354379808116958/zztXYcU1htl71kpjPhqDOmm626qM53HjfRj72FfEs1z_hEpctW42cFrZzmNYCl4BqTmn";
      
      // Save to Supabase
      const { error: dbError } = await supabase
        .from('waiting_list')
        .insert({
          name: formData.name,
          email: formData.email,
          discord_id: formData.discordId || null,
          qualification: formData.qualification || null,
          message: formData.message || null,
          status: 'new'
        });
      
      if (dbError) throw dbError;
      
      // Format message for Discord
      const discordMessage = {
        content: "New Waiting List Signup",
        embeds: [{
          title: "New Interest Form Submission",
          color: 3447003,
          fields: [
            {
              name: "Name",
              value: formData.name || "Not provided"
            },
            {
              name: "Email",
              value: formData.email || "Not provided"
            },
            {
              name: "Discord ID",
              value: formData.discordId || "Not provided"
            },
            {
              name: "Interested Qualification",
              value: formData.qualification || "Not specified"
            },
            {
              name: "Message",
              value: formData.message || "No message provided"
            }
          ],
          timestamp: new Date().toISOString()
        }]
      };

      // Send to webhook if available
      if (webhook) {
        const response = await fetch(webhook, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(discordMessage),
        });

        if (!response.ok) {
          console.error('Discord webhook error:', response.statusText);
        }
      }

      toast({
        title: "Success!",
        description: "You've been added to our waiting list. We'll contact you when applications open.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        discordId: '',
        qualification: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Something went wrong",
        description: "We couldn't add you to the waiting list. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Hero
        title="Contact Us"
        subtitle="Join our waiting list or get in touch with our team"
      />
      
      <section className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700">Join Our Waiting List</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="discordId">Discord ID (Optional)</Label>
                    <Input 
                      id="discordId"
                      name="discordId"
                      placeholder="username#0000 or User ID"
                      value={formData.discordId}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-gray-500">
                      Your Discord username or ID to receive updates
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="qualification">Interested Qualification</Label>
                    <select
                      id="qualification"
                      name="qualification"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      value={formData.qualification}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a qualification</option>
                      <option value="roblox-teacher">Roblox Teacher Qualification</option>
                      <option value="inclusion-officer">Inclusion Officer Certification</option>
                      <option value="behavioral-staff">Behavioral Staff Training</option>
                      <option value="advanced-roblox">Advanced Roblox Curriculum Design</option>
                      <option value="digital-literacy">Digital Literacy Through Roblox</option>
                      <option value="leadership">Educational Leadership in Virtual Environments</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Information</Label>
                    <Textarea 
                      id="message"
                      name="message"
                      placeholder="Tell us about your interest in our programs..."
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Join Waiting List'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-6">Get in Touch</h2>
            <p className="mb-8">
              Have questions about our training programs or want to learn more about how we can support your institution? Our team is here to help.
            </p>
            
            <div className="space-y-8">
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                  <p>rob.hastingsroblox@outlook.com</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Location</h3>
                  <p>London, United Kingdom</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Discord</h3>
                  <p>Join our Discord community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
