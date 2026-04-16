import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Menu from '@/components/Menu';
import Cocktail from '@/components/Cocktail';
import Bevande from '@/components/Bevande'; // Aggiunto
import Contatti from '@/components/Contatti';
import Footer from '@/components/Footer';

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