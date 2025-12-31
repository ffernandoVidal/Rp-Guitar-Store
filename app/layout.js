import './globals.css'

export const metadata = {
  title: 'RP GUITAR - Tienda de Guitarras y Accesorios',
  description: 'RP GUITAR - Tu tienda de confianza en Guatemala para guitarras eléctricas, acústicas, bajos, pedales de efectos, amplificadores y accesorios musicales de las mejores marcas.',
  keywords: 'guitarras Guatemala, pedales efectos, amplificadores, bajos, accesorios guitarra, Suhr, G&L, Nux, AMT, tienda música Guatemala',
  authors: [{ name: 'RP GUITAR' }],
  openGraph: {
    title: 'RP GUITAR - Tienda de Guitarras y Accesorios',
    description: 'La mejor selección de guitarras, pedales, amplificadores y accesorios musicales en Guatemala.',
    type: 'website',
    url: 'https://rpguitar.com',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
