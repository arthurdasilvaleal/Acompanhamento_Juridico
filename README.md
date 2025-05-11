# Sistema de Gerenciamento Jurídico

Este é um sistema web para gerenciamento de processos jurídicos, intimações e tarefas. Desenvolvido com **React.js** no front-end, **Flask (Python)** no back-end, e **MySQL** como banco de dados.

## 📚 Funcionalidades

- Cadastro e consulta de processos jurídicos
- Adição e listagem de intimações
- Criação de tarefas vinculadas a processos
- Integração entre front-end e back-end via API
- Validação de dados com máscaras de input
- Transições suaves entre estados de UI

## 🛠️ Tecnologias Utilizadas

### Front-end
- React.js
- styled-components
- axios
- React-Router-Dom
- React useState
- React useEffect
  Libs:
  - cpf-cnpj-validator
  - react-number-format
  - @react-input/mask

### Back-end
- Flask (Python)
- Flask-CORS
- MySQL Connector

### Banco de Dados
- MySQL
- Tabelas: `Cliente`, `Processo`, `Intimacao`, `Tarefa`, `Tribunal`, `Colaborador`, `TipoColaborador`, `StatusTarefa`, `TipoLogradouro` 

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js
- Python 3
- MySQL Server

### Instalação do Front-end (React.js)

```bash
npm install
npm i react-number-format
npm i cpf-cnpj-validator
npm i inputmask
```

### Instalação do Back-end (Python + Flask)
```bash
pip install flask
pip install flask-mysql-connector
pip install flask-cors
```

### Rodar o projeto
```bash
npm run dev
```

### Abra outro terminal para rodar o servidor

```bash
cd ./backend
py ./server.py
```

### 📬 Contato
Caso tenha dúvidas ou sugestões, entre em contato:<br>
**Arthur - Desenvolvedor Web Front-end**<br>
**https://github.com/arthurdasilvaleal**<br>
**https://www.linkedin.com/in/arthurdasilvaleal/**