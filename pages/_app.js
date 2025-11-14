import '../styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Amigos do Céu</title>
        <meta name="description" content="Galeria contemplativa com imagens e histórias de santos católicos." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/rosario_icon2.png" />
        <link rel="shortcut icon" href="/images/rosario_icon2.png" />
        <link rel="apple-touch-icon" href="/images/rosario_icon2.png" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
