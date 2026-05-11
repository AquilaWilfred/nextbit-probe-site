"use client";

import { useState } from "react";
import styles from "./CodeBlock.module.css";

interface CodeLine {
  type: "comment" | "command" | "flag" | "string" | "plain";
  text: string;
}

interface CodeBlockProps {
  lang: string;
  lines: CodeLine[];
}

export default function CodeBlock({ lang, lines }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const plainText = lines
    .map((l) => l.text)
    .join("\n");

  function handleCopy() {
    navigator.clipboard.writeText(plainText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="code-lang">{lang}</span>
        <button className="btn-ghost" onClick={handleCopy} aria-label="Copy code">
          {copied ? "✓ copied" : "⎘ copy"}
        </button>
      </div>
      <div className="code-body">
        {lines.map((line, i) => (
          <div key={i} className={styles.line}>
            <span
              className={
                line.type === "comment" ? "code-cmt"
                : line.type === "command" ? "code-cmd"
                : line.type === "flag" ? "code-flag"
                : line.type === "string" ? "code-str"
                : ""
              }
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
