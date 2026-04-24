import "../styles/globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Head from "next/head";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Head>
        <meta name="theme-color" content="#0A0A0F" />
      </Head>
      <div
        className={`${inter.className} ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
        style={{ minHeight: "100%" }}
      >
        <Component {...pageProps} />
      </div>
    </UserProvider>
  );
}

export default MyApp;
