import os
import re

# Configurações
diretorio_raiz = '../frontend'  # Pode ser alterado para o caminho desejado
ip_antigo = '192.168.100.3'
ip_novo = '10.107.200.12'
padrao_regex = re.compile(rf'http://{re.escape(ip_antigo)}(:\d+)?')

extensoes_permitidas = '.jsx'

def substituir_ip_em_arquivo(caminho_arquivo):
    with open(caminho_arquivo, 'r', encoding='utf-8') as arquivo:
        conteudo = arquivo.read()

    novo_conteudo = padrao_regex.sub(f'http://{ip_novo}\\1', conteudo)

    if conteudo != novo_conteudo:
        with open(caminho_arquivo, 'w', encoding='utf-8') as arquivo:
            arquivo.write(novo_conteudo)
        print(f'[✔] IP substituído em: {caminho_arquivo}')

def percorrer_e_substituir(diretorio):
    for raiz, _, arquivos in os.walk(diretorio):
        for nome_arquivo in arquivos:
            if any(nome_arquivo.endswith(ext) for ext in extensoes_permitidas):
                caminho_completo = os.path.join(raiz, nome_arquivo)
                substituir_ip_em_arquivo(caminho_completo)

# Executa
percorrer_e_substituir(diretorio_raiz)