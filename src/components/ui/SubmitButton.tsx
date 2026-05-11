import styles from "./SubmitButton.module.css";

interface SubmitButtonProps {
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export default function SubmitButton({
  loading = false,
  children,
  onClick,
  disabled = false,
}: SubmitButtonProps) {
  return (
    <button
      className={`btn-primary ${styles.btn}`}
      onClick={onClick}
      disabled={loading || disabled}
      aria-busy={loading}
      type="button"
    >
      {loading ? (
        <>
          <span className={styles.spinner} aria-hidden="true" />
          Sending…
        </>
      ) : (
        children
      )}
    </button>
  );
}
