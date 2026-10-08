import { useState, useEffect } from "react";
import { announcementsApi, type AnnouncementRecord } from "@/lib/api";
import { toast } from "@/components/ui/Toaster";
import { cyberAudio } from "@/lib/cyberAudio";

const CATEGORIES = [
  "TRANSMISSION",
  "LOGISTICS",
  "TECH",
  "CULTURAL",
  "SCHEDULE",
  "SECURITY",
  "CRITICAL",
] as const;

const STREAMS = [
  "GENERAL",
  "TECH",
  "CULTURAL",
  "GAMING",
  "MANAGEMENT",
  "ALL",
] as const;

export default function AnnouncementManager() {
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStream, setFilterStream] = useState<string>("ALL");

  // Create form state
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<string>("TRANSMISSION");
  const [newStream, setNewStream] = useState<string>("GENERAL");
  const [newUrgent, setNewUrgent] = useState(false);
  const [newPinned, setNewPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Edit modal state
  const [editingItem, setEditingItem] = useState<AnnouncementRecord | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState<string>("TRANSMISSION");
  const [editStream, setEditStream] = useState<string>("GENERAL");
  const [editUrgent, setEditUrgent] = useState(false);
  const [editPinned, setEditPinned] = useState(false);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await announcementsApi.list();
      setAnnouncements(data);
    } catch (err: any) {
      toast(err?.message || "Failed to load announcements from Supabase", "warn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast("Title and content are required for broadcast.", "warn");
      return;
    }

    setSubmitting(true);
    try {
      cyberAudio.playTelemetry();
      const created = await announcementsApi.create({
        title: newTitle.trim(),
        content: newContent.trim(),
        category: newCategory,
        stream: newStream,
        urgent: newUrgent,
        pinned: newPinned,
      });

      setAnnouncements((prev) => [created, ...prev]);
      setNewTitle("");
      setNewContent("");
      setNewUrgent(false);
      setNewPinned(false);
      setIsCreating(false);
      window.dispatchEvent(new CustomEvent("vyuham:announcement_update"));
      toast("Broadcast transmission successfully published live!", "ok");
    } catch (err: any) {
      toast(err?.message || "Failed to publish announcement", "warn");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (item: AnnouncementRecord) => {
    cyberAudio.playTelemetry();
    setEditingItem(item);
    setEditTitle(item.title);
    setEditContent(item.content);
    setEditCategory(item.category || "TRANSMISSION");
    setEditStream(item.stream || "GENERAL");
    setEditUrgent(!!item.urgent);
    setEditPinned(!!item.pinned);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editTitle.trim() || !editContent.trim()) {
      toast("Title and content cannot be blank.", "warn");
      return;
    }

    setSubmitting(true);
    try {
      cyberAudio.playTelemetry();
      const updated = await announcementsApi.update(editingItem.id, {
        title: editTitle.trim(),
        content: editContent.trim(),
        category: editCategory,
        stream: editStream,
        urgent: editUrgent,
        pinned: editPinned,
      });

      setAnnouncements((prev) =>
        prev.map((item) => (item.id === editingItem.id ? updated : item))
      );
      setEditingItem(null);
      window.dispatchEvent(new CustomEvent("vyuham:announcement_update"));
      toast("Announcement updated successfully!", "ok");
    } catch (err: any) {
      toast(err?.message || "Failed to update announcement", "warn");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete broadcast: "${title}"?`)) {
      return;
    }

    try {
      cyberAudio.playTelemetry();
      await announcementsApi.delete(id);
      setAnnouncements((prev) => prev.filter((item) => item.id !== id));
      window.dispatchEvent(new CustomEvent("vyuham:announcement_update"));
      toast("Announcement deleted from database.", "ok");
    } catch (err: any) {
      toast(err?.message || "Failed to delete announcement", "warn");
    }
  };

  const filtered = announcements.filter((a) => {
    const matchesStream =
      filterStream === "ALL" ||
      (a.stream && a.stream.toUpperCase() === filterStream);
    const matchesSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase());
    return matchesStream && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="border border-[rgba(120,160,145,0.16)] bg-[#060a09] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-mono text-xs font-bold tracking-[0.28em] text-[#9fc4b4] uppercase">
                LIVE BROADCAST & ANNOUNCEMENTS CONTROL
              </h3>
            </div>
            <p className="mt-1 text-xs text-[#6f8b80]">
              Direct control room for festival announcements. Create, edit, toggle urgency, and delete live broadcast transmissions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadAnnouncements}
              className="rounded border border-[rgba(120,160,145,0.2)] bg-[#0b1210] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9fc4b4] hover:bg-[#121c19] hover:text-[#eef8f3]"
            >
              REFRESH
            </button>
            <button
              type="button"
              onClick={() => {
                cyberAudio.playTelemetry();
                setIsCreating(!isCreating);
              }}
              className="rounded border border-emerald-500/50 bg-emerald-950/40 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300 hover:bg-emerald-900/60 hover:text-white hover:shadow-[0_0_15px_rgba(24,196,124,0.3)] transition-all"
            >
              {isCreating ? "✕ CANCEL" : "+ NEW BROADCAST"}
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[rgba(120,160,145,0.12)] pt-4">
          <input
            type="text"
            placeholder="Search broadcasts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] rounded border border-[rgba(120,160,145,0.2)] bg-[#030605] px-3 py-1.5 font-mono text-xs text-[#eef8f3] placeholder-[#4f6f61] focus:border-emerald-500/60 focus:outline-none"
          />

          <div className="flex flex-wrap gap-1 font-mono text-[10px]">
            {["ALL", "GENERAL", "TECH", "CULTURAL", "GAMING", "MANAGEMENT"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilterStream(s)}
                className={`rounded px-2.5 py-1 uppercase transition-all ${
                  filterStream === s
                    ? "border border-emerald-500/60 bg-emerald-950/50 text-emerald-300 font-bold"
                    : "border border-[rgba(120,160,145,0.14)] bg-[#080e0c] text-[#6f8b80] hover:text-[#9fc4b4]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Create Broadcast Form */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="border border-emerald-500/30 bg-[#06100c] p-5 rounded space-y-4 shadow-[0_0_20px_rgba(24,196,124,0.1)] animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
              CREATE NEW BROADCAST TRANSMISSION
            </span>
            <span className="font-mono text-[10px] text-[#6f8b80]">REAL-TIME SUPABASE SYNC</span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f8b80] mb-1">
                Headline / Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. DUK Gate 1 Entry Pass Verification Active"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded border border-[rgba(120,160,145,0.25)] bg-[#030605] px-3 py-2 font-mono text-xs text-[#eef8f3] focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f8b80] mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full rounded border border-[rgba(120,160,145,0.25)] bg-[#030605] px-3 py-2 font-mono text-xs text-[#eef8f3] focus:border-emerald-500 focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f8b80] mb-1">
              Transmission Content / Message *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Full details of the announcement broadcast..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full rounded border border-[rgba(120,160,145,0.25)] bg-[#030605] px-3 py-2 font-mono text-xs text-[#eef8f3] focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(120,160,145,0.12)] pt-3">
            <div className="flex items-center gap-6">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f8b80] mr-2">
                  Stream:
                </span>
                <select
                  value={newStream}
                  onChange={(e) => setNewStream(e.target.value)}
                  className="rounded border border-[rgba(120,160,145,0.2)] bg-[#030605] px-2 py-1 font-mono text-xs text-[#eef8f3]"
                >
                  {STREAMS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9fc4b4] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newUrgent}
                  onChange={(e) => setNewUrgent(e.target.checked)}
                  className="accent-amber-400"
                />
                <span className={newUrgent ? "text-amber-400 font-bold" : ""}>URGENT SIGNAL</span>
              </label>

              <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9fc4b4] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPinned}
                  onChange={(e) => setNewPinned(e.target.checked)}
                  className="accent-emerald-400"
                />
                <span className={newPinned ? "text-emerald-400 font-bold" : ""}>PIN TO TOP</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="rounded border border-emerald-500 bg-emerald-600 px-5 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {submitting ? "TRANSMITTING..." : "PUBLISH BROADCAST →"}
            </button>
          </div>
        </form>
      )}

      {/* Announcements List */}
      <div className="border border-[rgba(120,160,145,0.16)] bg-[#060a09]">
        <div className="border-b border-[rgba(120,160,145,0.14)] px-5 py-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#9fc4b4]">
            ACTIVE TRANSMISSIONS ({filtered.length})
          </span>
          <span className="font-mono text-[10px] text-[#4f6f61]">
            ORDERED BY PINNED & TIMESTAMP
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center font-mono text-xs text-[#6f8b80]">
            Scanning network feeds...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center font-mono text-xs text-[#6f8b80]">
            No announcements found matching current filter.
          </div>
        ) : (
          <div className="divide-y divide-[rgba(120,160,145,0.1)]">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-5 hover:bg-[#08100e] transition-colors"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                      {item.pinned && (
                        <span className="rounded border border-emerald-500/40 bg-emerald-950/60 px-2 py-0.5 text-emerald-300 font-bold">
                          PINNED
                        </span>
                      )}
                      {item.urgent && (
                        <span className="rounded border border-amber-500/50 bg-amber-950/60 px-2 py-0.5 text-amber-300 font-bold animate-pulse">
                          CRITICAL // URGENT
                        </span>
                      )}
                      <span className="rounded border border-[rgba(120,160,145,0.2)] bg-[#0e1614] px-2 py-0.5 text-[#9fc4b4]">
                        {item.category || "TRANSMISSION"}
                      </span>
                      <span className="rounded border border-[rgba(120,160,145,0.15)] bg-[#0a110f] px-2 py-0.5 text-[#6f8b80]">
                        STREAM: {item.stream || "ALL"}
                      </span>
                      <span className="text-[#4f6f61] ml-auto">
                        {item.created_at ? new Date(item.created_at).toLocaleString("en-IN") : ""}
                      </span>
                    </div>

                    <h4 className="font-mono text-sm font-bold text-[#eef8f3]">
                      {item.title}
                    </h4>

                    <p className="text-xs text-[#a9c2b7] leading-relaxed whitespace-pre-wrap">
                      {item.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 md:pt-0 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      className="rounded border border-[rgba(120,160,145,0.25)] bg-[#0c1412] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#9fc4b4] hover:border-emerald-500/50 hover:text-emerald-300"
                    >
                      EDIT
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.title)}
                      className="rounded border border-red-500/30 bg-red-950/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-red-300 hover:bg-red-900/50 hover:text-white"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Announcement Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-2xl rounded border border-emerald-500/40 bg-[#06100d] p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[rgba(120,160,145,0.2)] pb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
                EDIT BROADCAST TRANSMISSION
              </span>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="font-mono text-xs text-[#6f8b80] hover:text-white"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f8b80] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded border border-[rgba(120,160,145,0.3)] bg-[#030605] px-3 py-2 font-mono text-xs text-[#eef8f3] focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f8b80] mb-1">
                  Category
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full rounded border border-[rgba(120,160,145,0.3)] bg-[#030605] px-3 py-2 font-mono text-xs text-[#eef8f3] focus:border-emerald-500 focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f8b80] mb-1">
                Content
              </label>
              <textarea
                required
                rows={4}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full rounded border border-[rgba(120,160,145,0.3)] bg-[#030605] px-3 py-2 font-mono text-xs text-[#eef8f3] focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(120,160,145,0.2)] pt-3">
              <div className="flex items-center gap-6">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6f8b80] mr-2">
                    Stream:
                  </span>
                  <select
                    value={editStream}
                    onChange={(e) => setEditStream(e.target.value)}
                    className="rounded border border-[rgba(120,160,145,0.2)] bg-[#030605] px-2 py-1 font-mono text-xs text-[#eef8f3]"
                  >
                    {STREAMS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9fc4b4] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editUrgent}
                    onChange={(e) => setEditUrgent(e.target.checked)}
                    className="accent-amber-400"
                  />
                  <span>URGENT</span>
                </label>

                <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9fc4b4] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editPinned}
                    onChange={(e) => setEditPinned(e.target.checked)}
                    className="accent-emerald-400"
                  />
                  <span>PINNED</span>
                </label>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded border border-[rgba(120,160,145,0.2)] px-4 py-2 font-mono text-xs text-[#6f8b80] hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded border border-emerald-500 bg-emerald-600 px-5 py-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white hover:bg-emerald-500"
                >
                  {submitting ? "SAVING..." : "SAVE CHANGES"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
