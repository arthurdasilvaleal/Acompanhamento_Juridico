import os
import re

# Configurações
diretorio_raiz = '../frontend'  # Pode ser alterado para o caminho desejado
ip_antigo = '10.107.200.12'
ip_novo = '192.168.100.3'
padrao_regex = re.compile(rf'http://{re.escape(ip_antigo)}(:\d+)?')

extensao = '.jsx'
contador = 0

def substituir_ip_em_arquivo(caminho_arquivo, cont):
    with open(caminho_arquivo, 'r', encoding='utf-8') as arquivo:
        conteudo = arquivo.read()

    novo_conteudo = padrao_regex.sub(f'http://{ip_novo}\\1', conteudo)

    if conteudo != novo_conteudo:
        with open(caminho_arquivo, 'w', encoding='utf-8') as arquivo:
            arquivo.write(novo_conteudo)
        print(f'[✔] IP substituído em: {caminho_arquivo}')
        cont += 1
    
    return cont

def percorrer_e_substituir(diretorio):
    for raiz, _, arquivos in os.walk(diretorio):
        for nome_arquivo in arquivos:
            if any(nome_arquivo.endswith(ext) for ext in extensao):
                caminho_completo = os.path.join(raiz, nome_arquivo)
                anyIP = substituir_ip_em_arquivo(caminho_completo, contador)
    
    return anyIP

# Executa
result = percorrer_e_substituir(diretorio_raiz)
if result == 0:
    print("Nenhum IP substituido.")