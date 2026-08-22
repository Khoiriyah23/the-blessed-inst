import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase-external";

export const Route = createFileRoute("/admin/testimonials")({
  component: TestimonialsPage,
});

type Testimonial = {
  id: string;
  quote: string;
  author: string;
  sort_order: number;
};

const emptyDraft = (): Testimonial => ({
  id: "",
  quote: "",
  author: "",
  sort_order: 0,
});

function TestimonialsPage() {
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Testimonial | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, quote, author, sort_order")
      .order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else setRows((data ?? []) as Testimonial[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startEdit = (t: Testimonial) => {
    setCreating(false);
    setEditingId(t.id);
    setDraft({ ...t });
  };

  const startCreate = () => {
    setEditingId(null);
    setCreating(true);
    setDraft(emptyDraft());
  };

  const cancel = () => {
    setEditingId(null);
    setCreating(false);
    setDraft(null);
  };

  const save = async () => {
    if (!draft) return;
    if (!draft.quote.trim() || !draft.author.trim()) { alert("Quote and author are required"); return; }
    setSaving(true);

    if (creating) {
      const { data, error } = await supabase.from("testimonials").insert({
        quote: draft.quote,
        author: draft.author,
        sort_order: draft.sort_order,
      }).select().single();
      setSaving(false);
      if (error) { alert("Create failed: " + error.message); return; }
      setRows((r) => [...r, data as Testimonial].sort((a, b) => a.sort_order - b.sort_order));
    } else {
      const { error } = await supabase.from("testimonials").update({
        quote: draft.quote,
        author: draft.author,
        sort_order: draft.sort_order,
      }).eq("id", draft.id);
      setSaving(false);
      if (error) { alert("Save failed: " + error.message); return; }
      setRows((r) => r.map((x) => x.id === draft.id ? draft : x).sort((a, b) => a.sort_order - b.sort_order));
    }
    cancel();
  };

  const doDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    setDeletingId(null);
    setConfirmDeleteId(null);
    if (error) { alert("Delete failed: " + error.message); return; }
    setRows((r) => r.filter((x) => x.id !== id));
    if (editingId === id) cancel();
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Testimonials</h1>
          <p className="text-sm text-muted-foreground">Manage testimonials shown on the public site.</p>
        </div>
        <button
          onClick={startCreate}
          disabled={creating}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:bg-brand-dark disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}

      {creating && draft && (
        <div className="mb-4 rounded-xl bg-white border-2 border-brand p-5">
          <h3 className="font-semibold text-primary mb-4">New Testimonial</h3>
          <DraftEditor draft={draft} setDraft={setDraft} onCancel={cancel} onSave={save} saving={saving} />
        </div>
      )}

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : (
        <div className="space-y-4">
          {rows.map((t) => {
            const isEditing = editingId === t.id && draft;
            return (
              <div key={t.id} className="rounded-xl bg-white border border-slate-200 p-5">
                {!isEditing ? (
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-slate-700 line-clamp-2">"{t.quote}"</p>
                      <p className="mt-1.5 text-xs font-semibold text-brand">— {t.author}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => startEdit(t)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button onClick={() => setConfirmDeleteId(t.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <DraftEditor draft={draft!} setDraft={setDraft} onCancel={cancel} onSave={save} saving={saving} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setConfirmDeleteId(null)}>
          <div className="max-w-md w-full rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-primary">Delete testimonial?</h3>
            <p className="text-sm text-muted-foreground mt-2">Are you sure? This cannot be undone.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setConfirmDeleteId(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50">Cancel</button>
              <button
                onClick={() => confirmDeleteId && doDelete(confirmDeleteId)}
                disabled={!!deletingId}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deletingId ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DraftEditor({
  draft, setDraft, onCancel, onSave, saving,
}: {
  draft: Testimonial;
  setDraft: (t: Testimonial) => void;
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="space-y-4">
      <Field label="Quote">
        <textarea
          value={draft.quote}
          onChange={(e) => setDraft({ ...draft, quote: e.target.value })}
          rows={3}
          className="w-full rounded-md border border-input px-3 py-2 text-sm"
        />
      </Field>
      <Field label="Author (e.g. 'Parent, USA' or 'Haneefah A., Nigeria')">
        <input
          value={draft.author}
          onChange={(e) => setDraft({ ...draft, author: e.target.value })}
          className="w-full rounded-md border border-input px-3 py-2 text-sm"
        />
      </Field>
      <Field label="Sort Order">
        <input
          type="number"
          value={draft.sort_order}
          onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) || 0 })}
          className="w-full rounded-md border border-input px-3 py-2 text-sm"
        />
      </Field>
      <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
        <button onClick={onCancel} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50">Cancel</button>
        <button onClick={onSave} disabled={saving} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:bg-brand-dark disabled:opacity-60">
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}