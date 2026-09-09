import { publicAsset } from '@/lib/site';
import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: "Let's build a store — Your next online store",
  icons: { icon: { url: publicAsset('/favicon.svg'), type: 'image/svg+xml' } },
  description:
    "Let's build a store. We bring ecommerce design and development together to turn your ambition into an online store that feels unmistakably yours.",
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
