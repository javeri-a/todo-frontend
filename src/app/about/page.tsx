// frontend/src/app/about/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiTarget, 
  FiAward, 
  FiUsers, 
  FiGlobe, 
  FiMail, 
  FiTwitter, 
  FiGithub, 
  FiLinkedin,
  FiCheckCircle,
  FiZap,
  FiShield,
  FiSmartphone
} from 'react-icons/fi';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">TodoApp</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to help people organize their lives and achieve their goals through intuitive task management.
          </p>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-16"
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                <FiTarget className="text-blue-600 mr-3" /> Our Mission
              </h2>
              <p className="text-gray-600 mb-4">
                At TodoApp, our mission is to simplify task management and boost productivity for individuals and teams worldwide. 
                We believe that everyone deserves a tool that helps them stay organized without adding complexity to their lives.
              </p>
              <p className="text-gray-600">
                We're committed to creating solutions that empower people to achieve more with less stress, 
                allowing them to focus on what truly matters to them.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-1 w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                <div className="bg-white rounded-lg w-full h-full flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                      <FiTarget className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Mission</h3>
                    <p className="text-gray-600 mt-2">Simplify task management for everyone</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: <FiAward className="h-8 w-8" />, 
                title: "Excellence", 
                description: "We strive for excellence in everything we do, from our code to our customer service." 
              },
              { 
                icon: <FiUsers className="h-8 w-8" />, 
                title: "Community", 
                description: "We build our products with our community in mind, listening to their needs." 
              },
              { 
                icon: <FiGlobe className="h-8 w-8" />, 
                title: "Accessibility", 
                description: "We believe great tools should be accessible to everyone, regardless of their background." 
              },
              { 
                icon: <FiZap className="h-8 w-8" />, 
                title: "Innovation", 
                description: "We continuously innovate to bring fresh solutions to everyday challenges." 
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Why Choose TodoApp?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                icon: <FiCheckCircle className="h-6 w-6" />, 
                title: "Intuitive Interface", 
                description: "Our clean, user-friendly design makes task management effortless for everyone." 
              },
              { 
                icon: <FiShield className="h-6 w-6" />, 
                title: "Secure & Private", 
                description: "Your data is protected with industry-standard security measures." 
              },
              { 
                icon: <FiSmartphone className="h-6 w-6" />, 
                title: "Cross-Platform Sync", 
                description: "Access your tasks from any device, anywhere, anytime." 
              },
              { 
                icon: <FiZap className="h-6 w-6" />, 
                title: "Lightning Fast", 
                description: "Optimized for speed and performance to keep you productive." 
              }
            ].map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "CEO & Founder",
                bio: "Visionary leader with 10+ years in productivity software development.",
                avatar: "https://randomuser.me/api/portraits/men/41.jpg"
              },
              {
                name: "Maria Garcia",
                role: "Lead Developer",
                bio: "Passionate about creating elegant solutions to complex problems.",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                name: "David Chen",
                role: "UX Designer",
                bio: "Specializes in creating intuitive interfaces that delight users.",
                avatar: "https://randomuser.me/api/portraits/men/22.jpg"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-blue-600 font-medium">{member.role}</p>
                <p className="text-gray-600 mt-2">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-10 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Productivity?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already revolutionized their task management.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/signup">
              <button className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                Get Started Now
              </button>
            </Link>
            <Link href="/demo">
              <button className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border-2 border-white text-base font-medium rounded-lg text-white bg-transparent hover:bg-white hover:text-blue-600 transition-all duration-300">
                Try Demo
              </button>
            </Link>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
          <div className="flex justify-center space-x-6">
            <Link href="mailto:contact@todoapp.com" className="text-gray-600 hover:text-blue-600 transition-colors">
              <FiMail className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              <FiTwitter className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              <FiGithub className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              <FiLinkedin className="h-6 w-6" />
            </Link>
          </div>
          <p className="mt-6 text-gray-600">
            © {new Date().getFullYear()} TodoApp. All rights reserved.
          </p>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;