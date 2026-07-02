import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-external";

export const Route = createFileRoute("/admin/pricing")({
  component: PricingPage,
});

type Rule = {
  id: string;
  course_count: number;
  sessions_per_week: string;
  price: number;
};

function PricingPage() {
  const [rows, setRows] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("pricing_rules")
        .select("*")
        .order("course_count", { ascending: true })
        .order("sessions_per_week", { ascending: true });
      if (error) setError(error.message);
      else setRows((data ?? []) as Rule[]);
      setLoading(false);
    })();
  }, []);

  const save = async (r: Rule) => {
    setSaving(r.id);
    const { error } = await supabase.from("pricing_rules").update({ price: r.price }).eq("id", r.id);
    setSaving(null);
    if (error) alert("Save failed: " + error.message);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Pricing Rules</h1>
        <p className="text-sm text-muted-foreground">Adjust monthly price per course count × sessions/week.</p>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}

      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Course Count</th>
              <th className="px-4 py-3">Sessions Per Week</th>
              <th className="px-4 py-3">Price (₦)</th>
              <th className="px-4 py-3 w-32"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>}
            {!loading && rows.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No pricing rules found.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3">{r.course_count}</td>
                <td className="px-4 py-3">{r.sessions_per_week}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={r.price}
                    onChange={(e) => setRows((rs) => rs.map((x) => x.id === r.id ? { ...x, price: Number(e.target.value) } : x))}
                    className="w-36 rounded-md border border-input px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => save(r)}
                    disabled={saving === r.id}
                    className="rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground hover:bg-brand-dark disabled:opacity-60"
                  >
                    {saving === r.id ? "Saving…" : "Save"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
