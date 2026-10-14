import { BookingBar, BookingModal } from '@/components/Booking';
import { Effects } from '@/components/Effects';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { About, Amenities, Footer, Gallery, Location, Reviews, Rooms } from '@/components/Hotel';
import { IconSprite } from '@/components/Icon';
import { CategoryStrip, DumSection, Marquee } from '@/components/Intro';
import { Menu } from '@/components/Menu';
import { CartBar, CartDrawer, DishSheet, Lightbox, OrderConfirm, Toast } from '@/components/Overlays';
import { SiteProvider } from '@/components/SiteProvider';

export default function Home() {
  return (
    <SiteProvider>
      <div className="preloader" aria-hidden="true">
        <div className="preloader__mark">
          <span className="preloader__logo">HMR</span>
          <span className="preloader__line" />
          <span className="preloader__sub">Hotels &amp; Resorts</span>
        </div>
      </div>

      <Header />
      <main>
        <Hero />
        <BookingBar />
        <DumSection />
        <CategoryStrip />
        <Marquee />
        <Menu />
        <Rooms />
        <Amenities />
        <About />
        <Gallery />
        <Reviews />
        <Location />
      </main>
      <Footer />

      <CartBar />
      <CartDrawer />
      <OrderConfirm />
      <DishSheet />
      <BookingModal />
      <Lightbox />
      <Toast />
      <IconSprite />
      <Effects />
    </SiteProvider>
  );
}
