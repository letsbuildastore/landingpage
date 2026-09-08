import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:"Let's build a store — Your next online store",description:"You bring the ambition. Let's turn it into your next online store. Thoughtful design, solid development, and a clear path to launch."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
