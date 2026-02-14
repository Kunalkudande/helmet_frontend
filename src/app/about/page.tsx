'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Shield, Award, Users, Heart, Truck, Headphones, Star, Target,
} from 'lucide-react';
import { SITE_NAME, BRAND_POSITIONING, IMAGES } from '@/lib/constants';

const stats = [
  { value: '1,000+', label: 'Happy Riders' },
  { value: '25+', label: 'Helmet Brands' },
  { value: '500+', label: 'Products' },
  { value: '4.8★', label: 'Average Rating' },
];

const team = [
  { name: 'Omkar Ingale', role: 'Founder & CEO', bio: 'Passionate rider with 15+ years in motorcycle safety gear.' },
  { name: 'Kunal Kudande', role: 'Head of Operations', bio: 'Expert in supply chain and quality assurance.' },
  { name: 'Komal Ingale', role: 'Product Specialist', bio: 'ISI/DOT certification expert helping riders choose right.' },
];

const values = [
  { icon: Shield, title: 'Safety First', desc: 'Every helmet we sell meets ISI, DOT, or ECE safety standards.' },
  { icon: Award, title: 'Quality Assured', desc: 'We source directly from authorized brand distributors.' },
  { icon: Heart, title: 'Customer Love', desc: 'Your safety and satisfaction drive everything we do.' },
  { icon: Target, title: 'Best Prices', desc: 'Competitive pricing with regular deals and offers.' },
];

export default function AboutPage() {
  return (
    <div className="bg-[hsl(0,0%,5%)]">
      {/* Hero */}
      <section className="relative bg-[hsl(0,0%,7%)] text-white py-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <Image
            src={IMAGES.aboutHero}
            alt=""
            fill
            className="object-cover opacity-40"
            aria-hidden="true"
          />
        </div>
        <div className="container-custom text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display mb-4"
          >
            About <span className="text-accent-400">{SITE_NAME}</span>
          </motion.h1>
          <p className="text-lg text-brand-400 max-w-2xl mx-auto">
            {BRAND_POSITIONING.oneLiner} We believe every rider deserves the best protection on the road.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-3xl font-bold text-accent-500">{stat.value}</p>
                <p className="text-brand-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-[hsl(0,0%,7%)]">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display text-white mb-6">Our Story</h2>
            <div className="text-brand-400 space-y-4 text-lg text-left md:text-center">
              <p>
                {SITE_NAME} was born from a simple idea: every rider in India should have access to
                high-quality, certified motorcycle helmets at fair prices.
              </p>
              <p>
                As avid riders ourselves, we were frustrated with confusing information, fake products,
                and compromised safety. We set out to build a specialist destination that curates only
                trusted brands, educates riders, and makes choosing the right helmet simple.
              </p>
              <p>
                Today, we serve riders across India with a handpicked selection of full-face, half-face,
                modular, and off-road helmets, along with honest reviews and expert guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-display text-white text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent-500/10 text-accent-500 flex items-center justify-center mx-auto mb-4">
                  <value.icon size={28} />
                </div>
                <h3 className="font-bold text-white mb-2">{value.title}</h3>
                <p className="text-brand-500 text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-[hsl(0,0%,7%)]">
        <div className="container-custom">
          <h2 className="text-3xl font-display text-white text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/[0.03] rounded-2xl p-6 text-center border border-white/10"
              >
                <div className="w-20 h-20 rounded-full bg-accent-500/10 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-accent-400">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-bold text-white">{member.name}</h3>
                <p className="text-accent-400 text-sm mb-2">{member.role}</p>
                <p className="text-brand-500 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-accent-500 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-display mb-4">Ready to Ride Safe?</h2>
          <p className="text-accent-100 mb-8 max-w-xl mx-auto">
            Browse our collection of ISI/DOT certified helmets and find your perfect fit. If you&apos;re unsure,
            reach out to our team and we&apos;ll help you choose based on your riding style and budget.
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-accent-600 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}
