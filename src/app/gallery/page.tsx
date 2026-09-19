import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import ParallaxTile from "@/components/motion/ParallaxTile";
import { Kicker } from "@/components/ui/Elements";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore moments from previous editions of Vyuham at Digital University Kerala. Photos, highlights, and memories from the multiverse archive.",
};

/* 
  In production, these would be loaded from a CMS or image service.
  For now, we use gradient placeholder cards to demonstrate the layout.
*/
const galleryItems = [
  { id: 1, title: "Opening Ceremony", year: "2025", aspect: "landscape" },
  { id: 2, title: "Hackathon Finals", year: "2025", aspect: "portrait" },
  { id: 3, title: "Cultural Night", year: "2025", aspect: "landscape" },
  { id: 4, title: "Coding Arena", year: "2025", aspect: "square" },
  { id: 5, title: "Dance Battle", year: "2024", aspect: "portrait" },
  { id: 6, title: "Main Stage", year: "2024", aspect: "landscape" },
  { id: 7, title: "Workshop Sessions", year: "2024", aspect: "square" },
  { id: 8, title: "Award Ceremony", year: "2024", aspect: "landscape" },
  { id: 9, title: "Campus Vibes", year: "2025", aspect: "portrait" },
  { id: 10, title: "Tech Expo", year: "2025", aspect: "square" },
  { id: 11, title: "Battle of Bands", year: "2024", aspect: "landscape" },
  { id: 12, title: "Closing Ceremony", year: "2025", aspect: "landscape" },
];

const gradients = [
  "from-emerald-dark to-ink-mid",
  "from-[#0d2a1f] to-[#061510]",
  "from-[#132b1e] to-[#081a10]",
  "from-[#0a3020] to-[#05120b]",
];

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[92px]">
        <section className="py-24 md:py-36">
          <div className="mx-auto w-[min(1200px,calc(100%-48px))] md:w-[min(1200px,calc(100%-64px))]">
            <AnimatedSection>
              <Kicker>
                <span className="signal-dot" />
                Multiverse archive
              </Kicker>
              <h1 className="mt-4 font-display text-[clamp(48px,7vw,100px)] font-semibold leading-[0.85]">
                THE <em>GALLERY.</em>
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-[1.7] text-muted">
                Moments captured from previous editions. The archive grows with
                every Vyuham.
              </p>
            </AnimatedSection>

            {/* Masonry-style grid */}
            <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3">
              {galleryItems.map((item, i) => (
                <ParallaxTile key={item.id} className="mb-4 break-inside-avoid" depth={i % 2 === 0 ? 20 : 14} delay={i * 0.03}>
                  <div
                    className={`group relative overflow-hidden rounded-sm border border-line transition-all duration-300 hover:border-green/30 hover:shadow-[0_0_24px_rgba(200,255,66,0.06)] ${
                      item.aspect === "portrait"
                        ? "aspect-[3/4]"
                        : item.aspect === "square"
                          ? "aspect-square"
                          : "aspect-video"
                    }`}
                  >
                    {/* Gradient placeholder for images */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradients[i % gradients.length]}`}
                    />

                    {/* Grid pattern */}
                    <div className="absolute inset-0 grid-bg opacity-30" />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/90 via-ink/20 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="font-display text-sm font-semibold text-paper">
                        {item.title}
                      </p>
                      <span className="mt-1 font-mono text-[9px] tracking-[0.14em] text-green">
                        VYUHAM {item.year}
                      </span>
                    </div>

                    {/* Corner tag */}
                    <div className="absolute top-3 right-3">
                      <span className="font-mono text-[8px] tracking-[0.14em] text-muted/40">
                        {String(item.id).padStart(3, "0")}
                      </span>
                    </div>
                  </div>
                </ParallaxTile>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
