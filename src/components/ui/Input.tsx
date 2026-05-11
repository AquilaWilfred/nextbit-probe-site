import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
}

export default function Input({ label, id, className = "", ...rest }: InputProps) {
  return (
    <div>
      {label && (
        <label className="field-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input id={id} className={`field-input ${className}`} {...rest} />
    </div>
  );
}
