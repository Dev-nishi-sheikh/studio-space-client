import { HeroSlider } from "@/components/home/hero-slider";
import { MarqueeStrip } from "@/components/home/marquee-strip";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { BrowseCategories } from "@/components/home/browse-categories";
import { HowBookingWorks } from "@/components/home/how-booking-works";
import { HostGuarantee } from "@/components/home/host-guarantee";
import { HostCta } from "@/components/home/host-cta";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <MarqueeStrip />
      <FeaturedStudios />
      <BrowseCategories />
      <HowBookingWorks />
      <HostGuarantee />
      <HostCta />
    </>
  );
}
