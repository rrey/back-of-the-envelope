import { useState } from 'react';

interface Props {
  hints: string[];
  answer: { value: number; unit: string; tolerance: number };
  explanation: string;
  keyValues: { label: string; value: string }[];
}

export default function CaseInteractive({ hints, answer, explanation, keyValues }: Props) {
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);

  const parsed = parseFloat(userInput);
  const canSubmit = !submitted && Number.isFinite(parsed);
  const isCorrect = submitted
    ? Math.abs(parsed - answer.value) / answer.value <= answer.tolerance
    : null;

  function handleSubmit() {
    if (!canSubmit) return;
    setSubmitted(true);
  }

  return (
    <div className="interactive">
      {hints.length > 0 && (
        <div className="hints-section">
          <div className="section-label">hints</div>
          {hints.slice(0, revealedHints).map((hint, i) => (
            <div className="hint-output" key={i}>{hint}</div>
          ))}
          <button
            className="hint-btn"
            onClick={() => setRevealedHints((n) => Math.min(n + 1, hints.length))}
            disabled={revealedHints >= hints.length}
          >
            Reveal hint ({revealedHints}/{hints.length})
          </button>
        </div>
      )}

      <div className="answer-section">
        <div className="section-label">your answer</div>
        <div className="answer-row">
          <span className="prompt-glyph">$</span>
          <span className="answer-label">answer:</span>
          <input
            className="answer-input"
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={submitted}
            aria-label="your answer"
          />
          <span className="unit">{answer.unit}</span>
          <button className="submit-btn" onClick={handleSubmit} disabled={!canSubmit}>
            Submit
          </button>
        </div>
      </div>

      {submitted && (
        <>
          <div className={isCorrect ? 'verdict verdict-correct' : 'verdict verdict-incorrect'}>
            {isCorrect
              ? `Correct! (Accepted: ${answer.value} ${answer.unit}, ±${Math.round(answer.tolerance * 100)}%)`
              : `Not quite — the answer is around ${answer.value} ${answer.unit} (±${Math.round(answer.tolerance * 100)}%).`}
          </div>
          <div className="explanation">{explanation}</div>
          {keyValues.length > 0 && (
            <table className="keyvalues">
              <tbody>
                {keyValues.map((kv) => (
                  <tr key={kv.label}>
                    <th scope="row">{kv.label}</th>
                    <td>{kv.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <a href={import.meta.env.BASE_URL} className="try-another">→ try another case</a>
        </>
      )}
    </div>
  );
}
