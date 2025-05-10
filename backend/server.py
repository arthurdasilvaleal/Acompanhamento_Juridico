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
cursor = db.cursor(dictionary=True)

@app.route("/get_clientes", methods=["GET"])
def get_clientes():

    query = """SELECT cd_Cliente, nm_Cliente, cd_CPF, cd_NumeroEndereco, ds_ComplementoEndereco, 
            cd_Telefone, ds_Email, nm_Logradouro, nm_Bairro, nm_Cidade, nm_Estado, cd_CEP
            FROM cliente"""
    cursor.execute(query)
    result = cursor.fetchall()
    return jsonify(result)

@app.route("/post_cliente", methods=["POST"])
def post_cliente():
    data = request.get_json()

    Logradouro = data.get("nm_Logradouro")
    Bairro = data.get("nm_Bairro")
    Cidade = data.get("nm_Cidade")
    Estado = data.get("nm_Estado")
    CEP = data.get("cd_CEP")
    Nome = data.get("nm_Cliente")
    CPF = data.get("cd_CPF")
    Numero = data.get("cd_NumeroEndereco")
    Complemento = data.get("nm_Complemento")
    Telefone = data.get("cd_Telefone")
    Email = data.get("ds_Email")

    # Inserindo os dados do Cliente
    queryCliente = """
        INSERT INTO Cliente (nm_Cliente, cd_CPF, cd_NumeroEndereco, ds_ComplementoEndereco, cd_Telefone, ds_Email, nm_Logradouro, nm_Bairro, nm_Cidade, nm_Estado, cd_CEP)
        VALUES (%s, %s, %s, %s, %s, %s, %s);
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
                JOIN Cliente C ON C.cd_Cliente = P.cd_Cliente
                WHERE P.cd_NumeroProcesso = %s OR P.nm_Autor = %s OR P.nm_Reu = %s"""
        
        cursor.execute(query, (Num_Processo, Nome_Parte, Nome_Parte,))
        result = cursor.fetchall()
        return jsonify(result)
    
    else:
        query = """SELECT C.nm_Cliente, C.cd_Telefone, C.ds_Email, P.cd_Processo, P.cd_NumeroProcesso, 
        P.nm_Autor, P.nm_Reu, P.nm_Cidade, P.vl_Causa, P.ds_Juizo, P.ds_Acao, P.sg_Tribunal
        FROM Processo P
        JOIN Cliente C ON C.cd_Cliente = P.cd_Cliente
        WHERE P.cd_NumeroProcesso = %s AND (P.nm_Autor = %s OR P.nm_Reu = %s)"""
        cursor.execute(query, (Num_Processo, Nome_Parte, Nome_Parte,))
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
    cursor.execute(query_cliente, (Autor, Reu,))
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

@app.route("/post_card", methods=["POST"])
def post_intimacao():
    data = request.get_json()


if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")