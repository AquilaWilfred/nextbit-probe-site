"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import SubmitButton from "@/components/ui/SubmitButton";
import SuccessModal from "./SuccessModal";
import type { FeedbackPayload } from "@/types";
import styles from "./ContactForm.module.css";

const CATEGORIES = [
  "Bug report",
  "Feature request",
  "General feedback",
  "Performance issue",
  "Data accuracy",
  "Submit scan log",
];

export default function ContactForm() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [logPaste, setLogPaste] = useState("");
  const [showLog, setShowLog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  async function handleSubmit() {
    setFeedbackError(null);
    if (!message.trim()) {
      setFeedbackError("Please leave your feedback before submitting.");
      return;
    }

    const payload: FeedbackPayload = { rating, category, name, email, message, logPaste };
    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body?.error || "Failed to send feedback.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setFeedbackError(err instanceof Error ? err.message : "Failed to send feedback.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return <SuccessModal onClose={() => setSubmitted(false)} />;
  }

  return (
    <div className={`card ${styles.form}`}>
      <h3 className={styles.title}>Leave feedback</h3>
      <p className={`${styles.sublead} muted`}>Your feedback shapes the next release. Takes 60 seconds.</p>
      <p className={styles.optionalNote}>Rating is optional; feedback alone is enough to submit.</p>

      {/* Star rating — optional */}
      <div className={styles.stars} role="group" aria-label="Star rating (optional)">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className={`${styles.star} ${(hovered || rating) >= n ? styles.lit : ""}`}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            type="button"
          >
            ★
          </button>
        ))}
      </div>

      {/* Category — optional */}
      <div className={styles.field}>
        <label className="field-label" htmlFor="fb-cat">Category (optional)</label>
        <select
          id="fb-cat"
          className="field-select"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setShowLog(e.target.value === "Submit scan log");
          }}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Name + Email row */}
      <div className={styles.row}>
        <Input
          id="fb-name"
          label="Name (optional)"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          id="fb-email"
          label="Email (optional)"
          type="email"
          placeholder="For follow-up"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Message */}
      <div className={styles.field}>
        <TextArea
          id="fb-msg"
          label="Your feedback"
          placeholder="Describe what happened, what you expected, or what you'd love to see…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* Paste log — shown for "Submit scan log" category */}
      {showLog && (
        <div className={styles.field}>
          <TextArea
            id="fb-log"
            label="Paste your nextbit_probe.log"
            placeholder="Paste log contents here…"
            value={logPaste}
            onChange={(e) => setLogPaste(e.target.value)}
            style={{ fontFamily: "var(--mono)", fontSize: 11, minHeight: 140 }}
          />
        </div>
      )}

      {feedbackError && <p className={styles.error}>{feedbackError}</p>}
      <SubmitButton loading={loading} onClick={handleSubmit}>
        ✉ Submit feedback
      </SubmitButton>
    </div>
  );
}
