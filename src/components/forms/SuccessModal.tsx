import styles from "./SuccessModal.module.css";

interface SuccessModalProps {
  onClose: () => void;
}

export default function SuccessModal({ onClose }: SuccessModalProps) {
  return (
    <div className={`card ${styles.modal}`} role="alert" aria-live="polite">
      <span className={styles.icon} aria-hidden="true">✓</span>
      <h3 className={styles.title}>Thank you — feedback received!</h3>
      <p className={styles.desc}>It&apos;ll be read before the next release.</p>
      <button className="btn-ghost" onClick={onClose} style={{ fontSize: 12 }}>
        Submit another →
      </button>
    </div>
  );
}
