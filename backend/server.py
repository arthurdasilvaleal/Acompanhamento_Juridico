from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"]) # Resolve o erro do navegador bloquear a conexão

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="bd_aj"
)
cursor = db.cursor(dictionary=True)

@app.route("/clientes", methods=["GET"])
def get_clientes():

    query = "SELECT * FROM cliente;"
    cursor.execute(query)
    result = cursor.fetchall()
    return jsonify(result)


@app.route("/processo", methods=["POST"])
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

    query = """
        INSERT INTO processo (cd_NumProcesso, nm_Autor, nm_Reu, nm_Cidade, vl_Causa, ds_Juizo, ds_Acao, sg_Tribunal)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s);"""
    values = (NumProcesso, Autor, Reu, Cidade, Causa, Juizo, Acao, Tribunal)
    try:
        cursor.execute(query, values)
        db.commit()
        return jsonify({"message": "Processo inserido com sucesso!"}), 201
    except mysql.connector.Error as err:
        print("Erro:", err)
        return jsonify({"error": str(err)}), 500


if __name__ == "__main__":
    app.run(debug=True)