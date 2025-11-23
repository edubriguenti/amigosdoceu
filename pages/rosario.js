import Head from 'next/head';
import Layout from '../components/Layout';
import RosarioVirtual from '../components/RosarioVirtual';

export default function RosarioPage() {
  return (
    <Layout>
      <Head>
        <title>Rosário Virtual - Amigos do Céu</title>
        <meta
          name="description"
          content="Reze o Santo Rosário online com nosso guia interativo. Mistérios Gozosos, Dolorosos, Gloriosos e Luminosos. Acompanhamento visual, timer e estatísticas de oração."
        />
        <meta name="keywords" content="rosário virtual, terço online, oração, mistérios do rosário, Ave Maria, Pai Nosso, orações católicas" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Rosário Virtual - Amigos do Céu" />
        <meta property="og:description" content="Reze o Santo Rosário online com nosso guia interativo. Mistérios Gozosos, Dolorosos, Gloriosos e Luminosos." />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rosário Virtual - Amigos do Céu" />
        <meta name="twitter:description" content="Reze o Santo Rosário online com nosso guia interativo. Mistérios Gozosos, Dolorosos, Gloriosos e Luminosos." />
      </Head>

      <RosarioVirtual />
    </Layout>
  );
}
