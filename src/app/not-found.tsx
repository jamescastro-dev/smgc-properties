import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-luxury-900 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">

        {/* 404 number */}
        <p className="text-[120px] font-black text-luxury-800 leading-none select-none mb-4">
          404
        </p>

        {/* Gold divider */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="w-12 h-px bg-gold-500" />
          <span className="text-gold-500 text-xs tracking-widest uppercase font-semibold">
            Page Not Found
          </span>
          <span className="w-12 h-px bg-gold-500" />
        </div>

        <h1 className="text-3xl font-extrabold text-luxury-50 tracking-tight mb-4">
          Oops! This page doesn't exist
        </h1>
        <p className="text-luxury-400 text-base leading-relaxed mb-10">
          The page you're looking for may have been moved, deleted, or never
          existed. Let's get you back on track.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-luxury-900 text-sm font-bold px-7 py-3.5 rounded-lg tracking-wide transition-colors">
            <Home className="w-4 h-4" />
            Go to Homepage
          </Link>
          <Link
            href="/properties"
            className="flex items-center gap-2 border border-luxury-600 hover:border-gold-500 text-luxury-50 hover:text-gold-500 text-sm font-bold px-7 py-3.5 rounded-lg tracking-wide transition-all duration-300">
            <ArrowLeft className="w-4 h-4" />
            Browse Properties
          </Link>
        </div>

      </div>
    </main>
  );
}