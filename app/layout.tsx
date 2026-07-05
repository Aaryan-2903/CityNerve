import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { CityProvider } from '@/src/context/CityContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CityNerve — AI Disaster Intelligence Platform',
  description:
    'AI-powered Emergency Operations Center platform for real-time disaster intelligence, incident management, and decision support.',
  keywords: ['emergency operations', 'disaster management', 'AI', 'EOC', 'incident command'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#070B14] text-white">
        <CityProvider>
          {children}
        </CityProvider>
      </body>
    </html>
  );
}
