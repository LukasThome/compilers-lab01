import React, { useState } from 'react';
import Quiz from '../components/Quiz';
import TreeVisualization from '../components/visualization/TreeVisualization';

/* ═══════════════════════════════════════════════════
   MODULE 6 — Transformações de Gramáticas
   Covers: P3 Q1a (left-recursion removal)
   ═══════════════════════════════════════════════════ */

export default function Module6({ onNext, onPrev, moduleNumber, totalModules }) {
  return (
    <div className="content-wrapper fade-in">
      <div className="module-header">
        <span className="module-header-badge">🔄 Módulo 6</span>
        <h1>Transformações de Gramáticas</h1>
        <p>
          Certas gramáticas precisam ser transformadas antes de serem usadas em parsers
          preditivos. As duas transformações principais são a remoção de recursão à esquerda
          e a fatoração à esquerda.
        </p>
      </div>

      {/* ── Seção 1: Motivação ── */}
      <section className="section">
        <h2><span className="section-icon">🤔</span> Por que Transformar?</h2>

        <div className="theory-card">
          <p>
            Parsers <span className="highlight">top-down</span> (como LL(1)) têm uma
            limitação fundamental: eles não podem lidar com <span className="keyword">recursão à esquerda</span>.
          </p>

          <div className="definition-box">
            <div className="def-term">Recursão à Esquerda</div>
            <div className="def-desc">
              Uma gramática tem recursão à esquerda <strong>direta</strong> quando existe uma produção
              do tipo <code>A → Aα</code>, onde o não-terminal no lado esquerdo é o primeiro
              símbolo do lado direito.
            </div>
          </div>

          <div className="example-box">
            <div className="example-label">Exemplo de Recursão à Esquerda</div>
            <div className="code-block">
              <pre>{`E → E + T | T       ← E aparece à esquerda de "E + T"
T → T × F | F       ← T aparece à esquerda de "T × F"
F → ( E ) | a        ← F NÃO tem recursão à esquerda`}</pre>
            </div>
          </div>

          <div className="tip-box warning">
            <span className="tip-icon">⚠️</span>
            <div>
              <strong>O problema:</strong> um parser top-down tentaria expandir <code>E → E + T</code>,
              que por sua vez precisa expandir <code>E</code> novamente... entrando em
              <em>loop infinito</em> sem consumir nenhum token da entrada!
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 2: Algoritmo de Remoção ── */}
      <section className="section">
        <h2><span className="section-icon">🔧</span> Remoção de Recursão à Esquerda Direta</h2>

        <div className="theory-card">
          <div className="definition-box">
            <div className="def-term">Algoritmo Geral</div>
            <div className="def-desc">
              Se temos produções da forma:
              <br />
              <code>A → Aα₁ | Aα₂ | ... | β₁ | β₂ | ...</code>
              <br /><br />
              onde cada <code>βᵢ</code> <strong>não</strong> começa com <code>A</code>, substituímos por:
              <br />
              <code>A → β₁A' | β₂A' | ...</code>
              <br />
              <code>A' → α₁A' | α₂A' | ... | ε</code>
            </div>
          </div>

          <div className="code-block">
            <span className="code-label">FÓRMULA</span>
            <pre>{`Antes:    A → Aα | β
                  ↓
Depois:   A  → β A'
          A' → α A' | ε

Os "α" são as caudas após o A recursivo.
Os "β" são as alternativas que NÃO começam com A.
A' é um NOVO não-terminal.`}</pre>
          </div>
        </div>
      </section>

      {/* ── Seção 3: Passo a passo com a gramática do exame ── */}
      <section className="section">
        <h2><span className="section-icon">📝</span> Exemplo Completo (Gramática da Prova)</h2>

        <div className="theory-card">
          <p>Vamos aplicar o algoritmo à gramática clássica de expressões aritméticas:</p>

          <LeftRecursionWalkthrough />
        </div>
      </section>

      {/* ── Seção 4: Fatoração à Esquerda ── */}
      <section className="section">
        <h2><span className="section-icon">🔀</span> Fatoração à Esquerda</h2>

        <div className="theory-card">
          <div className="definition-box">
            <div className="def-term">Fatoração à Esquerda</div>
            <div className="def-desc">
              Quando duas ou mais produções de um não-terminal <span className="highlight">compartilham
              um prefixo</span>, o parser não consegue decidir qual regra usar
              olhando apenas o próximo token. A solução é fatorar o prefixo comum.
            </div>
          </div>

          <div className="code-block">
            <span className="code-label">ANTES E DEPOIS</span>
            <pre>{`Antes:    A → αβ₁ | αβ₂
                  ↓
Depois:   A  → α A'
          A' → β₁ | β₂

Exemplo:
Antes:    S → if E then S else S | if E then S
Depois:   S  → if E then S S'
          S' → else S | ε`}</pre>
          </div>

          <div className="tip-box info">
            <span className="tip-icon">💡</span>
            <div>
              <strong>Quando usar cada transformação:</strong>
              <br />• <strong>Remoção de recursão à esquerda:</strong> quando A → Aα (loop direto)
              <br />• <strong>Fatoração à esquerda:</strong> quando duas alternativas começam igual
              <br />
              Ambas são <em>necessárias</em> para construir gramáticas LL(1).
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 5: Comparação de árvores ── */}
      <section className="section">
        <h2><span className="section-icon">🌲</span> Comparando Árvores: Antes vs. Depois</h2>

        <div className="theory-card">
          <p>
            A transformação muda a <em>estrutura</em> da árvore, mas a linguagem gerada é a mesma.
            Veja a diferença para a expressão <code>a × (a + a / a) − a</code>:
          </p>
          <DualTreeComparison />
        </div>
      </section>

      {/* ── Exercício Interativo ── */}
      <section className="section">
        <h2><span className="section-icon">🎯</span> Exercício: Remova a Recursão</h2>
        <LeftRecursionExercise />
      </section>

      {/* ── Quiz ── */}
      <section className="section">
        <h2><span className="section-icon">🧠</span> Verificação de Aprendizado</h2>

        <Quiz
          question="Qual é o resultado da remoção de recursão à esquerda de E → E + T | T?"
          options={[
            'E → T + E | T',
            'E → T E\' , E\' → + T E\' | ε',
            'E → + T E | T',
            'E → T , E\' → E + T | ε',
          ]}
          correctIndex={1}
          explanation="Identificamos: α = '+T' (cauda recursiva) e β = 'T' (alternativa não-recursiva). Aplicando a fórmula: E → TE', E' → +TE' | ε."
        />

        <div style={{ marginTop: 24 }}>
          <Quiz
            question="Por que a recursão à esquerda é problemática para parsers top-down?"
            options={[
              'Porque gera gramáticas ambíguas',
              'Porque causa loop infinito — o parser tenta expandir A → Aα indefinidamente sem consumir entrada',
              'Porque aumenta o número de produções',
              'Porque impede o uso de terminais',
            ]}
            correctIndex={1}
            explanation="Um parser top-down (como descida recursiva ou LL) expande produções da esquerda para a direita. Se A → Aα, ele precisa expandir A de novo... e de novo... sem nunca consumir um token, criando um loop infinito."
          />
        </div>

        <div style={{ marginTop: 24 }}>
          <Quiz
            question="Quando devemos aplicar fatoração à esquerda?"
            options={[
              'Quando A → Aα (recursão à esquerda)',
              'Quando duas produções de A compartilham um prefixo comum (ex: A → αβ₁ | αβ₂)',
              'Quando a gramática tem ε-produções',
              'Sempre que há mais de 2 alternativas para um não-terminal',
            ]}
            correctIndex={1}
            explanation="A fatoração à esquerda resolve a situação em que o parser não consegue decidir entre duas alternativas porque ambas começam com os mesmos símbolos. Fatoramos o prefixo comum para adiar a decisão."
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

/* ── Left Recursion Removal Walkthrough ── */
function LeftRecursionWalkthrough() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Gramática Original',
      content: `E → E + T | E − T | T\nT → T × F | T / F | F\nF → ( E ) | a`,
      explanation: 'Identificamos recursão à esquerda em E (E → E+T, E → E−T) e em T (T → T×F, T → T/F). F não tem recursão.',
    },
    {
      title: 'Passo 1: Transformar E',
      content: `E  → T E'\nE' → + T E' | − T E' | ε\n\nT → T × F | T / F | F\nF → ( E ) | a`,
      explanation: 'Para E: β = T (não-recursiva), α₁ = +T, α₂ = −T (caudas recursivas). Aplicamos: E → TE\', E\' → +TE\' | −TE\' | ε.',
    },
    {
      title: 'Passo 2: Transformar T',
      content: `E  → T E'\nE' → + T E' | − T E' | ε\n\nT  → F T'\nT' → × F T' | / F T' | ε\n\nF → ( E ) | a`,
      explanation: 'Para T: β = F (não-recursiva), α₁ = ×F, α₂ = /F (caudas recursivas). Aplicamos: T → FT\', T\' → ×FT\' | /FT\' | ε.',
    },
    {
      title: 'Resultado Final',
      content: `E  → T E'\nE' → + T E' | − T E' | ε\nT  → F T'\nT' → × F T' | / F T' | ε\nF  → ( E ) | a`,
      explanation: 'Gramática sem recursão à esquerda! Pronta para ser usada em parsers LL(1). A linguagem gerada é a mesma da gramática original.',
    },
  ];

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {steps.map((s, i) => (
          <button
            key={i}
            className={`btn ${i === step ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setStep(i)}
          >
            {i === 0 ? 'Original' : `Passo ${i}`}
          </button>
        ))}
      </div>

      <div key={step} style={{ animation: 'fadeSlideIn 0.3s ease' }}>
        <h4 style={{ color: 'var(--accent-cyan)', marginBottom: 12 }}>{steps[step].title}</h4>
        <div className="code-block">
          <pre>{steps[step].content}</pre>
        </div>
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          padding: '12px 16px',
          background: 'rgba(59,130,246,0.06)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(59,130,246,0.15)',
        }}>
          {steps[step].explanation}
        </p>
      </div>
    </div>
  );
}

/* ── Dual Tree Comparison ── */
function DualTreeComparison() {
  const [showVersion, setShowVersion] = useState(0);

  // a × (a + a / a) − a using LEFT-RECURSIVE grammar
  const treeOriginal = {
    label: 'E',
    children: [
      {
        label: 'E',
        children: [
          {
            label: 'T',
            children: [
              {
                label: 'T',
                children: [{ label: 'F', children: [{ label: 'a' }] }],
              },
              { label: '×' },
              {
                label: 'F',
                children: [
                  { label: '(' },
                  {
                    label: 'E',
                    children: [
                      {
                        label: 'E',
                        children: [
                          { label: 'T', children: [{ label: 'F', children: [{ label: 'a' }] }] },
                        ],
                      },
                      { label: '+' },
                      {
                        label: 'T',
                        children: [
                          {
                            label: 'T',
                            children: [{ label: 'F', children: [{ label: 'a' }] }],
                          },
                          { label: '/' },
                          { label: 'F', children: [{ label: 'a' }] },
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
      { label: '−' },
      {
        label: 'T',
        children: [{ label: 'F', children: [{ label: 'a' }] }],
      },
    ],
  };

  // Same expression using the TRANSFORMED grammar (no left recursion)
  const treeTransformed = {
    label: 'E',
    children: [
      {
        label: 'T',
        children: [
          {
            label: 'F',
            children: [{ label: 'a' }],
          },
          {
            label: "T'",
            children: [
              { label: '×' },
              {
                label: 'F',
                children: [
                  { label: '(' },
                  {
                    label: 'E',
                    children: [
                      {
                        label: 'T',
                        children: [
                          { label: 'F', children: [{ label: 'a' }] },
                          { label: "T'", children: [{ label: 'ε' }] },
                        ],
                      },
                      {
                        label: "E'",
                        children: [
                          { label: '+' },
                          {
                            label: 'T',
                            children: [
                              { label: 'F', children: [{ label: 'a' }] },
                              {
                                label: "T'",
                                children: [
                                  { label: '/' },
                                  { label: 'F', children: [{ label: 'a' }] },
                                  { label: "T'", children: [{ label: 'ε' }] },
                                ],
                              },
                            ],
                          },
                          { label: "E'", children: [{ label: 'ε' }] },
                        ],
                      },
                    ],
                  },
                  { label: ')' },
                ],
              },
              { label: "T'", children: [{ label: 'ε' }] },
            ],
          },
        ],
      },
      {
        label: "E'",
        children: [
          { label: '−' },
          {
            label: 'T',
            children: [
              { label: 'F', children: [{ label: 'a' }] },
              { label: "T'", children: [{ label: 'ε' }] },
            ],
          },
          { label: "E'", children: [{ label: 'ε' }] },
        ],
      },
    ],
  };

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          className={`btn ${showVersion === 0 ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setShowVersion(0)}
        >
          Gramática Original (com recursão)
        </button>
        <button
          className={`btn ${showVersion === 1 ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setShowVersion(1)}
        >
          Gramática Transformada (sem recursão)
        </button>
      </div>

      <div key={showVersion} style={{ animation: 'fadeSlideIn 0.3s ease' }}>
        <TreeVisualization tree={showVersion === 0 ? treeOriginal : treeTransformed} />
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
          {showVersion === 0
            ? 'Árvore usando E → E+T | E−T | T, T → T×F | T/F | F, F → (E) | a'
            : 'Árvore usando E → TE\', E\' → +TE\' | −TE\' | ε, T → FT\', T\' → ×FT\' | /FT\' | ε, F → (E) | a'}
        </p>
      </div>
    </div>
  );
}

/* ── Left Recursion Removal Exercise ── */
function LeftRecursionExercise() {
  const [answers, setAnswers] = useState({
    eBase: '',
    ePrime: '',
    tBase: '',
    tPrime: '',
  });
  const [checked, setChecked] = useState(false);

  const solutions = {
    eBase: 'TE\'',
    ePrime: '+TE\'|-TE\'|ε',
    tBase: 'FT\'',
    tPrime: '×FT\'|/FT\'|ε',
  };

  const normalize = (s) => s.replace(/\s/g, '').toLowerCase();

  const checkAnswers = () => setChecked(true);

  const isCorrect = (key) => {
    const norm = normalize(answers[key]);
    const sol = normalize(solutions[key]);
    // Accept various formats
    const solAlts = sol.split('|').sort().join('|');
    const ansAlts = norm.split('|').sort().join('|');
    return ansAlts === solAlts;
  };

  const handleReset = () => {
    setAnswers({ eBase: '', ePrime: '', tBase: '', tPrime: '' });
    setChecked(false);
  };

  return (
    <div className="exercise-container">
      <div className="exercise-header">
        <div className="exercise-icon">✏️</div>
        <h3>Remova a Recursão à Esquerda</h3>
      </div>
      <p className="exercise-description">
        Aplique o algoritmo de remoção de recursão à esquerda na gramática abaixo.
        Preencha os campos com as novas produções.
      </p>

      <div className="code-block" style={{ marginBottom: 20 }}>
        <span className="code-label">GRAMÁTICA ORIGINAL</span>
        <pre>{`E → E + T | E − T | T
T → T × F | T / F | F
F → ( E ) | a`}</pre>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {/* E */}
        <div style={{
          padding: 16,
          background: 'var(--bg-input)',
          borderRadius: 'var(--radius-md)',
          border: checked ? `1px solid ${isCorrect('eBase') ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)'}` : '1px solid var(--border-subtle)',
        }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            E →
          </label>
          <input
            className="input"
            value={answers.eBase}
            onChange={(e) => setAnswers(p => ({ ...p, eBase: e.target.value }))}
            placeholder="ex: TE'"
            disabled={checked}
            style={{ marginTop: 6 }}
          />
          {checked && (
            <span style={{ fontSize: '0.8rem', color: isCorrect('eBase') ? 'var(--accent-green)' : 'var(--accent-rose)', marginTop: 4, display: 'block' }}>
              {isCorrect('eBase') ? '✅ Correto!' : `❌ Esperado: ${solutions.eBase}`}
            </span>
          )}
        </div>

        <div style={{
          padding: 16,
          background: 'var(--bg-input)',
          borderRadius: 'var(--radius-md)',
          border: checked ? `1px solid ${isCorrect('ePrime') ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)'}` : '1px solid var(--border-subtle)',
        }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            E' →
          </label>
          <input
            className="input"
            value={answers.ePrime}
            onChange={(e) => setAnswers(p => ({ ...p, ePrime: e.target.value }))}
            placeholder="ex: +TE'|−TE'|ε"
            disabled={checked}
            style={{ marginTop: 6 }}
          />
          {checked && (
            <span style={{ fontSize: '0.8rem', color: isCorrect('ePrime') ? 'var(--accent-green)' : 'var(--accent-rose)', marginTop: 4, display: 'block' }}>
              {isCorrect('ePrime') ? '✅ Correto!' : `❌ Esperado: ${solutions.ePrime}`}
            </span>
          )}
        </div>

        {/* T */}
        <div style={{
          padding: 16,
          background: 'var(--bg-input)',
          borderRadius: 'var(--radius-md)',
          border: checked ? `1px solid ${isCorrect('tBase') ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)'}` : '1px solid var(--border-subtle)',
        }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            T →
          </label>
          <input
            className="input"
            value={answers.tBase}
            onChange={(e) => setAnswers(p => ({ ...p, tBase: e.target.value }))}
            placeholder="ex: FT'"
            disabled={checked}
            style={{ marginTop: 6 }}
          />
          {checked && (
            <span style={{ fontSize: '0.8rem', color: isCorrect('tBase') ? 'var(--accent-green)' : 'var(--accent-rose)', marginTop: 4, display: 'block' }}>
              {isCorrect('tBase') ? '✅ Correto!' : `❌ Esperado: ${solutions.tBase}`}
            </span>
          )}
        </div>

        <div style={{
          padding: 16,
          background: 'var(--bg-input)',
          borderRadius: 'var(--radius-md)',
          border: checked ? `1px solid ${isCorrect('tPrime') ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)'}` : '1px solid var(--border-subtle)',
        }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            T' →
          </label>
          <input
            className="input"
            value={answers.tPrime}
            onChange={(e) => setAnswers(p => ({ ...p, tPrime: e.target.value }))}
            placeholder="ex: ×FT'|/FT'|ε"
            disabled={checked}
            style={{ marginTop: 6 }}
          />
          {checked && (
            <span style={{ fontSize: '0.8rem', color: isCorrect('tPrime') ? 'var(--accent-green)' : 'var(--accent-rose)', marginTop: 4, display: 'block' }}>
              {isCorrect('tPrime') ? '✅ Correto!' : `❌ Esperado: ${solutions.tPrime}`}
            </span>
          )}
        </div>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 12 }}>
        F não tem recursão à esquerda, então permanece: <code>F → ( E ) | a</code>
      </p>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        {!checked ? (
          <button className="btn btn-primary btn-sm" onClick={checkAnswers}>
            Verificar respostas
          </button>
        ) : (
          <button className="btn btn-secondary btn-sm" onClick={handleReset}>
            🔄 Tentar novamente
          </button>
        )}
      </div>
    </div>
  );
}
