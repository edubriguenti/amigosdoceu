import '../styles/globals.css'
import Head from 'next/head'
import { Inter, Playfair_Display } from 'next/font/google'
import NotificacoesLiturgicas from '../components/NotificacoesLiturgicas'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

export default function App({ Component, pageProps }) {
  return (
    <div className={`${inter.variable} ${playfair.variable} font-sans`}>
      <Head>
        {/* Title, description, viewport e canonical são responsabilidade do <SEO> de cada página. */}
        <link rel="icon" href="/images/rosario_icon2.png" />
        <link rel="shortcut icon" href="/images/rosario_icon2.png" />
        <link rel="apple-touch-icon" href="/images/rosario_icon2.png" />
      </Head>
      <Component {...pageProps} />
      <NotificacoesLiturgicas />
    </div>
  )
}
