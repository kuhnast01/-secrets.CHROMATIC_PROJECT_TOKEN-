
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { RoleProvider } from './RoleProvider';
import { PreviewProvider } from './PreviewProvider';
import { ErrorBoundary } from './ErrorBoundary';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Admin Panel | Poseidon Platform',
  description: 'Admin Panel for Poseidon Platform: Secure, Unified, and Scalable Operations',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RoleProvider role="admin">
          <PreviewProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </PreviewProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
