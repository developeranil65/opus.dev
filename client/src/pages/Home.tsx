import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import UseCasesSection from '../components/UseCasesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="bg-slate-950 min-h-screen text-white">
      <Navbar />
      <main>
        {/* The LampContainer hero section with the "Vanish Input" form */}
        <HeroSection />
        
        {/* The "All-in-One Polling" section with the Wobble Cards */}
        <FeatureSection />
        <UseCasesSection /> 
        <TestimonialsSection />
        
        {/* We can add the "Use Cases" and final "CTA" sections here later */}
      </main>
      <Footer />
    </div>
  );
}