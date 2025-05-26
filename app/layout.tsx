import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { SplashScreen } from '@/components/splash-screen';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Assistant with Web Access | Like Look Solutions',
  description: 'An advanced AI assistant with real-time web browsing capabilities, developed by Julio Campos Machado at Like Look Solutions.',
  authors: [{ name: 'Julio Campos Machado', url: 'https://likelook.wixsite.com/solutions' }],
  keywords: ['AI Assistant', 'Web Browsing', 'Content Generation', 'Like Look Solutions', 'Julio Campos Machado'],
  openGraph: {
    title: 'AI Assistant with Web Access | Like Look Solutions',
    description: 'Advanced AI assistant with real-time web browsing capabilities',
    url: 'https://likelook.wixsite.com/solutions',
    siteName: 'Like Look Solutions AI Assistant',
    images: [
      {
        url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
        width: 1200,
        height: 630,
        alt: 'AI Assistant Interface'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Assistant with Web Access | Like Look Solutions',
    description: 'Advanced AI assistant with real-time web browsing capabilities',
    images: ['https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <SplashScreen />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}