import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const { requestPasswordReset, completePasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [sent, setSent] = useState(false);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecoveryReady(true);
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session && new URLSearchParams(window.location.search).has("code")) setRecoveryReady(true);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const submitRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not process the request.");
    } finally {
      setPending(false);
    }
  };

  const submitPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }
    setPending(true);
    setError("");
    try {
      await completePasswordReset(password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the password.");
    } finally {
      setPending(false);
    }
  };

  const fieldClass = "mt-2 w-full border border-white/10 bg-[#07100c]/80 px-4 py-3 font-mono text-sm text-paper outline-none focus:border-green/50";

  return (
    <>
      <Navbar />
      <main className="flex min-h-[75vh] flex-1 items-center justify-center bg-[#030705] px-5 py-20 text-paper">
        <section className="w-full max-w-lg border border-white/10 bg-black/40 p-7 md:p-10">
          <p className="font-mono text-[9px] tracking-[0.3em] text-green">VYUHAM&apos;26 // ACCOUNT RECOVERY</p>
          <h1 className="mt-4 font-display text-4xl">{done ? "PASSWORD UPDATED" : "RESET PASSWORD"}</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            {done ? "Your password has been changed. Sign in again with your new password." : recoveryReady ? "Choose a new password for your account." : sent ? "If an account exists for that address, a reset link will be sent." : "Request a secure, one-time reset link for your account."}
          </p>
          {!done && !sent && !recoveryReady && (
            <form className="mt-7" onSubmit={submitRequest}>
              <label className="font-mono text-[9px] tracking-[0.2em] text-muted">EMAIL ADDRESS</label>
              <input className={fieldClass} type="email" required maxLength={254} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="btn-cine btn-cine--solid mt-5 w-full justify-center" disabled={pending}>{pending ? "SENDING…" : "SEND RESET LINK"}</button>
            </form>
          )}
          {!done && recoveryReady && (
            <form className="mt-7 space-y-4" onSubmit={submitPassword}>
              <label className="block font-mono text-[9px] tracking-[0.2em] text-muted">NEW PASSWORD<input className={fieldClass} type="password" required minLength={12} maxLength={128} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
              <label className="block font-mono text-[9px] tracking-[0.2em] text-muted">CONFIRM PASSWORD<input className={fieldClass} type="password" required minLength={12} maxLength={128} autoComplete="new-password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} /></label>
              <button className="btn-cine btn-cine--solid w-full justify-center" disabled={pending}>{pending ? "UPDATING…" : "UPDATE PASSWORD"}</button>
            </form>
          )}
          {error && <p className="mt-4 border border-red-500/30 p-3 font-mono text-xs text-red-200" role="alert">{error}</p>}
          <a className="mt-6 inline-block font-mono text-[10px] tracking-[0.2em] text-green" href="/login">RETURN TO SIGN IN</a>
        </section>
      </main>
      <Footer />
    </>
  );
}
