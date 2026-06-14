import React, { useState, useMemo } from 'react';
import Quiz from '../components/Quiz';

/* ═══════════════════════════════════════════════════
   MODULE 7 — Análise LL(1)
   Covers: P3 Q2 (FIRST, FOLLOW, LL(1) test)
   ═══════════════════════════════════════════════════ */

export default function Module7({ onNext, onPrev, moduleNumber, totalModules }) {
  return (
    <div className="content-wrapper fade-in">
      <div className="module-header">
        <span className="module-header-badge">📊 Módulo 7</span>
        <h1>Análise LL(1)</h1>
        <p>
          A análise LL(1) é uma técnica de parsing top-down que usa conjuntos FIRST e FOLLOW
          para decidir qual produção aplicar, olhando apenas um token à frente.
        </p>
      </div>

      {/* ── Seção 1: FIRST ── */}
      <section className="section">
        <h2><span className="section-icon">1️⃣</span> Conjuntos FIRST</h2>

        <div className="theory-card">
          <div className="definition-box">
            <div className="def-term">FIRST(α)</div>
            <div className="def-desc">
              O conjunto de <span className="highlight">terminais</span> que podem aparecer
              como o primeiro símbolo de qualquer cadeia derivada a partir de α.
              Se α pode derivar ε, então <code>ε ∈ FIRST(α)</code>.
            </div>
          </div>

          <h3>Regras para calcular FIRST</h3>
          <div className="code-block">
            <span className="code-label">REGRAS</span>
            <pre>{`1. Se X é terminal:           FIRST(X) = { X }

2. Se X → ε é produção:      adicione ε a FIRST(X)

3. Se X → Y₁ Y₂ ... Yₖ:
   - Adicione FIRST(Y₁) − {ε} a FIRST(X)
   - Se ε ∈ FIRST(Y₁), adicione FIRST(Y₂) − {ε} a FIRST(X)
   - Se ε ∈ FIRST(Y₁) e ε ∈ FIRST(Y₂), adicione FIRST(Y₃) − {ε}
   - ...continue até Yₖ
   - Se ε ∈ FIRST(Yᵢ) para todo i=1..k, adicione ε a FIRST(X)`}</pre>
          </div>

          <div className="example-box">
            <div className="example-label">Exemplo</div>
            <div className="code-block">
              <pre>{`Gramática:
  E  → T E'
  E' → + T E' | ε
  T  → F T'
  T' → × F T' | ε
  F  → ( E ) | id

FIRST(F) = { (, id }
FIRST(T') = { ×, ε }
FIRST(T) = FIRST(F) = { (, id }
FIRST(E') = { +, ε }
FIRST(E) = FIRST(T) = { (, id }`}</pre>
            </div>
          </div>

          <div className="tip-box info">
            <span className="tip-icon">📌</span>
            <div>
              <strong>FIRST de uma cauda de produção</strong> (FIRST(α)):
              Para calcular FIRST de uma sequência como <code>+ T E'</code>,
              basta olhar o primeiro símbolo: FIRST(+ T E') = {'{'} + {'}'} (pois + é terminal).
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 2: FOLLOW ── */}
      <section className="section">
        <h2><span className="section-icon">2️⃣</span> Conjuntos FOLLOW</h2>

        <div className="theory-card">
          <div className="definition-box">
            <div className="def-term">FOLLOW(A)</div>
            <div className="def-desc">
              O conjunto de <span className="highlight">terminais</span> que podem aparecer
              <strong>imediatamente após</strong> o não-terminal A em alguma derivação.
              O símbolo especial <code>$</code> (fim de entrada) é incluído quando
              A pode ser o último símbolo.
            </div>
          </div>

          <h3>Regras para calcular FOLLOW</h3>
          <div className="code-block">
            <span className="code-label">REGRAS</span>
            <pre>{`1. $ ∈ FOLLOW(S)   (S = símbolo inicial, $ = fim de entrada)

2. Se A → α B β:
   - Adicione FIRST(β) − {ε} a FOLLOW(B)

3. Se A → α B  ou  A → α B β onde ε ∈ FIRST(β):
   - Adicione FOLLOW(A) a FOLLOW(B)
   (o que segue A também pode seguir B)`}</pre>
          </div>

          <div className="example-box">
            <div className="example-label">Exemplo (continuação)</div>
            <div className="code-block">
              <pre>{`Gramática:
  E  → T E'
  E' → + T E' | ε
  T  → F T'
  T' → × F T' | ε
  F  → ( E ) | id

FOLLOW(E)  = { ), $ }
FOLLOW(E') = FOLLOW(E) = { ), $ }
FOLLOW(T)  = (FIRST(E') − {ε}) ∪ FOLLOW(E) ∪ FOLLOW(E')
           = { +, ), $ }
FOLLOW(T') = FOLLOW(T) = { +, ), $ }
FOLLOW(F)  = (FIRST(T') − {ε}) ∪ FOLLOW(T) ∪ FOLLOW(T')
           = { ×, +, ), $ }`}</pre>
            </div>
          </div>

          <div className="tip-box warning">
            <span className="tip-icon">⚠️</span>
            <div>
              <strong>Cuidado com dependências circulares:</strong> FOLLOW sets podem
              depender uns dos outros (ex: FOLLOW(E') depende de FOLLOW(E)). Resolva
              iterativamente até convergir — aplique as regras repetidamente até que
              nenhum conjunto mude.
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 3: Teorema LL(1) ── */}
      <section className="section">
        <h2><span className="section-icon">3️⃣</span> O Teorema LL(1)</h2>

        <div className="theory-card">
          <div className="definition-box">
            <div className="def-term">Condição LL(1)</div>
            <div className="def-desc">
              Uma gramática é <span className="highlight">LL(1)</span> se e somente se,
              para cada par de produções <code>A → α | β</code>:
              <br /><br />
              <strong>1.</strong> FIRST(α) ∩ FIRST(β) = ∅
              <br />
              <strong>2.</strong> Se ε ∈ FIRST(α), então FIRST(β) ∩ FOLLOW(A) = ∅
              <br />
              <strong>3.</strong> Se ε ∈ FIRST(β), então FIRST(α) ∩ FOLLOW(A) = ∅
              <br /><br />
              Em resumo: nunca dois caminhos podem ser escolhidos pelo mesmo token de lookahead.
            </div>
          </div>

          <div className="example-box">
            <div className="example-label">Exemplo de verificação</div>
            <div className="code-block">
              <pre>{`Para E' → + T E' | ε:
  FIRST(+ T E') = { + }
  FIRST(ε) = { ε }

  Condição 1: { + } ∩ { ε } = ∅  ✓ (ignora ε na interseção)
  Condição 2: ε ∈ FIRST(ε), então FIRST(+TE') ∩ FOLLOW(E') = ?
              { + } ∩ { ), $ } = ∅  ✓

Conclusão: As produções de E' satisfazem LL(1).`}</pre>
            </div>
          </div>

          <div className="tip-box info">
            <span className="tip-icon">💡</span>
            <div>
              <strong>O que LL(1) significa:</strong>
              <br />• <strong>L</strong>eft-to-right: lê a entrada da esquerda para a direita
              <br />• <strong>L</strong>eftmost derivation: produz a derivação mais à esquerda
              <br />• <strong>(1)</strong>: olha 1 token à frente para decidir
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 4: Tabela de Parsing ── */}
      <section className="section">
        <h2><span className="section-icon">📋</span> Tabela de Parsing LL(1)</h2>

        <div className="theory-card">
          <h3>Construção da tabela</h3>
          <div className="code-block">
            <span className="code-label">ALGORITMO</span>
            <pre>{`Para cada produção A → α:
  1. Para cada terminal a ∈ FIRST(α):
     - Adicione A → α na célula M[A, a]

  2. Se ε ∈ FIRST(α):
     - Para cada terminal b ∈ FOLLOW(A):
       - Adicione A → α na célula M[A, b]
     - Se $ ∈ FOLLOW(A):
       - Adicione A → α na célula M[A, $]`}</pre>
          </div>

          <ParseTableExample />
        </div>
      </section>

      {/* ── Exercício Interativo: FIRST/FOLLOW Calculator ── */}
      <section className="section">
        <h2><span className="section-icon">🎯</span> Exercício: Calcule FIRST e FOLLOW</h2>
        <FirstFollowExercise />
      </section>

      {/* ── Exercício: Predictive Parser ── */}
      <section className="section">
        <h2><span className="section-icon">🎮</span> Simulador de Parser Preditivo</h2>
        <PredictiveParserSimulator />
      </section>

      {/* ── Quiz ── */}
      <section className="section">
        <h2><span className="section-icon">🧠</span> Verificação de Aprendizado</h2>

        <Quiz
          question="Se a gramática tem E' → + T E' | ε, qual é FIRST(+ T E')?"
          options={[
            '{ +, T, E\' }',
            '{ + }',
            '{ +, ε }',
            '{ +, (, id }',
          ]}
          correctIndex={1}
          explanation="O primeiro símbolo de '+ T E\'' é o terminal '+'. Como '+' é terminal, FIRST(+ T E') = { + }. Não precisamos olhar os demais símbolos."
        />

        <div style={{ marginTop: 24 }}>
          <Quiz
            question="Se A → α | β e ε ∈ FIRST(α), qual condição adicional é necessária para LL(1)?"
            options={[
              'FIRST(α) ∩ FIRST(β) = ∅ (é suficiente)',
              'FIRST(β) ∩ FOLLOW(A) = ∅',
              'FOLLOW(A) deve ser vazio',
              'α e β devem começar com o mesmo terminal',
            ]}
            correctIndex={1}
            explanation="Quando ε ∈ FIRST(α), o parser pode 'pular' α e usar o que vem depois (FOLLOW(A)) para decidir. Para não haver conflito, FIRST(β) ∩ FOLLOW(A) deve ser vazio."
          />
        </div>

        <div style={{ marginTop: 24 }}>
          <Quiz
            question="Qual é a função do símbolo $ em FOLLOW?"
            options={[
              'Representa um dígito qualquer',
              'Marca o fim da entrada — é adicionado a FOLLOW(S) do símbolo inicial',
              'Substitui ε nas produções',
              'Indica que a gramática é ambígua',
            ]}
            correctIndex={1}
            explanation="$ (cifrão/dólar) é um marcador especial que indica o fim da cadeia de entrada. É sempre incluído em FOLLOW(S), onde S é o símbolo inicial da gramática."
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

/* ── Parse Table Example ── */
function ParseTableExample() {
  const table = {
    headers: ['id', '+', '×', '(', ')', '$'],
    rows: [
      { nt: 'E',  cells: ['TE\'', '', '', 'TE\'', '', ''] },
      { nt: 'E\'', cells: ['', '+TE\'', '', '', 'ε', 'ε'] },
      { nt: 'T',  cells: ['FT\'', '', '', 'FT\'', '', ''] },
      { nt: 'T\'', cells: ['', 'ε', '×FT\'', '', 'ε', 'ε'] },
      { nt: 'F',  cells: ['id', '', '', '(E)', '', ''] },
    ],
  };

  return (
    <div style={{ marginTop: 16, overflowX: 'auto' }}>
      <h4 style={{ color: 'var(--accent-cyan)', marginBottom: 12 }}>Tabela de parsing M[A, a]</h4>
      <table className="data-table">
        <thead>
          <tr>
            <th>NT \ T</th>
            {table.headers.map(h => <th key={h} className="mono">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {table.rows.map(row => (
            <tr key={row.nt}>
              <td className="mono" style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>{row.nt}</td>
              {row.cells.map((cell, i) => (
                <td key={i} className="mono" style={{
                  color: cell ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  fontSize: '0.82rem',
                }}>
                  {cell || '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── FIRST/FOLLOW Exercise ── */
function FirstFollowExercise() {
  const [answers, setAnswers] = useState({
    firstR: '', firstS: '', firstT: '', firstX: '',
    followR: '', followS: '', followT: '', followX: '',
  });
  const [checked, setChecked] = useState(false);

  // Grammar from Q2:
  // R → X R X | S
  // S → a T b | b T a
  // T → X T X | X | ε
  // X → a | b

  const solutions = {
    firstX: 'a,b',
    firstT: 'a,b,ε',
    firstS: 'a,b',
    firstR: 'a,b',
    followR: '$',
    followS: 'a,b,$',
    followT: 'a,b',
    followX: 'a,b,$',
  };

  const normalize = (s) => {
    return s.replace(/\s/g, '').toLowerCase().split(',').map(x => x.trim()).filter(Boolean).sort().join(',');
  };

  const isCorrect = (key) => normalize(answers[key]) === normalize(solutions[key]);

  const fields = [
    { key: 'firstX', label: 'FIRST(X)' },
    { key: 'firstT', label: 'FIRST(T)' },
    { key: 'firstS', label: 'FIRST(S)' },
    { key: 'firstR', label: 'FIRST(R)' },
    { key: 'followR', label: 'FOLLOW(R)' },
    { key: 'followS', label: 'FOLLOW(S)' },
    { key: 'followT', label: 'FOLLOW(T)' },
    { key: 'followX', label: 'FOLLOW(X)' },
  ];

  return (
    <div className="exercise-container">
      <div className="exercise-header">
        <div className="exercise-icon">🧮</div>
        <h3>Calcule FIRST e FOLLOW</h3>
      </div>
      <p className="exercise-description">
        Compute os conjuntos FIRST e FOLLOW para a gramática da Prova P3 2023 (Questão 2).
        Separe os símbolos por vírgula (ex: <code>a,b,ε</code>). Use <code>$</code> para o fim de entrada.
      </p>

      <div className="code-block" style={{ marginBottom: 20 }}>
        <span className="code-label">GRAMÁTICA (Q2 P3 2023)</span>
        <pre>{`R → X R X | S
S → a T b | b T a
T → X T X | X | ε
X → a | b`}</pre>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {fields.map(f => (
          <div key={f.key} style={{
            padding: 12,
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            border: checked ? `1px solid ${isCorrect(f.key) ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)'}` : '1px solid var(--border-subtle)',
          }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
              {f.label}
            </label>
            <input
              className="input"
              value={answers[f.key]}
              onChange={(e) => setAnswers(p => ({ ...p, [f.key]: e.target.value }))}
              placeholder="ex: a,b,ε"
              disabled={checked}
              style={{ fontSize: '0.85rem' }}
            />
            {checked && (
              <span style={{ fontSize: '0.75rem', color: isCorrect(f.key) ? 'var(--accent-green)' : 'var(--accent-rose)', marginTop: 4, display: 'block' }}>
                {isCorrect(f.key) ? '✅' : `❌ → { ${solutions[f.key]} }`}
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
          <button className="btn btn-secondary btn-sm" onClick={() => { setChecked(false); setAnswers({ firstR: '', firstS: '', firstT: '', firstX: '', followR: '', followS: '', followT: '', followX: '' }); }}>
            🔄 Tentar novamente
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Predictive Parser Simulator ── */
function PredictiveParserSimulator() {
  const [inputStr, setInputStr] = useState('id+id×id');
  const [simulation, setSimulation] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);

  // LL(1) grammar: E → TE', E' → +TE'|ε, T → FT', T' → ×FT'|ε, F → (E)|id
  const parseTable = {
    'E':  { 'id': ['T', "E'"], '(': ['T', "E'"] },
    "E'": { '+': ['+', 'T', "E'"], ')': [], '$': [] },
    'T':  { 'id': ['F', "T'"], '(': ['F', "T'"] },
    "T'": { '+': [], '×': ['×', 'F', "T'"], ')': [], '$': [] },
    'F':  { 'id': ['id'], '(': ['(', 'E', ')'] },
  };

  const nonTerminals = new Set(Object.keys(parseTable));

  const tokenize = (str) => {
    const tokens = [];
    let i = 0;
    while (i < str.length) {
      if (str[i] === ' ') { i++; continue; }
      if (str.slice(i, i + 2) === 'id') { tokens.push('id'); i += 2; }
      else { tokens.push(str[i]); i++; }
    }
    tokens.push('$');
    return tokens;
  };

  const runSimulation = () => {
    const tokens = tokenize(inputStr);
    const stack = ['$', 'E'];
    const steps = [];
    let ip = 0;

    steps.push({
      stack: [...stack].reverse().join(' '),
      input: tokens.slice(ip).join(' '),
      action: 'Início',
    });

    let maxSteps = 100;
    while (stack.length > 0 && maxSteps-- > 0) {
      const top = stack[stack.length - 1];
      const current = tokens[ip];

      if (top === '$' && current === '$') {
        steps.push({
          stack: '$',
          input: '$',
          action: '✅ Aceita!',
          accepted: true,
        });
        break;
      }

      if (top === current) {
        // Match
        stack.pop();
        ip++;
        steps.push({
          stack: [...stack].reverse().join(' ') || '$',
          input: tokens.slice(ip).join(' '),
          action: `Match: "${top}"`,
        });
      } else if (nonTerminals.has(top)) {
        const rule = parseTable[top]?.[current];
        if (rule === undefined) {
          steps.push({
            stack: [...stack].reverse().join(' '),
            input: tokens.slice(ip).join(' '),
            action: `❌ Erro: M[${top}, ${current}] está vazia`,
            error: true,
          });
          break;
        }
        stack.pop();
        // Push in reverse order
        for (let r = rule.length - 1; r >= 0; r--) {
          stack.push(rule[r]);
        }
        const ruleStr = rule.length > 0 ? rule.join(' ') : 'ε';
        steps.push({
          stack: [...stack].reverse().join(' ') || '$',
          input: tokens.slice(ip).join(' '),
          action: `${top} → ${ruleStr}`,
        });
      } else {
        steps.push({
          stack: [...stack].reverse().join(' '),
          input: tokens.slice(ip).join(' '),
          action: `❌ Erro: esperava "${top}", encontrou "${current}"`,
          error: true,
        });
        break;
      }
    }

    setSimulation(steps);
    setStepIdx(0);
  };

  const currentStep = simulation?.[stepIdx];

  return (
    <div className="exercise-container">
      <div className="exercise-header">
        <div className="exercise-icon">🎮</div>
        <h3>Simulador de Parser Preditivo LL(1)</h3>
      </div>
      <p className="exercise-description">
        Digite uma expressão usando <code>id</code>, <code>+</code>, <code>×</code>,
        <code>(</code>, <code>)</code> e veja o parser LL(1) processá-la passo a passo.
      </p>

      <div className="code-block" style={{ marginBottom: 16, fontSize: '0.82rem' }}>
        <span className="code-label">GRAMÁTICA</span>
        <pre>{`E → TE'   E' → +TE' | ε   T → FT'   T' → ×FT' | ε   F → (E) | id`}</pre>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <input
          className="input"
          value={inputStr}
          onChange={(e) => { setInputStr(e.target.value); setSimulation(null); }}
          placeholder="ex: id+id×id"
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary btn-sm" onClick={runSimulation}>
          Simular
        </button>
      </div>

      {simulation && (
        <div style={{ animation: 'fadeSlideIn 0.3s ease' }}>
          {/* Current step display */}
          <div style={{
            padding: 16,
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)',
            marginBottom: 12,
            borderLeft: `3px solid ${
              currentStep?.accepted ? 'var(--accent-green)' :
              currentStep?.error ? 'var(--accent-rose)' :
              'var(--accent-blue)'
            }`,
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>PILHA</span>
                <div className="mono" style={{ color: 'var(--accent-cyan)', marginTop: 4 }}>{currentStep?.stack}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>ENTRADA</span>
                <div className="mono" style={{ color: 'var(--accent-amber)', marginTop: 4 }}>{currentStep?.input}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>AÇÃO</span>
                <div style={{
                  marginTop: 4,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  color: currentStep?.accepted ? 'var(--accent-green)' :
                         currentStep?.error ? 'var(--accent-rose)' :
                         'var(--text-primary)',
                }}>
                  {currentStep?.action}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setStepIdx(Math.max(0, stepIdx - 1))} disabled={stepIdx <= 0}>
              ← Anterior
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setStepIdx(Math.min(simulation.length - 1, stepIdx + 1))} disabled={stepIdx >= simulation.length - 1}>
              Próximo →
            </button>
            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Passo {stepIdx + 1} de {simulation.length}
            </span>
          </div>

          {/* Full trace table */}
          <details style={{ marginTop: 16 }}>
            <summary style={{
              cursor: 'pointer',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              padding: '8px 0',
            }}>
              Ver tabela completa ({simulation.length} passos)
            </summary>
            <table className="data-table" style={{ marginTop: 8 }}>
              <thead>
                <tr><th>#</th><th>Pilha</th><th>Entrada</th><th>Ação</th></tr>
              </thead>
              <tbody>
                {simulation.map((s, i) => (
                  <tr key={i} style={{
                    background: i === stepIdx ? 'rgba(59,130,246,0.08)' : 'transparent',
                    cursor: 'pointer',
                  }} onClick={() => setStepIdx(i)}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td className="mono" style={{ fontSize: '0.82rem' }}>{s.stack}</td>
                    <td className="mono" style={{ fontSize: '0.82rem' }}>{s.input}</td>
                    <td style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.82rem',
                      color: s.accepted ? 'var(--accent-green)' : s.error ? 'var(--accent-rose)' : 'var(--text-secondary)',
                    }}>{s.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </div>
      )}
    </div>
  );
}
