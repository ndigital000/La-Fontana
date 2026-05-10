import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';

// Lazy loading per componenti below-the-fold — migliora LCP e TTI
const Menu = dynamic(() => import('@/components/Menu'), {
  loading: () => <div className="h-screen animate-pulse bg-gray-900" />,
});
const Cocktail = dynamic(() => import('@/components/Cocktail'), {
  loading: () => <div className="h-screen animate-pulse bg-gray-900" />,
});
const Bevande = dynamic(() => import('@/components/Bevande'), {
  loading: () => <div className="h-screen animate-pulse bg-gray-900" />,
});
const Contatti = dynamic(() => import('@/components/Contatti'), {
  loading: () => <div className="h-screen animate-pulse bg-gray-900" />,
});
const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-16 bg-gray-900" />,
});

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Menu />
      <Cocktail />
      <Bevande />
      <section id="contatti"> {/* ID aggiunto qui per sicurezza */}
        <Contatti />
      </section>
      <Footer />
    </main>
  );
}