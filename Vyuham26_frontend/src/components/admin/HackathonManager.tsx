import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "@/components/ui/Toaster";
import {
  eventsApi,
  hackathonApi,
  type HackathonMentorRecord,
  type HackathonMentorRequestRecord,
  type HackathonSubmissionRecord,
} from "@/lib/api";

const panelClass = "border border-[rgba(120,160,145,0.16)] bg-[#060a09]";
const fieldClass = "w-full border border-[rgba(120,160,145,0.2)] bg-[#030504] px-3 py-2 font-mono text-[10px] text-[#d8ebe2] outline-none focus:border-[#18c47c]/60";
const thClass = "px-3 py-2 text-left font-mono text-[9px] font-normal tracking-[0.2em] text-[#4f6f61]";
const tdClass = "px-3 py-3 font-mono text-[10px] text-[#b9d3c7]";

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={panelClass}>
      <header className="border-b border-[rgba(120,160,145,0.14)] px-5 py-3">
        <h3 className="font-mono text-[10px] tracking-[0.28em] text-[#9fc4b4]">{title.toUpperCase()}</h3>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export default function HackathonManager() {
  const [eventId, setEventId] = useState<string | null>(null);
  const [eventName, setEventName] = useState("HACKATHON — 24HR");
  const [submissions, setSubmissions] = useState<HackathonSubmissionRecord[]>([]);
  const [requests, setRequests] = useState<HackathonMentorRequestRecord[]>([]);
  const [mentors, setMentors] = useState<HackathonMentorRecord[]>([]);
  const [scoreDrafts, setScoreDrafts] = useState<Record<string, string>>({});
  const [statusDrafts, setStatusDrafts] = useState<Record<string, HackathonMentorRequestRecord["status"]>>({});
  const [mentorDraft, setMentorDraft] = useState({ name: "", expertise: "", slot_time: "", contact: "" });
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const event = await eventsApi.getBySlug("hackathon");
      setEventId(event.id);
      setEventName(event.name);
      const [submissionRows, requestRows, mentorRows] = await Promise.all([
        hackathonApi.adminListSubmissions(event.id),
        hackathonApi.adminListMentorRequests(event.id),
        hackathonApi.mentors(event.id),
      ]);
      setSubmissions(submissionRows);
      setRequests(requestRows);
      setMentors(mentorRows);
      setScoreDrafts(Object.fromEntries(submissionRows.map((row) => [row.id, row.score == null ? "" : String(row.score)])));
      setStatusDrafts(Object.fromEntries(requestRows.map((row) => [row.id, row.status])));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load hackathon administration data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const saveScore = async (submission: HackathonSubmissionRecord) => {
    if (!eventId) return;
    const score = scoreDrafts[submission.id]?.trim();
    if (!score || !Number.isFinite(Number(score)) || Number(score) < 0) {
      toast("Enter a valid non-negative score.", "warn");
      return;
    }
    setBusyKey(`score:${submission.id}`);
    try {
      await hackathonApi.scoreSubmission(eventId, submission.id, score);
      toast(`Score saved for ${submission.team_name}.`, "ok");
      await load();
    } catch (saveError) {
      toast(saveError instanceof Error ? saveError.message : "Could not save the score.", "warn");
    } finally {
      setBusyKey("");
    }
  };

  const saveRequestStatus = async (request: HackathonMentorRequestRecord) => {
    if (!eventId) return;
    const nextStatus = statusDrafts[request.id] ?? request.status;
    setBusyKey(`request:${request.id}`);
    try {
      await hackathonApi.updateMentorRequest(eventId, request.id, nextStatus);
      toast("Mentor request status updated.", "ok");
      await load();
    } catch (saveError) {
      toast(saveError instanceof Error ? saveError.message : "Could not update the request.", "warn");
    } finally {
      setBusyKey("");
    }
  };

  const addMentor = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!eventId) return;
    setBusyKey("mentor");
    try {
      await hackathonApi.createMentor(eventId, {
        name: mentorDraft.name.trim(),
        expertise: mentorDraft.expertise.trim(),
        slot_time: mentorDraft.slot_time.trim(),
        contact: mentorDraft.contact.trim() || null,
      });
      setMentorDraft({ name: "", expertise: "", slot_time: "", contact: "" });
      toast("Mentor added to the public hackathon support network.", "ok");
      await load();
    } catch (saveError) {
      toast(saveError instanceof Error ? saveError.message : "Could not add mentor.", "warn");
    } finally {
      setBusyKey("");
    }
  };

  const pendingRequests = requests.filter((request) => request.status === "pending").length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[rgba(120,160,145,0.14)] pb-4">
        <div>
          <p className="font-mono text-[9px] tracking-[0.25em] text-[#18c47c]">JUDGING & SUPPORT OPERATIONS</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-[#eef8f3]">{eventName}</h1>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading} className="border border-[rgba(120,160,145,0.2)] px-3 py-2 font-mono text-[9px] tracking-[0.2em] text-[#9fc4b4] hover:border-[#18c47c]/50 disabled:opacity-50">{loading ? "SYNCING…" : "REFRESH DATA"}</button>
      </div>

      {error && <div role="alert" className="border border-red-400/30 bg-red-950/20 px-4 py-3 font-mono text-[10px] text-red-200">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={panelClass + " p-4"}><p className="font-mono text-[9px] tracking-[0.2em] text-[#4f6f61]">SUBMISSIONS</p><p className="mt-2 font-display text-3xl text-[#eef8f3]">{loading ? "…" : submissions.length}</p></div>
        <div className={panelClass + " p-4"}><p className="font-mono text-[9px] tracking-[0.2em] text-[#4f6f61]">PENDING MENTOR REQUESTS</p><p className="mt-2 font-display text-3xl text-[#f2c98a]">{loading ? "…" : pendingRequests}</p></div>
        <div className={panelClass + " p-4"}><p className="font-mono text-[9px] tracking-[0.2em] text-[#4f6f61]">ACTIVE MENTORS</p><p className="mt-2 font-display text-3xl text-[#eef8f3]">{loading ? "…" : mentors.length}</p></div>
      </div>

      <Panel title={`Prototype submissions · ${submissions.length}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead><tr><th className={thClass}>TEAM / SUBMISSION</th><th className={thClass}>LINKS</th><th className={thClass}>LAST UPDATED</th><th className={thClass}>SCORE</th><th className={thClass}>ACTION</th></tr></thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="border-t border-[rgba(120,160,145,0.1)] align-top">
                  <td className={tdClass}><div className="font-semibold text-[#e1f2e9]">{submission.team_name}</div><p className="mt-2 max-w-[280px] whitespace-normal text-[9px] leading-relaxed text-[#6f8b80]">{submission.description || "No project summary provided."}</p></td>
                  <td className={tdClass}><div className="flex flex-col items-start gap-2"><a href={submission.repo_url} target="_blank" rel="noreferrer" className="text-[#18c47c] underline underline-offset-2">REPOSITORY ↗</a>{submission.demo_url && <a href={submission.demo_url} target="_blank" rel="noreferrer" className="text-cyan-300 underline underline-offset-2">LIVE DEMO ↗</a>}</div></td>
                  <td className={tdClass}>{new Date(submission.updated_at).toLocaleString()}</td>
                  <td className={tdClass}><input aria-label={`Score for ${submission.team_name}`} className={fieldClass + " max-w-28"} type="number" min="0" step="0.01" value={scoreDrafts[submission.id] ?? ""} onChange={(e) => setScoreDrafts((current) => ({ ...current, [submission.id]: e.target.value }))} placeholder="Not scored" /></td>
                  <td className={tdClass}><button type="button" onClick={() => void saveScore(submission)} disabled={busyKey === `score:${submission.id}`} className="border border-[#18c47c]/40 px-3 py-2 text-[#18c47c] hover:bg-[#18c47c]/10 disabled:opacity-50">{busyKey === `score:${submission.id}` ? "SAVING…" : "SAVE SCORE"}</button></td>
                </tr>
              ))}
              {!loading && submissions.length === 0 && <tr><td className={tdClass} colSpan={5}>No prototype submissions yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title={`Mentor requests · ${requests.length}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead><tr><th className={thClass}>PARTICIPANT</th><th className={thClass}>TEAM</th><th className={thClass}>REQUEST</th><th className={thClass}>STATUS</th><th className={thClass}>ACTION</th></tr></thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-t border-[rgba(120,160,145,0.1)] align-top">
                  <td className={tdClass}><div className="text-[#e1f2e9]">{request.requester_name || "Participant"}</div><div className="mt-1 text-[9px] text-[#6f8b80]">{request.requester_email || request.requester_id}</div></td>
                  <td className={tdClass}>{request.team_name || "Individual request"}</td>
                  <td className={tdClass}><p className="max-w-[320px] whitespace-normal leading-relaxed">{request.message || "No details included."}</p><p className="mt-2 text-[9px] text-[#6f8b80]">{new Date(request.created_at).toLocaleString()}</p></td>
                  <td className={tdClass}><select aria-label={`Status for mentor request from ${request.requester_name || "participant"}`} className={fieldClass + " max-w-36"} value={statusDrafts[request.id] ?? request.status} onChange={(e) => setStatusDrafts((current) => ({ ...current, [request.id]: e.target.value as HackathonMentorRequestRecord["status"] }))}>{["pending", "accepted", "completed", "cancelled"].map((status) => <option key={status} value={status}>{status.toUpperCase()}</option>)}</select></td>
                  <td className={tdClass}><button type="button" onClick={() => void saveRequestStatus(request)} disabled={busyKey === `request:${request.id}`} className="border border-[#18c47c]/40 px-3 py-2 text-[#18c47c] hover:bg-[#18c47c]/10 disabled:opacity-50">{busyKey === `request:${request.id}` ? "SAVING…" : "UPDATE"}</button></td>
                </tr>
              ))}
              {!loading && requests.length === 0 && <tr><td className={tdClass} colSpan={5}>No mentor requests yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title={`Mentor directory · ${mentors.length}`}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {mentors.map((mentor) => <div key={mentor.id} className="border border-[rgba(120,160,145,0.14)] p-3"><p className="font-mono text-[10px] text-[#d8ebe2]">{mentor.name}</p><p className="mt-1 font-mono text-[9px] text-[#6f8b80]">{mentor.expertise}</p><p className="mt-2 font-mono text-[9px] text-[#18c47c]">{mentor.slot_time}</p></div>)}
          {!loading && mentors.length === 0 && <p className="font-mono text-[10px] text-[#6f8b80]">No mentors listed. Add one below to make it visible on the participant page.</p>}
        </div>
        <form onSubmit={addMentor} className="mt-5 grid gap-3 border-t border-[rgba(120,160,145,0.12)] pt-5 sm:grid-cols-2 xl:grid-cols-4">
          {(["name", "expertise", "slot_time", "contact"] as const).map((key) => <label key={key} className="font-mono text-[8px] tracking-[0.2em] text-[#4f6f61]">{key === "slot_time" ? "SLOT / AVAILABILITY" : key.toUpperCase()}{key === "contact" && " (OPTIONAL)"}<input className={fieldClass + " mt-2"} required={key !== "contact"} maxLength={key === "name" ? 160 : key === "expertise" ? 250 : key === "slot_time" ? 120 : 250} value={mentorDraft[key]} onChange={(e) => setMentorDraft((current) => ({ ...current, [key]: e.target.value }))} /></label>)}
          <div className="sm:col-span-2 xl:col-span-4"><button type="submit" disabled={!eventId || busyKey === "mentor"} className="border border-[#18c47c]/40 px-4 py-2 font-mono text-[9px] tracking-[0.2em] text-[#18c47c] hover:bg-[#18c47c]/10 disabled:opacity-50">{busyKey === "mentor" ? "ADDING…" : "+ ADD MENTOR"}</button></div>
        </form>
      </Panel>
    </div>
  );
}
