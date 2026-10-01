import React, { Component, ErrorInfo, ReactNode } from "react";
import { navigate } from "@/lib/router";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKey?: string | number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      showDetails: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("[VYUHAM_ERROR_BOUNDARY_TRIP]:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.resetKey !== prevProps.resetKey && this.state.hasError) {
      this.resetError();
    }
  }

  private resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  private handleGoHome = () => {
    this.resetError();
    navigate("/");
  };

  private handleHardReload = () => {
    window.location.reload();
  };

  public render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    const { error, errorInfo, showDetails } = this.state;

    return (
      <div className="relative flex min-h-[100svh] w-full flex-col items-center justify-center bg-[#030504] px-4 py-12 text-[#cfd8d4] font-mono selection:bg-[#ef4444]/30">
        {/* Background scanline & glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.08)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative z-10 w-full max-w-xl border border-red-500/30 bg-[#060c08]/90 p-6 md:p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(239,68,68,0.15)] rounded-none">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 animate-ping rounded-full bg-red-500" />
              <span className="text-[11px] font-bold tracking-[0.25em] text-red-400">
                SYSTEM ANOMALY // 0xERR_FAULT
              </span>
            </div>
            <span className="text-[9px] tracking-widest text-[#6f7f77] uppercase">
              VYUHAM CORE DEFENSE
            </span>
          </div>

          {/* Main Error Callout */}
          <div className="mt-6">
            <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">
              Subsystem Execution Disrupted
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-[#8f9f97]">
              A fatal client runtime error occurred while mounting or rendering this visual module.
              The Vyuham anomaly-containment layer caught the failure to protect the active session.
            </p>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="mt-4 rounded border border-red-500/20 bg-red-950/20 p-3 text-[11px] text-red-300 break-words">
              <span className="font-bold text-red-400">MESSAGE: </span>
              {error.message || "Unknown client exception"}
            </div>
          )}

          {/* Collapsible Telemetry Details */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => this.setState({ showDetails: !showDetails })}
              className="text-[10px] uppercase tracking-wider text-[#18c47c] hover:underline focus:outline-none flex items-center gap-1"
            >
              <span>{showDetails ? "[-]" : "[+]"}</span>
              <span>{showDetails ? "Hide Diagnostic Telemetry" : "View Diagnostic Telemetry"}</span>
            </button>

            {showDetails && (
              <div className="mt-2 max-h-48 overflow-auto rounded bg-black/60 p-3 text-[10px] leading-snug text-[#6f7f77] border border-white/10 font-mono scrollbar-thin">
                <p className="font-bold text-red-400">{error?.stack}</p>
                {errorInfo?.componentStack && (
                  <p className="mt-2 text-[#8f9f97] whitespace-pre-wrap">
                    {errorInfo.componentStack}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Protocols */}
          <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={this.resetError}
              className="group relative flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-[#18c47c] hover:bg-[#20e290] transition-colors"
            >
              <span className="relative z-10">Reboot Module</span>
            </button>

            <button
              type="button"
              onClick={this.handleGoHome}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#cfd8d4] border border-white/20 hover:border-[#18c47c] hover:text-[#18c47c] transition-colors"
            >
              Return to Base Grid
            </button>

            <button
              type="button"
              onClick={this.handleHardReload}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted hover:text-white transition-colors"
            >
              Reload Page
            </button>
          </div>

          {/* Footer note */}
          <div className="mt-6 flex items-center justify-between text-[9px] text-[#4f5e57]">
            <span>LOC: {typeof window !== "undefined" ? window.location.hash || "/" : "/"}</span>
            <span>STATUS: RECOVERY_READY</span>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
