"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ChevronDown } from "lucide-react";

const STATUSES = ["new", "contacted", "closed"] as const;
type Status = (typeof STATUSES)[number];

const STATUS_STYLES: Record<Status, string> = {
  new: "bg-green-400/10 text-green-400 border-green-400/25 hover:border-green-400/50",
  contacted: "bg-blue-400/10 text-blue-400 border-blue-400/25 hover:border-blue-400/50",
  closed: "bg-luxury-700/60 text-luxury-400 border-luxury-600/40 hover:border-luxury-500/60",
};

export default function UpdateLeadStatus({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: Status;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Status;
    const prevStatus = status;
    setStatus(newStatus);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      setStatus(prevStatus);
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className={`text-[10px] font-bold tracking-widest uppercase pl-2.5 pr-6 py-1.5 rounded-full border outline-none cursor-pointer appearance-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${STATUS_STYLES[status]}`}
      >
        {STATUSES.map((s) => (
          <option
            key={s}
            value={s}
            className="bg-luxury-800 text-luxury-50 text-sm normal-case font-medium tracking-normal"
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>

      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
        {loading ? (
          <span className="block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin opacity-60" />
        ) : (
          <ChevronDown className="w-3 h-3 opacity-50" />
        )}
      </span>
    </div>
  );
}
