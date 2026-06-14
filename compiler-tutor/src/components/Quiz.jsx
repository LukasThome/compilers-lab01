import React, { useState } from 'react';

export default function Quiz({ question, options, correctIndex, explanation }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const isCorrect = selected === correctIndex;

  const handleSelect = (idx) => {
    if (submitted) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelected(null);
    setSubmitted(false);
  };

  return (
    <div className="quiz-container" style={{ position: 'relative' }}>
      <div className="exercise-header">
        <div className="exercise-icon" style={{ background: 'rgba(139,92,246,0.12)' }}>🧠</div>
        <h3 style={{ color: 'var(--accent-purple)' }}>Quiz</h3>
      </div>

      <p className="quiz-question">{question}</p>

      <div className="quiz-options">
        {options.map((opt, idx) => {
          let cls = 'quiz-option';
          if (selected === idx) cls += ' selected';
          if (submitted && idx === correctIndex) cls += ' correct';
          if (submitted && selected === idx && idx !== correctIndex) cls += ' incorrect';

          return (
            <div key={idx} className={cls} onClick={() => handleSelect(idx)}>
              <div className="quiz-option-marker">{letters[idx]}</div>
              <span>{opt}</span>
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={selected === null}>
            Verificar resposta
          </button>
        </div>
      ) : (
        <>
          <div className={`quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? '✅ Correto! ' : '❌ Incorreto. '}
            {explanation}
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-secondary btn-sm" onClick={handleReset}>
              Tentar novamente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
