import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { FeedbackPanel } from '@/components/FeedbackPanel';

interface QuizProps {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
  onAnswered: (correct: boolean) => void;
}

export function Quiz({ question, options, answer, explanation, onAnswered }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const correct = selected === answer;

  function handleSubmit() {
    if (selected === null) return;
    setSubmitted(true);
    onAnswered(correct);
  }

  function handleSelect(idx: number) {
    if (submitted) return;
    setSelected(idx);
  }

  return (
    <div className="quiz-container">
      <h3 className="lesson-card-title">{question}</h3>
      <div className="quiz-options">
        {options.map((opt, idx) => {
          let cls = 'quiz-option';
          if (submitted) {
            if (idx === answer) cls += ' correct';
            else if (idx === selected) cls += ' incorrect';
          } else if (idx === selected) {
            cls += ' selected';
          }
          return (
            <button
              key={idx}
              className={cls}
              onClick={() => handleSelect(idx)}
              disabled={submitted}
            >
              <span className="quiz-option-letter">
                {submitted && idx === answer ? <Check size={14} /> :
                 submitted && idx === selected ? <X size={14} /> :
                 String.fromCharCode(65 + idx)}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {submitted && (
        <div className="mt-4">
          <FeedbackPanel
            correct={correct}
            message={explanation ?? (correct ? 'Resposta correta!' : 'Resposta incorreta.')}
          />
        </div>
      )}

      {!submitted && (
        <div className="lesson-footer">
          <span />
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={selected === null}
          >
            Verificar
          </button>
        </div>
      )}
    </div>
  );
}