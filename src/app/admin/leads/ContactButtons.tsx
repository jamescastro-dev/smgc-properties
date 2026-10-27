import { MessageSquare, Phone } from "lucide-react";

/**
 * Call / Text buttons for a lead's phone (stored as E.164, e.g. +639171234567).
 * Full-width and 40px tall so they're easy to hit on a phone.
 */
export default function ContactButtons({
  phone,
  className = "",
}: {
  phone: string;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      <a
        href={`tel:${phone}`}
        className="h-10 flex items-center justify-center gap-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-luxury-900 text-sm font-bold transition-colors">
        <Phone className="w-4 h-4" />
        Call
      </a>
      <a
        href={`sms:${phone}`}
        className="h-10 flex items-center justify-center gap-2 rounded-lg border border-luxury-600 hover:border-gold-500/50 text-luxury-200 hover:text-gold-500 text-sm font-semibold transition-colors">
        <MessageSquare className="w-4 h-4" />
        Text
      </a>
    </div>
  );
}
