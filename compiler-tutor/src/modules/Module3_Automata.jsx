import React, { useState, useCallback } from 'react';
import Quiz from '../components/Quiz';

export default function Module3({ onNext, onPrev, moduleNumber, totalModules }) {
  return (
    <div className="content-wrapper fade-in">
      <div className="module-header">
        <span className="module-header-badge">⚙️ Módulo 3</span>
        <h1>Autômatos Finitos</h1>
        <p>
          Autômatos finitos são máquinas abstratas que reconhecem linguagens regulares.
          Eles são o modelo teórico por trás dos analisadores léxicos.
        </p>
      </div>

      {/* ── Seção 1: O que é um Autômato? ── */}
      <section className="section">
        <h2><span className="section-icon">🤖</span> O que é um Autômato Finito?</h2>

        <div className="theory-card">
          <div className="definition-box">
            <div className="def-term">Autômato Finito Determinístico (AFD / DFA)</div>
            <div className="def-desc">
              Uma <span className="highlight">5-tupla</span> M = (Q, Σ, δ, q₀, F) onde:
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr><th>Componente</th><th>Símbolo</th><th>Significado</th></tr>
            </thead>
            <tbody>
              <tr><td>Estados</td><td className="mono">Q</td><td>Conjunto finito de estados</td></tr>
              <tr><td>Alfabeto</td><td className="mono">Σ</td><td>Conjunto finito de símbolos de entrada</td></tr>
              <tr><td>Transição</td><td className="mono">δ: Q × Σ → Q</td><td>Função que, dado um estado e um símbolo, retorna o próximo estado</td></tr>
              <tr><td>Estado Inicial</td><td className="mono">q₀ ∈ Q</td><td>O estado onde a máquina começa</td></tr>
              <tr><td>Estados Finais</td><td className="mono">F ⊆ Q</td><td>Conjunto de estados de aceitação</td></tr>
            </tbody>
          </table>

          <div className="tip-box info">
            <span className="tip-icon">💡</span>
            <div>
              <strong>Analogia:</strong> Imagine um cadeado com combinação. Cada dígito que você gira
              muda o <em>estado</em> do cadeado. Se a sequência correta for inserida, ele chega ao
              estado de <em>aceitação</em> (aberto). Um DFA funciona da mesma forma com cadeias de texto.
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 2: DFA vs NFA ── */}
      <section className="section">
        <h2><span className="section-icon">⚖️</span> DFA vs NFA</h2>

        <div className="theory-card">
          <div className="definition-box">
            <div className="def-term">Autômato Finito Não-Determinístico (AFN / NFA)</div>
            <div className="def-desc">
              Igual ao DFA, mas a função de transição pode ter
              <span className="highlight">múltiplas saídas</span> para o mesmo par (estado, símbolo),
              incluindo transições <code>ε</code> (sem consumir entrada).
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr><th>Característica</th><th>DFA</th><th>NFA</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Transição por símbolo</td>
                <td>Exatamente <strong>uma</strong></td>
                <td>Zero, uma ou <strong>várias</strong></td>
              </tr>
              <tr>
                <td>Transições ε</td>
                <td>Não permitidas</td>
                <td>Permitidas</td>
              </tr>
              <tr>
                <td>Determinismo</td>
                <td>Sempre sabe para onde ir</td>
                <td>Pode "escolher" caminhos</td>
              </tr>
              <tr>
                <td>Implementação</td>
                <td>Tabela simples de transição</td>
                <td>Requer backtracking ou subconjuntos</td>
              </tr>
              <tr>
                <td>Poder expressivo</td>
                <td colSpan={2} style={{ textAlign: 'center', fontWeight: 600, color: 'var(--accent-green)' }}>
                  Equivalentes! Reconhecem as mesmas linguagens.
                </td>
              </tr>
            </tbody>
          </table>

          <div className="tip-box warning">
            <span className="tip-icon">⚠️</span>
            <div>
              <strong>Teorema importante:</strong> Para todo NFA existe um DFA equivalente
              (e vice-versa). A conversão é feita pela <em>construção de subconjuntos</em>,
              mas o DFA resultante pode ter até 2<sup>n</sup> estados (onde n é o número de
              estados do NFA).
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 3: Funcionamento de um DFA ── */}
      <section className="section">
        <h2><span className="section-icon">▶️</span> Como um DFA Processa uma Cadeia</h2>

        <div className="theory-card">
          <p>O algoritmo é simples:</p>
          <div className="code-block">
            <span className="code-label">ALGORITMO</span>
            <pre>{`estado_atual = q₀              // começa no estado inicial

para cada símbolo c na cadeia:
    estado_atual = δ(estado_atual, c)  // segue a transição

se estado_atual ∈ F:            // está em estado final?
    ACEITA                      // a cadeia pertence à linguagem
senão:
    REJEITA                     // a cadeia NÃO pertence`}</pre>
          </div>

          <div className="example-box">
            <div className="example-label">Exemplo: DFA que aceita cadeias terminando em "ab"</div>
            <p style={{ marginBottom: 8 }}>
              <code>Σ = {'{'} a, b {'}'}</code>, <code>Q = {'{'} q₀, q₁, q₂ {'}'}</code>,
              Estado final: <code>F = {'{'} q₂ {'}'}</code>
            </p>
            <div className="code-block">
              <pre>{`Tabela de transição δ:
┌──────┬─────┬─────┐
│      │  a  │  b  │
├──────┼─────┼─────┤
│  q₀  │ q₁  │ q₀  │
│  q₁  │ q₁  │ q₂  │
│ *q₂  │ q₁  │ q₀  │
└──────┴─────┴─────┘
(* = estado final)

Processando "aab":
  q₀ —a→ q₁ —a→ q₁ —b→ q₂  ✅ Aceita!

Processando "aba":
  q₀ —a→ q₁ —b→ q₂ —a→ q₁  ❌ Rejeita (q₁ ∉ F)`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 4: Simulador Interativo ── */}
      <section className="section">
        <h2><span className="section-icon">🎯</span> Simulador Interativo</h2>
        <DFASimulator />
      </section>

      {/* ── Seção 5: Relação com Expressões Regulares ── */}
      <section className="section">
        <h2><span className="section-icon">🔗</span> Autômatos e Expressões Regulares</h2>

        <div className="theory-card">
          <p>
            Existe uma <span className="highlight">correspondência direta</span> entre expressões
            regulares e autômatos finitos:
          </p>

          <div className="code-block">
            <pre>{`Expressão Regular  ──construção de Thompson──▶  NFA
                                                  │
                                        construção de subconjuntos
                                                  │
                                                  ▼
         Expressão Regular  ◀──────────────────  DFA`}</pre>
          </div>

          <table className="data-table">
            <thead>
              <tr><th>Construção de Thompson</th><th>Resultado</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Símbolo literal <code>a</code></td>
                <td className="mono">→ (q₀) —a→ ((q₁))</td>
              </tr>
              <tr>
                <td>Concatenação <code>r₁ r₂</code></td>
                <td>Conecta o estado final de NFA₁ ao estado inicial de NFA₂ via ε</td>
              </tr>
              <tr>
                <td>Alternância <code>r₁ | r₂</code></td>
                <td>Novo estado inicial com ε-transições para NFA₁ e NFA₂</td>
              </tr>
              <tr>
                <td>Fecho de Kleene <code>r*</code></td>
                <td>Loop ε do final ao início + bypass ε do início ao novo final</td>
              </tr>
            </tbody>
          </table>

          <div className="tip-box info">
            <span className="tip-icon">💡</span>
            <div>
              <strong>Na prática (no trabalho):</strong> Ferramentas como <code>flex</code> e <code>lex</code> recebem
              expressões regulares e geram automaticamente o DFA do analisador léxico. Mas entender
              o processo é essencial para depurar e escrever padrões corretos!
            </div>
          </div>
        </div>
      </section>

      {/* ── Quiz ── */}
      <section className="section">
        <h2><span className="section-icon">🧠</span> Verificação de Aprendizado</h2>

        <Quiz
          question="Qual a diferença fundamental entre DFA e NFA?"
          options={[
            'DFA reconhece mais linguagens que NFA',
            'NFA pode ter múltiplas transições para o mesmo par (estado, símbolo)',
            'DFA não pode ter estados finais',
            'NFA não pode processar cadeias com mais de 2 símbolos',
          ]}
          correctIndex={1}
          explanation="A diferença está no determinismo: no DFA, cada par (estado, símbolo) leva a exatamente um próximo estado. No NFA, pode haver zero, uma ou várias opções, incluindo transições ε. Mas ambos reconhecem as mesmas linguagens (regulares)."
        />

        <div style={{ marginTop: 24 }}>
          <Quiz
            question="Dado um DFA com estados {q₀, q₁}, Σ = {0, 1}, q₀ inicial, F = {q₁}, e δ(q₀,0)=q₀, δ(q₀,1)=q₁, δ(q₁,0)=q₀, δ(q₁,1)=q₁. Qual linguagem ele reconhece?"
            options={[
              'Cadeias que contêm pelo menos um 1',
              'Cadeias que terminam em 1',
              'Cadeias com número par de 1s',
              'Apenas a cadeia "1"',
            ]}
            correctIndex={1}
            explanation="Analisando: o DFA fica em q₀ enquanto lê 0s. Ao ler 1, vai para q₁ (final). De q₁, ler 1 mantém em q₁, mas ler 0 volta para q₀. Portanto, aceita exatamente as cadeias que terminam em 1."
          />
        </div>

        <div style={{ marginTop: 24 }}>
          <Quiz
            question="Na construção de Thompson, como a operação r* (Kleene) é convertida para NFA?"
            options={[
              'Duplica-se o NFA de r e concatena',
              'Adiciona-se um loop ε do estado final ao inicial e um bypass ε do início ao novo final',
              'Remove-se o estado final do NFA de r',
              'Adiciona-se um estado de erro',
            ]}
            correctIndex={1}
            explanation="O fecho de Kleene r* cria um novo estado inicial e final. O bypass ε do início ao final permite aceitar ε (zero repetições), e o loop ε do final do NFA(r) ao início permite repetições."
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

/* ── Simulador de DFA Interativo ── */
function DFASimulator() {
  const dfaPresets = [
    {
      name: 'Termina em "ab"',
      description: 'Aceita cadeias sobre {a, b} que terminam com "ab"',
      alphabet: ['a', 'b'],
      states: ['q₀', 'q₁', 'q₂'],
      initial: 'q₀',
      finals: ['q₂'],
      transitions: {
        'q₀': { 'a': 'q₁', 'b': 'q₀' },
        'q₁': { 'a': 'q₁', 'b': 'q₂' },
        'q₂': { 'a': 'q₁', 'b': 'q₀' },
      },
    },
    {
      name: 'Número par de 0s',
      description: 'Aceita cadeias sobre {0, 1} com número par de 0s',
      alphabet: ['0', '1'],
      states: ['q₀', 'q₁'],
      initial: 'q₀',
      finals: ['q₀'],
      transitions: {
        'q₀': { '0': 'q₁', '1': 'q₀' },
        'q₁': { '0': 'q₀', '1': 'q₁' },
      },
    },
    {
      name: 'Contém "01"',
      description: 'Aceita cadeias sobre {0, 1} que contêm a subcadeia "01"',
      alphabet: ['0', '1'],
      states: ['q₀', 'q₁', 'q₂'],
      initial: 'q₀',
      finals: ['q₂'],
      transitions: {
        'q₀': { '0': 'q₁', '1': 'q₀' },
        'q₁': { '0': 'q₁', '1': 'q₂' },
        'q₂': { '0': 'q₂', '1': 'q₂' },
      },
    },
  ];

  const [selectedPreset, setSelectedPreset] = useState(0);
  const [inputString, setInputString] = useState('');
  const [simulation, setSimulation] = useState(null);
  const [stepIndex, setStepIndex] = useState(-1);

  const dfa = dfaPresets[selectedPreset];

  const simulate = useCallback(() => {
    const steps = [];
    let current = dfa.initial;
    const chars = inputString.split('');

    steps.push({ state: current, symbol: null, description: `Início no estado ${current}` });

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      const next = dfa.transitions[current]?.[c];
      if (!next) {
        steps.push({
          state: current,
          symbol: c,
          description: `Símbolo '${c}': sem transição definida — ERRO`,
          error: true,
        });
        break;
      }
      steps.push({
        state: next,
        symbol: c,
        description: `δ(${current}, ${c}) = ${next}`,
        from: current,
        to: next,
      });
      current = next;
    }

    const lastStep = steps[steps.length - 1];
    const accepted = !lastStep.error && dfa.finals.includes(lastStep.state || current);
    steps.push({
      state: current,
      symbol: null,
      description: accepted
        ? `Estado ${current} ∈ F → ACEITA ✅`
        : `Estado ${current} ∉ F → REJEITA ❌`,
      final: true,
      accepted,
    });

    setSimulation(steps);
    setStepIndex(0);
  }, [dfa, inputString]);

  const handleStep = (dir) => {
    if (!simulation) return;
    const next = stepIndex + dir;
    if (next >= 0 && next < simulation.length) setStepIndex(next);
  };

  const currentStep = simulation?.[stepIndex];

  return (
    <div className="exercise-container">
      <div className="exercise-header">
        <div className="exercise-icon">🎮</div>
        <h3>Simulador de DFA</h3>
      </div>
      <p className="exercise-description">
        Selecione um autômato, insira uma cadeia e acompanhe a execução passo a passo.
      </p>

      {/* Preset selector */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {dfaPresets.map((p, i) => (
          <button
            key={i}
            className={`btn ${i === selectedPreset ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => { setSelectedPreset(i); setSimulation(null); setStepIndex(-1); setInputString(''); }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* DFA info */}
      <div style={{
        padding: 14,
        background: 'var(--bg-input)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 16,
        fontSize: '0.88rem',
        color: 'var(--text-secondary)',
      }}>
        <strong style={{ color: 'var(--text-accent)' }}>{dfa.description}</strong><br />
        <span className="mono" style={{ fontSize: '0.82rem' }}>
          Q = {'{'} {dfa.states.join(', ')} {'}'} &nbsp;|&nbsp;
          Σ = {'{'} {dfa.alphabet.join(', ')} {'}'} &nbsp;|&nbsp;
          q₀ = {dfa.initial} &nbsp;|&nbsp;
          F = {'{'} {dfa.finals.join(', ')} {'}'}
        </span>
      </div>

      {/* Transition table */}
      <table className="data-table" style={{ marginBottom: 16 }}>
        <thead>
          <tr>
            <th>δ</th>
            {dfa.alphabet.map(a => <th key={a} className="mono">{a}</th>)}
          </tr>
        </thead>
        <tbody>
          {dfa.states.map(s => (
            <tr key={s} style={{
              background: currentStep && (currentStep.state === s || currentStep.from === s)
                ? 'rgba(59,130,246,0.1)' : 'transparent',
            }}>
              <td className="mono" style={{ fontWeight: 600 }}>
                {dfa.finals.includes(s) ? '*' : ''}{s}
                {s === dfa.initial ? ' →' : ''}
              </td>
              {dfa.alphabet.map(a => (
                <td key={a} className="mono" style={{
                  color: currentStep && currentStep.from === s && currentStep.symbol === a
                    ? 'var(--accent-cyan)' : 'inherit',
                  fontWeight: currentStep && currentStep.from === s && currentStep.symbol === a
                    ? 700 : 400,
                }}>
                  {dfa.transitions[s]?.[a] || '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Input */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <input
          className="input"
          value={inputString}
          onChange={(e) => { setInputString(e.target.value); setSimulation(null); setStepIndex(-1); }}
          placeholder={`Digite uma cadeia com ${dfa.alphabet.join(', ')}...`}
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary btn-sm" onClick={simulate} disabled={inputString.length === 0}>
          Simular
        </button>
      </div>

      {/* Simulation result */}
      {simulation && (
        <div style={{ animation: 'fadeSlideIn 0.3s ease' }}>
          {/* Step display */}
          <div style={{
            padding: 16,
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)',
            marginBottom: 12,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.92rem',
            minHeight: 56,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderLeft: `3px solid ${
              currentStep?.final
                ? (currentStep.accepted ? 'var(--accent-green)' : 'var(--accent-rose)')
                : currentStep?.error
                  ? 'var(--accent-rose)'
                  : 'var(--accent-blue)'
            }`,
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: currentStep?.final
                ? (currentStep.accepted ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.12)')
                : 'rgba(59,130,246,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: currentStep?.final
                ? (currentStep.accepted ? 'var(--accent-green)' : 'var(--accent-rose)')
                : 'var(--accent-blue)',
              flexShrink: 0,
            }}>
              {stepIndex + 1}
            </div>
            <span>{currentStep?.description}</span>
          </div>

          {/* String visualization */}
          <div style={{
            display: 'flex',
            gap: 4,
            marginBottom: 12,
            padding: '10px 14px',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            {inputString.split('').map((c, i) => {
              const isProcessed = i < stepIndex;
              const isCurrent = i === stepIndex - 1;
              return (
                <span key={i} style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: isCurrent ? 'rgba(59,130,246,0.2)' : isProcessed ? 'rgba(16,185,129,0.1)' : 'transparent',
                  color: isCurrent ? 'var(--accent-cyan)' : isProcessed ? 'var(--accent-green)' : 'var(--text-muted)',
                  border: isCurrent ? '1px solid var(--accent-blue)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}>
                  {c}
                </span>
              );
            })}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleStep(-1)}
              disabled={stepIndex <= 0}
            >
              ← Anterior
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleStep(1)}
              disabled={stepIndex >= simulation.length - 1}
            >
              Próximo →
            </button>
            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Passo {stepIndex + 1} de {simulation.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
