import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Nav from "@/components/navbar/Nav";
import Breadcrumb from "@/components/Breadcrumb";
import { getMenu, getPageTitles, getSettings } from "@/lib/cms";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Bostanci Art",
  description: "Mehmet Bostanci Art, Malerei & Grafik Design",
};

export default async function RootLayout({ children }) {
  const [menu, titles, settings] = await Promise.all([getMenu(), getPageTitles(), getSettings()]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} mx-auto flex min-h-screen max-w-6xl flex-col border-gray-500 bg-white text-black antialiased shadow-xl`}
      >
        <Header />
        <Nav menuItems={menu} />
        <Breadcrumb titles={titles} />
        {children}
        <Footer settings={settings} />
      </body>
    </html>
  );
}
