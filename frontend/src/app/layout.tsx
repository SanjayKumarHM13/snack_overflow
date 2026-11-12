import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '../context/QueryProvider';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

export const metadata: Metadata = {
  title: 'Snack Overflow — Office Pantry Inventory',
  description: 'Real-time snack inventory management system for modern offices',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-pantry-bg text-navy-950 min-h-screen">
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
