import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase-external";

export const Route = createFileRoute("/admin/registrations")({
  component: RegistrationsPage,
});

type Registration = {
  id: string;
  created_at: string;
  registering_for: string;
  full_name: string;
  email: string;
  phone: string;
  selected_courses: string[];
  knowledge_level: string;
  sessions_per_week: string;
  monthly_price: number;
  availability: { day: string; time: string }[];
  number_of_students: number;
  special_requirements: string | null;
  status: string;
};

const STATUS_OPTIONS = ["pending_payment", "paid", "overdue"];

function RegistrationsPage() {
  const [rows, setRows] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setRows((data ?? []) as Registration[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    const { error } = await supabase.from("registrations").update({ status }).eq("id", id);
    if (error) alert("Failed to update: " + error.message);
  };

  const deleteRegistration = async (id: string) => {
  if (!confirm('Are you sure you want to delete this registration? This cannot be undone.')) return;
  const { error } = await supabase.from('registrations').delete().eq('id', id);
  if (error) { alert('Failed to delete: ' + error.message); return; }
  setRows(prev => prev.filter(r => r.id !== id));
  if (expanded === id) setExpanded(null);
};

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Registrations</h1>
          <p className="text-sm text-muted-foreground">{rows.length} total</p>
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}

      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 w-8"></th>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Courses</th>
              <th className="px-4 py-3">Sessions/Wk</th>
              <th className="px-4 py-3">Monthly</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Registered</th>
              <th className="px-4 py-3">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
  {loading && (
    <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>
  )}
  {!loading && rows.length === 0 && (
    <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No registrations yet.</td></tr>
  )}
  {rows.map((r) => {
    const open = expanded === r.id;
    return (
      <>
        <tr key={r.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setExpanded(open ? null : r.id)}>
          <td className="px-4 py-3 text-slate-400">{open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</td>
          <td className="px-4 py-3 font-medium">{r.full_name}</td>
          <td className="px-4 py-3 max-w-xs truncate">{r.selected_courses?.join(", ")}</td>
          <td className="px-4 py-3">{r.sessions_per_week}</td>
          <td className="px-4 py-3">₦{Number(r.monthly_price).toLocaleString()}</td>
          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
            <select
              value={r.status}
              onChange={(e) => updateStatus(r.id, e.target.value)}
              className={`rounded-md border px-2 py-1 text-xs font-medium ${
                r.status === "paid" ? "bg-green-50 border-green-200 text-green-700"
                : r.status === "overdue" ? "bg-red-50 border-red-200 text-red-700"
                : "bg-amber-50 border-amber-200 text-amber-700"
              }`}
            >
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </td>
          <td className="px-4 py-3 text-slate-500">{new Date(r.created_at).toLocaleDateString()}</td>
          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => deleteRegistration(r.id)}
              className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100 transition"
            >
              Delete
            </button>
          </td>
        </tr>
        {open && (
          <tr key={r.id + "-x"} className="bg-slate-50/60">
            <td></td>
            <td colSpan={7} className="px-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Field label="Email" value={r.email} />
                <Field label="Phone" value={r.phone} />
                <Field label="Registering For" value={r.registering_for} />
                <Field label="Knowledge Level" value={r.knowledge_level} />
                <Field label="Number of Students" value={String(r.number_of_students)} />
                <Field label="Special Requirements" value={r.special_requirements || "None"} />
                <div className="col-span-2">
                  <div className="text-xs font-semibold text-slate-500 mb-1">Availability</div>
                  <ul className="space-y-1">
                    {(r.availability ?? []).map((a, i) => (
                      <li key={i} className="text-sm">• <b>{a.day}:</b> {a.time}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </td>
          </tr>
        )}
      </>
    );
  })}
</tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="text-sm text-slate-800">{value}</div>
    </div>
  );
}
