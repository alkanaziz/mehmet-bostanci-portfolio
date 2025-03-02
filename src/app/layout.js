import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Nav from "@/components/navbar/Nav";
import Breadcrumb from "@/components/Breadcrumb";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} mx-auto flex min-h-screen max-w-6xl flex-col border-gray-500 bg-white text-black antialiased shadow-xl`}
      >
        <Header />
        <Nav />
        {/* <Sidebar /> */}
        <Breadcrumb />
        {children}
        <Footer />
      </body>
    </html>
  );
}
