def analisador_lexico(codigo_fonte):
    tokens = []
    i = 0
    tamanho = len(codigo_fonte)
    
    # Loop principal para ler toda a cadeia
    while i < tamanho:
        estado = 0
        
        # Loop do diagrama de transição para identificar um token
        while True:
            # Lê o caractere atual ou define como EOF (Fim de Arquivo)
            c = codigo_fonte[i] if i < tamanho else 'EOF'
            
            # ESTADO 0: Estado Inicial
            if estado == 0:
                if c == 'EOF':
                    break # Fim da análise
                elif c.isspace():
                    estado = 1 # Transição para BRANCO
                    i += 1
                elif c.isalpha():
                    estado = 2 # Transição para IDENT
                    i += 1
                else:
                    estado = 3 # Transição para OUTRO
                    i += 1
            
            # ESTADO 1: Branco (Espaços, tabulações, quebras de linha)
            elif estado == 1:
                # Token BRANCO finalizado, não adicionamos à lista e voltamos ao estado 0
                break
                
            # ESTADO 2: Identificador (Letras)
            elif estado == 2:
                # Se continuar sendo letra, permanece no estado 2
                if c != 'EOF' and c.isalpha():
                    i += 1
                else:
                    # Se não for, o token IDENT acabou. 
                    # Não incrementamos o 'i' para que o próximo token processe este caractere
                    tokens.append("IDENT")
                    break
            
            # ESTADO 3: Outros símbolos (operadores, pontuação)
            elif estado == 3:
                # O token OUTRO possui apenas 1 caractere de tamanho nesse contexto
                tokens.append("OUTRO")
                break

    return tokens

# --- Teste com a entrada fornecida ---
entrada = "_ def=def f (iintnt a 23) { x = x + a; return; }"
lista_tokens = analisador_lexico(entrada)

# Imprimindo a saída formatada na tela
saida = " ".join(lista_tokens)
print(f"Entrada: {entrada}")
print(f"Saída:   {saida}")