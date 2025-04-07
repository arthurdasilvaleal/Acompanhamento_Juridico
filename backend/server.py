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



if __name__ == "__main__":
    app.run(debug=True)