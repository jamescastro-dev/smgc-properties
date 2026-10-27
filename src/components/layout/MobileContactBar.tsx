import { Phone, MessageCircle, MessageSquare } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Fixed bottom contact bar for phones/tablets. On a listing the inquiry form
 * sits ~3 screens down on mobile, so this keeps one-tap contact always in reach.
 * Hidden on lg+, where the sticky sidebar already shows Call/Viber.
 * `data-mobile-contact-bar` lets globals.css pad the body so the footer stays clear.
 */
export default function MobileContactBar() {
  return (
    <nav
      aria-label="Contact Broker Shella"
      data-mobile-contact-bar
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-luxury-900/95 backdrop-blur-md border-t border-luxury-700 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        <a
          href={`tel:${SITE_CONFIG.phone}`}
          className="h-12 flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-luxury-900 font-bold text-sm rounded-xl transition-colors">
          <Phone className="w-4 h-4" />
          Call
        </a>
        <a
          href={`viber://chat?number=${SITE_CONFIG.phone.replace(/\D/g, "")}`}
          className="h-12 flex items-center justify-center gap-2 border border-gold-500 text-gold-500 font-bold text-sm rounded-xl transition-colors hover:bg-gold-500 hover:text-luxury-900">
          <MessageCircle className="w-4 h-4" />
          Viber
        </a>
        <a
          href={SITE_CONFIG.messenger}
          target="_blank"
          rel="noopener noreferrer"
          className="h-12 flex items-center justify-center gap-2 border border-gold-500 text-gold-500 font-bold text-sm rounded-xl transition-colors hover:bg-gold-500 hover:text-luxury-900">
          <MessageSquare className="w-4 h-4" />
          Messenger
        </a>
      </div>
    </nav>
  );
}
