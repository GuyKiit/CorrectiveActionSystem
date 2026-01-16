
import React from 'react';

export default function Footer() {
  const appVersion = import.meta.env.VITE_VERSION;
  const appName = import.meta.env.VITE_APP_NAME;

  return (
    <footer className="w-full py-4 px-6 mt-auto bg-transparent">
        <div className="flex justify-end items-center text-gray-500 text-sm">
            <span>{appName} Version : {appVersion}</span>
        </div>
    </footer>
  );
}
