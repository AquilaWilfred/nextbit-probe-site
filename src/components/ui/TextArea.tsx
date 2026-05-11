import { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  id: string;
}

export default function TextArea({ label, id, className = "", ...rest }: TextAreaProps) {
  return (
    <div>
      {label && (
        <label className="field-label" htmlFor={id}>
          {label}
        </label>
      )}
      <textarea id={id} className={`field-textarea ${className}`} {...rest} />
    </div>
  );
}
