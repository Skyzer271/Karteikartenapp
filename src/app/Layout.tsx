import React from 'react';
import { Outlet } from 'react-router';
import { Navbar } from './components/Navbar';

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Outlet />
    </div>
  );
}