import { Check, X } from 'lucide-react';

interface FeedbackPanelProps {
  correct: boolean;
  title?: string;
  message?: string;
}

export function FeedbackPanel({ correct, title, message }: FeedbackPanelProps) {
  return (
    <div className={`feedback-panel ${correct ? 'correct' : 'incorrect'}`}>
      <div className="feedback-icon">
        {correct ? <Check /> : <X />}
      </div>
      <div className="feedback-content">
        <h4>{title ?? (correct ? 'Correto!' : 'Tente novamente')}</h4>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}