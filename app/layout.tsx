import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = {title:'Dot garden · Picture puzzles',description:'Make printable dot-to-dot puzzles with adjustable dots and counting challenges.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
