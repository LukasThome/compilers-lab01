import React, { useState, useCallback } from 'react';
import Quiz from '../components/Quiz';

export default function Module4({ onNext, onPrev, moduleNumber, totalModules }) {
  return (
    <div className="content-wrapper fade-in">
      <div className="module-header">
        <span className="module-header-badge">🔍 Módulo 4</span>
        <h1>Análise Léxica</h1>
        <p>
          O analisador léxico (lexer/scanner) é a primeira fase do compilador.
          Ele transforma o código-fonte em uma sequência de tokens.
        </p>
      </div>

      {/* ── Seção 1: Papel do Léxico ── */}
      <section className="section">
        <h2><span className="section-icon">🏗️</span> O Papel do Analisador Léxico</h2>

        <div className="theory-card">
          <p>
            O analisador léxico é o <span className="highlight">primeiro estágio</span> do
            pipeline de compilação. Sua função é ler o código-fonte caractere por caractere
            e agrupar esses caracteres em unidades significativas chamadas <span className="keyword">tokens</span>.
          </p>

          <div className="code-block">
            <span className="code-label">PIPELINE</span>
            <pre>{`Código-Fonte (texto)
    │
    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Analisador  │     │  Analisador  │     │   Geração    │
│    Léxico    │────▶│   Sintático  │────▶│   de Código  │
│   (Lexer)    │     │   (Parser)   │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
    │                      │
    ▼                      ▼
 Tokens              Árvore Sintática`}</pre>
          </div>

          <div className="tip-box info">
            <span className="tip-icon">💡</span>
            <div>
              <strong>Por que separar léxico do sintático?</strong>
              <br />
              1. <strong>Simplicidade:</strong> cada fase resolve um problema específico
              <br />
              2. <strong>Eficiência:</strong> o léxico remove espaços e comentários antes do parser
              <br />
              3. <strong>Portabilidade:</strong> mudanças na representação de tokens não afetam o parser
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 2: Token, Lexema, Padrão ── */}
      <section className="section">
        <h2><span className="section-icon">📐</span> Token, Lexema e Padrão</h2>

        <div className="theory-card">
          <p>Três conceitos fundamentais que precisamos distinguir:</p>

          <div className="definition-box">
            <div className="def-term">Token</div>
            <div className="def-desc">
              A <span className="highlight">categoria</span> de uma unidade léxica.
              Ex: <code>IDENT</code>, <code>INT_CONST</code>, <code>KEYWORD</code>.
            </div>
          </div>

          <div className="definition-box">
            <div className="def-term">Lexema</div>
            <div className="def-desc">
              A <span className="highlight">sequência concreta de caracteres</span> no código-fonte
              que corresponde a um token. Ex: <code>soma</code>, <code>42</code>, <code>def</code>.
            </div>
          </div>

          <div className="definition-box">
            <div className="def-term">Padrão</div>
            <div className="def-desc">
              A <span className="highlight">regra</span> (geralmente uma expressão regular) que
              descreve quais lexemas pertencem a um token.
              Ex: <code>letra (letra | dígito)*</code> para <code>IDENT</code>.
            </div>
          </div>

          <div className="example-box">
            <div className="example-label">Exemplo Completo</div>
            <table className="data-table">
              <thead>
                <tr><th>Código-Fonte</th><th>Token</th><th>Lexema</th><th>Padrão (Regex)</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td className="mono">def</td>
                  <td><span className="token-chip keyword">KEYWORD</span></td>
                  <td className="mono">def</td>
                  <td className="mono">def</td>
                </tr>
                <tr>
                  <td className="mono">soma</td>
                  <td><span className="token-chip ident">IDENT</span></td>
                  <td className="mono">soma</td>
                  <td className="mono">letra(letra|dígito|_)*</td>
                </tr>
                <tr>
                  <td className="mono">42</td>
                  <td><span className="token-chip number">INT_CONST</span></td>
                  <td className="mono">42</td>
                  <td className="mono">dígito⁺</td>
                </tr>
                <tr>
                  <td className="mono">3.14</td>
                  <td><span className="token-chip number">FLOAT_CONST</span></td>
                  <td className="mono">3.14</td>
                  <td className="mono">dígito⁺.dígito⁺</td>
                </tr>
                <tr>
                  <td className="mono">=</td>
                  <td><span className="token-chip operator">ASSIGN</span></td>
                  <td className="mono">=</td>
                  <td className="mono">=</td>
                </tr>
                <tr>
                  <td className="mono">;</td>
                  <td><span className="token-chip delimiter">SEMICOLON</span></td>
                  <td className="mono">;</td>
                  <td className="mono">;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Seção 3: Como o Lexer Funciona ── */}
      <section className="section">
        <h2><span className="section-icon">⚙️</span> Como o Lexer Funciona</h2>

        <div className="theory-card">
          <p>
            O analisador léxico é essencialmente um <span className="highlight">DFA em ação</span>.
            Para cada tipo de token, há um padrão (regex), que foi convertido em um autômato.
          </p>

          <div className="code-block">
            <span className="code-label">PSEUDOCÓDIGO</span>
            <pre>{`função próximo_token():
    pular_espaços_e_comentários()

    se fim_da_entrada:
        retorna <EOF>

    // Tenta casar com cada padrão (na ordem de prioridade)
    para cada padrão P em ordem:
        se entrada casa com P:
            lexema = texto casado
            avança posição no código-fonte
            retorna Token(tipo, lexema, linha)

    // Nenhum padrão casou
    reporta_erro("Caractere inesperado", posição)
    avança 1 caractere  // recuperação de erro`}</pre>
          </div>

          <div className="tip-box warning">
            <span className="tip-icon">⚠️</span>
            <div>
              <strong>Regras de desambiguação:</strong>
              <br />
              1. <strong>Maior casamento (longest match):</strong> entre dois casamentos possíveis
              a partir da mesma posição, o lexer escolhe o mais longo.
              Ex: <code>{"<="}</code> é um token, não <code>{"<"}</code> seguido de <code>=</code>.
              <br />
              2. <strong>Prioridade de regras:</strong> se dois padrões casam o mesmo lexema,
              o de maior prioridade vence. Ex: <code>def</code> é KEYWORD, não IDENT.
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 4: Erros Léxicos ── */}
      <section className="section">
        <h2><span className="section-icon">🚨</span> Erros Léxicos</h2>

        <div className="theory-card">
          <p>
            Erros léxicos ocorrem quando o lexer encontra uma sequência de caracteres que
            <span className="highlight"> não corresponde a nenhum padrão</span> válido.
          </p>

          <div className="example-box">
            <div className="example-label">Exemplos de Erros Léxicos</div>
            <table className="data-table">
              <thead>
                <tr><th>Entrada</th><th>Erro</th><th>Explicação</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td className="mono">@variavel</td>
                  <td>Caractere inválido</td>
                  <td><code>@</code> não pertence ao alfabeto da linguagem</td>
                </tr>
                <tr>
                  <td className="mono">"texto sem fechar</td>
                  <td>String não terminada</td>
                  <td>Falta a aspa de fechamento</td>
                </tr>
                <tr>
                  <td className="mono">3.14.15</td>
                  <td>Número malformado</td>
                  <td>Dois pontos decimais em um literal numérico</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="tip-box info">
            <span className="tip-icon">💡</span>
            <div>
              <strong>Recuperação de erros:</strong> um bom lexer não para no primeiro erro.
              Ele reporta o problema, pula o caractere inválido e continua analisando
              o restante da entrada para encontrar mais erros de uma vez.
            </div>
          </div>
        </div>
      </section>

      {/* ── Seção 5: Tokenizador Interativo ── */}
      <section className="section">
        <h2><span className="section-icon">🎯</span> Tokenizador Interativo</h2>
        <InteractiveTokenizer />
      </section>

      {/* ── Quiz ── */}
      <section className="section">
        <h2><span className="section-icon">🧠</span> Verificação de Aprendizado</h2>

        <Quiz
          question="Qual a diferença entre token e lexema?"
          options={[
            'São a mesma coisa — sinônimos',
            'Token é a categoria (IDENT, INT_CONST); lexema é o texto concreto (soma, 42)',
            'Lexema é o padrão regex; token é o texto',
            'Token é sempre uma palavra-chave; lexema é qualquer outro texto',
          ]}
          correctIndex={1}
          explanation="Token é a classificação/categoria (IDENT, KEYWORD, INT_CONST), enquanto lexema é a sequência real de caracteres no código-fonte que foi classificada nessa categoria."
        />

        <div style={{ marginTop: 24 }}>
          <Quiz
            question={`O que acontece quando o lexer encontra "defg" no código-fonte?`}
            options={[
              'Gera o token KEYWORD("def") e depois IDENT("g")',
              'Gera o token IDENT("defg") — longest match vence',
              'Gera um erro léxico',
              'Gera KEYWORD("def") e depois KEYWORD("g")',
            ]}
            correctIndex={1}
            explanation={`Pela regra do longest match, "defg" casa inteiramente com o padrão de identificador (letra seguida de letras/dígitos). Como é mais longo que "def", o resultado é IDENT("defg"), não KEYWORD("def").`}
          />
        </div>

        <div style={{ marginTop: 24 }}>
          <Quiz
            question="Qual destes NÃO é um erro léxico?"
            options={[
              'Caractere @ no meio de um identificador',
              'String sem aspa de fechamento',
              'Duas variáveis com o mesmo nome',
              'Número com dois pontos decimais (3.14.15)',
            ]}
            correctIndex={2}
            explanation="Variáveis com o mesmo nome é um erro semântico (ou de escopo), detectado em fases posteriores do compilador. O léxico apenas gera tokens — ele não verifica significado nem duplicação."
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

/* ── Tokenizador Interativo ── */
const KEYWORDS = new Set([
  'def', 'int', 'float', 'string', 'if', 'else',
  'for', 'return', 'print', 'read', 'new', 'null', 'break',
]);

const OPERATORS = new Set([
  '+', '-', '*', '/', '%', '<', '>', '<=', '>=', '==', '!=',
]);

const DELIMITERS = new Set(['(', ')', '{', '}', '[', ']', ';', ',']);

function tokenize(input) {
  const tokens = [];
  let pos = 0;
  let line = 1;
  let col = 1;

  while (pos < input.length) {
    const ch = input[pos];

    // Skip whitespace
    if (/\s/.test(ch)) {
      if (ch === '\n') { line++; col = 1; } else { col++; }
      pos++;
      continue;
    }

    // Skip line comments
    if (ch === '/' && input[pos + 1] === '/') {
      while (pos < input.length && input[pos] !== '\n') pos++;
      continue;
    }

    const startPos = pos;
    const startCol = col;

    // String literal
    if (ch === '"') {
      pos++; col++;
      let value = '"';
      let terminated = false;
      while (pos < input.length) {
        if (input[pos] === '\n') { line++; col = 1; }
        if (input[pos] === '"') {
          value += '"';
          pos++; col++;
          terminated = true;
          break;
        }
        value += input[pos];
        pos++; col++;
      }
      tokens.push({
        type: terminated ? 'STRING_CONST' : 'ERROR',
        lexeme: value,
        line,
        col: startCol,
        class: terminated ? 'string' : 'error',
        error: terminated ? null : 'String não terminada',
      });
      continue;
    }

    // Number (int or float)
    if (/[0-9]/.test(ch)) {
      let num = '';
      while (pos < input.length && /[0-9]/.test(input[pos])) {
        num += input[pos]; pos++; col++;
      }
      if (pos < input.length && input[pos] === '.' && pos + 1 < input.length && /[0-9]/.test(input[pos + 1])) {
        num += '.'; pos++; col++;
        while (pos < input.length && /[0-9]/.test(input[pos])) {
          num += input[pos]; pos++; col++;
        }
        tokens.push({ type: 'FLOAT_CONST', lexeme: num, line, col: startCol, class: 'number' });
      } else {
        tokens.push({ type: 'INT_CONST', lexeme: num, line, col: startCol, class: 'number' });
      }
      continue;
    }

    // Identifier or keyword
    if (/[a-zA-Z_]/.test(ch)) {
      let id = '';
      while (pos < input.length && /[a-zA-Z0-9_]/.test(input[pos])) {
        id += input[pos]; pos++; col++;
      }
      if (KEYWORDS.has(id)) {
        tokens.push({ type: 'KEYWORD', lexeme: id, line, col: startCol, class: 'keyword' });
      } else {
        tokens.push({ type: 'IDENT', lexeme: id, line, col: startCol, class: 'ident' });
      }
      continue;
    }

    // Two-character operators
    if (pos + 1 < input.length) {
      const twoChar = ch + input[pos + 1];
      if (OPERATORS.has(twoChar)) {
        tokens.push({ type: 'OPERATOR', lexeme: twoChar, line, col: startCol, class: 'operator' });
        pos += 2; col += 2;
        continue;
      }
    }

    // Assignment
    if (ch === '=') {
      tokens.push({ type: 'ASSIGN', lexeme: '=', line, col: startCol, class: 'operator' });
      pos++; col++;
      continue;
    }

    // Single-character operators
    if (OPERATORS.has(ch)) {
      tokens.push({ type: 'OPERATOR', lexeme: ch, line, col: startCol, class: 'operator' });
      pos++; col++;
      continue;
    }

    // Delimiters
    if (DELIMITERS.has(ch)) {
      tokens.push({ type: 'DELIMITER', lexeme: ch, line, col: startCol, class: 'delimiter' });
      pos++; col++;
      continue;
    }

    // Unknown character — error
    tokens.push({
      type: 'ERROR',
      lexeme: ch,
      line,
      col: startCol,
      class: 'error',
      error: `Caractere inesperado: '${ch}'`,
    });
    pos++; col++;
  }

  tokens.push({ type: 'EOF', lexeme: '', line, col, class: 'eof' });
  return tokens;
}

function InteractiveTokenizer() {
  const [code, setCode] = useState(`def soma(a, b) {\n  return a + b;\n}`);
  const [hoveredToken, setHoveredToken] = useState(null);

  const tokens = tokenize(code);
  const errors = tokens.filter(t => t.type === 'ERROR');
  const realTokens = tokens.filter(t => t.type !== 'EOF');

  return (
    <div className="exercise-container">
      <div className="exercise-header">
        <div className="exercise-icon">⌨️</div>
        <h3>Tokenizador ao Vivo</h3>
      </div>
      <p className="exercise-description">
        Digite código LCC-2026-1 abaixo e veja os tokens sendo gerados em tempo real.
        Experimente introduzir erros (como <code>@</code> ou strings sem fechar) para ver como o lexer reage.
      </p>

      {/* Code input */}
      <div style={{ marginBottom: 20 }}>
        <label style={{
          display: 'block',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          marginBottom: 6,
          fontWeight: 600,
        }}>
          Código-fonte
        </label>
        <textarea
          className="input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={5}
          style={{
            resize: 'vertical',
            lineHeight: 1.6,
            tabSize: 2,
          }}
        />
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex',
        gap: 16,
        marginBottom: 16,
        flexWrap: 'wrap',
      }}>
        <div style={{
          padding: '8px 16px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(59,130,246,0.1)',
          border: '1px solid rgba(59,130,246,0.2)',
          fontSize: '0.82rem',
          color: 'var(--accent-blue)',
          fontWeight: 600,
        }}>
          {realTokens.length} tokens
        </div>
        {errors.length > 0 && (
          <div style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(244,63,94,0.1)',
            border: '1px solid rgba(244,63,94,0.2)',
            fontSize: '0.82rem',
            color: 'var(--accent-rose)',
            fontWeight: 600,
          }}>
            {errors.length} erro{errors.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Token chips visual */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 20,
        padding: '16px',
        background: 'var(--bg-input)',
        borderRadius: 'var(--radius-md)',
        minHeight: 48,
      }}>
        {realTokens.map((t, i) => (
          <span
            key={i}
            className={`token-chip ${t.class}${hoveredToken === i ? ' active' : ''}`}
            onMouseEnter={() => setHoveredToken(i)}
            onMouseLeave={() => setHoveredToken(null)}
            style={{
              cursor: 'default',
              ...(t.type === 'ERROR' ? {
                background: 'rgba(244,63,94,0.15)',
                color: '#fb7185',
                border: '1px solid rgba(244,63,94,0.4)',
                textDecoration: 'wavy underline',
              } : {}),
            }}
          >
            {t.lexeme || 'EOF'}
          </span>
        ))}
      </div>

      {/* Token detail on hover */}
      {hoveredToken !== null && realTokens[hoveredToken] && (
        <div style={{
          padding: '12px 16px',
          background: 'var(--bg-input)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-accent)',
          marginBottom: 16,
          fontSize: '0.85rem',
          fontFamily: 'var(--font-mono)',
          animation: 'fadeSlideIn 0.2s ease',
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Tipo: </span>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{realTokens[hoveredToken].type}</span>
          <span style={{ color: 'var(--text-muted)', marginLeft: 16 }}>Lexema: </span>
          <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>
            {JSON.stringify(realTokens[hoveredToken].lexeme)}
          </span>
          <span style={{ color: 'var(--text-muted)', marginLeft: 16 }}>Linha: </span>
          <span style={{ color: 'var(--text-primary)' }}>{realTokens[hoveredToken].line}</span>
          {realTokens[hoveredToken].error && (
            <>
              <br />
              <span style={{ color: 'var(--accent-rose)' }}>
                Erro: {realTokens[hoveredToken].error}
              </span>
            </>
          )}
        </div>
      )}

      {/* Full token table */}
      <details style={{ marginTop: 8 }}>
        <summary style={{
          cursor: 'pointer',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          fontWeight: 600,
          padding: '8px 0',
          userSelect: 'none',
        }}>
          Ver tabela completa de tokens
        </summary>
        <table className="data-table" style={{ marginTop: 8 }}>
          <thead>
            <tr><th>#</th><th>Token</th><th>Lexema</th><th>Linha</th><th>Coluna</th></tr>
          </thead>
          <tbody>
            {tokens.map((t, i) => (
              <tr key={i} style={{
                background: t.type === 'ERROR' ? 'rgba(244,63,94,0.06)' : 'transparent',
              }}>
                <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                <td>
                  <span className={`token-chip ${t.class}`} style={{ margin: 0 }}>
                    {t.type}
                  </span>
                </td>
                <td className="mono">{t.type === 'EOF' ? '—' : JSON.stringify(t.lexeme)}</td>
                <td>{t.line}</td>
                <td>{t.col}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
