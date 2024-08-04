import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pantry Management Appv",
  description: "An app to manage your pantry inventory",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
