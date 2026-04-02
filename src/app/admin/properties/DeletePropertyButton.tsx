"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DeletePropertyButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property? This cannot be undone.")) return;

    setLoading(true);
    setFailed(false);
    const supabase = createClient();
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) {
      setFailed(true);
      setLoading(false);
      return;
    }
    router.refresh();
  };

  if (failed) {
    return (
      <span className="text-red-400 text-xs font-medium" title="Delete failed — try again">
        Failed
      </span>
    );
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-luxury-400 hover:text-red-400 transition-colors disabled:opacity-50"
      title="Delete">
      {loading ? (
        <span className="w-4 h-4 border-2 border-luxury-400/30 border-t-luxury-400 rounded-full animate-spin inline-block" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}