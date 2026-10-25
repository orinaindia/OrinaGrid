import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import { LazyEnquiryPopup } from '@/components/forms/LazyEnquiryPopup';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { SITE } from '@/lib/site';
import './globals.css';

const instrument = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
  // only small labels use it: not worth a preload ahead of the page's own fonts
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Orina Grid: rooftop solar with a trusted partner in your district',
    template: '%s · Orina Grid',
  },
  description:
    'Rooftop solar for homes, housing societies and businesses across India: a free site survey, a clear quotation with GST and the PM Surya Ghar subsidy, installation, net meter and subsidy paperwork by a trusted local partner.',
  openGraph: { type: 'website', siteName: 'Orina Grid', locale: 'en_IN' },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#F7F6F2',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`${instrument.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* before the first paint: things that animate in may start hidden (never without JS) */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a
          href="#main"
          className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-full bg-ink px-5 py-3 text-on-ink focus:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <LazyEnquiryPopup />
        </SmoothScroll>
      </body>
    </html>
  );
}
