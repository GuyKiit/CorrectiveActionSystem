import React, { useState, useEffect } from 'react';
import Navbar from './component/navbar';
import Sidebar from './component/sidebar';

interface PropsLayout {
  children: React.ReactNode;
}

export default function MasterLayout({ children }: PropsLayout) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      if (window.innerWidth < 640) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Sidebar isOpen={isOpen} />
      
      <div className={`p-4 transition-all duration-300 ${
        isOpen ? 'sm:ml-64' : 'sm:ml-16'
      } pt-20`}>
        <div className="p-4 border-0  rounded-lg dark:border-gray-700">
          {children}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
