import SEO from '../components/SEO';
import { SEO_ROSARIO } from '../lib/seoOracoes';
import Layout from '../components/Layout';
import RosarioVirtual from '../components/RosarioVirtual';
import { resumoFigurinha } from '../lib/albumData';
import { CRISTO_POR_MISTERIO } from '../lib/rosarioConclusao';

export async function getStaticProps() {
  const figurinhas = {};
  Object.entries(CRISTO_POR_MISTERIO).forEach(([tipo, slug]) => {
    figurinhas[tipo] = resumoFigurinha('cristo', slug);
  });
  return { props: { figurinhas } };
}

export default function RosarioPage({ figurinhas }) {
  return (
    <Layout>
      <SEO {...SEO_ROSARIO} />

      <RosarioVirtual figurinhas={figurinhas} />
    </Layout>
  );
}
