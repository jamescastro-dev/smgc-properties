import MortgageCalculator from "@/components/ui/MortgageCalculator";

export default function AdminCalculatorPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-extrabold text-luxury-50">
          Mortgage Calculator
        </h1>
        <p className="text-luxury-400 text-sm mt-1">
          Estimate monthly payments for your clients.
        </p>
      </div>
      <div className="flex justify-center">
      <div className="flex flex-col items-center gap-6 w-full max-w-lg text-center">
        <div className="w-full">
          <MortgageCalculator />
        </div>
      </div>
      </div>
    </div>
  );
}
