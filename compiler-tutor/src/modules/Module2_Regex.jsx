import React, { useState, useCallback } from 'react';
import Quiz from '../components/Quiz';

export default function Module2({ onNext, onPrev, moduleNumber, totalModules }) {
  return (
    <div className="content-wrapper fade-in">
      <div className="module-header">
        <span className="module-header-badge">🔤 Módulo 2</span>
        <h1>Expressões Regulares</h1>
        <p>
          Expressões regulares são uma notação compacta para descrever padrões de cadeias.
          Elas são a base para definir os tokens de uma linguagem de programação.
        </p>
      </div>

      {/* ── Seção 1: Motivação ── */}
      <section className="section">
        <h2><span className="section-icon">🤔</span> Por que Expressões Regulares?</h2>
        <div className="theory-card">
          <p>
            Imagine que você precisa descrever <span className="highlight">todos os identificadores
            válidos</span> de uma linguagem de programação. Você poderia listar cada um:
          </p>
          <div className="code-block">
            <pre>{`L = { a, b, ..., z, aa, ab, ..., az, ba, bb, ..., zz, aaa, ... }

Impossível! O conjunto é infinito.`}</pre>
          </div>
          <p>
            Mas com uma expressão regular, basta escrever:
          </p>
          <div className="code-block">
            <span className="code-label">REGEX</span>
            <pre>{`letra (letra | dígito)*`}</pre>
          </div>
          <p style={{ marginBottom: 0 }}>
            Isso significa: <em>"uma letra seguida de zero ou mais letras ou dígitos"</em>.
            Simples, conciso e preciso!
          </p>
        </div>
      </section>

      {/* ── Seção 2: Operadores Fundamentais ── */}
      <section className="section">
        <h2><span className="section-icon">🧩</span> Os 3 Operadores Fundamentais</h2>

        <div className="theory-card">
          <p>
            Toda expressão regular é construída com apenas <span className="keyword">3 operações básicas</span>.
            Tudo o mais é açúcar sintático.
          </p>

          <table className="data-table">
            <thead>
              <tr><th>Operação</th><th>Notação</th><th>Significado</th><th>Exemplo</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Concatenação</strong></td>
                <td className="mono">r₁ r₂</td>
                <td>r₁ seguido de r₂</td>
                <td className="mono">ab → {'{'}"ab"{'}'}</td>
              </tr>
              <tr>
                <td><strong>Alternância (União)</strong></td>
                <td className="mono">r₁ | r₂</td>
                <td>r₁ ou r₂</td>
                <td className="mono">a|b → {'{'}"a", "b"{'}'}</td>
              </tr>
              <tr>
                <td><strong>Fecho de Kleene</strong></td>
                <td className="mono">r*</td>
                <td>Zero ou mais repetições de r</td>
                <td className="mono">a* → {'{'} ε, "a", "aa", "aaa", ...{'}'}</td>
              </tr>
            </tbody>
          </table>

          <div className="tip-box info">
            <span className="tip-icon">📌</span>
            <div>
              <strong>Precedência dos operadores</strong> (da maior para a menor):<br/>
              1. <code>*</code> (fecho de Kleene) — liga-se ao símbolo mais próximo<br/>
              2. Concatenação — implícita, sem operador<br/>
              3. <code>|</code> (alternância) — a menor precedência<br/><br/>
              Exemplo: <code>ab*|c</code> = <code>(a(b*))|c</code>, e <strong>não</strong> <code>(ab)*|c</code>
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 3: Operadores Extras ── */}
      <section className="section">
        <h2><span className="section-icon">🔧</span> Operadores Auxiliares (Açúcar Sintático)</h2>

        <div className="theory-card">
          <p>Estes operadores são <em>atalhos</em> — podem ser reescritos com os 3 fundamentais:</p>

          <table className="data-table">
            <thead>
              <tr><th>Operador</th><th>Notação</th><th>Equivalente</th><th>Significado</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Fecho Positivo</td>
                <td className="mono">r⁺</td>
                <td className="mono">r r*</td>
                <td>Uma ou mais repetições</td>
              </tr>
              <tr>
                <td>Opcional</td>
                <td className="mono">r?</td>
                <td className="mono">r | ε</td>
                <td>Zero ou uma ocorrência</td>
              </tr>
              <tr>
                <td>Classe de caracteres</td>
                <td className="mono">[a-z]</td>
                <td className="mono">a|b|c|...|z</td>
                <td>Qualquer símbolo do intervalo</td>
              </tr>
              <tr>
                <td>Qualquer caractere</td>
                <td className="mono">.</td>
                <td className="mono">[qualquer símbolo de Σ]</td>
                <td>Casa com um símbolo qualquer</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Seção 4: Exemplos com Tokens ── */}
      <section className="section">
        <h2><span className="section-icon">🏷️</span> Expressões Regulares para Tokens</h2>

        <div className="theory-card">
          <p>
            No contexto de compiladores, usamos expressões regulares para definir
            o <span className="highlight">padrão de cada tipo de token</span>.
            Veja como os tokens da linguagem LCC-2026-1 são descritos:
          </p>

          <table className="data-table">
            <thead>
              <tr><th>Token</th><th>Expressão Regular</th><th>Exemplos</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="token-chip keyword">KEYWORD</span></td>
                <td className="mono">def | int | float | string | if | else | for | return | print | read | new | null | break</td>
                <td className="mono">def, return, if</td>
              </tr>
              <tr>
                <td><span className="token-chip ident">IDENT</span></td>
                <td className="mono">letra (letra | dígito | _)*</td>
                <td className="mono">x, soma, func1</td>
              </tr>
              <tr>
                <td><span className="token-chip number">INT_CONST</span></td>
                <td className="mono">dígito⁺</td>
                <td className="mono">0, 42, 1024</td>
              </tr>
              <tr>
                <td><span className="token-chip number">FLOAT_CONST</span></td>
                <td className="mono">dígito⁺ . dígito⁺</td>
                <td className="mono">3.14, 0.5</td>
              </tr>
              <tr>
                <td><span className="token-chip string">STRING_CONST</span></td>
                <td className="mono">" [^"]* "</td>
                <td className="mono">"hello", ""</td>
              </tr>
              <tr>
                <td><span className="token-chip operator">OPERATOR</span></td>
                <td className="mono">+ | - | * | / | % | {'<'} | {'>'} | {'<'}= | {'>'}= | == | !=</td>
                <td className="mono">+, {'<'}=, !=</td>
              </tr>
              <tr>
                <td><span className="token-chip delimiter">DELIMITER</span></td>
                <td className="mono">( | ) | {'{'} | {'}'} | [ | ] | ; | ,</td>
                <td className="mono">(, ;, {'}'}</td>
              </tr>
              <tr>
                <td><span className="token-chip operator">ASSIGN</span></td>
                <td className="mono">=</td>
                <td className="mono">=</td>
              </tr>
            </tbody>
          </table>

          <div className="tip-box warning">
            <span className="tip-icon">⚠️</span>
            <div>
              <strong>Palavras-chave vs. Identificadores:</strong> "def" casa com o padrão
              de identificador <em>e</em> com a palavra-chave. A regra é: <strong>palavras-chave
              têm prioridade</strong>. O analisador léxico verifica primeiro se é palavra-chave.
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 5: Como ler uma ER ── */}
      <section className="section">
        <h2><span className="section-icon">📖</span> Como Ler uma Expressão Regular</h2>

        <div className="theory-card">
          <p>Vamos decompor a expressão regular para identificadores passo a passo:</p>
          <div className="code-block">
            <span className="code-label">REGEX</span>
            <pre>{`letra (letra | dígito)*`}</pre>
          </div>

          <RegexBreakdown />
        </div>
      </section>

      {/* ── Exercício Interativo ── */}
      <section className="section">
        <h2><span className="section-icon">🎯</span> Exercício Interativo</h2>
        <RegexTester />
      </section>

      {/* ── Quiz ── */}
      <section className="section">
        <h2><span className="section-icon">🧠</span> Verificação de Aprendizado</h2>

        <Quiz
          question="Qual linguagem a expressão regular (a|b)*abb descreve?"
          options={[
            'Todas as cadeias sobre {a,b} que terminam com "abb"',
            'Apenas a cadeia "abb"',
            'Cadeias que contêm "abb" em qualquer posição',
            'Cadeias com exatamente 3 caracteres',
          ]}
          correctIndex={0}
          explanation={`(a|b)* gera qualquer combinação de a's e b's (inclusive ε), e depois "abb" é concatenado ao final. Portanto, todas as cadeias que terminam com "abb".`}
        />

        <div style={{ marginTop: 24 }}>
          <Quiz
            question="Como se escreve 'um ou mais dígitos seguidos opcionalmente de um ponto e mais dígitos' em expressão regular?"
            options={[
              'dígito* . dígito*',
              'dígito⁺ (. dígito⁺)?',
              'dígito (. dígito)?',
              'dígito⁺ . dígito',
            ]}
            correctIndex={1}
            explanation="dígito⁺ garante ao menos um dígito. (. dígito⁺)? torna a parte decimal opcional. Isso descreve inteiros (42) e floats (3.14)."
          />
        </div>

        <div style={{ marginTop: 24 }}>
          <Quiz
            question='Qual é a precedência correta dos operadores em "ab*|c"?'
            options={[
              '(a(b*))|c — o * se aplica ao b, depois concatena com a, depois alterna com c',
              '((ab)*)|c — o * se aplica a ab',
              'a((b|c)*) — b e c são alternados, depois o *',
              '(a(b|c))* — tudo é repetido',
            ]}
            correctIndex={0}
            explanation="Precedência: * > concatenação > |. Portanto, * se aplica apenas ao b, resultando em (a(b*))|c."
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

/* ── Componente: Decomposição de Regex ── */
function RegexBreakdown() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      highlight: 'letra',
      desc: 'Começa com exatamente uma letra (a-z, A-Z). Este é o primeiro símbolo obrigatório.',
      color: 'var(--accent-blue)',
    },
    {
      highlight: '(letra | dígito)',
      desc: 'Depois, cada caractere seguinte pode ser uma letra OU um dígito.',
      color: 'var(--accent-purple)',
    },
    {
      highlight: '(letra | dígito)*',
      desc: 'O asterisco (*) indica que o grupo anterior pode se repetir ZERO ou mais vezes. Ou seja, após a primeira letra, pode não haver mais nada, ou pode haver muitos caracteres.',
      color: 'var(--accent-green)',
    },
  ];

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 16,
        flexWrap: 'wrap',
      }}>
        {steps.map((s, i) => (
          <button
            key={i}
            className={`btn ${i === step ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setStep(i)}
          >
            Passo {i + 1}
          </button>
        ))}
      </div>

      <div style={{
        padding: 16,
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-input)',
        border: `2px solid ${steps[step].color}`,
        animation: 'fadeSlideIn 0.3s ease',
      }}
        key={step}
      >
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.1rem',
          marginBottom: 12,
          color: steps[step].color,
          fontWeight: 600,
        }}>
          {steps[step].highlight}
        </div>
        <p style={{ marginBottom: 0, color: 'var(--text-secondary)' }}>
          {steps[step].desc}
        </p>
      </div>

      <div className="example-box" style={{ marginTop: 16 }}>
        <div className="example-label">Cadeias que casam com letra (letra | dígito)*</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['x', 'soma', 'func1', 'a2b3', 'Total', 'i'].map(s => (
            <span key={s} className="token-chip ident">{s}</span>
          ))}
        </div>
        <div style={{ marginTop: 10, fontSize: '0.85rem', color: 'var(--accent-rose)' }}>
          <strong>Não casam:</strong> 1abc (começa com dígito), _var (começa com _), abc-def (contém -)
        </div>
      </div>
    </div>
  );
}

/* ── Exercício: Testador de Regex ── */
function RegexTester() {
  const [selectedRegex, setSelectedRegex] = useState(0);
  const [testInput, setTestInput] = useState('');

  const regexes = [
    {
      name: 'Identificador',
      pattern: /^[a-zA-Z][a-zA-Z0-9]*$/,
      description: 'letra (letra | dígito)*',
      examples: ['x', 'soma', 'func1'],
    },
    {
      name: 'Inteiro',
      pattern: /^[0-9]+$/,
      description: 'dígito⁺',
      examples: ['42', '0', '1024'],
    },
    {
      name: 'Float',
      pattern: /^[0-9]+\.[0-9]+$/,
      description: 'dígito⁺ . dígito⁺',
      examples: ['3.14', '0.5', '100.0'],
    },
    {
      name: 'Cadeia terminando em "abb"',
      pattern: /^[ab]*abb$/,
      description: '(a|b)* a b b',
      examples: ['abb', 'aabb', 'bababb'],
    },
  ];

  const current = regexes[selectedRegex];
  const matches = testInput.length > 0 ? current.pattern.test(testInput) : null;

  return (
    <div className="exercise-container">
      <div className="exercise-header">
        <div className="exercise-icon">🔬</div>
        <h3>Testador de Expressões Regulares</h3>
      </div>
      <p className="exercise-description">
        Selecione uma expressão regular e teste diferentes cadeias para ver se casam com o padrão.
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {regexes.map((r, i) => (
          <button
            key={i}
            className={`btn ${i === selectedRegex ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => { setSelectedRegex(i); setTestInput(''); }}
          >
            {r.name}
          </button>
        ))}
      </div>

      <div style={{
        padding: 14,
        background: 'var(--bg-input)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 16,
        fontFamily: 'var(--font-mono)',
        fontSize: '1rem',
        color: 'var(--accent-cyan)',
        textAlign: 'center',
      }}>
        {current.description}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <input
          className="input"
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
          placeholder="Digite uma cadeia para testar..."
          style={{ flex: 1 }}
        />
        {matches !== null && (
          <div style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.85rem',
            background: matches ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.1)',
            color: matches ? 'var(--accent-green)' : 'var(--accent-rose)',
            border: `1px solid ${matches ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.25)'}`,
            whiteSpace: 'nowrap',
            animation: 'fadeSlideIn 0.2s ease',
          }}>
            {matches ? '✅ Casa!' : '❌ Não casa'}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: 4 }}>
          Exemplos válidos:
        </span>
        {current.examples.map(ex => (
          <button
            key={ex}
            className="token-chip ident"
            onClick={() => setTestInput(ex)}
            style={{ cursor: 'pointer', border: '1px solid var(--border-subtle)' }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
