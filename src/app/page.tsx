import { Calculator } from '@/components/home/Calculator';
import { FactsMarquee } from '@/components/home/FactsMarquee';
import { Faq } from '@/components/home/Faq';
import { Hero } from '@/components/home/Hero';
import { PartnerTeaser } from '@/components/home/PartnerTeaser';
import { QuotePreview } from '@/components/home/QuotePreview';
import { Segments } from '@/components/home/Segments';
import { Steps } from '@/components/home/Steps';
import { Motion } from '@/components/motion/Motion';
import { SurveySection } from '@/components/site/SurveySection';

export default function Home() {
  return (
    <Motion>
      <Hero />
      <FactsMarquee />
      <Segments />
      <Calculator />
      <Steps />
      <QuotePreview />
      <PartnerTeaser />
      <Faq />
      <SurveySection />
    </Motion>
  );
}
