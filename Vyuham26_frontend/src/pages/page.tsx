import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "./sections/HeroSection";
import StatsBar from "./sections/StatsBar";
import AboutSection from "./sections/AboutSection";
import StreamsSection from "./sections/StreamsSection";
import ScheduleSection from "./sections/ScheduleSection";
import CtaSection from "./sections/CtaSection";
import IntroSequence from "@/components/motion/IntroSequence";
import SignalTicker from "@/components/ui/SignalTicker";
import { PageEntranceProvider } from "@/components/motion/PageEntrance";

export default function HomePage() {
  return (
    <>
      <IntroSequence />
      <Navbar />
      <PageEntranceProvider>
        <main className="flex-1">
          <HeroSection />
          <SignalTicker />
          <StatsBar />
          <AboutSection />
          <StreamsSection />
          <ScheduleSection />
          <CtaSection />
        </main>
      </PageEntranceProvider>
      <Footer />
    </>
  );
}


