import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema Papelão Ondulado Brasil',
  description: 'Sistema completo para gestão da indústria de papelão ondulado no Brasil. FEFCO, McKee, cotações 3D e muito mais.',
  keywords: ['papelão ondulado', 'FEFCO', 'caixas', 'corrugado', 'brasil', 'indústria', 'embalagens'],
  authors: [{ name: 'Sua Empresa' }],
  creator: 'Sua Empresa',
  publisher: 'Sua Empresa',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: process.env.NEXTAUTH_URL || 'https://your-app.vercel.app',
    siteName: 'Sistema Papelão Ondulado Brasil',
    title: 'Sistema Papelão Ondulado Brasil',
    description: 'Revolucione sua indústria de papelão ondulado com nosso sistema completo',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sistema Papelão Ondulado Brasil',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sistema Papelão Ondulado Brasil',
    description: 'Revolucione sua indústria de papelão ondulado',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}