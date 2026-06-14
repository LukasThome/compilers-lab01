import React, { useState, useMemo } from 'react';
import Quiz from '../components/Quiz';
import TreeVisualization from '../components/visualization/TreeVisualization';

/* ═══════════════════════════════════════════════════
   MODULE 8 — Definições Dirigidas pela Sintaxe (SDDs)
   Covers: P3 Q4 (annotated parse trees)
   ═══════════════════════════════════════════════════ */

export default function Module8({ onNext, onPrev, moduleNumber, totalModules }) {
  return (
    <div className="content-wrapper fade-in">
      <div className="module-header">
        <span className="module-header-badge">📝 Módulo 8</span>
        <h1>Definições Dirigidas pela Sintaxe (SDDs)</h1>
        <p>
          SDDs associam regras semânticas às produções de uma gramática, permitindo
          computar valores (atributos) durante o processo de parsing. Elas são a ponte
          entre a sintaxe e a semântica.
        </p>
      </div>

      {/* ── Seção 1: O que são SDDs ── */}
      <section className="section">
        <h2><span className="section-icon">📐</span> O que são SDDs?</h2>

        <div className="theory-card">
          <div className="definition-box">
            <div className="def-term">Definição Dirigida pela Sintaxe (SDD)</div>
            <div className="def-desc">
              Uma gramática onde cada produção tem uma ou mais
              <span className="highlight">regras semânticas</span> associadas, que definem
              como calcular os <span className="keyword">atributos</span> dos símbolos da produção.
            </div>
          </div>

          <div className="definition-box">
            <div className="def-term">Atributo</div>
            <div className="def-desc">
              Um valor associado a um nó da árvore de derivação. Pode ser um número,
              string, tipo, ou qualquer informação semântica. Cada símbolo (terminal ou
              não-terminal) pode ter atributos.
            </div>
          </div>

          <div className="example-box">
            <div className="example-label">Exemplo Simples</div>
            <table className="data-table">
              <thead>
                <tr><th>Produção</th><th>Regra Semântica</th></tr>
              </thead>
              <tbody>
                <tr><td className="mono">E → E₁ + T</td><td className="mono">E.val = E₁.val + T.val</td></tr>
                <tr><td className="mono">E → T</td><td className="mono">E.val = T.val</td></tr>
                <tr><td className="mono">F → digit</td><td className="mono">F.val = digit.lexval</td></tr>
              </tbody>
            </table>
            <p style={{ marginTop: 12, marginBottom: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Cada nó recebe um atributo <code>.val</code> que carrega o valor numérico da subexpressão.
            </p>
          </div>
        </div>
      </section>

      {/* ── Seção 2: Tipos de Atributos ── */}
      <section className="section">
        <h2><span className="section-icon">⬆️⬇️</span> Tipos de Atributos</h2>

        <div className="theory-card">
          <table className="data-table">
            <thead>
              <tr><th>Tipo</th><th>Direção</th><th>Definido por</th><th>Exemplo</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Sintetizado</strong></td>
                <td>⬆️ Baixo para cima</td>
                <td>Calculado a partir dos filhos</td>
                <td><code>E.val = E₁.val + T.val</code></td>
              </tr>
              <tr>
                <td><strong>Herdado</strong></td>
                <td>⬇️ Cima para baixo</td>
                <td>Recebido do pai ou irmãos</td>
                <td><code>T'.inh = T.val</code></td>
              </tr>
            </tbody>
          </table>

          <div className="tip-box info">
            <span className="tip-icon">💡</span>
            <div>
              <strong>S-attributed:</strong> Uma SDD que usa apenas atributos sintetizados.
              Pode ser avaliada em uma travessia <em>bottom-up</em> da árvore (das folhas para a raiz).
              <br /><br />
              <strong>L-attributed:</strong> Usa atributos sintetizados e herdados, mas cada
              atributo herdado depende apenas de atributos do pai ou de irmãos à esquerda.
              Pode ser avaliada em uma travessia <em>da esquerda para a direita</em>.
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 3: SDD da Prova ── */}
      <section className="section">
        <h2><span className="section-icon">📋</span> SDD do Exame (P3 2023, Q4)</h2>

        <div className="theory-card">
          <p>A SDD da questão 4 da prova é <strong>S-attributed</strong> (apenas sintetizados):</p>

          <table className="data-table">
            <thead>
              <tr><th>#</th><th>Produção</th><th>Regra Semântica</th></tr>
            </thead>
            <tbody>
              <tr><td>1</td><td className="mono">L → E n</td><td className="mono">L.val = E.val</td></tr>
              <tr><td>2</td><td className="mono">E → E₁ + T</td><td className="mono">E.val = E₁.val + T.val</td></tr>
              <tr><td>3</td><td className="mono">E → T</td><td className="mono">E.val = T.val</td></tr>
              <tr><td>4</td><td className="mono">T → T₁ * F</td><td className="mono">T.val = T₁.val × F.val</td></tr>
              <tr><td>5</td><td className="mono">T → F</td><td className="mono">T.val = F.val</td></tr>
              <tr><td>6</td><td className="mono">F → ( E )</td><td className="mono">F.val = E.val</td></tr>
              <tr><td>7</td><td className="mono">F → digit</td><td className="mono">F.val = digit.lexval</td></tr>
            </tbody>
          </table>

          <div className="tip-box info">
            <span className="tip-icon">📌</span>
            <div>
              <strong>Como avaliar:</strong>
              <br />1. Construa a árvore de derivação para a expressão
              <br />2. Atribua valores às <strong>folhas</strong> (digit.lexval para números, n é apenas uma marca de fim)
              <br />3. Calcule os valores <strong>de baixo para cima</strong> usando as regras semânticas
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 4: Walkthroughs ── */}
      <section className="section">
        <h2><span className="section-icon">🔍</span> Walkthroughs da Prova</h2>

        <div className="theory-card">
          <SDDWalkthrough />
        </div>
      </section>

      {/* ── Exercício Interativo ── */}
      <section className="section">
        <h2><span className="section-icon">🎯</span> Exercício: Construa a Árvore Anotada</h2>
        <AnnotatedTreeExercise />
      </section>

      {/* ── Quiz ── */}
      <section className="section">
        <h2><span className="section-icon">🧠</span> Verificação de Aprendizado</h2>

        <Quiz
          question="Qual a diferença entre atributos sintetizados e herdados?"
          options={[
            'Sintetizados são calculados de cima para baixo; herdados de baixo para cima',
            'Sintetizados são calculados a partir dos filhos (bottom-up); herdados vêm do pai ou irmãos',
            'Sintetizados são para terminais; herdados são para não-terminais',
            'Não há diferença — são sinônimos',
          ]}
          correctIndex={1}
          explanation="Atributos sintetizados fluem de baixo para cima (calculados dos filhos para o pai). Atributos herdados fluem de cima para baixo ou lateralmente (calculados a partir do pai ou irmãos)."
        />

        <div style={{ marginTop: 24 }}>
          <Quiz
            question="Na SDD do exame, qual é o valor de F.val quando a produção F → digit é aplicada com digit.lexval = 5?"
            options={[
              'F.val = 0',
              'F.val = 5',
              'F.val = digit',
              'F.val não é definido',
            ]}
            correctIndex={1}
            explanation="A regra semântica diz F.val = digit.lexval. Se digit.lexval = 5, então F.val = 5. O atributo simplesmente copia o valor léxico do terminal."
          />
        </div>

        <div style={{ marginTop: 24 }}>
          <Quiz
            question="Para a expressão '2 + 3 * 4 n' usando a SDD do exame, qual é L.val?"
            options={[
              '20 (porque (2+3)×4 = 20)',
              '14 (porque 2+(3×4) = 14)',
              '24 (porque 2×3×4 = 24)',
              '9 (porque 2+3+4 = 9)',
            ]}
            correctIndex={1}
            explanation="A gramática garante precedência: * (em T) tem precedência maior que + (em E). Portanto: E.val = E₁.val + T.val = 2 + (3×4) = 2 + 12 = 14."
          />
        </div>
      </section>

      {/* ── Footer ── */}
      <div className="module-footer">
        <button className="btn btn-secondary" onClick={onPrev}>
          ← Anterior
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Módulo {moduleNumber} de {totalModules}
        </span>
        <button className="btn btn-primary" onClick={onNext}>
          Próximo módulo →
        </button>
      </div>
    </div>
  );
}

/* ── SDD Walkthrough ── */
function SDDWalkthrough() {
  const [selectedExpr, setSelectedExpr] = useState(0);

  const examples = [
    {
      name: 'Q4a: (3 + 4) * (5 * 6) n',
      tree: {
        label: 'L', value: 210,
        children: [
          {
            label: 'E', value: 210,
            children: [
              {
                label: 'T', value: 210,
                children: [
                  {
                    label: 'T', value: 7,
                    children: [
                      {
                        label: 'F', value: 7,
                        children: [
                          { label: '(' },
                          {
                            label: 'E', value: 7,
                            children: [
                              {
                                label: 'E', value: 3,
                                children: [
                                  {
                                    label: 'T', value: 3,
                                    children: [
                                      { label: 'F', value: 3, children: [{ label: '3', value: 3 }] },
                                    ],
                                  },
                                ],
                              },
                              { label: '+' },
                              {
                                label: 'T', value: 4,
                                children: [
                                  { label: 'F', value: 4, children: [{ label: '4', value: 4 }] },
                                ],
                              },
                            ],
                          },
                          { label: ')' },
                        ],
                      },
                    ],
                  },
                  { label: '*' },
                  {
                    label: 'F', value: 30,
                    children: [
                      { label: '(' },
                      {
                        label: 'E', value: 30,
                        children: [
                          {
                            label: 'T', value: 30,
                            children: [
                              {
                                label: 'T', value: 5,
                                children: [
                                  { label: 'F', value: 5, children: [{ label: '5', value: 5 }] },
                                ],
                              },
                              { label: '*' },
                              { label: 'F', value: 6, children: [{ label: '6', value: 6 }] },
                            ],
                          },
                        ],
                      },
                      { label: ')' },
                    ],
                  },
                ],
              },
            ],
          },
          { label: 'n' },
        ],
      },
      steps: [
        'Folhas: digit(3).lexval=3, digit(4).lexval=4, digit(5).lexval=5, digit(6).lexval=6',
        'F.val: cada F → digit copia o lexval → F.val = 3, 4, 5, 6',
        'T.val (interno esq.): T → F → T.val = 3. Depois T → F → T.val = 5',
        'E.val (interno esq.): E → T → E.val = 3. Depois E → E+T → E.val = 3+4 = 7',
        'F.val (par. esq.): F → (E) → F.val = E.val = 7',
        'T.val (interno dir.): T → T*F → T.val = 5×6 = 30',
        'E.val (par. dir.): E → T → E.val = 30. Depois F → (E) → F.val = 30',
        'T.val (raiz): T → T*F → T.val = 7×30 = 210',
        'E.val (raiz): E → T → E.val = 210',
        'L.val: L → En → L.val = E.val = 210',
      ],
    },
    {
      name: 'Q4b: 1 * 2 * 3 * (4 + 5) n',
      tree: {
        label: 'L', value: 54,
        children: [
          {
            label: 'E', value: 54,
            children: [
              {
                label: 'T', value: 54,
                children: [
                  {
                    label: 'T', value: 6,
                    children: [
                      {
                        label: 'T', value: 2,
                        children: [
                          {
                            label: 'T', value: 1,
                            children: [
                              { label: 'F', value: 1, children: [{ label: '1', value: 1 }] },
                            ],
                          },
                          { label: '*' },
                          { label: 'F', value: 2, children: [{ label: '2', value: 2 }] },
                        ],
                      },
                      { label: '*' },
                      { label: 'F', value: 3, children: [{ label: '3', value: 3 }] },
                    ],
                  },
                  { label: '*' },
                  {
                    label: 'F', value: 9,
                    children: [
                      { label: '(' },
                      {
                        label: 'E', value: 9,
                        children: [
                          {
                            label: 'E', value: 4,
                            children: [
                              {
                                label: 'T', value: 4,
                                children: [
                                  { label: 'F', value: 4, children: [{ label: '4', value: 4 }] },
                                ],
                              },
                            ],
                          },
                          { label: '+' },
                          {
                            label: 'T', value: 5,
                            children: [
                              { label: 'F', value: 5, children: [{ label: '5', value: 5 }] },
                            ],
                          },
                        ],
                      },
                      { label: ')' },
                    ],
                  },
                ],
              },
            ],
          },
          { label: 'n' },
        ],
      },
      steps: [
        'Folhas: digit(1).lexval=1, digit(2).lexval=2, digit(3).lexval=3, digit(4).lexval=4, digit(5).lexval=5',
        'F.val: cada F → digit → F.val = 1, 2, 3, 4, 5',
        'T.val mais interno: T → F → T.val = 1',
        'T.val: T → T*F → T.val = 1×2 = 2',
        'T.val: T → T*F → T.val = 2×3 = 6',
        'E.val interno (4+5): E → T → E.val = 4. Depois E → E+T → E.val = 4+5 = 9',
        'F.val (parênteses): F → (E) → F.val = 9',
        'T.val (raiz): T → T*F → T.val = 6×9 = 54',
        'E.val: E → T → E.val = 54',
        'L.val: L → En → L.val = 54',
      ],
    },
  ];

  const example = examples[selectedExpr];
  const [stepIdx, setStepIdx] = useState(0);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {examples.map((ex, i) => (
          <button
            key={i}
            className={`btn ${i === selectedExpr ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => { setSelectedExpr(i); setStepIdx(0); }}
          >
            {ex.name}
          </button>
        ))}
      </div>

      <TreeVisualization tree={example.tree} showValues={true} />

      <div style={{ marginTop: 16 }}>
        <h4 style={{ color: 'var(--accent-cyan)', marginBottom: 12 }}>
          Avaliação passo a passo (bottom-up)
        </h4>

        <div style={{
          padding: '14px 20px',
          background: 'var(--bg-input)',
          borderRadius: 'var(--radius-md)',
          borderLeft: '3px solid var(--accent-amber)',
          marginBottom: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          color: 'var(--text-primary)',
          animation: 'fadeSlideIn 0.2s ease',
        }} key={`${selectedExpr}-${stepIdx}`}>
          <span style={{ color: 'var(--text-muted)', marginRight: 8 }}>Passo {stepIdx + 1}:</span>
          {example.steps[stepIdx]}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setStepIdx(Math.max(0, stepIdx - 1))} disabled={stepIdx <= 0}>
            ← Anterior
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setStepIdx(Math.min(example.steps.length - 1, stepIdx + 1))} disabled={stepIdx >= example.steps.length - 1}>
            Próximo →
          </button>
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {stepIdx + 1} / {example.steps.length}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Annotated Tree Exercise ── */
function AnnotatedTreeExercise() {
  const [answers, setAnswers] = useState({
    f1: '', f2: '', f3: '',
    t1: '', t2: '',
    e1: '',
    l: '',
  });
  const [checked, setChecked] = useState(false);

  // Expression: 2 * (3 + 5) n
  // F(2)=2, F(3)=3, F(5)=5
  // T(2)=2
  // E(3)=3, E(3+5)=8
  // F((3+5))=8
  // T(2*8)=16
  // E=16, L=16

  const solutions = {
    f1: '2',  // F → digit(2)
    f2: '3',  // F → digit(3)
    f3: '5',  // F → digit(5)
    t1: '2',  // T → F (the left T)
    t2: '16', // T → T * F = 2 * 8
    e1: '8',  // E → E + T = 3 + 5
    l: '16',  // L → E n
  };

  const isCorrect = (key) => answers[key].trim() === solutions[key];

  const fields = [
    { key: 'f1', label: 'F.val (digit=2)', hint: 'F → digit: F.val = digit.lexval' },
    { key: 'f2', label: 'F.val (digit=3)', hint: 'F → digit' },
    { key: 'f3', label: 'F.val (digit=5)', hint: 'F → digit' },
    { key: 't1', label: 'T.val (para T → F com F.val=2)', hint: 'T → F: T.val = F.val' },
    { key: 'e1', label: 'E.val (para 3 + 5)', hint: 'E → E₁ + T: E.val = E₁.val + T.val' },
    { key: 't2', label: 'T.val (para 2 * (3+5))', hint: 'T → T₁ * F: T.val = T₁.val × F.val' },
    { key: 'l', label: 'L.val (resultado final)', hint: 'L → E n: L.val = E.val' },
  ];

  return (
    <div className="exercise-container">
      <div className="exercise-header">
        <div className="exercise-icon">✏️</div>
        <h3>Calcule os Atributos</h3>
      </div>
      <p className="exercise-description">
        Usando a SDD do exame, calcule os valores (<code>.val</code>) para a expressão
        <code> 2 * (3 + 5) n</code>. Preencha de baixo para cima (folhas → raiz).
      </p>

      <div className="code-block" style={{ marginBottom: 20, fontSize: '0.82rem' }}>
        <span className="code-label">SDD</span>
        <pre>{`L→En: L.val=E.val | E→E₁+T: E.val=E₁.val+T.val | E→T: E.val=T.val
T→T₁*F: T.val=T₁.val×F.val | T→F: T.val=F.val | F→(E): F.val=E.val
F→digit: F.val=digit.lexval`}</pre>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {fields.map(f => (
          <div key={f.key} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 16px',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            border: checked ? `1px solid ${isCorrect(f.key) ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)'}` : '1px solid var(--border-subtle)',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{f.label}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{f.hint}</div>
            </div>
            <input
              className="input"
              value={answers[f.key]}
              onChange={(e) => setAnswers(p => ({ ...p, [f.key]: e.target.value }))}
              placeholder="?"
              disabled={checked}
              style={{ width: 80, textAlign: 'center' }}
            />
            {checked && (
              <span style={{ fontSize: '0.85rem', flexShrink: 0 }}>
                {isCorrect(f.key) ? '✅' : `❌ ${solutions[f.key]}`}
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        {!checked ? (
          <button className="btn btn-primary btn-sm" onClick={() => setChecked(true)}>
            Verificar respostas
          </button>
        ) : (
          <button className="btn btn-secondary btn-sm" onClick={() => { setChecked(false); setAnswers({ f1: '', f2: '', f3: '', t1: '', t2: '', e1: '', l: '' }); }}>
            🔄 Tentar novamente
          </button>
        )}
      </div>
    </div>
  );
}
