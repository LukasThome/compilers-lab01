import React, { useState } from 'react';
import Quiz from '../components/Quiz';

export default function Module1({ onNext, onPrev, moduleNumber, totalModules }) {
  return (
    <div className="content-wrapper fade-in">
      <div className="module-header">
        <span className="module-header-badge">📖 Módulo 1</span>
        <h1>Linguagens Formais e Alfabetos</h1>
        <p>
          Antes de mergulhar em compiladores, precisamos entender a base matemática:
          o que são linguagens formais, alfabetos e cadeias.
        </p>
      </div>

      {/* ── Seção 1: Alfabeto ── */}
      <section className="section">
        <h2><span className="section-icon">🔠</span> O que é um Alfabeto?</h2>

        <div className="theory-card">
          <div className="definition-box">
            <div className="def-term">Alfabeto (Σ)</div>
            <div className="def-desc">
              Um <span className="highlight">conjunto finito e não-vazio</span> de símbolos.
              Cada símbolo é uma unidade indivisível — como uma "letra" da linguagem.
            </div>
          </div>

          <div className="example-box">
            <div className="example-label">Exemplos</div>
            <p style={{ marginBottom: 0 }}>
              <code>Σ₁ = {'{'} 0, 1 {'}'}</code> — Alfabeto binário (usado em computadores)<br/>
              <code>Σ₂ = {'{'} a, b, c, ..., z {'}'}</code> — Letras minúsculas<br/>
              <code>Σ₃ = {'{'} +, -, *, /, 0, 1, ..., 9 {'}'}</code> — Operadores e dígitos<br/>
              <code>Σ₄ = {'{'} def, int, if, return, ident, (, ), ... {'}'}</code> — Tokens de uma linguagem de programação
            </p>
          </div>

          <div className="tip-box info">
            <span className="tip-icon">💡</span>
            <div>
              <strong>Conexão com o trabalho:</strong> No trabalho de compiladores, os
              símbolos do alfabeto do <em>analisador léxico</em> são caracteres individuais
              (letras, dígitos, operadores). Já para o <em>analisador sintático</em>,
              o alfabeto são os <em>tokens</em> produzidos pelo léxico!
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 2: Cadeias ── */}
      <section className="section">
        <h2><span className="section-icon">🔗</span> Cadeias (Strings)</h2>

        <div className="theory-card">
          <div className="definition-box">
            <div className="def-term">Cadeia (String / Palavra)</div>
            <div className="def-desc">
              Uma <span className="highlight">sequência finita de símbolos</span> de um alfabeto Σ.
              O comprimento de uma cadeia <code>w</code> é denotado por <code>|w|</code>.
            </div>
          </div>

          <div className="definition-box">
            <div className="def-term">Cadeia Vazia (ε)</div>
            <div className="def-desc">
              A cadeia com comprimento zero. Não contém nenhum símbolo. <code>|ε| = 0</code>.
              É como o "zero" das cadeias — neutra na concatenação.
            </div>
          </div>

          <div className="example-box">
            <div className="example-label">Exemplos com Σ = {'{'} a, b {'}'}</div>
            <table className="data-table">
              <thead>
                <tr><th>Cadeia (w)</th><th>Comprimento |w|</th><th>Observação</th></tr>
              </thead>
              <tbody>
                <tr><td className="mono">ε</td><td>0</td><td>Cadeia vazia</td></tr>
                <tr><td className="mono">a</td><td>1</td><td>Um único símbolo</td></tr>
                <tr><td className="mono">ab</td><td>2</td><td>Dois símbolos</td></tr>
                <tr><td className="mono">aabba</td><td>5</td><td>Repetições são permitidas</td></tr>
                <tr><td className="mono">bbb</td><td>3</td><td>Todos iguais, tudo bem</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Seção 3: Operações sobre Cadeias ── */}
      <section className="section">
        <h2><span className="section-icon">⚡</span> Operações sobre Cadeias</h2>

        <div className="theory-card">
          <h3>Concatenação</h3>
          <p>Juntar duas cadeias, uma após a outra.</p>
          <div className="code-block">
            <pre>{`Se x = "abc" e y = "de", então:
  x · y = "abcde"
  y · x = "deabc"
  x · ε = x = "abc"     (ε é o elemento neutro)`}</pre>
          </div>

          <h3 style={{ marginTop: 20 }}>Reverso</h3>
          <p>A cadeia escrita de trás para frente. Denotado por w<sup>R</sup>.</p>
          <div className="code-block">
            <pre>{`Se w = "abcd", então:
  wᴿ = "dcba"

Se w = "aba", então:
  wᴿ = "aba"     (palíndromo! w = wᴿ)`}</pre>
          </div>

          <h3 style={{ marginTop: 20 }}>Potência</h3>
          <p>Concatenar a cadeia consigo mesma <code>n</code> vezes.</p>
          <div className="code-block">
            <pre>{`Se w = "ab", então:
  w⁰ = ε          (qualquer cadeia elevada a 0 = ε)
  w¹ = "ab"
  w² = "abab"
  w³ = "ababab"`}</pre>
          </div>
        </div>
      </section>

      {/* ── Seção 4: Linguagens ── */}
      <section className="section">
        <h2><span className="section-icon">🌐</span> Linguagens</h2>

        <div className="theory-card">
          <div className="definition-box">
            <div className="def-term">Linguagem (L)</div>
            <div className="def-desc">
              Um <span className="highlight">conjunto de cadeias</span> sobre um alfabeto Σ.
              Pode ser finito ou infinito. Formalmente: L ⊆ Σ*.
            </div>
          </div>

          <div className="definition-box">
            <div className="def-term">Σ* (Fecho de Kleene do Alfabeto)</div>
            <div className="def-desc">
              O conjunto de <span className="highlight">todas as cadeias possíveis</span> (incluindo ε)
              formadas a partir dos símbolos de Σ. É sempre um conjunto infinito.
            </div>
          </div>

          <div className="example-box">
            <div className="example-label">Exemplos com Σ = {'{'} 0, 1 {'}'}</div>
            <p style={{ marginBottom: 0 }}>
              <code>Σ* = {'{'} ε, 0, 1, 00, 01, 10, 11, 000, 001, ... {'}'}</code><br/><br/>
              <strong>Linguagens sobre Σ:</strong><br/>
              <code>L₁ = {'{'} 0, 01, 011, 0111, ... {'}'}</code> — Cadeias que começam com 0 seguido de qualquer número de 1s<br/>
              <code>L₂ = {'{'} ε, 01, 0011, 000111, ... {'}'}</code> — Mesma quantidade de 0s e 1s<br/>
              <code>L₃ = {'{'} ε {'}'}</code> — Linguagem contendo apenas a cadeia vazia<br/>
              <code>L₄ = {'{'} {'}'} = ∅</code> — Linguagem vazia (sem nenhuma cadeia!)
            </p>
          </div>

          <div className="tip-box warning">
            <span className="tip-icon">⚠️</span>
            <div>
              <strong>Atenção:</strong> Não confunda <code>{'{'} ε {'}'}</code> com <code>∅</code>!
              A primeira contém uma cadeia (a vazia). A segunda não contém cadeia nenhuma.
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 5: Operações sobre Linguagens ── */}
      <section className="section">
        <h2><span className="section-icon">🧮</span> Operações sobre Linguagens</h2>

        <div className="theory-card">
          <table className="data-table">
            <thead>
              <tr><th>Operação</th><th>Notação</th><th>Significado</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>União</td>
                <td className="mono">L₁ ∪ L₂</td>
                <td>Cadeias que estão em L₁ <strong>ou</strong> em L₂ (ou em ambas)</td>
              </tr>
              <tr>
                <td>Concatenação</td>
                <td className="mono">L₁ · L₂</td>
                <td>Toda cadeia <code>xy</code> onde <code>x ∈ L₁</code> e <code>y ∈ L₂</code></td>
              </tr>
              <tr>
                <td>Fecho de Kleene</td>
                <td className="mono">L*</td>
                <td>Zero ou mais concatenações de cadeias de L: <code>L⁰ ∪ L¹ ∪ L² ∪ ...</code></td>
              </tr>
              <tr>
                <td>Fecho Positivo</td>
                <td className="mono">L⁺</td>
                <td>Uma ou mais concatenações: <code>L¹ ∪ L² ∪ L³ ∪ ...</code> (sem ε necessariamente)</td>
              </tr>
            </tbody>
          </table>

          <div className="example-box">
            <div className="example-label">Exemplo</div>
            <div className="code-block">
              <pre>{`L₁ = { a, b }    L₂ = { 1, 2 }

L₁ ∪ L₂ = { a, b, 1, 2 }
L₁ · L₂ = { a1, a2, b1, b2 }

L₁* = { ε, a, b, aa, ab, ba, bb, aaa, aab, ... }
L₁⁺ = { a, b, aa, ab, ba, bb, aaa, aab, ... }  (sem ε)`}</pre>
            </div>
          </div>

          <div className="tip-box info">
            <span className="tip-icon">💡</span>
            <div>
              <strong>A grande sacada:</strong> Linguagens de programação como LCC-2026-1 são
              exatamente isso — um <em>conjunto de cadeias</em> (programas válidos) sobre um
              alfabeto de tokens. O trabalho do compilador é verificar se uma cadeia (o programa)
              pertence a essa linguagem!
            </div>
          </div>
        </div>
      </section>

      {/* ── Exercício Interativo ── */}
      <section className="section">
        <h2><span className="section-icon">🎯</span> Exercício Interativo</h2>
        <StringOperationExercise />
      </section>

      {/* ── Quiz ── */}
      <section className="section">
        <h2><span className="section-icon">🧠</span> Verificação de Aprendizado</h2>

        <Quiz
          question="Se Σ = { a, b }, qual das opções NÃO é uma cadeia sobre Σ?"
          options={[
            'ε (cadeia vazia)',
            'aabba',
            'abc',
            'bbb',
          ]}
          correctIndex={2}
          explanation="A cadeia 'abc' contém o símbolo 'c', que não pertence ao alfabeto Σ = { a, b }. Cadeias devem usar apenas símbolos do alfabeto."
        />

        <div style={{ marginTop: 24 }}>
          <Quiz
            question="Qual é a diferença entre ∅ (conjunto vazio) e { ε }?"
            options={[
              'São a mesma coisa — ambos representam "nada"',
              '∅ não contém nenhuma cadeia; { ε } contém exatamente uma cadeia (a vazia)',
              '{ ε } é inválido — ε não é uma cadeia',
              '∅ contém ε implicitamente',
            ]}
            correctIndex={1}
            explanation="∅ é a linguagem vazia (0 cadeias). { ε } contém uma cadeia: a cadeia vazia, com comprimento 0. São conjuntos diferentes!"
          />
        </div>

        <div style={{ marginTop: 24 }}>
          <Quiz
            question={`Se L = { ab, c }, qual é L² (concatenação de L consigo mesma)?`}
            options={[
              '{ ab, c, abab, cc }',
              '{ abab, abc, cab, cc }',
              '{ aabb, cc }',
              '{ ab, c }',
            ]}
            correctIndex={1}
            explanation="L² = L · L = toda combinação de uma cadeia de L seguida de outra cadeia de L: ab·ab = abab, ab·c = abc, c·ab = cab, c·c = cc."
          />
        </div>
      </section>

      {/* ── Footer ── */}
      <div className="module-footer">
        <div />
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

/* ── Exercício: Operações com Cadeias ── */
function StringOperationExercise() {
  const [inputW, setInputW] = useState('ab');
  const [inputX, setInputX] = useState('cd');

  const concat = inputW + inputX;
  const reverseW = inputW.split('').reverse().join('');
  const power2 = inputW + inputW;
  const power3 = inputW + inputW + inputW;
  const lenW = inputW.length;

  return (
    <div className="exercise-container">
      <div className="exercise-header">
        <div className="exercise-icon">✏️</div>
        <h3>Calculadora de Operações sobre Cadeias</h3>
      </div>
      <p className="exercise-description">
        Digite duas cadeias abaixo e veja as operações sendo calculadas em tempo real!
      </p>

      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>
            Cadeia w
          </label>
          <input
            className="input"
            value={inputW}
            onChange={(e) => setInputW(e.target.value)}
            placeholder="ex: ab"
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>
            Cadeia x
          </label>
          <input
            className="input"
            value={inputX}
            onChange={(e) => setInputX(e.target.value)}
            placeholder="ex: cd"
          />
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr><th>Operação</th><th>Resultado</th><th>Comprimento</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>|w|</td>
            <td className="mono">{lenW}</td>
            <td>—</td>
          </tr>
          <tr>
            <td>w · x (concatenação)</td>
            <td className="mono">{concat || 'ε'}</td>
            <td>{concat.length}</td>
          </tr>
          <tr>
            <td>w<sup>R</sup> (reverso)</td>
            <td className="mono">{reverseW || 'ε'}</td>
            <td>{reverseW.length}</td>
          </tr>
          <tr>
            <td>w² (potência)</td>
            <td className="mono">{power2 || 'ε'}</td>
            <td>{power2.length}</td>
          </tr>
          <tr>
            <td>w³ (potência)</td>
            <td className="mono">{power3 || 'ε'}</td>
            <td>{power3.length}</td>
          </tr>
          <tr>
            <td>Palíndromo?</td>
            <td className="mono" style={{ color: inputW === reverseW ? 'var(--accent-green)' : 'var(--accent-rose)' }}>
              {inputW === reverseW ? '✅ Sim' : '❌ Não'}
            </td>
            <td>—</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
