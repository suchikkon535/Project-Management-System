"use client";

import { useState, useRef, useCallback } from "react";

export default function AIAssistantPage() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [statusText, setStatusText] = useState("");
  const [plan, setPlan] = useState([]);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const abortRef = useRef(null);

  const resetState = () => {
    setPlan([]);
    setResults([]);
    setSummary(null);
    setError(null);
    setCurrentStep(0);
  };

  const handleSubmit = useCallback(async () => {
    if (!message.trim()) return;

    resetState();
    setStatus("planning");
    setStatusText("Planning...");

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjBmOGJlNzVmMDBlNzQzNWZjNjAwZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3ODA4MzI0NCwiZXhwIjoxNzc4Njg4MDQ0fQ.a36TV9rbfS--_UqckmrxLOFsO0mQZlg9nRL_qNnXRDY";

    try {
      const response = await fetch("http://localhost:5000/api/auth/ai/task/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader available");

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const data = JSON.parse(jsonStr);

              // 👇 Log raw data to see exact structure from backend
              console.log("SSE event:", data);

              switch (data.type) {
                case "status":
                  setStatusText(data.message);
                  setStatus("planning");
                  break;

                case "plan":
                  const normalizedPlan = normalizePlan(data.plan);
                  console.log("Normalized plan:", normalizedPlan);
                  setPlan(normalizedPlan);
                  setStatus("executing");
                  setStatusText(`Executing ${normalizedPlan.length} steps...`);
                  break;

                case "step_result":
                  setCurrentStep(data.step);
                  setResults((prev) => [...prev, data]);
                  setStatusText(
                    `Step ${data.step}/${data.total}: ${data.action} — ${data.status}`
                  );
                  break;

                case "done":
                  setSummary(data.summary);
                  setStatus("done");
                  setStatusText("All steps completed!");
                  break;

                case "error":
                  setError(data.message);
                  setStatus("error");
                  setStatusText("Error occurred");
                  break;
              }
            } catch {
              // skip malformed JSON
            }
          }
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
        setStatus("error");
        setStatusText("Connection failed");
      }
    }
  }, [message]);

  const handleCancel = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setStatus("idle");
    setStatusText("Cancelled");
  };

  const getStepStatus = (index) => {
    const result = results.find((r) => r.step === index + 1);
    if (result) return result.status === "completed" ? "completed" : "failed";
    if (index + 1 === currentStep && status === "executing") return "running";
    return "pending";
  };

  const isLoading = status === "planning" || status === "executing";

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">AI Assistant</h1>
          <p className="text-gray-400 mt-1">
            Describe what you want to do and AI will execute it step by step.
          </p>
        </div>

        {/* Input */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='e.g. "Create a project called Website Redesign and add 3 tasks to it"'
            className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none text-lg"
            rows={3}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-500">
              Press Enter to send, Shift+Enter for new line
            </span>
            <div className="flex gap-2">
              {isLoading && (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={isLoading || !message.trim()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg text-sm font-medium transition"
              >
                {isLoading ? "Processing..." : "Execute"}
              </button>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        {status !== "idle" && <StatusBar status={status} text={statusText} />}

        {/* Plan Overview */}
        {plan.length > 0 && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
              <h2 className="font-semibold text-lg">Execution Plan</h2>
              <span className="text-sm text-gray-400">
                {results.length}/{plan.length} completed
              </span>
            </div>

            {/* Progress Bar */}
            <div className="px-5 pt-3">
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(results.length / plan.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="p-5 space-y-3">
              {plan.map((step, index) => (
                <StepCard
                  key={index}
                  index={index}
                  step={step}
                  status={getStepStatus(index)}
                  result={results.find((r) => r.step === index + 1)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <h2 className="font-semibold text-lg mb-3">Summary</h2>
            <div className="grid grid-cols-3 gap-4">
              <SummaryCard label="Total" value={summary.total} color="text-white" />
              <SummaryCard label="Succeeded" value={summary.succeeded} color="text-green-400" />
              <SummaryCard label="Failed" value={summary.failed} color="text-red-400" />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-950/50 border border-red-800 rounded-xl p-4 flex items-start gap-3">
            <ErrorIcon />
            <div>
              <p className="font-medium text-red-400">Error</p>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Normalize plan from backend (handles any shape) ──────────────────────────

function normalizePlan(plan) {
  if (!Array.isArray(plan)) return [];

  return plan.map((step) => {
    // Already correct shape
    if (step && typeof step === "object") {
      return {
        action: step.action || step.type || step.name || "unknown",
        // Handle ALL possible shapes for steps/instructions
        steps: normalizeSteps(step),
      };
    }
    return { action: String(step), steps: [] };
  });
}

function normalizeSteps(step) {
  // shape: { steps: [...] }
  if (Array.isArray(step.steps)) return step.steps.map(String);

  // shape: { instructions: [...] }
  if (Array.isArray(step.instructions)) return step.instructions.map(String);

  // shape: { description: "..." }
  if (typeof step.description === "string") return [step.description];

  // shape: { steps: "do this, do that" } — string instead of array
  if (typeof step.steps === "string") return [step.steps];

  // shape: { details: [...] }
  if (Array.isArray(step.details)) return step.details.map(String);

  // Fallback — no instructions found
  return [];
}

// ─── Sub Components ───────────────────────────────────────────────────────────

function StatusBar({ status, text }) {
  const config = {
    planning: { bg: "bg-yellow-950/50 border-yellow-800", dot: "bg-yellow-400 animate-pulse" },
    executing: { bg: "bg-blue-950/50 border-blue-800", dot: "bg-blue-400 animate-pulse" },
    done: { bg: "bg-green-950/50 border-green-800", dot: "bg-green-400" },
    error: { bg: "bg-red-950/50 border-red-800", dot: "bg-red-400" },
  };

  const c = config[status] || config.planning;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${c.bg}`}>
      <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

function StepCard({ index, step, status, result }) {
  const [expanded, setExpanded] = useState(false);

  const statusStyles = {
    pending: "border-gray-700 bg-gray-800/50",
    running: "border-blue-700 bg-blue-950/30",
    completed: "border-green-700 bg-green-950/30",
    failed: "border-red-700 bg-red-950/30",
  };

  // ✅ Always guaranteed to be an array now
  const stepsList = Array.isArray(step.steps) ? step.steps : [];

  return (
    <div
      className={`rounded-lg border p-4 transition-all cursor-pointer ${statusStyles[status]}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StepIcon status={status} />
          <div>
            <span className="text-sm text-gray-400">Step {index + 1}</span>
            <p className="font-medium">{formatAction(step.action)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          <ChevronIcon expanded={expanded} />
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3">
          {/* Instructions */}
          {stepsList.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Instructions
              </p>
              <ul className="space-y-1">
                {stepsList.map((s, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-gray-600 mt-0.5">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Raw step data if no instructions found */}
          {stepsList.length === 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Raw Data
              </p>
              <pre className="bg-gray-950 rounded-lg p-3 text-xs text-yellow-300 overflow-x-auto max-h-48">
                {JSON.stringify(step, null, 2)}
              </pre>
            </div>
          )}

          {/* Result */}
          {result?.result && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Result
              </p>
              <pre className="bg-gray-950 rounded-lg p-3 text-xs text-green-300 overflow-x-auto max-h-48">
                {JSON.stringify(result.result, null, 2)}
              </pre>
            </div>
          )}

          {/* Error */}
          {result?.error && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Error
              </p>
              <p className="text-sm text-red-400">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StepIcon({ status }) {
  if (status === "completed") {
    return (
      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (status === "failed") {
    return (
      <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  }
  if (status === "running") {
    return (
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
      <div className="w-2 h-2 bg-gray-500 rounded-full" />
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-gray-800 text-gray-400",
    running: "bg-blue-900 text-blue-300",
    completed: "bg-green-900 text-green-300",
    failed: "bg-red-900 text-red-300",
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function SummaryCard({ label, value, color }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 text-center">
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-sm text-gray-400 mt-1">{label}</p>
    </div>
  );
}

function ChevronIcon({ expanded }) {
  return (
    <svg
      className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function formatAction(action) {
  if (!action) return "Unknown";
  return action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}