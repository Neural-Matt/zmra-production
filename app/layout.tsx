import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZMRA - Medicine Search",
  description: "Search and explore medicines in the ZMRA database",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
