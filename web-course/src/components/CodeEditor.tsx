import { useRef, useEffect } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { python } from '@codemirror/lang-python';
import { indentWithTab } from '@codemirror/commands';
import { oneDark } from '@codemirror/theme-one-dark';
import { Play, Loader2, RotateCcw } from 'lucide-react';
import type { RunResult } from '@/types';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  onRun: () => void;
  onReset?: () => void;
  result: RunResult | null;
  isRunning: boolean;
  disabled?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  onRun,
  onReset,
  result,
  isRunning,
  disabled,
}: CodeEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Initialize CodeMirror once
  useEffect(() => {
    if (!hostRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChangeRef.current(update.state.doc.toString());
      }
    });

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        python(),
        keymap.of([indentWithTab]),
        oneDark,
        EditorView.lineWrapping,
        updateListener,
        EditorState.tabSize.of(4),
        EditorView.theme({
          '&': {
            fontSize: '0.9rem',
            height: '100%',
          },
          '.cm-scroller': {
            fontFamily: 'var(--font-mono)',
            lineHeight: '1.6',
          },
          '.cm-gutters': {
            border: 'none',
            background: 'transparent',
          },
        }),
      ],
    });

    const view = new EditorView({ state, parent: hostRef.current });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // External value sync (e.g. reset)
  useEffect(() => {
    const view = viewRef.current;
    if (view && view.state.doc.toString() !== value) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      });
    }
  }, [value]);

  return (
    <div className="code-editor-wrapper">
      <div className="code-editor-toolbar">
        <span className="code-editor-label">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
          <span style={{ marginLeft: '0.5rem' }}>main.py</span>
        </span>
        <div className="flex gap-2">
          {onReset && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={onReset}
              disabled={isRunning || disabled}
              title="Restaurar código inicial"
            >
              <RotateCcw size={14} />
              Resetar
            </button>
          )}
          <button
            className="btn btn-accent btn-sm"
            onClick={onRun}
            disabled={isRunning || disabled}
          >
            {isRunning ? <Loader2 size={16} className="spin" /> : <Play size={16} />}
            {isRunning ? 'Executando...' : 'Executar'}
          </button>
        </div>
      </div>

      <div className="code-editor-host" ref={hostRef} />

      {(result || isRunning) && (
        <div style={{ padding: '1rem', background: 'var(--bg-code)' }}>
          <div className="code-output">
            {isRunning && !result && (
              <span className="output-placeholder">Executando código...</span>
            )}
            {result && (
              <>
                {result.stdout && (
                  <span className="output-stdout">{result.stdout}</span>
                )}
                {result.stderr && (
                  <span className="output-stderr">{'\n' + result.stderr}</span>
                )}
                {result.error && (
                  <span className="output-error">{'\n' + result.error}</span>
                )}
                {result.testResults.length > 0 && (
                  <div className="test-results">
                    {result.testResults.map((t, i) => (
                      <div
                        key={i}
                        className={`test-result-item ${t.passed ? 'pass' : 'fail'}`}
                      >
                        <span>{t.passed ? '✓' : '✗'}</span>
                        <span>
                          {t.expression} → esperado: {t.expected} | obtido: {t.actual}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {result.testsPassed && result.testResults.length > 0 && (
                  <span className="output-success">
                    {'\n✓ Todos os testes passaram!'}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}