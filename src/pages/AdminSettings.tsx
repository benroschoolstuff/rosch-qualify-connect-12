
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Hero from '@/components/shared/Hero';
import WebhookConfiguration from '@/components/admin/WebhookConfiguration';
import HowItWorks from '@/components/admin/HowItWorks';

const AdminSettings = () => {
  return (
    <MainLayout>
      <Hero 
        title="Admin Settings" 
        subtitle="Configure system settings and integrations" 
      />
      
      <section className="section-container py-10">
        <div className="max-w-4xl mx-auto">
          <WebhookConfiguration />
          <HowItWorks />
        </div>
      </section>
    </MainLayout>
  );
};

export default AdminSettings;
