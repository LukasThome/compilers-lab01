import React, { useState, useMemo } from 'react';
import Quiz from '../components/Quiz';
import TreeVisualization from '../components/visualization/TreeVisualization';

/* ═══════════════════════════════════════════════════
   MODULE 5 — Gramáticas Livres de Contexto (GLC)
   Covers: P3 Q1 (parse trees) + Q3 (ambiguity)
   ═══════════════════════════════════════════════════ */

export default function Module5({ onNext, onPrev, moduleNumber, totalModules }) {
  return (
    <div className="content-wrapper fade-in">
      <div className="module-header">
        <span className="module-header-badge">🌳 Módulo 5</span>
        <h1>Gramáticas Livres de Contexto (GLC)</h1>
        <p>
          Gramáticas livres de contexto são o formalismo usado para descrever
          a estrutura sintática de linguagens de programação. Elas definem como
          os tokens se combinam em construções válidas.
        </p>
      </div>

      {/* ── Seção 1: Definição ── */}
      <section className="section">
        <h2><span className="section-icon">📐</span> O que é uma GLC?</h2>

        <div className="theory-card">
          <div className="definition-box">
            <div className="def-term">Gramática Livre de Contexto (GLC / CFG)</div>
            <div className="def-desc">
              Uma <span className="highlight">4-tupla</span> G = (V, Σ, P, S) onde:
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr><th>Componente</th><th>Símbolo</th><th>Significado</th></tr>
            </thead>
            <tbody>
              <tr><td>Variáveis</td><td className="mono">V</td><td>Conjunto finito de símbolos não-terminais (ex: E, T, F)</td></tr>
              <tr><td>Terminais</td><td className="mono">Σ</td><td>Conjunto finito de símbolos terminais (ex: +, ×, a, (, ))</td></tr>
              <tr><td>Produções</td><td className="mono">P</td><td>Regras de substituição: A → α (A ∈ V, α ∈ (V ∪ Σ)*)</td></tr>
              <tr><td>Símbolo inicial</td><td className="mono">S ∈ V</td><td>O não-terminal onde a derivação começa</td></tr>
            </tbody>
          </table>

          <div className="example-box">
            <div className="example-label">Exemplo clássico: Expressões Aritméticas</div>
            <div className="code-block">
              <span className="code-label">GRAMÁTICA</span>
              <pre>{`E → E + T | E − T | T
T → T × F | T / F | F
F → ( E ) | a`}</pre>
            </div>
            <p style={{ marginBottom: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Aqui, <code>V = {'{'} E, T, F {'}'}</code>, <code>Σ = {'{'} +, −, ×, /, (, ), a {'}'}</code>,
              e <code>E</code> é o símbolo inicial. Cada linha é um conjunto de produções.
            </p>
          </div>

          <div className="tip-box info">
            <span className="tip-icon">💡</span>
            <div>
              <strong>Por que "livre de contexto"?</strong> Porque o lado esquerdo de cada produção
              é <em>um único não-terminal</em>, sem contexto ao redor. Isso significa que a substituição
              pode ser feita independentemente de onde o não-terminal aparece na derivação.
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 2: Hierarquia de Chomsky ── */}
      <section className="section">
        <h2><span className="section-icon">🏛️</span> Hierarquia de Chomsky</h2>

        <div className="theory-card">
          <p>As GLCs ocupam um lugar específico na hierarquia de Chomsky:</p>

          <table className="data-table">
            <thead>
              <tr><th>Tipo</th><th>Nome</th><th>Reconhecedor</th><th>Exemplo</th></tr>
            </thead>
            <tbody>
              <tr><td>3</td><td>Regular</td><td>Autômato Finito (DFA/NFA)</td><td>Tokens, padrões léxicos</td></tr>
              <tr style={{ background: 'rgba(59,130,246,0.08)' }}>
                <td><strong>2</strong></td><td><strong>Livre de Contexto</strong></td>
                <td><strong>Autômato de Pilha (PDA)</strong></td><td><strong>Sintaxe de linguagens</strong></td>
              </tr>
              <tr><td>1</td><td>Sensível ao Contexto</td><td>Máquina de Turing limitada</td><td>Declaração antes do uso</td></tr>
              <tr><td>0</td><td>Irrestrita</td><td>Máquina de Turing</td><td>Qualquer linguagem computável</td></tr>
            </tbody>
          </table>

          <div className="tip-box warning">
            <span className="tip-icon">⚠️</span>
            <div>
              <strong>Compiladores usam GLCs (Tipo 2)</strong> para a análise sintática.
              As gramáticas regulares (Tipo 3), que vimos nos módulos anteriores,
              são insuficientes — não conseguem expressar aninhamento arbitrário como
              parênteses balanceados.
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 3: Derivações ── */}
      <section className="section">
        <h2><span className="section-icon">🔄</span> Derivações</h2>

        <div className="theory-card">
          <div className="definition-box">
            <div className="def-term">Derivação</div>
            <div className="def-desc">
              O processo de substituir não-terminais por suas produções, partindo
              do símbolo inicial até obter uma cadeia de <span className="highlight">apenas terminais</span>.
            </div>
          </div>

          <h3>Derivação mais à esquerda (leftmost)</h3>
          <p>
            A cada passo, sempre substituímos o <span className="highlight">não-terminal mais à esquerda</span>.
          </p>
          <div className="code-block">
            <span className="code-label">DERIVAÇÃO</span>
            <pre>{`Gramática:  E → E + T | T     T → T × F | F     F → ( E ) | a

Derivando "a + a × a":

E  ⇒  E + T              (E → E + T)
   ⇒  T + T              (E → T)
   ⇒  F + T              (T → F)
   ⇒  a + T              (F → a)
   ⇒  a + T × F          (T → T × F)
   ⇒  a + F × F          (T → F)
   ⇒  a + a × F          (F → a)
   ⇒  a + a × a          (F → a)  ✓`}</pre>
          </div>

          <div className="tip-box info">
            <span className="tip-icon">📌</span>
            <div>
              <strong>Derivação mais à direita (rightmost)</strong> funciona da mesma forma,
              mas sempre substitui o não-terminal mais à <em>direita</em>.
              A árvore de derivação é a mesma — apenas a <em>ordem</em> dos passos muda.
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 4: Árvore de Derivação ── */}
      <section className="section">
        <h2><span className="section-icon">🌲</span> Árvores de Derivação (Parse Trees)</h2>

        <div className="theory-card">
          <div className="definition-box">
            <div className="def-term">Árvore de Derivação</div>
            <div className="def-desc">
              Representação gráfica de uma derivação, onde:
              <br />• A <span className="highlight">raiz</span> é o símbolo inicial
              <br />• Cada <span className="highlight">nó interno</span> é um não-terminal
              <br />• Cada <span className="highlight">folha</span> é um terminal (ou ε)
              <br />• Os filhos de cada nó correspondem ao lado direito de uma produção
            </div>
          </div>

          <h3>Exemplo: Árvore para "a + a × a"</h3>
          <ParseTreeExample />
        </div>
      </section>

      {/* ── Seção 5: Ambiguidade ── */}
      <section className="section">
        <h2><span className="section-icon">⚡</span> Ambiguidade</h2>

        <div className="theory-card">
          <div className="definition-box">
            <div className="def-term">Gramática Ambígua</div>
            <div className="def-desc">
              Uma gramática é <span className="highlight">ambígua</span> se existe
              pelo menos uma cadeia que possui <strong>duas ou mais árvores de
              derivação distintas</strong>.
            </div>
          </div>

          <AmbiguityDemo />

          <div className="tip-box warning">
            <span className="tip-icon">⚠️</span>
            <div>
              <strong>Problema na prática:</strong> Ambiguidade é indesejável em linguagens
              de programação, pois uma expressão poderia ter dois significados diferentes.
              Para resolver, usamos regras de precedência e associatividade, ou
              transformamos a gramática para eliminar a ambiguidade.
            </div>
          </div>
        </div>
      </section>

      {/* ── Exercício Interativo: Parse Tree Builder ── */}
      <section className="section">
        <h2><span className="section-icon">🎯</span> Exercício Interativo: Construindo Árvores</h2>
        <ParseTreeBuilder />
      </section>

      {/* ── Quiz ── */}
      <section className="section">
        <h2><span className="section-icon">🧠</span> Verificação de Aprendizado</h2>

        <Quiz
          question="Na gramática E → E + T | T, T → T × F | F, F → a, qual é o símbolo inicial?"
          options={[
            'a (é o terminal base)',
            'F (é o mais simples)',
            'E (é o primeiro a aparecer e gera toda a expressão)',
            'T (fica no meio da hierarquia)',
          ]}
          correctIndex={2}
          explanation="O símbolo inicial é E, pois é a partir dele que toda derivação começa. A hierarquia E → T → F define precedência: × (em T) tem maior precedência que + (em E)."
        />

        <div style={{ marginTop: 24 }}>
          <Quiz
            question="O que significa dizer que uma gramática é ambígua?"
            options={[
              'Possui produções recursivas à esquerda',
              'Não pode ser usada em compiladores',
              'Existe pelo menos uma cadeia com duas árvores de derivação distintas',
              'O símbolo inicial pode derivar a cadeia vazia',
            ]}
            correctIndex={2}
            explanation="Uma gramática é ambígua quando existe ao menos uma cadeia na linguagem que pode ser derivada de duas (ou mais) formas diferentes, gerando árvores de derivação distintas."
          />
        </div>

        <div style={{ marginTop: 24 }}>
          <Quiz
            question="Na gramática E → E + E | E × E | a, a cadeia 'a + a × a' é ambígua. Por quê?"
            options={[
              'Porque a gramática tem recursão à esquerda',
              'Porque \'a + a × a\' pode ser derivada como (a + a) × a OU a + (a × a)',
              'Porque existe ε nas produções',
              'Porque \'a\' aparece três vezes na cadeia',
            ]}
            correctIndex={1}
            explanation="A ambiguidade surge porque a gramática não define precedência entre + e ×, permitindo duas árvores: uma onde + é feito primeiro (E+E)×E, e outra onde × é feito primeiro E+(E×E)."
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

/* ── Parse Tree Example ── */
function ParseTreeExample() {
  const tree = {
    label: 'E',
    children: [
      {
        label: 'E',
        children: [
          { label: 'T', children: [{ label: 'F', children: [{ label: 'a' }] }] }
        ]
      },
      { label: '+' },
      {
        label: 'T',
        children: [
          {
            label: 'T',
            children: [{ label: 'F', children: [{ label: 'a' }] }]
          },
          { label: '×' },
          { label: 'F', children: [{ label: 'a' }] }
        ]
      }
    ]
  };

  return (
    <div style={{ marginTop: 16 }}>
      <TreeVisualization tree={tree} />
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
        Árvore de derivação para "a + a × a" usando E → E + T | T, T → T × F | F, F → a
      </p>
    </div>
  );
}

/* ── Ambiguity Demo ── */
function AmbiguityDemo() {
  const [showTree, setShowTree] = useState(0);

  // Ambiguous grammar: E → E + E | E × E | a
  // String: a + a × a
  const tree1 = {
    label: 'E',
    children: [
      {
        label: 'E',
        children: [
          { label: 'E', children: [{ label: 'a' }] },
          { label: '+' },
          { label: 'E', children: [{ label: 'a' }] },
        ]
      },
      { label: '×' },
      { label: 'E', children: [{ label: 'a' }] },
    ]
  };

  const tree2 = {
    label: 'E',
    children: [
      { label: 'E', children: [{ label: 'a' }] },
      { label: '+' },
      {
        label: 'E',
        children: [
          { label: 'E', children: [{ label: 'a' }] },
          { label: '×' },
          { label: 'E', children: [{ label: 'a' }] },
        ]
      },
    ]
  };

  return (
    <div style={{ marginTop: 16 }}>
      <p>
        Considere a gramática ambígua: <code>E → E + E | E × E | a</code>
        <br />
        A cadeia <code>a + a × a</code> tem <strong>duas</strong> árvores de derivação distintas:
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          className={`btn ${showTree === 0 ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setShowTree(0)}
        >
          Árvore 1: (a + a) × a
        </button>
        <button
          className={`btn ${showTree === 1 ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setShowTree(1)}
        >
          Árvore 2: a + (a × a)
        </button>
      </div>

      <div key={showTree} style={{ animation: 'fadeSlideIn 0.3s ease' }}>
        <TreeVisualization tree={showTree === 0 ? tree1 : tree2} />
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
          {showTree === 0
            ? 'Interpretação: soma é feita antes da multiplicação → (a + a) × a'
            : 'Interpretação: multiplicação é feita antes da soma → a + (a × a)'}
        </p>
      </div>
    </div>
  );
}

/* ── Interactive Parse Tree Builder ── */
function ParseTreeBuilder() {
  const [selectedGrammar, setSelectedGrammar] = useState(0);
  const [derivationSteps, setDerivationSteps] = useState([]);
  const [currentSentential, setCurrentSentential] = useState('');

  const grammars = [
    {
      name: 'Expressões (não-ambígua)',
      rules: {
        'E': [['E', '+', 'T'], ['E', '−', 'T'], ['T']],
        'T': [['T', '×', 'F'], ['T', '/', 'F'], ['F']],
        'F': [['(', 'E', ')'], ['a']],
      },
      start: 'E',
      target: 'a + a × a',
      terminals: new Set(['+', '−', '×', '/', '(', ')', 'a']),
    },
    {
      name: 'Parênteses balanceados',
      rules: {
        'S': [['(', 'S', ')'], ['S', 'S'], ['ε']],
      },
      start: 'S',
      target: '( ( ) )',
      terminals: new Set(['(', ')', 'ε']),
    },
  ];

  const grammar = grammars[selectedGrammar];

  const resetDerivation = () => {
    setDerivationSteps([{ form: grammar.start, rule: 'Início' }]);
    setCurrentSentential(grammar.start);
  };

  useState(() => {
    resetDerivation();
  });

  const nonTerminals = Object.keys(grammar.rules);

  // Find the leftmost non-terminal in the current sentential form
  const findLeftmostNT = (form) => {
    const tokens = form.split(' ').filter(Boolean);
    for (let i = 0; i < tokens.length; i++) {
      if (nonTerminals.includes(tokens[i])) {
        return { index: i, symbol: tokens[i] };
      }
    }
    return null;
  };

  const leftmostNT = findLeftmostNT(currentSentential);
  const availableRules = leftmostNT ? grammar.rules[leftmostNT.symbol] : [];

  const applyRule = (ruleBody) => {
    const tokens = currentSentential.split(' ').filter(Boolean);
    const idx = leftmostNT.index;
    const replacement = ruleBody.filter(s => s !== 'ε');
    const newTokens = [...tokens.slice(0, idx), ...replacement, ...tokens.slice(idx + 1)];
    const newForm = newTokens.join(' ') || 'ε';

    setCurrentSentential(newForm);
    setDerivationSteps(prev => [...prev, {
      form: newForm,
      rule: `${leftmostNT.symbol} → ${ruleBody.join(' ')}`,
    }]);
  };

  const handleReset = () => {
    resetDerivation();
  };

  const handleChangeGrammar = (idx) => {
    setSelectedGrammar(idx);
    const g = grammars[idx];
    setDerivationSteps([{ form: g.start, rule: 'Início' }]);
    setCurrentSentential(g.start);
  };

  const isDone = !leftmostNT;

  return (
    <div className="exercise-container">
      <div className="exercise-header">
        <div className="exercise-icon">🏗️</div>
        <h3>Construtor de Derivações</h3>
      </div>
      <p className="exercise-description">
        Construa uma derivação mais à esquerda passo a passo. A cada passo, escolha
        qual produção aplicar ao não-terminal mais à esquerda (destacado em azul).
      </p>

      {/* Grammar selector */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {grammars.map((g, i) => (
          <button
            key={i}
            className={`btn ${i === selectedGrammar ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => handleChangeGrammar(i)}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Grammar rules */}
      <div className="code-block" style={{ marginBottom: 16 }}>
        <span className="code-label">GRAMÁTICA</span>
        <pre>{Object.entries(grammar.rules).map(([lhs, alts]) =>
          `${lhs} → ${alts.map(a => a.join(' ')).join(' | ')}`
        ).join('\n')}</pre>
      </div>

      {/* Target */}
      <div style={{
        padding: '10px 16px',
        background: 'rgba(16,185,129,0.08)',
        border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 16,
        fontSize: '0.88rem',
      }}>
        <strong style={{ color: 'var(--accent-green)' }}>Alvo:</strong>{' '}
        <code>{grammar.target}</code>
      </div>

      {/* Current sentential form */}
      <div style={{
        padding: '14px 20px',
        background: 'var(--bg-input)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 16,
        fontFamily: 'var(--font-mono)',
        fontSize: '1.1rem',
        textAlign: 'center',
        letterSpacing: '0.05em',
      }}>
        {currentSentential.split(' ').map((token, i) => {
          const isNT = nonTerminals.includes(token);
          const isLeftmost = leftmostNT && i === leftmostNT.index;
          return (
            <span key={i} style={{
              color: isLeftmost ? 'var(--accent-cyan)' : isNT ? 'var(--accent-blue)' : 'var(--text-primary)',
              fontWeight: isLeftmost ? 700 : isNT ? 600 : 400,
              background: isLeftmost ? 'rgba(6,182,212,0.12)' : 'transparent',
              padding: isLeftmost ? '2px 6px' : '0 2px',
              borderRadius: isLeftmost ? '4px' : '0',
              marginRight: 4,
            }}>
              {token}
            </span>
          );
        })}
      </div>

      {/* Available rules */}
      {!isDone && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>
            Escolha uma produção para <strong style={{ color: 'var(--accent-cyan)' }}>{leftmostNT.symbol}</strong>:
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {availableRules.map((body, i) => (
              <button
                key={i}
                className="btn btn-secondary btn-sm"
                onClick={() => applyRule(body)}
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {leftmostNT.symbol} → {body.join(' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Done message */}
      {isDone && (
        <div style={{
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.25)',
          color: 'var(--accent-green)',
          marginBottom: 16,
          animation: 'fadeSlideIn 0.3s ease',
        }}>
          ✅ Derivação completa! A cadeia resultante é: <code>{currentSentential}</code>
        </div>
      )}

      {/* Derivation history */}
      <details open>
        <summary style={{
          cursor: 'pointer',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          fontWeight: 600,
          padding: '8px 0',
        }}>
          Histórico de derivação ({derivationSteps.length} passos)
        </summary>
        <div style={{ marginTop: 8 }}>
          {derivationSteps.map((step, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '6px 0',
              fontSize: '0.85rem',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              <span style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 700,
                background: 'var(--bg-input)',
                color: 'var(--text-muted)',
                flexShrink: 0,
              }}>
                {i}
              </span>
              <code style={{ flex: 1, color: 'var(--text-primary)' }}>{step.form}</code>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {step.rule}
              </span>
            </div>
          ))}
        </div>
      </details>

      {/* Reset button */}
      <div style={{ marginTop: 16 }}>
        <button className="btn btn-secondary btn-sm" onClick={handleReset}>
          🔄 Recomeçar
        </button>
      </div>
    </div>
  );
}
