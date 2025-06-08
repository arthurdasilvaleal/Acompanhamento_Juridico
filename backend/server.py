from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app) # Resolve o erro do navegador bloquear a conexão

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="bd_aj"
)
# Se o usuário sair da aba muito rápido, causa um erro... fix that
cursor = db.cursor(dictionary=True)

# Para o Login
@app.route("/submit_login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("Login")
    password = data.get("Pass")

    query = """SELECT nm_Colaborador, nm_TipoColaborador FROM Colaborador C
            JOIN TipoColaborador TP ON C.cd_TipoColaborador = TP.cd_TipoColaborador
            WHERE nm_Usuario = %s AND ds_Senha = SHA2(%s, 256)"""
    
    cursor.execute(query, (username, password))
    user = cursor.fetchone()

    if user:
        return jsonify({"success": True, "message": "Login bem-sucedido", "user": user })
    else:
        return jsonify({"success": False, "message": "Usuário ou senha incorretos"}), 401

# Para Cadastro
@app.route("/post_cadastro", methods=["POST"])
def post_clientes():
    data = request.get_json()

    Nome = data.get("nm_Nome")
    CEP = data.get("cd_cep")
    CPF = data.get("cd_cpf")
    Telefone = data.get("cd_Telefone")
    Endereco = data.get("nm_Logradouro")
    Cidade = data.get("nm_Cidade")
    Bairro = data.get("nm_Bairro")
    Estado = data.get("sg_Estado")
    Complemento = data.get("ds_Complemento")
    NumeroEnd = data.get("cd_NumeroEndereco")
    Email = data.get("ds_Email")
    Usuario = data.get("nm_Usuario")
    Senha = data.get("ds_Senha")
    TipoColaborador = data.get("cd_TipoColaborador")

    query = """INSERT INTO Colaborador (nm_Colaborador, cd_CPF, nm_Logradouro, nm_Bairro, 
            nm_Cidade, sg_Estado, cd_CEP, cd_NumeroEndereco, ds_ComplementoEndereco, 
            cd_Telefone, ds_Email, nm_Usuario, ds_Senha, cd_TipoColaborador)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, SHA2(%s, 256), %s)"""
    try:
        cursor.execute(query, (Nome, CPF, Endereco, Bairro, Cidade, Estado, CEP, NumeroEnd, Complemento, Telefone, Email, Usuario, Senha, TipoColaborador))
        db.commit()
        return jsonify({"message": "Colaborador cadastrado"}), 201
    except mysql.connector.Error as err:
        print("Erro: ", err)
        return jsonify({"error": str(err)}), 500


# Consultar Clientes
@app.route("/get_clientes", methods=["GET"])
def get_clientes():

    query = "SELECT nm_Cliente FROM cliente"
    cursor.execute(query)
    result = cursor.fetchall()
    return jsonify(result)

@app.route("/post_cliente", methods=["POST"])
def post_cliente():
    data = request.get_json()

    Logradouro = data.get("nm_Logradouro")
    Bairro = data.get("nm_Bairro")
    Cidade = data.get("nm_Cidade")
    Estado = data.get("sg_Estado")
    CEP = data.get("cd_CEP")
    Nome = data.get("nm_Cliente")
    CPF = data.get("cd_CPF")
    Numero = data.get("cd_NumeroEndereco")
    Complemento = data.get("nm_Complemento")
    Telefone = data.get("cd_Telefone")
    Email = data.get("ds_Email")

    if len(CPF) > 11:
        queryCliente = """
        INSERT INTO Cliente (nm_Cliente, cd_CNPJ, cd_NumeroEndereco, ds_ComplementoEndereco, cd_Telefone, ds_Email, nm_Logradouro, nm_Bairro, nm_Cidade, sg_Estado, cd_CEP)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
    else:
        queryCliente = """
            INSERT INTO Cliente (nm_Cliente, cd_CPF, cd_NumeroEndereco, ds_ComplementoEndereco, cd_Telefone, ds_Email, nm_Logradouro, nm_Bairro, nm_Cidade, sg_Estado, cd_CEP)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

    try:
        valuesCliente = (Nome, CPF, Numero, Complemento, Telefone, Email, Logradouro, Bairro, Cidade, Estado, CEP)
        cursor.execute(queryCliente, valuesCliente)
        db.commit()
        return jsonify({"message": "Cliente inserido com sucesso!"}), 201
    except mysql.connector.Error as err:
        print("Erro:", err)
        return jsonify({"error": str(err)}), 500

@app.route("/get_processos", methods=["GET"])
def get_processos():

    only_numeros = request.args.get("only") == "id"

    if only_numeros:
        query = """SELECT cd_NumeroProcesso FROM Processo"""
        cursor.execute(query)
        result = cursor.fetchall()
        numeros = [row["cd_NumeroProcesso"] for row in result]
        return jsonify(numeros)
    
    Num_Processo = request.args.get("id_processo")
    Nome_Parte = request.args.get("parte")

    if Nome_Parte == "" or Num_Processo == "":
        query = """SELECT C.nm_Cliente, C.cd_Telefone, C.ds_Email, P.cd_Processo, P.cd_NumeroProcesso, 
                P.nm_Autor, P.nm_Reu, P.nm_Cidade, P.vl_Causa, P.ds_Juizo, P.ds_Acao, P.sg_Tribunal
                FROM Processo P
                JOIN Cliente_Processo CP ON CP.cd_Processo = P.cd_Processo
                JOIN Cliente C ON C.cd_Cliente = CP.cd_Cliente
                WHERE P.cd_NumeroProcesso = %s OR P.nm_Autor = %s OR P.nm_Reu = %s"""
        
        cursor.execute(query, (Num_Processo, Nome_Parte, Nome_Parte))
        result = cursor.fetchall()
        print(Nome_Parte)
        return jsonify(result)
    
    else:
        query = """SELECT C.nm_Cliente, C.cd_Telefone, C.ds_Email, P.cd_Processo, P.cd_NumeroProcesso, 
        P.nm_Autor, P.nm_Reu, P.nm_Cidade, P.vl_Causa, P.ds_Juizo, P.ds_Acao, P.sg_Tribunal
        FROM Processo P
        JOIN Cliente_Processo CP ON CP.cd_Processo = P.cd_Processo
        JOIN Cliente C ON C.cd_Cliente = CP.cd_Cliente
        WHERE P.cd_NumeroProcesso = %s AND (P.nm_Autor = %s OR P.nm_Reu = %s)"""
        cursor.execute(query, (Num_Processo, Nome_Parte, Nome_Parte))
        result = cursor.fetchall()
        return jsonify(result)
    

@app.route("/post_processo", methods=["POST"])
def post_processo():
    data = request.get_json()

    NumProcesso = data.get("cd_NumProcesso")
    NomeCliente = data.get("nm_Cliente")
    Posicao = data.get("opcaoCliente")
    Autor = data.get("nm_Autor")
    Reu = data.get("nm_Reu")
    Cidade = data.get("nm_Cidade")
    Causa = data.get("vl_Causa")
    Juizo = data.get("ds_Juizo")
    Acao = data.get("ds_Acao")
    Tribunal = data.get("sg_Tribunal")

    # Buscar cliente pelo nome no campo "Autor"
    query_cliente = "SELECT cd_Cliente FROM cliente WHERE nm_Cliente = %s;"
    cursor.execute(query_cliente, (NomeCliente,))
    resultado = cursor.fetchone()

    if not resultado:
        return jsonify({"error": "Cliente não encontrado."}), 400

    códigoCliente = resultado["cd_Cliente"]

    query_processo = """CALL Proc_Insercao_ProcessoCliente(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"""
    values = (NumProcesso, códigoCliente, Posicao, Autor, Reu, Juizo, Acao, Cidade, Tribunal, Causa)
    try:
        cursor.execute(query_processo, values)
        db.commit()
        return jsonify({"message": "Processo inserido com sucesso!"}), 201
    except mysql.connector.Error as err:
        print("Erro:", err)
        return jsonify({"error": str(err)}), 500
    

# Para os Cards da consulta
@app.route("/get_card", methods=["GET"])
def get_intimacao():

    Nome_Parte = request.args.get("parte")

    query = """SELECT I.dt_Recebimento, I.ds_Intimacao, I.cd_Processo, I.cd_Intimacao
            FROM Intimacao I
            JOIN Processo P ON P.cd_Processo = I.cd_Processo
            JOIN Cliente_Processo CP ON CP.cd_Processo = P.cd_Processo
            JOIN Cliente C ON C.cd_Cliente = CP.cd_Cliente
            WHERE C.nm_Cliente = %s"""
    try:
        cursor.execute(query, (Nome_Parte,))
        result = cursor.fetchall()
        return jsonify(result)
    except mysql.connector.Error as err:
        print("Erro nas intimações:", err)
        return jsonify({"erro ao buscar intimações": str(err)}), 500
    

# Para enviar os dados de Intimações/Tarefas
@app.route("/post_card", methods=["POST"])
def post_intimacao():
    data = request.get_json()

    intimacao = request.args.get("form") == "intimacao"
    tarefa = request.args.get("form") == "task"

    if intimacao:
        dataRecebimento = data.get("dataRecebimento")
        descrição = data.get("descricaoIntimacao")
        codigoProcesso = data.get("codigoProcesso")

        query = "INSERT INTO Intimacao (cd_Processo, dt_Recebimento, ds_Intimacao) VALUES (%s, %s, %s)"

        try:
            cursor.execute(query, (codigoProcesso, dataRecebimento, descrição,))
            db.commit()
            return jsonify({"message": "Intimação inserida com sucesso!"}), 201
        except mysql.connector.Error as err:
            print("Erro:", err)
            return jsonify({"erro": str(err)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")


## TODO: REMEMBER:

## METHODS=["POST"] = CREATE / INSERT   }   SQL
## METHODS=["GET"] = READ / SELECT      }   SQL
## METHODS=["PUT"] = UPDATE / UPDATE    }   SQL
## METHODS=["DELETE"] = DELETE / DELETE }   SQL