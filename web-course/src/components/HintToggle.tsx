import { useState } from 'react';
import { Lightbulb } from 'lucide-react';

interface HintToggleProps {
  hint: string;
}

export function HintToggle({ hint }: HintToggleProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="mt-3">
      <button
        className="hint-toggle"
        onClick={() => setShow((v) => !v)}
        type="button"
      >
        <Lightbulb size={16} />
        {show ? 'Ocultar dica' : 'Mostrar dica'}
      </button>
      {show && (
        <div className="hint-box mt-2">
          <Lightbulb size={16} />
          <span>{hint}</span>
        </div>
      )}
    </div>
  );
}