"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { PHONE_COUNTRIES, composePhone } from "@/lib/phone";

interface Props {
  /** Receives the E.164 number (e.g. +639171234567) on every change. */
  onChange: (phone: string) => void;
  /** Field look shared with the surrounding form (bg, border, padding, radius). */
  fieldClassName: string;
}

/**
 * Country code + mobile number, the way large PH property sites do it
 * (Ayala Land, Dot Property). The native <select> sits invisibly over a
 * compact "PH +63" label so the closed state stays narrow while the open
 * list shows full country names. Invalid numbers block submit via
 * setCustomValidity, so the browser shows the message like any required field.
 */
export default function PhoneInput({ onChange, fieldClassName }: Props) {
  const [country, setCountry] = useState(PHONE_COUNTRIES[0]);
  const [typed, setTyped] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const update = (nextCountry: typeof country, nextTyped: string) => {
    const { phone, error } = composePhone(nextCountry, nextTyped);
    // Empty is left to `required`; anything typed must be a real number.
    inputRef.current?.setCustomValidity(nextTyped.trim() && error ? error : "");
    onChange(nextTyped.trim() ? phone : "");
  };

  return (
    <div className="flex gap-2">
      <div
        className={`${fieldClassName} relative shrink-0 flex items-center gap-1.5 px-3! focus-within:border-gold-500`}>
        <span className="text-luxury-50 text-sm tabular-nums whitespace-nowrap" aria-hidden="true">
          {country.dial ? `${country.iso} +${country.dial}` : "Other"}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-gold-500" aria-hidden="true" />
        <select
          aria-label="Country code"
          value={country.iso}
          onChange={(e) => {
            const next = PHONE_COUNTRIES.find((c) => c.iso === e.target.value)!;
            setCountry(next);
            update(next, typed);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
          {PHONE_COUNTRIES.map((c) => (
            <option key={c.iso} value={c.iso} className="bg-luxury-800 text-luxury-50">
              {c.dial ? `${c.name} (+${c.dial})` : c.name}
            </option>
          ))}
        </select>
      </div>
      <input
        ref={inputRef}
        type="tel"
        name="phone"
        aria-label="Mobile number"
        value={typed}
        onChange={(e) => {
          const next = e.target.value.replace(/[^\d\s+()-]/g, "").slice(0, 20);
          setTyped(next);
          update(country, next);
        }}
        required
        inputMode="tel"
        autoComplete={country.dial ? "tel-national" : "tel"}
        placeholder={country.example}
        className={`${fieldClassName} flex-1 min-w-0`}
      />
    </div>
  );
}
