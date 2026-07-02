import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, X, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase-external";

export const Route = createFileRoute("/admin/courses")({
  component: CoursesPage,
});

type Course = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  curriculum: string[];
  features: string[];
  category: string;
  sort_order: number;
};

const emptyDraft = (): Course => ({
  id: "",
  title: "",
  slug: "",
  short_description: "",
  description: "",
  curriculum: [],
  features: [],
  category: "general",
  sort_order: 0,
});

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function CoursesPage() {
  const [rows, setRows] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Course | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .select("id, title, slug, short_description, description, curriculum, features, category, sort_order")
      .order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else setRows((data ?? []) as Course[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startEdit = (c: Course) => {
    setCreating(false);
    setEditingId(c.id);
    setDraft({ ...c, curriculum: [...(c.curriculum ?? [])], features: [...(c.features ?? [])] });
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
    if (!draft.title.trim()) { alert("Title is required"); return; }
    setSaving(true);

    if (creating) {
      const slug = draft.slug.trim() || slugify(draft.title);
      const { data, error } = await supabase.from("courses").insert({
        title: draft.title,
        slug,
        short_description: draft.short_description,
        description: draft.description,
        curriculum: draft.curriculum,
        features: draft.features,
        category: draft.category,
        sort_order: draft.sort_order,
      }).select().single();
      setSaving(false);
      if (error) { alert("Create failed: " + error.message); return; }
      setRows((r) => [...r, data as Course].sort((a, b) => a.sort_order - b.sort_order));
    } else {
      const { error } = await supabase.from("courses").update({
        title: draft.title,
        short_description: draft.short_description,
        description: draft.description,
        curriculum: draft.curriculum,
        features: draft.features,
        category: draft.category,
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
    const { error } = await supabase.from("courses").delete().eq("id", id);
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
          <h1 className="text-2xl font-bold text-primary">Courses</h1>
          <p className="text-sm text-muted-foreground">Edit course content shown on the public site.</p>
        </div>
        <button
          onClick={startCreate}
          disabled={creating}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:bg-brand-dark disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> Add New Course
        </button>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}

      {creating && draft && (
        <div className="mb-4 rounded-xl bg-white border-2 border-brand p-5">
          <h3 className="font-semibold text-primary mb-4">New Course</h3>
          <DraftEditor draft={draft} setDraft={setDraft} onCancel={cancel} onSave={save} saving={saving} showSlug />
        </div>
      )}

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : (
        <div className="space-y-4">
          {rows.map((c) => {
            const isEditing = editingId === c.id && draft;
            return (
              <div key={c.id} className="rounded-xl bg-white border border-slate-200 p-5">
                {!isEditing ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-primary truncate">{c.title}</h3>
                        <span className="text-[10px] uppercase tracking-wide rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">{c.category}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{c.description}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => startEdit(c)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button onClick={() => setConfirmDeleteId(c.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
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
            <h3 className="text-lg font-semibold text-primary">Delete course?</h3>
            <p className="text-sm text-muted-foreground mt-2">Are you sure you want to delete this course? This cannot be undone.</p>
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
  draft, setDraft, onCancel, onSave, saving, showSlug,
}: {
  draft: Course;
  setDraft: (c: Course) => void;
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
  showSlug?: boolean;
}) {
  return (
    <div className="space-y-4">
      <Field label="Title">
        <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="w-full rounded-md border border-input px-3 py-2 text-sm" />
      </Field>
      {showSlug && (
        <Field label="Slug (optional — auto-generated from title)">
          <input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} placeholder={slugify(draft.title) || "course-slug"} className="w-full rounded-md border border-input px-3 py-2 text-sm" />
        </Field>
      )}
      <Field label="Short Description">
        <input value={draft.short_description} onChange={(e) => setDraft({ ...draft, short_description: e.target.value })} className="w-full rounded-md border border-input px-3 py-2 text-sm" />
      </Field>
      <Field label="Description">
        <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} rows={3} className="w-full rounded-md border border-input px-3 py-2 text-sm" />
      </Field>
      <ListEditor label="Curriculum" items={draft.curriculum} onChange={(v) => setDraft({ ...draft, curriculum: v })} />
      <ListEditor label="Features" items={draft.features} onChange={(v) => setDraft({ ...draft, features: v })} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Category">
          <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="w-full rounded-md border border-input px-3 py-2 text-sm bg-white">
            <option value="general">General</option>
            <option value="kids">Kids</option>
          </select>
        </Field>
        <Field label="Sort Order">
          <input type="number" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) || 0 })} className="w-full rounded-md border border-input px-3 py-2 text-sm" />
        </Field>
      </div>
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

function ListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const [newItem, setNewItem] = useState("");
  return (
    <Field label={label}>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={it}
              onChange={(e) => onChange(items.map((x, idx) => idx === i ? e.target.value : x))}
              className="flex-1 rounded-md border border-input px-3 py-1.5 text-sm"
            />
            <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="rounded-md border border-slate-200 px-2 py-1 text-slate-500 hover:bg-red-50 hover:text-red-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={`Add ${label.toLowerCase()} item…`}
            className="flex-1 rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-sm"
            onKeyDown={(e) => { if (e.key === "Enter" && newItem.trim()) { onChange([...items, newItem.trim()]); setNewItem(""); }}}
          />
          <button
            onClick={() => { if (newItem.trim()) { onChange([...items, newItem.trim()]); setNewItem(""); }}}
            className="inline-flex items-center gap-1 rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground hover:bg-brand-dark"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
    </Field>
  );
}
