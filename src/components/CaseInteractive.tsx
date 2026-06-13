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
      <div className="answer-row">
        <label>
          Your answer:{' '}
          <input
            className="input"
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={submitted}
            aria-label="your answer"
          />
        </label>
        <span className="muted">{answer.unit}</span>
        <button className="button" onClick={handleSubmit} disabled={!canSubmit}>
          Submit
        </button>
      </div>

      {submitted && (
        <>
          <div className={isCorrect ? 'verdict verdict--correct' : 'verdict verdict--incorrect'}>
            {isCorrect
              ? `Correct! (Accepted answer: ${answer.value} ${answer.unit}, ±${Math.round(answer.tolerance * 100)}%)`
              : `Not quite — the answer is around ${answer.value} ${answer.unit} (±${Math.round(answer.tolerance * 100)}%).`}
          </div>
          <p>{explanation}</p>
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
          <p><a href="/">Try another case →</a></p>
        </>
      )}
    </div>
  );
}
