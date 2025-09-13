from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from fpdf import FPDF
import io
import mysql.connector

# Para o loop de inserção de dados automáticos
import threading, time, random, requests
from datetime import datetime, timedelta

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

# Adicionando dados automáticos(útil para o dashboard - DESATIVAR EM PRODUÇÃO!!!!!!!!)
FillRandomDataTask = False
MainRole = ""

def Submit_Random_Task():

    cursor = db.cursor(dictionary=True)

    query = "SELECT COUNT(*) FROM Intimacao"
    cursor.execute(query)
    result = cursor.fetchone()
    total_int = result["COUNT(*)"]

    query2 = "SELECT COUNT(*) FROM Colaborador"
    cursor.execute(query2)
    result2 = cursor.fetchone()
    total_worker = result2["COUNT(*)"]

    ultimo_estado = None

    while True:
        if FillRandomDataTask:
            if ultimo_estado != True:
                print(f"[{datetime.now().strftime('%H:%M:%S')}] Envio automático ativado")
                ultimo_estado = True

            if MainRole == "task":
                TaskData = {
                    "idIntimacao": random.randint(1, total_int),
                    "DataRecebimento": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    "dataPrazo": (datetime.now() + timedelta(days=random.randint(-180, 300))).strftime('%Y-%m-%d'),
                    "idColaborador": random.randint(1, total_worker),
                    "StatusTarefa": random.choice([1, 2, 3]),
                    "DescricaoTarefa": f"Tarefa automática {random.randint(1000, 9999)}",
                    "idTipoTarefa": random.randint(1, 4)
                }

                try:
                    response = requests.post("http://192.168.100.3:5000/post_card?form=task", json=TaskData)
                    print(f"[{datetime.now().strftime('%H:%M:%S')}] Tarefa enviada: {response.status_code} - {response.json()}")
                except Exception as e:
                    print(f"[{datetime.now().strftime('%H:%M:%S')}] ERRO ao enviar tarefa: {e}")
            else:
                IntData = {
                    
                }

                print("MainRole diferente de task. Ignorando o envio.")
        else:
            if ultimo_estado != False:
                print(f"[{datetime.now().strftime('%H:%M:%S')}] Envio automático desativado")
                ultimo_estado = False
        
        time.sleep(random.randint(10, 30))

@app.route("/activate_AutoSubmit", methods=["POST"])
def ativar_envio():

    data = request.get_json()

    Activate = data.get("activate")
    role = data.get("role")

    global MainRole, FillRandomDataTask

    if Activate:
        MainRole = role
        FillRandomDataTask = True
        return jsonify({"mensagem": "Envio automático ATIVADO", "Arg": Activate}), 200
    else:
        FillRandomDataTask = False
        return jsonify({"mensagem": "Envio automático DESATIVADO", "Arg": Activate}), 200
 
# Adicionando dados automáticos(útil para o dashboard - DESATIVAR EM PRODUÇÃO!!!!!!!!)


# Para o Login
@app.route("/submit_login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("Login")
    password = data.get("Pass")
    cursor = db.cursor(dictionary=True)

    query = """SELECT cd_Colaborador, nm_Colaborador, nm_TipoColaborador, C.cd_TipoColaborador FROM Colaborador C
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
                T.cd_Colaborador, T.cd_StatusTarefa, T.ds_Tarefa, T.cd_TipoTarefa,
                C.nm_Colaborador, TP.nm_TipoTarefa
                FROM Tarefa T
                JOIN TipoTarefa TP ON TP.cd_TipoTarefa = T.cd_TipoTarefa
                JOIN Intimacao I ON I.cd_Intimacao = T.cd_Intimacao
                JOIN Processo P ON P.cd_Processo = I.cd_Processo
                JOIN Colaborador C ON C.cd_Colaborador = T.cd_Colaborador
                WHERE P.cd_NumeroProcesso = %s"""
        values = (Numero_Processo,)
    elif Nome_Parte != "" and Numero_Processo != "":
        query = """SELECT T.cd_Tarefa, T.cd_Intimacao, T.dt_Registro, T.dt_Prazo,
                T.cd_Colaborador, T.cd_StatusTarefa, T.ds_Tarefa, T.cd_TipoTarefa,
                Co.nm_Colaborador, TP.nm_TipoTarefa
                FROM Tarefa T
                JOIN TipoTarefa TP ON TP.cd_TipoTarefa = T.cd_TipoTarefa
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
                T.cd_Colaborador, T.cd_StatusTarefa, T.ds_Tarefa, T.cd_TipoTarefa,
                Co.nm_Colaborador, TP.nm_TipoTarefa
                FROM Tarefa T
                JOIN TipoTarefa TP ON TP.cd_TipoTarefa = T.cd_TipoTarefa
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

        query = "INSERT INTO Intimacao (cd_Processo, dt_Recebimento, ds_Intimacao) VALUES (%s, %s, %s)"

        try:
            cursor.execute(query, (codigoProcesso, dataRecebimento, descrição,))
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
        CodigoTipoTarefa = data.get("idTipoTarefa")

        query = """INSERT INTO Tarefa (cd_Intimacao, dt_Registro, dt_Prazo, cd_Colaborador, cd_StatusTarefa, ds_Tarefa, cd_TipoTarefa) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)"""
        
        try:
            cursor.execute(query, (idIntimacao, DataRecebimento, dataPrazo, idColaborador, StatusTarefa, DescricaoTarefa, CodigoTipoTarefa,))
            db.commit()
            return jsonify({"message": "Tarefa inserida com sucesso!"}), 201
        except mysql.connector.Error as err:
            print("\n\nErro em 'post_card' postando tarefa:", err)
            return jsonify({"error": str(err)}), 500

# Para a tela de visão Geral
@app.route("/get_MainInfo", methods=["GET"])
def get_MainInfo():

    cursor = db.cursor(dictionary=True)
    colaborador = request.args.get("colaborador")

    query = """
        SELECT
            (SELECT COUNT(*) FROM Processo) AS qtd_Processo,
            (SELECT COUNT(*) FROM Processo WHERE cd_FaseProcesso = 1) AS Conhecimento,
            (SELECT COUNT(*) FROM Processo WHERE cd_FaseProcesso = 2) AS Recursal,
            (SELECT COUNT(*) FROM Processo WHERE cd_FaseProcesso = 3) AS Execução,
            (SELECT COUNT(*) FROM Processo WHERE cd_FaseProcesso = 4) AS Finalizado,
            (SELECT COUNT(*) FROM Processo WHERE cd_FaseProcesso = 5) AS Cancelado,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_StatusTarefa = 1) AS Aguardando,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_StatusTarefa = 2) AS Em_andamento,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_StatusTarefa = 3) AS Concluido,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 1) AS qtd_MyTaskByMonth1,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 2) AS qtd_MyTaskByMonth2,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 3) AS qtd_MyTaskByMonth3,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 4) AS qtd_MyTaskByMonth4,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 5) AS qtd_MyTaskByMonth5,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 6) AS qtd_MyTaskByMonth6,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 7) AS qtd_MyTaskByMonth7,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 8) AS qtd_MyTaskByMonth8,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 9) AS qtd_MyTaskByMonth9,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 10) AS qtd_MyTaskByMonth10,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 11) AS qtd_MyTaskByMonth11,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 12) AS qtd_MyTaskByMonth12,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 1 AND cd_StatusTarefa = 3) AS qtdF_MyTaskByMonth1,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 2 AND cd_StatusTarefa = 3) AS qtdF_MyTaskByMonth2,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 3 AND cd_StatusTarefa = 3) AS qtdF_MyTaskByMonth3,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 4 AND cd_StatusTarefa = 3) AS qtdF_MyTaskByMonth4,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 5 AND cd_StatusTarefa = 3) AS qtdF_MyTaskByMonth5,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 6 AND cd_StatusTarefa = 3) AS qtdF_MyTaskByMonth6,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 7 AND cd_StatusTarefa = 3) AS qtdF_MyTaskByMonth7,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 8 AND cd_StatusTarefa = 3) AS qtdF_MyTaskByMonth8,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 9 AND cd_StatusTarefa = 3) AS qtdF_MyTaskByMonth9,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 10 AND cd_StatusTarefa = 3) AS qtdF_MyTaskByMonth10,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 11 AND cd_StatusTarefa = 3) AS qtdF_MyTaskByMonth11,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 12 AND cd_StatusTarefa = 3) AS qtdF_MyTaskByMonth12,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 1 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_MyTaskByMonth1,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 2 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_MyTaskByMonth2,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 3 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_MyTaskByMonth3,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 4 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_MyTaskByMonth4,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 5 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_MyTaskByMonth5,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 6 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_MyTaskByMonth6,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 7 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_MyTaskByMonth7,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 8 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_MyTaskByMonth8,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 9 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_MyTaskByMonth9,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 10 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_MyTaskByMonth10,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 11 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_MyTaskByMonth11,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND MONTH(dt_Registro) = 12 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_MyTaskByMonth12,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 1) AS qtd_TaskByMonth1,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 2) AS qtd_TaskByMonth2,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 3) AS qtd_TaskByMonth3,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 4) AS qtd_TaskByMonth4,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 5) AS qtd_TaskByMonth5,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 6) AS qtd_TaskByMonth6,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 7) AS qtd_TaskByMonth7,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 8) AS qtd_TaskByMonth8,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 9) AS qtd_TaskByMonth9,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 10) AS qtd_TaskByMonth10,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 11) AS qtd_TaskByMonth11,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 12) AS qtd_TaskByMonth12,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 1 AND cd_StatusTarefa = 3) AS qtdF_TaskByMonth1,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 2 AND cd_StatusTarefa = 3) AS qtdF_TaskByMonth2,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 3 AND cd_StatusTarefa = 3) AS qtdF_TaskByMonth3,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 4 AND cd_StatusTarefa = 3) AS qtdF_TaskByMonth4,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 5 AND cd_StatusTarefa = 3) AS qtdF_TaskByMonth5,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 6 AND cd_StatusTarefa = 3) AS qtdF_TaskByMonth6,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 7 AND cd_StatusTarefa = 3) AS qtdF_TaskByMonth7,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 8 AND cd_StatusTarefa = 3) AS qtdF_TaskByMonth8,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 9 AND cd_StatusTarefa = 3) AS qtdF_TaskByMonth9,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 10 AND cd_StatusTarefa = 3) AS qtdF_TaskByMonth10,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 11 AND cd_StatusTarefa = 3) AS qtdF_TaskByMonth11,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 12 AND cd_StatusTarefa = 3) AS qtdF_TaskByMonth12,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 1 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_TaskByMonth1,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 2 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_TaskByMonth2,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 3 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_TaskByMonth3,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 4 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_TaskByMonth4,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 5 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_TaskByMonth5,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 6 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_TaskByMonth6,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 7 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_TaskByMonth7,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 8 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_TaskByMonth8,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 9 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_TaskByMonth9,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 10 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_TaskByMonth10,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 11 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_TaskByMonth11,
            (SELECT COUNT(*) FROM Tarefa WHERE MONTH(dt_Registro) = 12 AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_TaskByMonth12,
            (SELECT COUNT(*) FROM Tarefa WHERE cd_Colaborador = %s AND cd_StatusTarefa = 3) AS qtd_MyTaskFinished;
        """
    try:
        cursor.execute(query, (colaborador, colaborador, colaborador, colaborador, colaborador, 
            colaborador, colaborador, colaborador, colaborador, colaborador, colaborador, colaborador, 
            colaborador, colaborador, colaborador, colaborador, colaborador, colaborador, colaborador, 
            colaborador, colaborador, colaborador, colaborador, colaborador, colaborador, colaborador,
            colaborador, colaborador, colaborador, colaborador, colaborador, colaborador, colaborador, 
            colaborador, colaborador, colaborador, colaborador,))
        result = cursor.fetchone()
        return jsonify(result)
    except mysql.connector.Error as Err:
        print("\n\nErro em 'get_MainInfo':", Err)
        return jsonify({"error": str(Err)}), 500

@app.route("/generate_pdf", methods=["POST"])
def generate_pdf():

    data = request.get_json()
    cursor = db.cursor(dictionary=True)

    PrimeiroFiltro = data.get("FilterOne") 
    SegundoFiltro = data.get("FilterTwo")
    TerceiroFiltro = data.get("FilterThree")

    # Ajudstando o PDF
    class PDF(FPDF):
        def header(self):
            # Inserir imagem (x, y, largura)
            if self.page_no() == 1:
                # Logo
                self.image("../frontend/src/Images/logo.png", 10, 8, 40)  

                # Move o cursor abaixo da imagem
                self.set_y(30)

                # Título
                self.set_font("Arial", "B", 16)
                self.cell(0, 10, "Sistema de Acompanhamento Jurídico", ln=1, align="R")
                self.set_font("Arial", "", 12)
                self.cell(0, 8, "Relatório de Clientes e Processos", ln=1, align="R")
                self.ln(3)

                # Linha separadora
                self.set_draw_color(0, 0, 0)  # cor preta
                self.set_line_width(0.5)      # espessura da linha
                self.line(10, self.get_y(), 200, self.get_y())  # x1, y1, x2, y2
                self.ln(10)  # espaço após a linha

        def footer(self):
            # Número da página no rodapé
            self.set_y(-15)
            self.set_font("Arial", "I", 8)
            self.cell(0, 10, f"Página {self.page_no()}", align="C")

    # (*DEPRECATED*)
    # query = "SELECT * FROM Tarefa WHERE 1=1" # WHERE 1=1: Truque para definir a clausula AND depois
    # params = []

    # if filtro_colaborador:
    #     query += " AND cd_Colaborador = %s"
    #     params.append(filtro_colaborador)

    # if filtro_status:
    #     query += " AND cd_StatusTarefa = %s"
    #     params.append(filtro_status)

    cursor.execute("CALL PDFDownloadCase(%s, %s, %s)", (PrimeiroFiltro, SegundoFiltro, TerceiroFiltro))
    result = cursor.fetchall()
    Title = ""

    # Delegação dos Filtros
    # 1 = "Processos"
    # 2 = "Clientes"
    # 3 = "Colaboradores"

    print(PrimeiroFiltro, SegundoFiltro, TerceiroFiltro)

    match PrimeiroFiltro:
        case 1:
            Title = "Still lefting"
        case 2:
            if SegundoFiltro == 1:
                Title = "Relatório de Todos os clientes"
            elif SegundoFiltro == 3:
                Title = f"Relatório do {(TerceiroFiltro)}"
        case _:   
            Title = "Error"

    # Criar PDF
    pdf = PDF()
    pdf.add_page()
    pdf.set_font("Arial", "B", 12)
    pdf.cell(0, 10, Title, ln=True, align="C")
    pdf.ln(5)

    if PrimeiroFiltro == 2 and (SegundoFiltro == 1 or SegundoFiltro == 3):
        # Loop de clientes
        pdf.set_font("Arial", size=10)
        for t in result:
            pdf.set_font("Arial", style="B", size=10)
            pdf.cell(0, 8, f"Cliente: {t.get('Cliente', '')}", ln=True)
            pdf.set_font("Arial", size=10)

            pdf.multi_cell(0, 6,
                f"CPF/CNPJ: {t.get('CPF/CNPJ', '')}\n"
                f"Endereço: {t.get('Logradouro', '')}, {t.get('Número', '')}, {t.get('Bairro', '')}, "
                f"{t.get('Cidade', '')} - {t.get('Estado', '')}, CEP {t.get('CEP', '')}\n"
                f"Telefone: {t.get('Telefone', '')}\n"
                f"E-mail: {t.get('E-mail', '')}\n"
                f"Processo(s): {t.get('Processo(s)') or 'Nenhum processo cadastrado'}"
            )
            pdf.ln(5)  # espaço entre cards

    # Salvar PDF na memória
    pdf_output = io.BytesIO()
    pdf_bytes = pdf.output(dest='S').encode('latin1')  # exporta como string, depois converte p/ bytes
    pdf_output.write(pdf_bytes)
    pdf_output.seek(0)

    return send_file(
        pdf_output,
        mimetype='application/pdf',
        as_attachment=True,
        download_name="relatorio.pdf"
    )

if __name__ == "__main__":
    t = threading.Thread(target=Submit_Random_Task, daemon=True)
    t.start()
    app.run(debug=True, port=5000, host="0.0.0.0")


## TODO: REMEMBER:

## METHODS=["POST"] = CREATE / INSERT   }   SQL
## METHODS=["GET"] = READ / SELECT      }   SQL
## METHODS=["PUT"] = UPDATE / UPDATE    }   SQL
## METHODS=["DELETE"] = DELETE / DELETE }   SQL