'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  MapPin, Phone, Mail, Clock, Send, MessageSquare,
} from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CONTACT_INFO, SITE_NAME } from '@/lib/constants';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

const contactDetails = [
  { icon: MapPin, label: 'Visit Us', value: CONTACT_INFO.address, sub: 'Mon - Sat, 10 AM - 7 PM' },
  { icon: Phone, label: 'Call Us', value: CONTACT_INFO.phone, sub: 'Mon - Sat, 10 AM - 7 PM' },
  { icon: Mail, label: 'Email Us', value: CONTACT_INFO.email, sub: 'We reply within 24 hours' },
  { icon: Clock, label: 'Working Hours', value: 'Mon - Sat: 10 AM - 7 PM', sub: 'Sunday: Closed' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
    toast.success('Message sent! We\'ll get back to you soon.');
    reset();
  };

  return (
    <div className="bg-[hsl(0,0%,5%)]">
      {/* Hero */}
      <section className="bg-[hsl(0,0%,7%)] border-b border-white/5 text-white py-16">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-display mb-3"
          >
            Contact Us
          </motion.h1>
          <p className="text-brand-400 max-w-lg mx-auto">
            Have a question, feedback, or need help choosing the right helmet? {SITE_NAME}&apos;s rider support team is here to help.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          {/* Contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactDetails.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/[0.03] rounded-2xl p-6 border border-white/10 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-500/10 text-accent-500 flex items-center justify-center mx-auto mb-3">
                  <item.icon size={22} />
                </div>
                <h3 className="font-semibold text-white mb-1">{item.label}</h3>
                <p className="text-sm text-brand-300 font-medium">{item.value}</p>
                <p className="text-xs text-brand-500 mt-1">{item.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Form + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-display text-white mb-2">Send us a Message</h2>
              <p className="text-brand-500 mb-6">Fill out the form below and we'll get back to you as soon as possible.</p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center"
                >
                  <MessageSquare size={40} className="text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-green-400">Message Sent!</h3>
                  <p className="text-sm text-green-400/70 mt-1">We'll respond within 24 hours.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setSubmitted(false)}>
                    Send Another
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Full Name" error={errors.name?.message} {...register('name')} />
                    <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Phone (Optional)" {...register('phone')} />
                    <Input label="Subject" error={errors.subject?.message} {...register('subject')} />
                  </div>
                  <Textarea label="Message" rows={5} error={errors.message?.message} {...register('message')} />
                  <Button type="submit" size="lg" isLoading={isSubmitting} leftIcon={<Send size={16} />}>
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            {/* Map placeholder */}
            <div>
              <h2 className="text-2xl font-display text-white mb-2">Find Us</h2>
              <p className="text-brand-500 mb-6">Visit our store for a hands-on helmet experience.</p>
              <div className="bg-white/[0.03] rounded-2xl h-80 flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <MapPin size={40} className="text-brand-600 mx-auto mb-2" />
                  <p className="text-brand-500 text-sm">Map integration will be available soon</p>
                  <p className="text-xs text-brand-600 mt-1">{CONTACT_INFO.address}</p>
                </div>
              </div>

              <div className="bg-accent-500/10 rounded-2xl p-6 mt-6 border border-accent-500/20">
                <h3 className="font-semibold text-white mb-2">💡 Quick Tips</h3>
                <ul className="text-sm text-brand-400 space-y-2">
                  <li>• For order-related queries, include your order number</li>
                  <li>• For size guidance, mention your head circumference</li>
                  <li>• For returns, check our <a href="/policies/returns" className="text-accent-400 hover:underline">return policy</a> first</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
