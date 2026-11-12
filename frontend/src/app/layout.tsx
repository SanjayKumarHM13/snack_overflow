import type { Metadata } from 'next';
import './globals.css';

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
        {children}
      </body>
    </html>
  );
}
