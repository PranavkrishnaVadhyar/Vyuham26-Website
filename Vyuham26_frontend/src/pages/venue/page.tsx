import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/motion/AnimatedSection";
import RouteTrace from "@/components/motion/RouteTrace";
import { Kicker } from "@/components/ui/Elements";
import VenueClient from "./VenueClient";

export const metadata: Metadata = {
  title: "Venue",
  description:
    "Vyuham 26 takes place at Technocity campus, Thiruvananthapuram — Digital University Kerala's technology hub. View campus map and directions.",
};

export default function VenuePage() {
  return (
    <>
      <Navbar />

      <main className="relative flex-1 overflow-hidden pt-23">
        <VenueClient />
      </main>

      <Footer />
    </>
  );
}