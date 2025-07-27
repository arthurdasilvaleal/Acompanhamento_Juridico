from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app) # Resolve o erro do navegador bloquear a conexão

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="BD_AJ"
)
# Se o usuário sair da aba muito rápido, causa um erro... fix that
# cursor = db.cursor(dictionary=True) Dicionario global(DEPRECATED)

# Para o Login
@app.route("/submit_login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("Login")
    password = data.get("Pass")
    cursor = db.cursor(dictionary=True)

    query = """SELECT cd_Colaborador, nm_Colaborador, nm_TipoColaborador FROM Colaborador C
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
    cursor = db.cursor(dictionary=True)

    query = """INSERT INTO Colaborador (nm_Colaborador, cd_CPF, nm_Logradouro, nm_Bairro, 
            nm_Cidade, sg_Estado, cd_CEP, cd_NumeroEndereco, ds_ComplementoEndereco, 
            cd_Telefone, ds_Email, nm_Usuario, ds_Senha, cd_TipoColaborador)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, SHA2(%s, 256), %s)"""
    try:
        cursor.execute(query, (Nome, CPF, Endereco, Bairro, Cidade, Estado, CEP, NumeroEnd, Complemento, Telefone, Email, Usuario, Senha, TipoColaborador))
        db.commit()
        return jsonify({"message": "Colaborador cadastrado"}), 201
    except mysql.connector.Error as err:
        print("Erro em '/post_cadastro': ", err)
        return jsonify({"error": str(err)}), 500


# Consultar nome dos clientes
@app.route("/get_clientes", methods=["GET"])
def get_clientes():

    cursor = db.cursor(dictionary=True)
    query = "SELECT cd_Cliente, nm_Cliente FROM Cliente"
    
    try:
        cursor.execute(query)
        result = cursor.fetchall()
        return jsonify(result)
    except mysql.connector.Error as Err:
        print("Erro em 'get_clientes'", Err)
        return jsonify({"error": str(Err)}), 500

# Consultar dados de TODOS os clientes
@app.route("/get_Allclientes", methods=["GET"])
def get_Allclientes():
    
    cursor = db.cursor(dictionary=True)
    query = """SELECT
                c.cd_Cliente,
                c.nm_Cliente,
                c.cd_CPF,
                c.cd_CNPJ,
                c.nm_Logradouro,
                c.cd_NumeroEndereco,
                c.nm_Bairro,
                c.nm_Cidade,
                c.sg_Estado, 
                c.cd_CEP,
                c.cd_Telefone,
                c.ds_Email,
                c.ds_ComplementoEndereco,
                GROUP_CONCAT(p.cd_NumeroProcesso SEPARATOR ' @ ') AS 'cd_numProcessos'
            FROM Cliente c
            LEFT JOIN Cliente_Processo cp ON cp.cd_Cliente = c.cd_Cliente
            LEFT JOIN Processo p ON cp.cd_Processo = p.cd_Processo
            GROUP BY
                c.cd_cliente,
                c.nm_Cliente, 
                c.cd_CPF, 
                c.cd_CNPJ,
                c.nm_Logradouro,
                c.cd_NumeroEndereco,
                c.nm_Bairro,
                c.nm_Cidade,
                c.sg_Estado,
                c.cd_CEP,
                c.cd_Telefone,
                c.ds_ComplementoEndereco,
                c.ds_Email"""

    try:
        cursor.execute(query)
        result = cursor.fetchall()
        return jsonify(result)
    
    except mysql.connector.Error as err:
        print("\n\nErro em 'get_Allclientes':", err)
        return jsonify({"error": str(err)}), 500
    
    
# Cadastrar Clientes
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
    cursor = db.cursor(dictionary=True)

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
        return jsonify({"message": "Cliente alterado com sucesso!"}), 201
    except mysql.connector.Error as err:
        print("\n\nErro em 'post_cliente':", err)
        return jsonify({"error": str(err)}), 500

# Editar um cliente
@app.route("/put_cliente", methods=["PUT"])
def put_cliente():
    data = request.get_json()

    Codigo = data.get("cd_Cliente")
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
    cursor = db.cursor(dictionary=True)

    if len(CPF) > 11:
        query = """CALL SP_Update_Cliente(%s, %s, null, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    else:
        query = """CALL SP_Update_Cliente(%s, %s, %s, null, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    
    try:
        valuesCliente = (Codigo, Nome, CPF, Logradouro, Bairro, Cidade, Estado, CEP, Numero, Complemento, Telefone, Email)
        cursor.execute(query, valuesCliente)
        db.commit()
        return jsonify({"message": "Cliente editado com sucesso!"}), 201
    except mysql.connector.Error as err:
        print("\n\nErro '/put_cliente':", err)
        return jsonify({"error": str(err)}), 500
    
# Para deletar um cliente
@app.route("/delete_cliente", methods=["DELETE"])
def delete_cliente(): 

    cdCliente = request.get_json().get("DeleteCliente")
    cursor = db.cursor(dictionary=True)

    try:
        cursor.callproc("SP_Delete_Cliente", [cdCliente])
        db.commit()
        return jsonify({"message": "Cliente removido com sucesso!"}), 201
    except mysql.connector.Error as err:
        print("\n\nErro em '/delete_cliente':", err)
        return jsonify({"error": str(err)}), 500

# Pegar os numeros dos processos bem como todos os dados do processo ou parte buscados
@app.route("/get_processos", methods=["GET"])
def get_processos():

    only_numeros = request.args.get("only") == "id"
    cursor = db.cursor(dictionary=True)

    if only_numeros:
        query = """SELECT cd_NumeroProcesso FROM Processo"""
        try:
            cursor.execute(query)
            result = cursor.fetchall()
            numeros = [row["cd_NumeroProcesso"] for row in result]
            return jsonify(numeros)
        except mysql.connector.Error as Err:
            return jsonify(Err)
    
    Num_Processo = request.args.get("id_processo")
    Nome_Parte = request.args.get("parte")

    if Nome_Parte == "" or Num_Processo == "":
        query = """SELECT C.cd_Cliente, C.nm_Cliente, C.cd_Telefone, C.ds_Email, P.cd_Processo, P.cd_NumeroProcesso, 
                P.nm_Autor, P.nm_Reu, P.nm_Cidade, P.vl_Causa, P.ds_Juizo, P.ds_Acao, P.sg_Tribunal, P.cd_FaseProcesso
                FROM Processo P
                JOIN Cliente_Processo CP ON CP.cd_Processo = P.cd_Processo
                JOIN Cliente C ON C.cd_Cliente = CP.cd_Cliente
                WHERE P.cd_NumeroProcesso = %s OR P.nm_Autor = %s OR P.nm_Reu = %s OR C.nm_Cliente = %s"""
        
        cursor.execute(query, (Num_Processo, Nome_Parte, Nome_Parte, Nome_Parte))
        result = cursor.fetchall()
        print(Nome_Parte)
        return jsonify(result)
    
    else:
        query = """SELECT C.cd_Cliente, C.nm_Cliente, C.cd_Telefone, C.ds_Email, P.cd_Processo, P.cd_NumeroProcesso, 
        P.nm_Autor, P.nm_Reu, P.nm_Cidade, P.vl_Causa, P.ds_Juizo, P.ds_Acao, P.sg_Tribunal
        FROM Processo P
        JOIN Cliente_Processo CP ON CP.cd_Processo = P.cd_Processo
        JOIN Cliente C ON C.cd_Cliente = CP.cd_Cliente
        WHERE P.cd_NumeroProcesso = %s AND (P.nm_Autor = %s OR P.nm_Reu = %s OR C.nm_Cliente = %s)"""
        cursor.execute(query, (Num_Processo, Nome_Parte, Nome_Parte, Nome_Parte))
        result = cursor.fetchall()
        return jsonify(result)

# Cadastrar um processo
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
    cursor = db.cursor(dictionary=True)

    # Buscar cliente pelo nome no campo "Autor"
    query_cliente = "SELECT cd_Cliente FROM Cliente WHERE nm_Cliente = %s;"
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
        print("\n\nErro em 'post_processo':", err)
        return jsonify({"error": str(err)}), 500
    
#Para editar um processo
@app.route("/put_processo", methods=["PUT"])
def put_processo():

    data = request.get_json()

    Codigo = data.get("cd_Processo")
    NumProcesso = data.get("cd_NumProcesso")
    CodClienteNovo = data.get("cd_ClienteNovo")
    CodClienteAntigo = data.get("cd_ClienteAntigo")
    Posicao = data.get("opcaoCliente")
    Autor = data.get("nm_Autor")
    Reu = data.get("nm_Reu")
    Cidade = data.get("nm_Cidade")
    Causa = data.get("vl_Causa")
    Juizo = data.get("ds_Juizo")
    Acao = data.get("ds_Acao")
    Tribunal = data.get("sg_Tribunal")
    Fase = data.get("cd_FaseProcesso")
    cursor = db.cursor(dictionary=True)

    query = """CALL SP_Update_Processo(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"""
    
    values = (Codigo, CodClienteAntigo, CodClienteNovo, Posicao, NumProcesso, Autor, Reu, Juizo, Acao, Cidade, Tribunal, Causa, Fase)
    
    try:
        cursor.execute(query, values)
        db.commit()
        return jsonify({"message": "Processo editado com sucesso!", "Valores": values}), 201
    except mysql.connector.Error as err:
        print("\n\nErro em 'put_processo':", err)
        return jsonify({"error": str(err)}), 500

# Para deletar um processo
@app.route("/delete_processo", methods=["DELETE"])
def delete_processo():

    cursor = db.cursor(dictionary=True)
    cdProcesso = request.get_json().get("deleteProcess")

    try:
        cursor.callproc("SP_Delete_Processo", [cdProcesso])
        db.commit()
        return jsonify({"message": "Processo deletado com sucesso!", "Processo": cdProcesso}), 201
    except mysql.connector.Error as err:
        print("\n\nErro em 'delete_processo':", err)
        return jsonify({"error": str(err)}), 500

# Para os Cards da consulta de processos
@app.route("/get_cardInt", methods=["GET"])
def get_intimacao():

    Nome_Parte = request.args.get("parte")
    Numero_Processo = request.args.get("numeroProcesso")
    cursor = db.cursor(dictionary=True)

    
    if Nome_Parte == "":
        query = """SELECT I.dt_Recebimento, I.ds_Intimacao, I.cd_Processo, I.cd_Intimacao
        FROM Intimacao I
        JOIN Processo P ON I.cd_Processo = P.cd_Processo
        WHERE P.cd_NumeroProcesso = %s"""
        values = (Numero_Processo,)
    elif Nome_Parte != "" and Numero_Processo != "":
        query = """SELECT I.dt_Recebimento, I.ds_Intimacao, I.cd_Processo, I.cd_Intimacao
                FROM Intimacao I
                JOIN Processo P ON P.cd_Processo = I.cd_Processo
                JOIN Cliente_Processo CP ON CP.cd_Processo = P.cd_Processo
                JOIN Cliente C ON C.cd_Cliente = CP.cd_Cliente
                WHERE P.cd_NumeroProcesso = %s AND (
                P.nm_Autor = %s OR
                P.nm_Reu = %s OR
                C.nm_Cliente = %s)"""
        values = (Numero_Processo, Nome_Parte, Nome_Parte, Nome_Parte) 
    else:
        query = """SELECT I.dt_Recebimento, I.ds_Intimacao, I.cd_Processo, I.cd_Intimacao
                FROM Intimacao I
                JOIN Processo P ON P.cd_Processo = I.cd_Processo
                JOIN Cliente_Processo CP ON CP.cd_Processo = P.cd_Processo
                JOIN Cliente C ON C.cd_Cliente = CP.cd_Cliente
                WHERE C.nm_Cliente = %s"""
        values = (Nome_Parte, )

    try:
        cursor.execute(query, values)
        result = cursor.fetchall()
        return jsonify(result)
    except mysql.connector.Error as err:
        print("\n\nErro em '/get_cardInt':", err)
        return jsonify({"erro ao buscar intimações": str(err)}), 500

# Buscar Tarefas
@app.route("/get_cardTask", methods=["GET"])
def get_Task():

    Nome_Parte = request.args.get("parte")
    Numero_Processo = request.args.get("numeroProcesso")
    cursor = db.cursor(dictionary=True)

    if Nome_Parte == "":
        query = """SELECT T.cd_Tarefa, T.cd_Intimacao, T.dt_Registro, T.dt_Prazo,
                T.cd_Colaborador, T.cd_StatusTarefa, T.nm_TipoTarefa, T.ds_Tarefa,
                C.nm_Colaborador
                FROM Tarefa T
                JOIN Intimacao I ON I.cd_Intimacao = T.cd_Intimacao
                JOIN Processo P ON P.cd_Processo = I.cd_Processo
                JOIN Colaborador C ON C.cd_Colaborador = T.cd_Colaborador
                WHERE P.cd_NumeroProcesso = %s"""
        values = (Numero_Processo,)
    elif Nome_Parte != "" and Numero_Processo != "":
        query = """SELECT T.cd_Tarefa, T.cd_Intimacao, T.dt_Registro, T.dt_Prazo,
                T.cd_Colaborador, T.cd_StatusTarefa, T.nm_TipoTarefa, T.ds_Tarefa,
                Co.nm_Colaborador
                FROM Tarefa T
                JOIN Intimacao I ON I.cd_Intimacao = T.cd_Intimacao
                JOIN Processo P ON P.cd_Processo = I.cd_Processo
                JOIN Cliente_Processo CP ON CP.cd_Processo = P.cd_Processo
                JOIN Cliente C ON C.cd_Cliente = CP.cd_Cliente
                JOIN Colaborador Co ON Co.cd_Colaborador = T.cd_Colaborador
                WHERE P.cd_NumeroProcesso = %s AND (
                P.nm_Autor = %s OR
                P.nm_Reu = %s OR
                C.nm_Cliente = %s)"""
        values = (Numero_Processo, Nome_Parte, Nome_Parte, Nome_Parte) 
    else:
        query = """SELECT T.cd_Tarefa, T.cd_Intimacao, T.dt_Registro, T.dt_Prazo,
                T.cd_Colaborador, T.cd_StatusTarefa, T.nm_TipoTarefa, T.ds_Tarefa,
                Co.nm_Colaborador
                FROM Tarefa T
                JOIN Intimacao I ON I.cd_Intimacao = T.cd_Intimacao
                JOIN Processo P ON P.cd_Processo = I.cd_Processo
                JOIN Cliente_Processo CP ON CP.cd_Processo = P.cd_Processo
                JOIN Cliente C ON C.cd_Cliente = CP.cd_Cliente
                JOIN Colaborador Co ON Co.cd_Colaborador = T.cd_Colaborador
                WHERE C.nm_Cliente = %s"""
        values = (Nome_Parte, )

    try:
        cursor.execute(query, values)
        result = cursor.fetchall()
        return jsonify(result)
    except mysql.connector.Error as err:
        print("\n\nErro em '/get_cardTask' tarefas:", err)
        return jsonify({"erro ao buscar tarefas": str(err)}), 500

# Para atualizar as tarefas
@app.route("/put_cardTask", methods=["PUT"])
def put_cardTask():

    data = request.get_json()
    cursor = db.cursor(dictionary=True)

    dt_Prazo = data.get("dtPrazo")
    cd_Status = data.get("cdStatus")
    ds_Tarefa = data.get("dsTarefa")
    cd_Tarefa = data.get("cdTarefa")
    values = (dt_Prazo, cd_Status, ds_Tarefa, cd_Tarefa)

    query = """UPDATE Tarefa
            SET dt_Prazo = %s, cd_StatusTarefa = %s, ds_Tarefa = %s
            WHERE cd_Tarefa = %s;"""
    
    try:
        cursor.execute(query, values)
        db.commit()
        return jsonify({"message": "Tarefa editada com sucesso!", "Values": values}), 201
    except mysql.connector.Error as err:
        print("\n\nErro '/put_cardTask':", err)
        return jsonify({"error": str(err)}), 500
        


# Para enviar os dados de Intimações/Tarefas
@app.route("/post_card", methods=["POST"])
def post_intimacao():
    data = request.get_json()

    intimacao = request.args.get("form") == "intimacao"
    tarefa = request.args.get("form") == "task"
    cursor = db.cursor(dictionary=True)

    if intimacao:
        dataRecebimento = data.get("dataRecebimento")
        descrição = data.get("descricaoIntimacao")
        codigoProcesso = data.get("codigoProcesso")
        codigoColaborador = data.get("idColaborador")

        query = "INSERT INTO Intimacao (cd_Processo, dt_Recebimento, ds_Intimacao, cd_Colaborador) VALUES (%s, %s, %s, %s)"

        try:
            cursor.execute(query, (codigoProcesso, dataRecebimento, descrição, codigoColaborador,))
            db.commit()
            return jsonify({"message": "Intimação inserida com sucesso!"}), 201
        except mysql.connector.Error as err:
            print("\n\nErro em '/post_card' postando intimação:", err)
            return jsonify({"Erro": str(err)}), 500
    
    if tarefa:
        idIntimacao = data.get("idIntimacao")
        DataRecebimento = data.get("DataRecebimento")
        dataPrazo = data.get("dataPrazo")
        idColaborador = data.get("idColaborador")
        StatusTarefa = data.get("StatusTarefa")
        DescricaoTarefa = data.get("DescricaoTarefa")

        query = """INSERT INTO Tarefa (cd_Intimacao, dt_Registro, dt_Prazo, cd_Colaborador, cd_StatusTarefa, ds_Tarefa) 
                VALUES (%s, %s, %s, %s, %s, %s)"""
        
        try:
            cursor.execute(query, (idIntimacao, DataRecebimento, dataPrazo, idColaborador, StatusTarefa, DescricaoTarefa,))
            db.commit()
            return jsonify({"message": "Tarefa inserida com sucesso!"}), 201
        except mysql.connector.Error as err:
            print("\n\nErro em 'post_card' postando tarefa:", err)
            return jsonify({"error": str(err)}), 500

# Para a tela de visão Geral
@app.route("/get_MainInfo", methods=["GET"])
def get_MainInfo():

    cursor = db.cursor(dictionary=True)
    query = """
        SELECT
            (SELECT COUNT(*) AS qtd_Processo FROM Processo) AS qtd_Processo,
            (SELECT COUNT(*) AS qtd_ProcessoFase1 FROM Processo WHERE cd_FaseProcesso = 1) AS qtd_ProcessoFase1,
            (SELECT COUNT(*) AS qtd_ProcessoFase2 FROM Processo WHERE cd_FaseProcesso = 2) AS qtd_ProcessoFase2,
            (SELECT COUNT(*) AS qtd_ProcessoFase3 FROM Processo WHERE cd_FaseProcesso = 3) AS qtd_ProcessoFase3,
            (SELECT COUNT(*) AS qtd_ProcessoFase4 FROM Processo WHERE cd_FaseProcesso = 4) AS qtd_ProcessoFase4,
            (SELECT COUNT(*) AS qtd_ProcessoFase5 FROM Processo WHERE cd_FaseProcesso = 5) AS qtd_ProcessoFase5,
            (SELECT COUNT(*) AS qtd_TarefaFase1 FROM Tarefa WHERE cd_StatusTarefa = 1) AS qtd_TarefaStatus1,
            (SELECT COUNT(*) AS qtd_TarefaFase2 FROM Tarefa WHERE cd_StatusTarefa = 2) AS qtd_TarefaStatus2,
            (SELECT COUNT(*) AS qtd_TarefaFase3 FROM Tarefa WHERE cd_StatusTarefa = 3) AS qtd_TarefaStatus3;


        """

    # query = """SELECT COUNT(*) AS qtd_Processo FROM Processo;
    #         SELECT COUNT(*) AS qtd_ProcessoFase1 FROM Processo WHERE cd_FaseProcesso = 1;"""

    try:
        # cursor.execute(query, multi=True) # Para mais de uma consulta

        # results = []
        # for result in cursor:
        #     data = result.fetchall()
        #     results.append(data)

        # return jsonify({
        #     "qtd_Processo": results[0][0]["qtd_Processo"],
        #     "qtd_ProcessoFase1": results[1][0]["qtd_ProcessoFase1"]
        # })

        cursor.execute(query)
        result = cursor.fetchone()
        return jsonify(result)
    except mysql.connector.Error as Err:
        print("\n\nErro em 'get_MainInfo':", Err)
        return jsonify({"error": str(Err)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")


## TODO: REMEMBER:

## METHODS=["POST"] = CREATE / INSERT   }   SQL
## METHODS=["GET"] = READ / SELECT      }   SQL
## METHODS=["PUT"] = UPDATE / UPDATE    }   SQL
## METHODS=["DELETE"] = DELETE / DELETE }   SQL