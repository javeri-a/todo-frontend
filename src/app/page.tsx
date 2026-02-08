// frontend/src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';
import { motion } from 'framer-motion';
import { 
  FiCheckCircle, 
  FiLock, 
  FiSmartphone, 
  FiZap, 
  FiStar, 
  FiUsers, 
  FiBarChart2, 
  FiMail, 
  FiTwitter, 
  FiFacebook, 
  FiInstagram,
  FiMessageSquare,
  FiArrowRight
} from 'react-icons/fi';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ users: 0, tasks: 0, completed: 0 });

  // Animate stats counter
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        users: 10000,
        tasks: 50000,
        completed: 45000
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-32">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center mix-blend-multiply opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-12 md:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Productivity</span> Today
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                The ultimate task management solution designed to help you organize, prioritize, and accomplish more in less time. Join thousands of productive individuals today.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {isAuthenticated ? (
                  <Link href="/tasks">
                    <Button className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      View My Tasks
                      <FiArrowRight className="ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/signup">
                    <Button className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Get Started Free
                      <FiArrowRight className="ml-2" />
                    </Button>
                  </Link>
                )}
                
                <Link href="/tasks">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 shadow hover:shadow-md"
                  >
                    Try Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-1 transform rotate-3">
                  <div className="bg-white rounded-xl p-6 w-80 h-96 flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                      <div className="mb-3">
                        <div className="flex items-center mb-2">
                          <input type="checkbox" className="mr-2 h-4 w-4 text-blue-600 rounded" defaultChecked />
                          <span className="line-through text-gray-500">Complete project proposal</span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center mb-2">
                          <input type="checkbox" className="mr-2 h-4 w-4 text-blue-600 rounded" defaultChecked />
                          <span className="line-through text-gray-500">Schedule team meeting</span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center mb-2">
                          <input type="checkbox" className="mr-2 h-4 w-4 text-blue-600 rounded" />
                          <span>Prepare presentation slides</span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center mb-2">
                          <input type="checkbox" className="mr-2 h-4 w-4 text-blue-600 rounded" />
                          <span>Review quarterly reports</span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center mb-2">
                          <input type="checkbox" className="mr-2 h-4 w-4 text-blue-600 rounded" />
                          <span>Follow up with clients</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">3 tasks remaining</span>
                        <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                          + Add new task
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 bg-yellow-400 rounded-lg shadow-lg p-4 w-48">
                  <p className="text-sm font-medium text-gray-800">"Increased my productivity by 40%"</p>
                  <p className="text-xs text-gray-600 mt-1">- Sarah K.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">{stats.users.toLocaleString()}+</div>
              <div className="text-blue-100">Active Users</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">{stats.tasks.toLocaleString()}+</div>
              <div className="text-blue-100">Tasks Created</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">{Math.round((stats.completed / stats.tasks) * 100)}%</div>
              <div className="text-blue-100">Tasks Completed</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your tasks efficiently and effectively
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: <FiCheckCircle className="h-8 w-8" />, 
                title: "Task Management", 
                description: "Create, update, and organize your tasks with our intuitive interface." 
              },
              { 
                icon: <FiLock className="h-8 w-8" />, 
                title: "Secure Authentication", 
                description: "Your data is protected with industry-standard security measures." 
              },
              { 
                icon: <FiSmartphone className="h-8 w-8" />, 
                title: "Responsive Design", 
                description: "Access your tasks from any device with our responsive design." 
              },
              { 
                icon: <FiZap className="h-8 w-8" />, 
                title: "Fast Performance", 
                description: "Enjoy a smooth, fast experience with optimized loading times." 
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-b from-white to-gray-50 rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied users who transformed their productivity
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "This app completely changed how I manage my daily tasks. I've become so much more organized and productive!",
                author: "Alex Johnson",
                role: "Product Manager"
              },
              {
                quote: "The clean interface and powerful features make this the best todo app I've ever used. Highly recommended!",
                author: "Maria Garcia",
                role: "Software Engineer"
              },
              {
                quote: "I love how easy it is to use. My productivity has increased significantly since I started using this app.",
                author: "David Chen",
                role: "Marketing Director"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Boost Your Productivity?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of users who have transformed their workflow with our app
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/signup">
                <Button className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Get Started Now
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border-2 border-white text-base font-medium rounded-lg text-white bg-transparent hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  Sign In to Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <motion.div 
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30,
          delay: 1 
        }}
      >
        <Link href="/tasks?chat=open">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
          >
            <FiMessageSquare className="h-8 w-8 text-white" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}