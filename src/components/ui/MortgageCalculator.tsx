"use client";

import { useState, useMemo } from "react";

interface Props {
  defaultPrice?: number;
}

export default function MortgageCalculator({ defaultPrice }: Props) {
  const [price, setPrice] = useState(defaultPrice || 3500000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [years, setYears] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);

  const result = useMemo(() => {
    const downPayment = (price * downPaymentPct) / 100;
    const loanAmount = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = years * 12;

    const monthlyPayment =
      monthlyRate === 0
        ? loanAmount / numPayments
        : (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
          (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - loanAmount;

    return {
      downPayment,
      loanAmount,
      monthlyPayment,
      totalPayment,
      totalInterest,
    };
  }, [price, downPaymentPct, years, interestRate]);

  const formatPHP = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-6 flex flex-col gap-6">
      <div>
        <h3 className="text-luxury-50 text-lg font-bold mb-1">
          Mortgage Calculator
        </h3>
        <p className="text-luxury-400 text-xs">
          Estimate your monthly payment
        </p>
      </div>

      <div className="flex flex-col gap-5">

        {/* Property Price */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
              Property Price
            </label>
            <span className="text-gold-500 text-xs font-bold">
              {formatPHP(price)}
            </span>
          </div>
          <input
            type="range"
            min={500000}
            max={20000000}
            step={100000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full accent-gold-500"
          />
          <div className="flex justify-between text-luxury-500 text-xs">
            <span>₱500K</span>
            <span>₱20M</span>
          </div>
        </div>

        {/* Down Payment */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
              Down Payment
            </label>
            <span className="text-gold-500 text-xs font-bold">
              {downPaymentPct}% — {formatPHP(result.downPayment)}
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={50}
            step={5}
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            className="w-full accent-gold-500"
          />
          <div className="flex justify-between text-luxury-500 text-xs">
            <span>10%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Loan Term */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
              Loan Term
            </label>
            <span className="text-gold-500 text-xs font-bold">
              {years} years
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            step={5}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-gold-500"
          />
          <div className="flex justify-between text-luxury-500 text-xs">
            <span>5 yrs</span>
            <span>30 yrs</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
              Interest Rate
            </label>
            <span className="text-gold-500 text-xs font-bold">
              {interestRate}% per year
            </span>
          </div>
          <input
            type="range"
            min={3}
            max={15}
            step={0.5}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-gold-500"
          />
          <div className="flex justify-between text-luxury-500 text-xs">
            <span>3%</span>
            <span>15%</span>
          </div>
        </div>

      </div>

      {/* Results */}
      <div className="bg-luxury-900 border border-luxury-700 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-4 border-b border-luxury-700">
          <p className="text-luxury-300 text-sm">Monthly Payment</p>
          <p className="text-gold-500 text-2xl font-black">
            {formatPHP(result.monthlyPayment)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-luxury-400 text-xs">Loan Amount</p>
          <p className="text-luxury-50 text-sm font-semibold">
            {formatPHP(result.loanAmount)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-luxury-400 text-xs">Total Interest</p>
          <p className="text-luxury-50 text-sm font-semibold">
            {formatPHP(result.totalInterest)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-luxury-400 text-xs">Total Payment</p>
          <p className="text-luxury-50 text-sm font-semibold">
            {formatPHP(result.totalPayment)}
          </p>
        </div>
      </div>

      <p className="text-luxury-500 text-xs text-center leading-relaxed">
        This is an estimate only. Contact Broker Shella for actual bank
        financing options.
      </p>
    </div>
  );
}