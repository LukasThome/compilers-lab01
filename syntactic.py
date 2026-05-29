"""
Syntactic Analyzer — Left Recursion Detector
Detects direct and indirect left recursion in context-free grammars.

Grammar format (one rule per line):
    A -> B C | D      (alternatives separated by |)
    A -> ε            (empty production)
"""

import sys
from collections import defaultdict


def parse_grammar(text):
    grammar = defaultdict(list)
    start = None

    for line in text.strip().splitlines():
        line = line.strip()
        if not line or line.startswith('#'):
            continue

        if '->' in line:
            lhs, rhs = line.split('->', 1)
        elif '::=' in line:
            lhs, rhs = line.split('::=', 1)
        else:
            print(f"Aviso: linha ignorada (formato inválido): '{line}'")
            continue

        lhs = lhs.strip()
        if not lhs:
            continue

        if start is None:
            start = lhs

        for alt in rhs.split('|'):
            symbols = alt.split()
            grammar[lhs].append(symbols if symbols else ['ε'])

    return dict(grammar), start


def compute_nullable(grammar):
    """Retorna conjunto de não-terminais que derivam a cadeia vazia."""
    nullable = set()
    changed = True
    while changed:
        changed = False
        for nt, productions in grammar.items():
            if nt in nullable:
                continue
            for prod in productions:
                if prod == ['ε'] or all(s in nullable for s in prod):
                    nullable.add(nt)
                    changed = True
                    break
    return nullable


def build_can_start(grammar, nullable):
    """
    can_start[A] = conjunto de não-terminais B tais que A pode ter B como
    primeiro símbolo não-terminal em alguma derivação de um passo.
    Leva em conta anuláveis: se B é anulável, continua para o próximo símbolo.
    """
    non_terminals = set(grammar.keys())
    can_start = defaultdict(set)

    for nt, productions in grammar.items():
        for prod in productions:
            for symbol in prod:
                if symbol in non_terminals:
                    can_start[nt].add(symbol)
                    if symbol not in nullable:
                        break
                elif symbol != 'ε':
                    break  # terminal — para

    return dict(can_start)


def find_cycle(start, can_start):
    """DFS para encontrar um ciclo que começa e termina em `start`. Retorna caminho ou None."""
    visited = set()
    path = [start]

    def dfs(node):
        for neighbor in sorted(can_start.get(node, set())):
            if neighbor == start:
                return path + [start]
            if neighbor not in visited:
                visited.add(neighbor)
                path.append(neighbor)
                result = dfs(neighbor)
                if result:
                    return result
                path.pop()
        return None

    visited.add(start)
    return dfs(start)


def detect_left_recursion(grammar):
    nullable = compute_nullable(grammar)
    can_start = build_can_start(grammar, nullable)

    # Recursão direta: A -> A ...
    direct = {}
    for nt, productions in grammar.items():
        culprits = [prod for prod in productions if prod and prod[0] == nt]
        if culprits:
            direct[nt] = culprits

    # Recursão indireta: ciclo em can_start (excluindo os que já são diretos)
    indirect = {}
    for nt in grammar:
        if nt in direct:
            continue
        cycle = find_cycle(nt, can_start)
        if cycle:
            indirect[nt] = cycle

    return direct, indirect, nullable


def report(grammar, start):
    direct, indirect, nullable = detect_left_recursion(grammar)

    print("=" * 54)
    print("  ANÁLISE SINTÁTICA — DETECÇÃO DE RECURSÃO À ESQUERDA")
    print("=" * 54)

    if nullable:
        print(f"\nAnuláveis (derivam ε): {', '.join(sorted(nullable))}")

    if not direct and not indirect:
        print("\n✓ Nenhuma recursão à esquerda detectada.")
        return

    if direct:
        print("\n[DIRETA] Recursão à esquerda direta detectada:")
        for nt in sorted(direct):
            for prod in direct[nt]:
                print(f"  {nt} -> {' '.join(prod)}")

    if indirect:
        print("\n[INDIRETA] Recursão à esquerda indireta detectada:")
        for nt in sorted(indirect):
            cycle = indirect[nt]
            print(f"  Ciclo: {' -> '.join(cycle)}")

    print()


def main():
    if len(sys.argv) > 1:
        with open(sys.argv[1]) as f:
            text = f.read()
    else:
        print("Uso: python syntactic.py <arquivo_gramatica>")
        print("Usando gramática de exemplo...\n")
        text = open("gramatica.txt").read() if __import__("os").path.exists("gramatica.txt") else """
# Gramática com recursão à esquerda direta e indireta
E -> E + T | T
T -> T * F | F
F -> id | ( E )
"""

    grammar, start = parse_grammar(text)

    print("Gramática lida:")
    for nt, prods in grammar.items():
        for prod in prods:
            sufixo = "  [início]" if nt == start else ""
            print(f"  {nt} -> {' '.join(prod)}{sufixo}")

    print()
    report(grammar, start)


if __name__ == "__main__":
    main()
