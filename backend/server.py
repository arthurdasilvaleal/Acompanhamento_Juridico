from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app, origins="*") # Resolve o erro do navegador bloquear a conexão

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="bd_aj"
)
cursor = db.cursor(dictionary=True)

@app.route("/get_clientes", methods=["GET"])
def get_clientes():

    query = """SELECT C.cd_Cliente, C.nm_Cliente, C.cd_CPF, C.cd_NumeroEndereco, C.ds_ComplementoEndereco, 
            C.cd_Telefone, C.ds_Email, E.nm_Logradouro, E.nm_Cidade, E.nm_Estado, E.cd_CEP
            FROM cliente C
            JOIN Endereco E ON E.cd_endereco = C.cd_Endereco"""
    cursor.execute(query)
    result = cursor.fetchall()
    return jsonify(result)

@app.route("/post_cliente", methods=["POST"])
def post_cliente():
    data = request.get_json()

    # Dados do endereço
    Logradouro = data.get("nm_Logradouro")
    Cidade = data.get("nm_Cidade")
    Estado = data.get("nm_Estado")
    CEP = data.get("cd_CEP")

    # Dados do cliente
    Nome = data.get("nm_Cliente")
    CPF = data.get("cd_CPF")
    Numero = data.get("cd_NumeroEndereco")
    Complemento = data.get("nm_Complemento")
    Telefone = data.get("cd_Telefone")
    Email = data.get("ds_Email")

    # Inserindo o endereço do cliente primeiro
    queryEndereco = """
        INSERT INTO Endereco (nm_Logradouro, nm_Cidade, nm_Estado, cd_CEP)
        VALUES (%s, %s, %s, %s);
        """
    valuesEndereco = (Logradouro, Cidade, Estado, CEP)

    # Inserindo os dados do Cliente
    queryCliente = """
        INSERT INTO Cliente (nm_Cliente, cd_CPF, cd_NumeroEndereco, ds_ComplementoEndereco, cd_Telefone, ds_Email, cd_Endereco)
        VALUES (%s, %s, %s, %s, %s, %s, %s);
        """

    try:
        cursor.execute(queryEndereco, valuesEndereco)
        db.commit()
        cd_Endereco = cursor.lastrowid  # Pega o ID do último endereço inserido
        valuesCliente = (Nome, CPF, Numero, Complemento, Telefone, Email, cd_Endereco)
        cursor.execute(queryCliente, valuesCliente)
        db.commit()
        return jsonify({"message": "Cliente inserido com sucesso!"}), 201
    except mysql.connector.Error as err:
        print("Erro:", err)
        return jsonify({"error": str(err)}), 500

@app.route("/get_processos", methods=["GET"])
def get_processos():

    processNumber = request.args.get("processNumber")
    
    if processNumber is not None:
        query = "SELECT cd_NumeroProcesso, cd_Processo FROM Processo"
        cursor.execute(query)
        numbers = [row[0] for row in cursor.fetchall()]
        return jsonify(numbers)

    query = """SELECT C.nm_Cliente, P.cd_Processo, P.cd_NumeroProcesso, P.nm_Autor, P.nm_Reu, P.nm_Cidade, P.vl_Causa, P.ds_Juizo, P.ds_Acao, P.sg_Tribunal
            FROM Processo P
            JOIN Cliente C ON C.cd_Cliente = P.cd_Cliente"""
    
    cursor.execute(query)
    result = cursor.fetchall()
    return jsonify(result)

@app.route("/post_processo", methods=["POST"])
def post_processo():
    data = request.get_json()

    NumProcesso = data.get("cd_NumProcesso")
    Autor = data.get("nm_Autor")
    Reu = data.get("nm_Reu")
    Cidade = data.get("nm_Cidade")
    Causa = data.get("vl_Causa")
    Juizo = data.get("ds_Juizo")
    Acao = data.get("ds_Acao")
    Tribunal = data.get("sg_Tribunal")

    # Buscar cliente pelo nome no campo "Autor"
    query_cliente = "SELECT cd_Cliente FROM cliente WHERE nm_Cliente = %s or nm_Cliente = %s;"
    cursor.execute(query_cliente, (Autor, Reu))
    resultado = cursor.fetchone()

    if not resultado:
        return jsonify({"error": f"Cliente {Autor} ou {Reu} não encontrado."}), 400

    códigoCliente = resultado["cd_Cliente"]

    query_processo = """
        INSERT INTO processo (cd_NumeroProcesso, nm_Autor, nm_Reu, nm_Cidade, vl_Causa, ds_Juizo, ds_Acao, sg_Tribunal, cd_Cliente)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);"""
    values = (NumProcesso, Autor, Reu, Cidade, Causa, Juizo, Acao, Tribunal, códigoCliente)
    try:
        cursor.execute(query_processo, values)
        db.commit()
        return jsonify({"message": "Processo inserido com sucesso!"}), 201
    except mysql.connector.Error as err:
        print("Erro:", err)
        return jsonify({"error": str(err)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")