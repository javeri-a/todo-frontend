// frontend/src/app/layout.tsx
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthProviderWrapper from '@/components/AuthProviderWrapper';
import '@/styles/globals.css';

export const metadata = {
  title: 'Todo App',
  description: 'A full-featured todo application with authentication',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <AuthProviderWrapper>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProviderWrapper>
      </body>
    </html>
  );
}