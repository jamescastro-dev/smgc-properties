const DEVELOPERS = [
  "Archer Realty",
  "St. Agatha Homes",
  "Evara Residences",
  "Santa Clara",
  "Alegria",
  "Amihana",
  "SMDC",
  "Robinsons Homes",
  "Serene Townhomes",
  "Cross Roads",
  "Polaris",
  "Camella",
  "Asian Land",
  "DMCI Homes",
  "Demeterland",
  "Filinvest Land",
  "Avida",
  "Landco Pacific",
  "MiraVerde",
  "Amaia",
  "Manhattan Residences",
];

export default function AccreditedDevelopers() {
  return (
    <section className="bg-luxury-800 border-y border-luxury-700 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <div className="inline-flex items-center gap-2">
          <span className="w-8 h-px bg-gold-500" />
          <span className="text-gold-500 text-xs tracking-widest uppercase font-semibold">
            Accredited Developers
          </span>
          <span className="w-8 h-px bg-gold-500" />
        </div>
      </div>

      {/* Scrolling marquee */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-linear-to-r from-luxury-800 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-linear-to-l from-luxury-800 to-transparent pointer-events-none" />

        <div className="flex gap-6 animate-marquee whitespace-nowrap">
          {[...DEVELOPERS, ...DEVELOPERS].map((name, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-luxury-700 bg-luxury-900 text-luxury-300 text-sm font-medium tracking-wide shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
