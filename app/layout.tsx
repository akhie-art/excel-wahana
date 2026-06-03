import type { Metadata } from "next";
import { Outfit, Fira_Code } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const sansFont = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const monoFont = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://excel-wahana.vercel.app"),
  title: "Excel Wahana — Belajar Microsoft Excel Interaktif Gratis No. 1",
  description: "Platform kursus online Microsoft Excel interaktif gratis nomor 1 di Indonesia. Pelajari rumus SUM, AVERAGE, VLOOKUP, dan IF melalui simulator spreadsheet langsung di browser dengan feedback instan.",
  keywords: [
    "belajar excel online",
    "belajar excel gratis",
    "rumus excel lengkap",
    "lms excel indonesia",
    "simulator excel",
    "vlookup",
    "if nested",
    "belajar formula excel",
    "interactive excel training",
    "excel payroll tutorial",
    "kursus excel online"
  ],
  authors: [{ name: "Excel Wahana Team" }],
  creator: "Excel Wahana",
  publisher: "Excel Wahana",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Excel Wahana — Belajar Microsoft Excel Interaktif Gratis",
    description: "Platform LMS Microsoft Excel interaktif gratis dengan simulator rumus instan di browser. Kuasai formula dasar hingga tingkat lanjut dengan cepat.",
    url: "https://excel-wahana.vercel.app",
    siteName: "Excel Wahana",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Excel Wahana — Belajar Excel Secara Interaktif",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Excel Wahana — Belajar Microsoft Excel Interaktif Gratis",
    description: "Kuasai rumus Microsoft Excel secara interaktif dengan simulator spreadsheet langsung di browser. Gratis 100%.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${monoFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Hidden SVG Filter to create handwriting/sketch effect on line icons */}
        <svg xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
          <defs>
            <filter id="rough-sketch" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        {/* Structured Data (Schema.org) for Google SEO Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://excel-wahana.vercel.app/#software",
                  "name": "Excel Wahana",
                  "url": "https://excel-wahana.vercel.app",
                  "applicationCategory": "EducationalApplication",
                  "operatingSystem": "All",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "IDR"
                  },
                  "description": "Platform simulator Microsoft Excel interaktif gratis nomor 1 di Indonesia. Belajar rumus SUM, AVERAGE, VLOOKUP, dan IF secara langsung."
                },
                {
                  "@type": "Course",
                  "@id": "https://excel-wahana.vercel.app/#course",
                  "name": "Belajar Rumus Microsoft Excel Interaktif",
                  "description": "Kuasai rumus excel dasar hingga lanjutan (VLOOKUP, NESTED IF) dengan simulator spreadsheet instan di browser.",
                  "provider": {
                    "@type": "Organization",
                    "name": "Excel Wahana",
                    "url": "https://excel-wahana.vercel.app"
                  }
                }
              ]
            })
          }}
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

