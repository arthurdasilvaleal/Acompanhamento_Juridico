from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from fpdf import FPDF
from decimal import Decimal
import io
import mysql.connector
from mysql.connector import pooling

# Para o loop de inserção de dados automáticos

app = Flask(__name__)
CORS(app) # Resolve o erro do navegador bloquear a conexão

dbconfig = {
    "host": "localhost",
    "user": "root",
    "password": "root",
    "database": "BD_AJ"
}

connection_pool = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=10,          # número máximo de conexões simultâneas
    pool_reset_session=True,
    **dbconfig
)

# Se o usuário sair da aba muito rápido, causa um erro... fix that
# cursor = db.cursor(dictionary=True) Dicionario global(DEPRECATED)

# Para o Login
@app.route("/submit_login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("Login")
    password = data.get("Pass")

    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """SELECT cd_Colaborador, nm_Colaborador, nm_TipoColaborador, C.cd_TipoColaborador FROM Colaborador C
            JOIN TipoColaborador TP ON C.cd_TipoColaborador = TP.cd_TipoColaborador
            WHERE nm_Usuario = %s AND ds_Senha = SHA2(%s, 256)"""
    try:
        cursor.execute(query, (username, password))
        user = cursor.fetchone()
    except mysql.connector.Error as Err:
        print(Err)
    finally:
        cursor.close()
        conn.close()

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
    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """INSERT INTO Colaborador (nm_Colaborador, cd_CPF, nm_Logradouro, nm_Bairro, 
            nm_Cidade, sg_Estado, cd_CEP, cd_NumeroEndereco, ds_ComplementoEndereco, 
            cd_Telefone, ds_Email, nm_Usuario, ds_Senha, cd_TipoColaborador)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, SHA2(%s, 256), %s)"""
    try:
        cursor.execute(query, (Nome, CPF, Endereco, Bairro, Cidade, Estado, CEP, NumeroEnd, Complemento, Telefone, Email, Usuario, Senha, TipoColaborador))
        conn.commit()
        return jsonify({"message": "Colaborador cadastrado"}), 201
    except mysql.connector.Error as err:
        print("Erro em '/post_cadastro': ", err)
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()


# Pegando os nomes dos colaboradores (Para relatórios)
@app.route("/get_colaborador", methods=["GET"])
def get_colaborador():
    
    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT cd_Colaborador, nm_Colaborador FROM Colaborador"
    
    try:
        cursor.execute(query)
        result = cursor.fetchall()
        return jsonify(result)
    except mysql.connector.Error as Err:
        print("Erro em 'get_colaborador'", Err)
        return jsonify({"error": str(Err)}), 500
    finally:
        cursor.close()
        conn.close()

# Consultar nome dos clientes
@app.route("/get_clientes", methods=["GET"])
def get_clientes():

    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT cd_Cliente, nm_Cliente FROM Cliente"
    
    try:
        cursor.execute(query)
        result = cursor.fetchall()
        return jsonify(result)
    except mysql.connector.Error as Err:
        print("Erro em 'get_clientes'", Err)
        return jsonify({"error": str(Err)}), 500
    finally:
        cursor.close()
        conn.close()

# Consultar dados de TODOS os clientes
@app.route("/get_Allclientes", methods=["GET"])
def get_Allclientes():
    
    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)
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
    finally:
        cursor.close()
        conn.close()
    
    
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
    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)

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
        conn.commit()
        return jsonify({"message": "Cliente alterado com sucesso!"}), 201
    except mysql.connector.Error as err:
        print("\n\nErro em 'post_cliente':", err)
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()

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
    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)

    if len(CPF) > 11:
        query = """CALL SP_Update_Cliente(%s, %s, null, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    else:
        query = """CALL SP_Update_Cliente(%s, %s, %s, null, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    
    try:
        valuesCliente = (Codigo, Nome, CPF, Logradouro, Bairro, Cidade, Estado, CEP, Numero, Complemento, Telefone, Email)
        cursor.execute(query, valuesCliente)
        conn.commit()
        return jsonify({"message": "Cliente editado com sucesso!"}), 201
    except mysql.connector.Error as err:
        print("\n\nErro '/put_cliente':", err)
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()

# Para deletar um cliente
@app.route("/delete_cliente", methods=["DELETE"])
def delete_cliente(): 

    cdCliente = request.get_json().get("DeleteCliente")
    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.callproc("SP_Delete_Cliente", [cdCliente])
        conn.commit()
        return jsonify({"message": "Cliente removido com sucesso!"}), 201
    except mysql.connector.Error as err:
        print("\n\nErro em '/delete_cliente':", err)
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()

# Pegar os numeros dos processos bem como todos os dados do processo ou parte buscados
@app.route("/get_processos", methods=["GET"])
def get_processos():

    only_numeros = request.args.get("only") == "id"
    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)

    if only_numeros:
        query = """SELECT cd_Processo, cd_NumeroProcesso FROM Processo"""
        try:
            cursor.execute(query)
            result = cursor.fetchall()
            return jsonify(result)
        except mysql.connector.Error as Err:
            print("Erro em 'get_clientes'", Err)
            return jsonify({"error": str(Err)}), 500
        finally:
            cursor.close()
            conn.close()
    
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
        cursor.close()
        conn.close()
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
        cursor.close()
        conn.close()
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
    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)

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
        conn.commit()
        return jsonify({"message": "Processo inserido com sucesso!"}), 201
    except mysql.connector.Error as err:
        print("\n\nErro em 'post_processo':", err)
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()
    
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
    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """CALL SP_Update_Processo(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"""
    
    values = (Codigo, CodClienteAntigo, CodClienteNovo, Posicao, NumProcesso, Autor, Reu, Juizo, Acao, Cidade, Tribunal, Causa, Fase)
    
    try:
        cursor.execute(query, values)
        conn.commit()
        return jsonify({"message": "Processo editado com sucesso!", "Valores": values}), 201
    except mysql.connector.Error as err:
        print("\n\nErro em 'put_processo':", err)
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()

# Para deletar um processo
@app.route("/delete_processo", methods=["DELETE"])
def delete_processo():

    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    cdProcesso = request.get_json().get("deleteProcess")

    try:
        cursor.callproc("SP_Delete_Processo", [cdProcesso])
        conn.commit()
        return jsonify({"message": "Processo deletado com sucesso!", "Processo": cdProcesso}), 201
    except mysql.connector.Error as err:
        print("\n\nErro em 'delete_processo':", err)
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()

# Para os Cards da consulta de processos
@app.route("/get_cardInt", methods=["GET"])
def get_intimacao():

    Nome_Parte = request.args.get("parte")
    Numero_Processo = request.args.get("numeroProcesso")
    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    
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
    finally:
        cursor.close()
        conn.close()

# Buscar Tarefas
@app.route("/get_cardTask", methods=["GET"])
def get_Task():

    Nome_Parte = request.args.get("parte")
    Numero_Processo = request.args.get("numeroProcesso")
    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)

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
    finally:
        cursor.close()
        conn.close()

# Para atualizar as tarefas
@app.route("/put_cardTask", methods=["PUT"])
def put_cardTask():

    data = request.get_json()
    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)

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
        conn.commit()
        return jsonify({"message": "Tarefa editada com sucesso!", "Values": values}), 201
    except mysql.connector.Error as err:
        print("\n\nErro '/put_cardTask':", err)
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()
        


# Para enviar os dados de Intimações/Tarefas
@app.route("/post_card", methods=["POST"])
def post_intimacao():
    data = request.get_json()

    intimacao = request.args.get("form") == "intimacao"
    tarefa = request.args.get("form") == "task"
    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)

    if intimacao:
        dataRecebimento = data.get("dataRecebimento")
        descrição = data.get("descricaoIntimacao")
        codigoProcesso = data.get("codigoProcesso")

        query = "INSERT INTO Intimacao (cd_Processo, dt_Recebimento, ds_Intimacao) VALUES (%s, %s, %s)"

        try:
            cursor.execute(query, (codigoProcesso, dataRecebimento, descrição,))
            conn.commit()
            return jsonify({"message": "Intimação inserida com sucesso!"}), 201
        except mysql.connector.Error as err:
            print("\n\nErro em '/post_card' postando intimação:", err)
            return jsonify({"Erro": str(err)}), 500
        finally:
            cursor.close()
            conn.close()
    
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
            conn.commit()
            return jsonify({"message": "Tarefa inserida com sucesso!"}), 201
        except mysql.connector.Error as err:
            print("\n\nErro em 'post_card' postando tarefa:", err)
            return jsonify({"error": str(err)}), 500
        finally:
            cursor.close()
            conn.close()

# Para a tela de visão Geral
@app.route("/get_MainInfo", methods=["GET"])
def get_MainInfo():

    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    colaborador = request.args.get("colaborador")

    query = """
                SELECT
                    -- =========================
                    -- 📂 Dados gerais de Processos
                    -- =========================
                    p.qtd_Processo,
                    p.Conhecimento,
                    p.Recursal,
                    p.Execucao,
                    p.Finalizado,
                    p.Cancelado,

                    -- =========================
                    -- 📋 Dados gerais de Tarefas
                    -- =========================
                    t.Aguardando,
                    t.Em_andamento,
                    t.Concluido,
                    t.qtd_MyTaskFinished,

                    -- =========================
                    -- 📆 Tarefas do colaborador por mês
                    -- =========================
                    mt.qtd_MyTaskByMonth1,
                    mt.qtd_MyTaskByMonth2,
                    mt.qtd_MyTaskByMonth3,
                    mt.qtd_MyTaskByMonth4,
                    mt.qtd_MyTaskByMonth5,
                    mt.qtd_MyTaskByMonth6,
                    mt.qtd_MyTaskByMonth7,
                    mt.qtd_MyTaskByMonth8,
                    mt.qtd_MyTaskByMonth9,
                    mt.qtd_MyTaskByMonth10,
                    mt.qtd_MyTaskByMonth11,
                    mt.qtd_MyTaskByMonth12,

                    -- =========================
                    -- 📆 Tarefas gerais por mês
                    -- =========================
                    tt.qtd_TaskByMonth1,
                    tt.qtd_TaskByMonth2,
                    tt.qtd_TaskByMonth3,
                    tt.qtd_TaskByMonth4,
                    tt.qtd_TaskByMonth5,
                    tt.qtd_TaskByMonth6,
                    tt.qtd_TaskByMonth7,
                    tt.qtd_TaskByMonth8,
                    tt.qtd_TaskByMonth9,
                    tt.qtd_TaskByMonth10,
                    tt.qtd_TaskByMonth11,
                    tt.qtd_TaskByMonth12,

                    -- =========================
                    -- ✅ Tarefas concluídas (geral e por colaborador)
                    -- =========================
                    ttf.qtdF_TaskByMonth1,
                    ttf.qtdF_TaskByMonth2,
                    ttf.qtdF_TaskByMonth3,
                    ttf.qtdF_TaskByMonth4,
                    ttf.qtdF_TaskByMonth5,
                    ttf.qtdF_TaskByMonth6,
                    ttf.qtdF_TaskByMonth7,
                    ttf.qtdF_TaskByMonth8,
                    ttf.qtdF_TaskByMonth9,
                    ttf.qtdF_TaskByMonth10,
                    ttf.qtdF_TaskByMonth11,
                    ttf.qtdF_TaskByMonth12,

                    ttfm.qtdF_MyTaskByMonth1,
                    ttfm.qtdF_MyTaskByMonth2,
                    ttfm.qtdF_MyTaskByMonth3,
                    ttfm.qtdF_MyTaskByMonth4,
                    ttfm.qtdF_MyTaskByMonth5,
                    ttfm.qtdF_MyTaskByMonth6,
                    ttfm.qtdF_MyTaskByMonth7,
                    ttfm.qtdF_MyTaskByMonth8,
                    ttfm.qtdF_MyTaskByMonth9,
                    ttfm.qtdF_MyTaskByMonth10,
                    ttfm.qtdF_MyTaskByMonth11,
                    ttfm.qtdF_MyTaskByMonth12,

                    -- =========================
                    -- ⏳ Tarefas não finalizadas (geral e por colaborador)
                    -- =========================
                    tunf.qtdUNF_TaskByMonth1,
                    tunf.qtdUNF_TaskByMonth2,
                    tunf.qtdUNF_TaskByMonth3,
                    tunf.qtdUNF_TaskByMonth4,
                    tunf.qtdUNF_TaskByMonth5,
                    tunf.qtdUNF_TaskByMonth6,
                    tunf.qtdUNF_TaskByMonth7,
                    tunf.qtdUNF_TaskByMonth8,
                    tunf.qtdUNF_TaskByMonth9,
                    tunf.qtdUNF_TaskByMonth10,
                    tunf.qtdUNF_TaskByMonth11,
                    tunf.qtdUNF_TaskByMonth12,

                    tunfm.qtdUNF_MyTaskByMonth1,
                    tunfm.qtdUNF_MyTaskByMonth2,
                    tunfm.qtdUNF_MyTaskByMonth3,
                    tunfm.qtdUNF_MyTaskByMonth4,
                    tunfm.qtdUNF_MyTaskByMonth5,
                    tunfm.qtdUNF_MyTaskByMonth6,
                    tunfm.qtdUNF_MyTaskByMonth7,
                    tunfm.qtdUNF_MyTaskByMonth8,
                    tunfm.qtdUNF_MyTaskByMonth9,
                    tunfm.qtdUNF_MyTaskByMonth10,
                    tunfm.qtdUNF_MyTaskByMonth11,
                    tunfm.qtdUNF_MyTaskByMonth12

                FROM
                    (
                        SELECT
                            COUNT(*) AS qtd_Processo,
                            SUM(cd_FaseProcesso = 1) AS Conhecimento,
                            SUM(cd_FaseProcesso = 2) AS Recursal,
                            SUM(cd_FaseProcesso = 3) AS Execucao,
                            SUM(cd_FaseProcesso = 4) AS Finalizado,
                            SUM(cd_FaseProcesso = 5) AS Cancelado
                        FROM Processo
                    ) p

                CROSS JOIN
                    (
                        SELECT
                            SUM(cd_StatusTarefa = 1) AS Aguardando,
                            SUM(cd_StatusTarefa = 2) AS Em_andamento,
                            SUM(cd_StatusTarefa = 3) AS Concluido,
                            SUM(cd_Colaborador = %s AND cd_StatusTarefa = 3) AS qtd_MyTaskFinished
                        FROM Tarefa
                    ) t

                CROSS JOIN
                    (
                        SELECT
                            """ + ",\n            ".join([
                                f"SUM(MONTH(dt_Registro) = {i} AND cd_Colaborador = %s) AS qtd_MyTaskByMonth{i}" for i in range(1, 13)
                            ]) + """
                        FROM Tarefa
                    ) mt

                CROSS JOIN
                    (
                        SELECT
                            """ + ",\n            ".join([
                                f"SUM(MONTH(dt_Registro) = {i}) AS qtd_TaskByMonth{i}" for i in range(1, 13)
                            ]) + """
                        FROM Tarefa
                    ) tt

                CROSS JOIN
                    (
                        SELECT
                            """ + ",\n            ".join([
                                f"SUM(MONTH(dt_Registro) = {i} AND cd_StatusTarefa = 3) AS qtdF_TaskByMonth{i}" for i in range(1, 13)
                            ]) + """
                        FROM Tarefa
                    ) ttf

                CROSS JOIN
                    (
                        SELECT
                            """ + ",\n            ".join([
                                f"SUM(MONTH(dt_Registro) = {i} AND cd_Colaborador = %s AND cd_StatusTarefa = 3) AS qtdF_MyTaskByMonth{i}" for i in range(1, 13)
                            ]) + """
                        FROM Tarefa
                    ) ttfm

                CROSS JOIN
                    (
                        SELECT
                            """ + ",\n            ".join([
                                f"SUM(MONTH(dt_Registro) = {i} AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_TaskByMonth{i}" for i in range(1, 13)
                            ]) + """
                        FROM Tarefa
                    ) tunf

                CROSS JOIN
                    (
                        SELECT
                            """ + ",\n            ".join([
                                f"SUM(MONTH(dt_Registro) = {i} AND cd_Colaborador = %s AND (cd_StatusTarefa = 1 OR cd_StatusTarefa = 2)) AS qtdUNF_MyTaskByMonth{i}" for i in range(1, 13)
                            ]) + """
                        FROM Tarefa
                    ) tunfm;
                """
    try:
        cursor.execute(query, tuple([colaborador] * 37))
        result = cursor.fetchone()
        return jsonify(result)
    except mysql.connector.Error as Err:
        print("\n\nErro em 'get_MainInfo':", Err)
        return jsonify({"error": str(Err)}), 500
    finally:
        cursor.close()
        conn.close()

# Novos endpoints para gráficos adicionais
@app.route("/get_performance_data", methods=["GET"])
def get_performance_data():
    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    
    query = """
        SELECT 
            c.nm_Colaborador,
            COUNT(t.cd_Tarefa) as total_tarefas,
            SUM(CASE WHEN t.cd_StatusTarefa = 3 THEN 1 ELSE 0 END) as tarefas_concluidas,
            ROUND(
                (SUM(CASE WHEN t.cd_StatusTarefa = 3 THEN 1 ELSE 0 END) / COUNT(t.cd_Tarefa)) * 100, 2
            ) as taxa_conclusao,
            AVG(CASE 
                WHEN t.cd_StatusTarefa = 3 AND t.dt_Registro IS NOT NULL AND t.dt_Prazo IS NOT NULL 
                THEN DATEDIFF(t.dt_Registro, t.dt_Prazo) 
                ELSE NULL 
            END) as tempo_medio_resolucao
        FROM Colaborador c
        LEFT JOIN Tarefa t ON c.cd_Colaborador = t.cd_Colaborador
        WHERE c.cd_TipoColaborador IN (2, 3, 4)  -- Advogados, Assistentes, Estagiários
        GROUP BY c.cd_Colaborador, c.nm_Colaborador
        HAVING COUNT(t.cd_Tarefa) > 0
        ORDER BY taxa_conclusao DESC
    """
    
    try:
        cursor.execute(query)
        result = cursor.fetchall()
        return jsonify(result)
    except mysql.connector.Error as Err:
        print("\n\nErro em 'get_performance_data':", Err)
        return jsonify({"error": str(Err)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route("/get_workload_data", methods=["GET"])
def get_workload_data():
    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    
    query = """
        SELECT 
            c.nm_Colaborador,
            SUM(CASE WHEN t.cd_StatusTarefa = 1 THEN 1 ELSE 0 END) as tarefas_aguardando,
            SUM(CASE WHEN t.cd_StatusTarefa = 2 THEN 1 ELSE 0 END) as tarefas_em_andamento,
            SUM(CASE WHEN t.cd_StatusTarefa = 3 THEN 1 ELSE 0 END) as tarefas_concluidas,
            COUNT(t.cd_Tarefa) as total_tarefas
        FROM Colaborador c
        LEFT JOIN Tarefa t ON c.cd_Colaborador = t.cd_Colaborador
        WHERE c.cd_TipoColaborador IN (2, 3, 4)
        GROUP BY c.cd_Colaborador, c.nm_Colaborador
        ORDER BY total_tarefas DESC
    """
    
    try:
        cursor.execute(query)
        result = cursor.fetchall()
        return jsonify(result)
    except mysql.connector.Error as Err:
        print("\n\nErro em 'get_workload_data':", Err)
        return jsonify({"error": str(Err)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route("/get_deadline_data", methods=["GET"])
def get_deadline_data():
    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    
    query = """
        SELECT 
            CASE 
                WHEN t.dt_Prazo < CURDATE() AND t.cd_StatusTarefa != 3 THEN 'Atrasadas'
                WHEN t.dt_Prazo BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY) AND t.cd_StatusTarefa != 3 THEN 'Próximas do Vencimento'
                WHEN t.dt_Prazo > DATE_ADD(CURDATE(), INTERVAL 3 DAY) AND t.cd_StatusTarefa != 3 THEN 'No Prazo'
                WHEN t.cd_StatusTarefa = 3 THEN 'Concluídas'
                ELSE 'Outras'
            END as status_prazo,
            COUNT(*) as quantidade
        FROM Tarefa t
        GROUP BY status_prazo
        ORDER BY 
            CASE status_prazo
                WHEN 'Atrasadas' THEN 1
                WHEN 'Próximas do Vencimento' THEN 2
                WHEN 'No Prazo' THEN 3
                WHEN 'Concluídas' THEN 4
                ELSE 5
            END
    """
    
    try:
        cursor.execute(query)
        result = cursor.fetchall()
        return jsonify(result)
    except mysql.connector.Error as Err:
        print("\n\nErro em 'get_deadline_data':", Err)
        return jsonify({"error": str(Err)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route("/get_personal_stats", methods=["GET"])
def get_personal_stats():
    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    colaborador = request.args.get("colaborador")
    
    query = """
        SELECT 
            -- Total de tarefas do colaborador
            COUNT(t.cd_Tarefa) as total_tarefas,
            
            -- Tarefas por status
            SUM(CASE WHEN t.cd_StatusTarefa = 1 THEN 1 ELSE 0 END) as aguardando,
            SUM(CASE WHEN t.cd_StatusTarefa = 2 THEN 1 ELSE 0 END) as em_andamento,
            SUM(CASE WHEN t.cd_StatusTarefa = 3 THEN 1 ELSE 0 END) as concluidas,
            
            -- Análise de prazos
            SUM(CASE 
                WHEN t.dt_Prazo < CURDATE() AND t.cd_StatusTarefa != 3 THEN 1 
                ELSE 0 
            END) as tarefas_vencidas,
            
            SUM(CASE 
                WHEN t.dt_Prazo BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY) 
                AND t.cd_StatusTarefa != 3 THEN 1 
                ELSE 0 
            END) as tarefas_proximas_vencimento,
            
            SUM(CASE 
                WHEN t.dt_Prazo > DATE_ADD(CURDATE(), INTERVAL 3 DAY) 
                AND t.cd_StatusTarefa != 3 THEN 1 
                ELSE 0 
            END) as tarefas_no_prazo,
            
            -- Taxa de conclusão
            ROUND(
                (SUM(CASE WHEN t.cd_StatusTarefa = 3 THEN 1 ELSE 0 END) / COUNT(t.cd_Tarefa)) * 100, 2
            ) as taxa_conclusao,
            
            -- Tarefas deste mês
            SUM(CASE 
                WHEN MONTH(t.dt_Registro) = MONTH(CURDATE()) 
                AND YEAR(t.dt_Registro) = YEAR(CURDATE()) THEN 1 
                ELSE 0 
            END) as tarefas_este_mes,
            
            -- Tarefas concluídas este mês
            SUM(CASE 
                WHEN MONTH(t.dt_Registro) = MONTH(CURDATE()) 
                AND YEAR(t.dt_Registro) = YEAR(CURDATE()) 
                AND t.cd_StatusTarefa = 3 THEN 1 
                ELSE 0 
            END) as tarefas_concluidas_este_mes
            
        FROM Tarefa t
        WHERE t.cd_Colaborador = %s
    """
    
    try:
        cursor.execute(query, (colaborador,))
        result = cursor.fetchone()
        return jsonify(result)
    except mysql.connector.Error as Err:
        print("\n\nErro em 'get_personal_stats':", Err)
        return jsonify({"error": str(Err)}), 500
    finally:
        cursor.close()
        conn.close()

# Gerando o PDF da aba de relatórios
@app.route("/generate_pdf", methods=["POST"])
def generate_pdf():

    data = request.get_json()
    conn = connection_pool.get_connection()
    cursor = conn.cursor(dictionary=True)

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
    # Remove o "Lixo" da consulta, evitando o erro "MySQL not Available"
    while cursor.nextset():
        cursor.fetchall()

    cursor.close()
    conn.close()
    
    Title = ""

    # Delegação dos Filtros
    # 1 = "Processos"
    # 2 = "Clientes"
    # 3 = "Colaboradores"

    print(PrimeiroFiltro, SegundoFiltro, TerceiroFiltro)

    match PrimeiroFiltro:
        case 1:
            if SegundoFiltro == 1:
                Title = "Relatório de todos os processos"
            elif SegundoFiltro == 3:
                Title = f"Relatórios de processos do cliente {(TerceiroFiltro)}"
            else:
                Title = f"Relatório do processo N° {(TerceiroFiltro)}"
        case 2:
            if SegundoFiltro == 1:
                Title = "Relatório de Todos os clientes"
            elif SegundoFiltro == 3:
                Title = f"Relatório de {(TerceiroFiltro)}"
        case 3:
            if SegundoFiltro == 1:
                Title = "Relatório geral de todos os colaboradores"
            elif SegundoFiltro == 5:
                Title = f"Relatório do colaborador(a) {(TerceiroFiltro)}"
        case _:   
            Title = "Error"

    # Criar PDF
    pdf = PDF()
    pdf.add_page()
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 9, Title, ln=True, align="C")
    pdf.ln(10)

    #Formatando o CEP
    def format_CEP(cep: str) -> str:

        # Garantindo que CEP seja string(Decimal has no length)
        cep = str(cep)
        return f"{cep[:5]}-{cep[5:]}"

    # Formatando o N° telefone
    def format_cell(cell: str) -> str:
        
        # Se vier como tuple/list, pega o primeiro valor
        if isinstance(cell, (list, tuple, set)):
            cell = next(iter(cell))

        # Se vier como dict, pega o valor (ajustar conforme o schema)
        if isinstance(cell, dict):
            cell = list(cell.values())[0]

        # Garantindo que cell seja string(Decimal has no length)
        cell = str(cell)
        return f"({cell[:2]}) {cell[2:7]}-{cell[7:]}"

    # Formatando o CPF/CNPJ
    def format_cpf(cpf: str) -> str:
        if cpf and len(cpf) == 11:
            return f"{cpf[:3]}.{cpf[3:6]}.{cpf[6:9]}-{cpf[9:]}"
        return cpf or ""

    def format_cnpj(cnpj: str) -> str:
        if cnpj and len(cnpj) == 14:
            return f"{cnpj[:2]}.{cnpj[2:5]}.{cnpj[5:8]}/{cnpj[8:12]}-{cnpj[12:]}"
        return cnpj or ""

    def format_cpf_cnpj(doc: str) -> str:
        if not doc:
            return ""

        # Garantindo que o CPF seja string(Decimal has no length)
        doc = str(doc)

        if len(doc) == 11:
            return format_cpf(doc)
        if len(doc) == 14:
            return format_cnpj(doc)
        return doc
    # Formatando o CPF/CNPJ

    # (Clientes, TODOS, Específico)
    if PrimeiroFiltro == 2 and (SegundoFiltro == 1 or SegundoFiltro == 3):
        # Loop de clientes
        pdf.set_font("Arial", size=10)
        for t in result:
            pdf.set_font("Arial", style="B", size=10)
            pdf.cell(0, 8, f"Cliente: {t.get('Cliente', '')}", ln=True)
            pdf.set_font("Arial", size=10)

            doc = format_cpf_cnpj(t.get("CPF/CNPJ"))
            cell = format_cell(t.get("Telefone"))

            pdf.multi_cell(0, 6,
                f"CPF/CNPJ: {doc}\n"
                f"Endereço: {t.get('Logradouro', '')}, {t.get('Número', '')}, {t.get('Bairro', '')}, "
                f"{t.get('Cidade', '')} - {t.get('Estado', '')}, CEP {t.get('CEP', '')}\n"
                f"Telefone: {cell}\n"
                f"E-mail: {t.get('E-mail', '')}\n"
                f"Processo(s): {t.get('Processo(s)') or 'Nenhum processo cadastrado'}"
            )
            pdf.ln(5)  # espaço entre cards

    # (Processos, TODOS, Cliente específico, Processo específico)
    elif PrimeiroFiltro == 1:
        pdf.set_font("Arial", size=10)
        for t in result:
            pdf.set_font("Arial", style="B", size=10)
            doc = format_cpf_cnpj(t.get("cd_CPF") or t.get("cd_CNPJ"))
            
            if SegundoFiltro == 3:
                pdf.cell(0, 8, f"Autor: {t.get('nm_Autor', '')} {doc}", ln=True)
            else:
                pdf.cell(0, 8, f"Autor: {t.get('nm_Autor', '')}", ln=True)
            pdf.set_font("Arial", size=10)
            pdf.multi_cell(0, 6, 
                f"Processo: {t.get('cd_NumeroProcesso', '')}\n"
                f"Réu: {t.get('nm_Reu', '')}\n"
                f"Juizado: {t.get('ds_Juizo', '')}\n"
                f"Ação: {t.get('ds_Acao', '')}\n"
                f"Cidade: {t.get('nm_Cidade', '')}\n"
                f"Sigla do Tribunal: {t.get('sg_Tribunal', '')}\n"
            )
            pdf.set_font("Arial", style="B", size=10)

            # Formatando os valores da causa
            valor = t.get("vl_Causa", "")
            if isinstance(valor, Decimal):
                valor = f"{valor:,.2f}"  # formata com 2 casas
                valor = valor.replace(",", "X").replace(".", ",").replace("X", ".")
                # truque para trocar ponto por vírgula sem confundir separador de milhar

            pdf.cell(0, 6, f"Valor da causa: R${valor}", ln=True)

            pdf.ln(5)  # espaço entre cards
    
    elif PrimeiroFiltro == 3:
        for t in result:
            pdf.set_font("Arial", style="B", size=10)
            pdf.cell(0, 8, f"Colaborador: {t.get('nm_Colaborador', '')}", ln=True)

            doc = format_cpf_cnpj(t.get('cd_CPF') or t.get('cd_CNPJ'))
            cell = format_cell({t.get('cd_Telefone')})
            cep = format_CEP(t.get('cd_CEP'))

            pdf.set_font("Arial", size=10)
            pdf.multi_cell(0, 6, 
                f"CPF: {doc}\n"
                f"Endereço: {t.get('nm_Logradouro', '')}, {t.get('nm_Bairro', '')}, {t.get('nm_Cidade', '')}/{t.get('sg_Estado', '')}\n"
                f"CEP: {cep}, Nº {t.get('cd_NumeroEndereco', '')}, {t.get('ds_ComplementoEndereco', '')}\n"
                f"Telefone: {cell}\n"
                f"Email: {t.get('ds_Email', '')}"
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
    app.run(debug=True, port=5000, host="0.0.0.0")


## TODO: REMEMBER:

## METHODS=["POST"] = CREATE / INSERT   }   SQL
## METHODS=["GET"] = READ / SELECT      }   SQL
## METHODS=["PUT"] = UPDATE / UPDATE    }   SQL
## METHODS=["DELETE"] = DELETE / DELETE }   SQL