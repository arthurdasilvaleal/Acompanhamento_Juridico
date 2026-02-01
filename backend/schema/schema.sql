-- Criação do Banco de Dados
DROP DATABASE IF EXISTS BD_AJ;
CREATE DATABASE BD_AJ;
USE BD_AJ;

-- Criação das tabelas

CREATE TABLE TipoColaborador(
    cd_TipoColaborador int NOT NULL,
    nm_TipoColaborador varchar(25),
    PRIMARY KEY (cd_TipoColaborador)
);

CREATE TABLE Colaborador(
    cd_Colaborador INT AUTO_INCREMENT NOT NULL,
    nm_Colaborador VARCHAR(40),
    cd_CPF NUMERIC(11) UNIQUE,
    nm_Logradouro VARCHAR(40),
    nm_Bairro VARCHAR(30),
    nm_Cidade VARCHAR(20),
    sg_Estado char(2),
    cd_CEP NUMERIC(8),
    cd_NumeroEndereco INT NULL,
    ds_ComplementoEndereco VARCHAR(20),
    cd_Telefone VARCHAR(20),
    ds_Email VARCHAR(80),
    nm_Usuario VARCHAR(15) UNIQUE,
    ds_Senha VARCHAR(64),
    cd_TipoColaborador int NOT NULL,
    PRIMARY KEY (cd_Colaborador)
);

CREATE TABLE Cliente(
    cd_Cliente INT AUTO_INCREMENT NOT NULL,
    nm_Cliente VARCHAR(40),
    cd_CPF NUMERIC(11) UNIQUE,
    cd_CNPJ NUMERIC(14) UNIQUE,
    nm_Logradouro VARCHAR(40),
    nm_Bairro VARCHAR(30),
    nm_Cidade VARCHAR(20),
    sg_Estado CHAR(2),
    cd_CEP NUMERIC(8),
    cd_NumeroEndereco INT,
    ds_ComplementoEndereco VARCHAR(20),
    cd_Telefone NUMERIC(11),
    ds_Email VARCHAR(80),
    PRIMARY KEY (cd_Cliente)
);

CREATE TABLE Posicao_na_Acao(
    cd_PosicaoAcao INT NOT NULL,
    nm_PosicaoAcao VARCHAR(15),
    PRIMARY KEY (cd_PosicaoAcao)
);

CREATE TABLE Tribunal(
    sg_Tribunal VARCHAR(6) NOT NULL,
    nm_Tribunal VARCHAR(50),
    PRIMARY KEY (sg_Tribunal)
);

CREATE TABLE FaseProcesso(
    cd_FaseProcesso INT DEFAULT 1 NOT NULL,
    nm_FaseProcesso VARCHAR(20),
    PRIMARY KEY (cd_FaseProcesso)
);

CREATE TABLE Processo(
    cd_Processo INT AUTO_INCREMENT NOT NULL,
    cd_NumeroProcesso VARCHAR(25) UNIQUE,
    nm_Autor VARCHAR(40),
    nm_Reu VARCHAR(40),
    ds_Juizo VARCHAR(30),
    ds_Acao VARCHAR(50),
    nm_Cidade VARCHAR(20),
    sg_Tribunal VARCHAR(6) NOT NULL,
    vl_Causa DECIMAL(10,2),
    cd_FaseProcesso INT DEFAULT 1,
    PRIMARY KEY (cd_Processo)
);

CREATE TABLE Cliente_Processo(
    cd_Cliente INT NOT NULL,
    cd_Processo INT NOT NULL,
    cd_PosicaoAcao INT,
    PRIMARY KEY (cd_Cliente, cd_Processo)
);

CREATE TABLE Intimacao(
    cd_Intimacao INT AUTO_INCREMENT NOT NULL,
    dt_Recebimento DATETIME,
    cd_Processo INT NOT NULL,
    ds_Intimacao TEXT,
    PRIMARY KEY (cd_Intimacao)
);

CREATE TABLE StatusTarefa(
    cd_StatusTarefa INT NOT NULL,
    nm_StatusTarefa VARCHAR(12),
    PRIMARY KEY (cd_StatusTarefa)
);

CREATE TABLE TipoTarefa(
    cd_TipoTarefa INT AUTO_INCREMENT NOT NULL,
    nm_TipoTarefa VARCHAR(80),
    PRIMARY KEY (cd_TipoTarefa)
);

CREATE TABLE Tarefa(
    cd_Tarefa INT AUTO_INCREMENT NOT NULL,
    cd_Intimacao INT NOT NULL,
    dt_Registro DATETIME,
    dt_Prazo DATE,
    cd_Colaborador INT NOT NULL,
    cd_StatusTarefa int NOT NULL,
    cd_TipoTarefa INT NOT NULL,
    ds_Tarefa VARCHAR(200),
    PRIMARY KEY (cd_Tarefa)
);

-- Criação das Chaves Estrangeiras

ALTER TABLE Processo
ADD CONSTRAINT FK_Processo_Tribunal
	FOREIGN KEY (sg_Tribunal) REFERENCES Tribunal (sg_Tribunal);
    
ALTER TABLE Processo
ADD	CONSTRAINT FK_Processo_FaseProcesso
	FOREIGN KEY (cd_FaseProcesso) REFERENCES FaseProcesso (cd_FaseProcesso);

ALTER TABLE Intimacao
ADD CONSTRAINT FK_Intimacao_Processo
	FOREIGN KEY (cd_Processo) REFERENCES Processo (cd_Processo);

ALTER TABLE Tarefa
ADD CONSTRAINT FK_Tarefa_Intimacao
	FOREIGN KEY (cd_Intimacao) REFERENCES Intimacao (cd_Intimacao);

ALTER TABLE Tarefa
ADD CONSTRAINT FK_Tarefa_Colaborador
	FOREIGN KEY (cd_Colaborador) REFERENCES Colaborador (cd_Colaborador);
    
ALTER TABLE Tarefa
ADD CONSTRAINT FK_Tarefa_StatusTarefa
	FOREIGN KEY (cd_StatusTarefa) REFERENCES StatusTarefa (cd_StatusTarefa);
    
ALTER TABLE Tarefa
ADD CONSTRAINT FK_Tarefa_TipoTarefa
	FOREIGN KEY (cd_TipoTarefa) REFERENCES TipoTarefa (cd_TipoTarefa);

ALTER TABLE Colaborador
ADD	CONSTRAINT FK_Colaborador_TipoColaborador
	FOREIGN KEY (cd_TipoColaborador) REFERENCES TipoColaborador (cd_TipoColaborador);

ALTER TABLE Cliente_Processo
ADD	CONSTRAINT FK_ClienteProcesso_Cliente
	FOREIGN KEY (cd_Cliente) REFERENCES Cliente (cd_Cliente);
    
ALTER TABLE Cliente_Processo
ADD	CONSTRAINT FK_ClienteProcesso_Processo
	FOREIGN KEY (cd_Processo) REFERENCES Processo (cd_Processo);

ALTER TABLE Cliente_Processo
ADD	CONSTRAINT FK_ClienteProcesso_PosicaonaAcao
	FOREIGN KEY (cd_PosicaoAcao) REFERENCES Posicao_na_Acao (cd_PosicaoAcao);
    
-- Stored Procedure para inserção de processos
    
DELIMITER $$

CREATE PROCEDURE Proc_Insercao_ProcessoCliente (
    IN p_cd_NumeroProcesso VARCHAR(25),
    IN p_cd_Cliente INT,
    IN p_cd_PosicaoAcao INT,
    IN p_nm_Autor VARCHAR(40),
    IN p_nm_Reu VARCHAR(40),
    IN p_ds_Juizo VARCHAR(30),
    IN p_ds_Acao VARCHAR(50),
    IN p_nm_Cidade VARCHAR(20),
    IN p_sg_Tribunal VARCHAR(6),
    IN p_vl_Causa DECIMAL(10,2)
)
BEGIN
    DECLARE v_cd_Processo INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Inserção na tabela Processo
    INSERT INTO Processo 
        (cd_NumeroProcesso, nm_Autor, nm_Reu, ds_Juizo, ds_Acao, nm_Cidade, sg_Tribunal, vl_Causa)
    VALUES 
        (p_cd_NumeroProcesso, p_nm_Autor, p_nm_Reu, p_ds_Juizo, p_ds_Acao, p_nm_Cidade, p_sg_Tribunal, p_vl_Causa);

    -- Obtém o ID gerado (AUTO_INCREMENT)
    SET v_cd_Processo = LAST_INSERT_ID();

    -- Inserção na tabela Cliente_Processo
    INSERT INTO Cliente_Processo 
        (cd_Cliente, cd_Processo, cd_PosicaoAcao)
    VALUES 
        (p_cd_Cliente, v_cd_Processo, p_cd_PosicaoAcao);

    COMMIT;
END $$

DELIMITER ;

-- Trigger para atualização de autor e réu, quando o nome do cliente for alterado

DELIMITER $$

CREATE TRIGGER TG_Update_Cliente_AutorReu
AFTER UPDATE ON Cliente
FOR EACH ROW
BEGIN
	
    -- Atualiza processos nos quais o cliente é Autor
    UPDATE Processo p
    INNER JOIN Cliente_Processo cp ON cp.cd_Processo = p.cd_Processo
    SET p.nm_Autor = NEW.nm_Cliente
    WHERE cp.cd_Cliente = NEW.cd_Cliente AND cp.cd_PosicaoAcao = 1;
    
    -- Atualiza processos nos quais o cliente é Réu
    UPDATE Processo p
    INNER JOIN Cliente_Processo cp ON cp.cd_Processo = p.cd_Processo
    SET p.nm_Reu = NEW.nm_Cliente
    WHERE cp.cd_Cliente = NEW.cd_Cliente AND cp.cd_PosicaoAcao = 2;
    
END $$

-- Stored Procedure para update dos dados de clientes
    
DELIMITER $$

CREATE PROCEDURE SP_Update_Cliente (
	IN sp_cd_Cliente int,
	IN sp_nm_Cliente varchar(40),
	IN sp_cd_CPF decimal(11,0),
	IN sp_cd_CNPJ decimal(14,0), 
	IN sp_nm_Logradouro varchar(40), 
	IN sp_nm_Bairro varchar(30),
	IN sp_nm_Cidade varchar(20),
	IN sp_sg_Estado char(2),
	IN sp_cd_CEP decimal(8,0), 
	IN sp_cd_NumeroEndereco int, 
	IN sp_ds_ComplementoEndereco varchar(20),
	IN sp_cd_Telefone decimal(11,0),
	IN sp_ds_Email varchar(80)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
    
    -- Verifica se o cliente existe
    IF NOT EXISTS (SELECT 1 FROM Cliente WHERE cd_Cliente = sp_cd_Cliente) 
    THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cliente não encontrado';
    END IF;
    
    -- Verifica se CPF já existe em outro cliente
	IF (sp_cd_CPF IS NOT NULL) AND 
	EXISTS (SELECT 1 FROM Cliente WHERE cd_CPF = sp_cd_CPF AND cd_Cliente != sp_cd_Cliente) 
	THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CPF já cadastrado para outro cliente';
	END IF;

	-- Verifica se CNPJ já existe em outro cliente
	IF (sp_cd_CNPJ IS NOT NULL) AND 
	EXISTS (SELECT 1 FROM Cliente WHERE cd_CNPJ = sp_cd_CNPJ AND cd_Cliente != sp_cd_Cliente) 
	THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CNPJ já cadastrado para outro cliente';
	END IF;

    -- Update dos dados do cliente
    UPDATE Cliente
    SET
	nm_Cliente = COALESCE(sp_nm_Cliente, nm_Cliente), -- COALESCE: atualiza apenas se o novo dado não for NULL
	cd_CPF = sp_cd_CPF,
	cd_CNPJ = sp_cd_CNPJ,
	nm_Logradouro = sp_nm_Logradouro,
	nm_Bairro = sp_nm_Bairro,
	nm_Cidade = sp_nm_Cidade,
	sg_Estado = sp_sg_Estado,
	cd_CEP = sp_cd_CEP,
	cd_NumeroEndereco = sp_cd_NumeroEndereco,
	ds_ComplementoEndereco = sp_ds_ComplementoEndereco,
	cd_Telefone = sp_cd_Telefone,
	ds_Email = sp_ds_Email
    WHERE cd_Cliente = sp_cd_Cliente;

   COMMIT;
END $$

DELIMITER ;

-- Stored Procedure para update dos dados de processos
-- Atualiza dados de um processo e sua associação com o cliente (Cliente_Processo)
    
DELIMITER $$

CREATE PROCEDURE SP_Update_Processo (
	IN sp_cd_Processo INT,
	IN sp_cd_ClienteAntigo INT,
	IN sp_cd_ClienteNovo INT,
	IN sp_cd_PosicaoAcao INT,
	IN sp_cd_NumeroProcesso VARCHAR(25),
	IN sp_nm_Autor VARCHAR(40),
	IN sp_nm_Reu VARCHAR(40),
	IN sp_ds_Juizo VARCHAR(30),
	IN sp_ds_Acao VARCHAR(50),
	IN sp_nm_Cidade VARCHAR(20),
	IN sp_sg_Tribunal VARCHAR(6),
	IN sp_vl_Causa DECIMAL(10,2),
	IN sp_cd_FaseProcesso INT
)
BEGIN
    -- Tratamento de erro: rollback se houver exceção SQL
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
    
    -- Atualiza os dados do processo
    UPDATE Processo
    SET
		cd_NumeroProcesso = sp_cd_NumeroProcesso,
		nm_Autor = sp_nm_Autor,
		nm_Reu = sp_nm_Reu,
		ds_Juizo = sp_ds_Juizo,
		ds_Acao = sp_ds_Acao,
		nm_Cidade = sp_nm_Cidade,
		sg_Tribunal = sp_sg_Tribunal,
		vl_Causa = sp_vl_Causa,
		cd_FaseProcesso = sp_cd_FaseProcesso
    WHERE cd_Processo = sp_cd_Processo;
    
    -- Atualiza a relação Cliente_Processo
    UPDATE Cliente_Processo
    SET 
        cd_Cliente = sp_cd_ClienteNovo, 
        cd_PosicaoAcao = sp_cd_PosicaoAcao
    WHERE 
        cd_Cliente = sp_cd_ClienteAntigo 
        AND cd_Processo = sp_cd_Processo;

    COMMIT;
END $$

DELIMITER ;

-- Stored Procedure para delete de cliente

DELIMITER $$

CREATE PROCEDURE SP_Delete_Cliente (
	IN sp_cd_Cliente INT
)
BEGIN
    -- Tratamento de erro: rollback se houver exceção SQL
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
    
    -- Verifica se o cliente existe
    IF sp_cd_Cliente NOT IN (SELECT cd_Cliente FROM Cliente)
    THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cliente não encontrado';
    END IF;
    
    -- Verifica se há vínculo na tabela Cliente_Processo
    IF sp_cd_Cliente IN (SELECT cd_Cliente FROM Cliente_Processo)
    THEN
		SET @mensagem = CONCAT(	'Não foi possível concluir a exclusão, pois o cliente está vinculado a ', 
								(SELECT COUNT(p.cd_Processo)
                                FROM Processo p
                                INNER JOIN Cliente_Processo cp ON cp.cd_Processo = p.cd_Processo
                                WHERE cp.cd_Cliente = sp_cd_Cliente), ' processo(s)');
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @mensagem;
	ELSE
		DELETE FROM Cliente
        WHERE cd_Cliente = sp_cd_Cliente;
	END IF;
    
    COMMIT;
END $$

DELIMITER ;

-- Stored Procedure para delete de processo

DELIMITER $$

CREATE PROCEDURE SP_Delete_Processo (
	IN sp_cd_Processo INT
)
BEGIN
    -- Tratamento de erro: rollback se houver exceção SQL
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
    
    -- Verifica se o processo existe
    IF NOT EXISTS (SELECT 1 FROM Processo WHERE cd_Processo = sp_cd_Processo)
	THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Processo não encontrado';
	END IF;
    
    -- Verifica se o processo não possui intimações
    IF NOT EXISTS (SELECT cd_Intimacao
					FROM Intimacao
					WHERE cd_Processo = sp_cd_Processo)
	THEN
        DELETE FROM Cliente_Processo
        WHERE cd_Processo = sp_cd_Processo;
        DELETE FROM Processo
        WHERE cd_Processo = sp_cd_Processo;
	ELSE
		IF EXISTS (	SELECT t.cd_Tarefa
					FROM Tarefa t
					INNER JOIN Intimacao i ON i.cd_Intimacao = t.cd_Intimacao
					WHERE (i.cd_Processo = sp_cd_Processo) AND (t.cd_StatusTarefa <> 3)	)
		THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ERRO: Exclusão não realizada, o processo possui tarefas pendentes';
		ELSE
			UPDATE Processo
            SET cd_FaseProcesso = 5
            WHERE cd_Processo = sp_cd_Processo;
            
            SELECT 'Fase do processo alterada para "Cancelado"' AS Mensagem;

		END IF;
	END IF;
    
    COMMIT;
END $$

DELIMITER ;

-- ENCAPSULANDO SELECTS PARA O SERVIDOR (By jestao)
DELIMITER $$

CREATE PROCEDURE PDFDownloadCase(
    IN Filt1 INT,
    IN Filt2 INT,
    IN Filt3 VARCHAR(100)
)
BEGIN
    CASE Filt1
        -- ================== Bloco de PROCESSOS ==================
        WHEN 1 THEN
            CASE Filt2
                WHEN 1 THEN
                    -- (Processos, TODOS)
                    SELECT * FROM Processo;
                
                WHEN 3 THEN
                    -- (Processos, por Nome do cliente)
                    SELECT p.*
                    FROM Processo p
                    LEFT JOIN Cliente_Processo cp ON cp.cd_Processo = p.cd_Processo
                    LEFT JOIN Cliente c ON cp.cd_Cliente = c.cd_Cliente
                    WHERE c.nm_Cliente = Filt3;
                
                WHEN 4 THEN
                    -- (Processos, por Número do Processo)
                    SELECT *
                    FROM Processo 
                    WHERE cd_NumeroProcesso = Filt3;
            END CASE;
            
        -- ================== Bloco de CLIENTES ==================
        WHEN 2 THEN
            CASE Filt2
                WHEN 1 THEN
                    -- (Clientes, TODOS)
                    SELECT
                        c.nm_Cliente AS 'Cliente',
                        CASE 
                            WHEN c.cd_CPF IS NOT NULL THEN c.cd_CPF
                            ELSE c.cd_CNPJ
                        END AS 'CPF/CNPJ',
                        c.nm_Logradouro AS 'Logradouro',
                        c.cd_NumeroEndereco AS 'Número',
                        c.nm_Bairro AS 'Bairro',
                        c.nm_Cidade AS 'Cidade',
                        c.sg_Estado AS 'Estado', 
                        c.cd_CEP AS 'CEP',
                        c.cd_Telefone AS 'Telefone',
                        c.ds_Email AS 'E-mail',
                        GROUP_CONCAT(p.cd_NumeroProcesso SEPARATOR ' - ') AS 'Processo(s)'
                    FROM Cliente c
                    LEFT JOIN Cliente_Processo cp ON cp.cd_Cliente = c.cd_Cliente
                    LEFT JOIN Processo p ON cp.cd_Processo = p.cd_Processo
                    GROUP BY c.cd_Cliente;

                WHEN 3 THEN
                    -- (Clientes, Selecionado por nome)
                    SELECT
                        c.nm_Cliente AS 'Cliente',
                        CASE 
                            WHEN c.cd_CPF IS NOT NULL THEN c.cd_CPF
                            ELSE c.cd_CNPJ
                        END AS 'CPF/CNPJ',
                        c.nm_Logradouro AS 'Logradouro',
                        c.cd_NumeroEndereco AS 'Número',
                        c.nm_Bairro AS 'Bairro',
                        c.nm_Cidade AS 'Cidade',
                        c.sg_Estado AS 'Estado', 
                        c.cd_CEP AS 'CEP',
                        c.cd_Telefone AS 'Telefone',
                        c.ds_Email AS 'E-mail',
                        GROUP_CONCAT(p.cd_NumeroProcesso SEPARATOR ' - ') AS 'Processo(s)'
                    FROM Cliente c
                    LEFT JOIN Cliente_Processo cp ON cp.cd_Cliente = c.cd_Cliente
                    LEFT JOIN Processo p ON cp.cd_Processo = p.cd_Processo
                    WHERE c.nm_Cliente = Filt3
                    GROUP BY c.cd_Cliente;
            END CASE;

        -- ================== Bloco de COLABORADORES ==================
        WHEN 3 THEN
            CASE Filt2
                WHEN 1 THEN
                    -- (Colaboradores, TODOS)
                    SELECT * FROM Colaborador;
				WHEN 5 THEN
                    -- (Colaboradores, TODOS)
                    SELECT * FROM Colaborador
                    WHERE nm_Colaborador = Filt3;
            END CASE;
    END CASE;
END$$

DELIMITER ;


-- INSERÇÃO DE DADOS BÁSICOS (Tabelas de domínio)

-- Tribunais
INSERT INTO Tribunal (sg_Tribunal, nm_Tribunal) 
VALUES  ('TJSP', 'Tribunal de Justiça de São Paulo'),
        ('TRT2', 'Tribunal Regional do Trabalho da 2ª Região'),
        ('TRF3', 'Tribunal Regional Federal da 3ª Região'),
        ('TST', 'Superior Tribunal do Trabalho'),
        ('STJ', 'Superior Tribunal de Justiça'),
        ('STF', 'Supremo Tribunal Federal');

-- Fases de Processo
INSERT INTO FaseProcesso (cd_FaseProcesso, nm_FaseProcesso)
VALUES	(1, 'Conhecimento'),
        (2, 'Recursal'),
        (3, 'Execução'),
        (4, 'Finalizado'),
        (5, 'Cancelado');

-- Tipos de Colaborador
INSERT INTO TipoColaborador (cd_TipoColaborador, nm_TipoColaborador) 
VALUES
(1, 'Administrador do Sistema'),
(2, 'Advogado'),
(3, 'Assistente'),
(4, 'Estagiário');

-- Tipos de participação do cliente no processo
INSERT INTO Posicao_na_Acao (cd_PosicaoAcao, nm_PosicaoAcao)
VALUES
    (1, 'Autor'),
    (2, 'Réu'),
    (3, 'Terceiro');    

-- Status da Tarefa
INSERT INTO StatusTarefa (cd_StatusTarefa, nm_StatusTarefa) 
VALUES
(1, 'Aguardando'),
(2, 'Em andamento'),
(3, 'Concluído'),
(4, 'Cancelado');

-- Tipos de tarefa (mantidos para referência de cd_TipoTarefa utilizados nas tarefas)
INSERT INTO TipoTarefa (nm_TipoTarefa) VALUES
-- Petições e atos processuais (1-7)
('Despachar com Juízo'),
('Diligência externa'),
('Incidente de Desconsideração PJ'),
('Pedido de habilitação'),
('Petição Diversa'),
('Petição Inicial'),
('Protocolar petição'),

-- Provas (8-9)
('Arrolar testemunhas'),
('Especificação de provas'),

-- Custas e cálculos (10-13)
('Comprovar pagamento'),
('Comprovar recolhimento de custas'),
('Elaborar cálculo'),
('Recolher custas'),

-- Execução (14)
('Cumprimento de Sentença'),

-- Comunicação com cliente (15-21)
('Agendar reunião com cliente'),
('Reporte ao cliente'),
('Solicitar cumprimento de obrigação (cliente)'),
('Solicitar documento (cliente)'),
('Solicitar informações (cliente)'),
('Solicitar pagamento (cliente)'),
('Comprovar cumprimento de obrigação'),

-- Administração (22-23)
('Organização de documentos'),
('Análise de intimação'),

-- Recursos (24-44)
('Recurso - Agravo de Instrumento'),
('Recurso - Agravo em Execução Penal'),
('Recurso - Agravo em Recurso Especial/Extraordinário'),
('Recurso - Agravo Interno'),
('Recurso - Agravo Regimental'),
('Recurso - Agravo Regimental/Interno'),
('Recurso - Agravo de Petição'),
('Recurso - Apelação'),
('Recurso - de Revista'),
('Recurso - Embargos à Execução'),
('Recurso - Embargos à Execução Fiscal'),
('Recurso - Embargos de Declaração'),
('Recurso - Embargos de Divergência'),
('Recurso - Embargos Infringentes'),
('Recurso - Especial'),
('Recurso - Extraordinário'),
('Recurso - Habeas Corpus'),
('Recurso - Mandado de Segurança'),
('Recurso - Ordinário'),
('Recurso - em Sentido Estrito'),
('Recurso - Outros');
        
-- Inserção de Colaboradores (mantidos para testes do sistema)
INSERT INTO Colaborador (
    nm_Colaborador, cd_CPF, nm_Logradouro, nm_Bairro, 
    nm_Cidade, sg_Estado, cd_CEP, cd_NumeroEndereco, ds_ComplementoEndereco, 
    cd_Telefone, ds_Email, nm_Usuario, ds_Senha, cd_TipoColaborador)
VALUES
('Ana Paula', 45678901234, 'Rua XV de Novembro', 'Gonzaga', 'Santos', 'SP', 11055000, 191, 'Apto 32', '11977773333', 'ana@email.com', 'ana_paula', SHA2('123', 256), 2),
('João Mendes', 56789012345, 'Avenida Ana Costa', 'Boqueirão', 'Santos', 'SP', 11060001, 71, 'Sala 5', '13966664444', 'joao@email.com', 'joao_mendes', SHA2('123', 256), 1),
('Laura Ferreira', 67890123456, 'Rua São Francisco', 'Centro', 'São Vicente', 'SP', 11310000, 86, 'Casa 2', '13955552222', 'laura@email.com', 'laura_ferreira', SHA2('123', 256), 3),
('Carlos Magalhães', 78901234567, 'Praça dos Expedicionários', 'Embaré', 'Santos', 'SP', 11015000, 84, 'Bloco B', '13944441111', 'carlos@email.com', 'carlos_m', SHA2('123', 256), 2),
('Paula Amaral', 89012345678, 'Avenida Conselheiro Nébias', 'Campo Grande', 'Santos', 'SP', 11045001, 94, 'Apto 101', '13933336666', 'paula@email.com', 'paula_amaral', SHA2('123', 256), 2),
('Felipe Borges', 90123456789, 'Rua Euclides da Cunha', 'Vila Mathias', 'Santos', 'SP', 11065000, 17, NULL, '13922227777', 'felipe@email.com', 'felipe_borges', SHA2('123', 256), 4),
('Renata Xavier', 12309876543, 'Alameda Dino Bueno', 'Ponta da Praia', 'Santos', 'SP', 11030000, 8, 'Apto 302', '11911118888', 'renata@email.com', 'renata_x', SHA2('123', 256), 3),
('Amanda Lopes', 34509876543, 'Rua Oswaldo Cruz', 'José Menino', 'Santos', 'SP', 11065050, 63, 'Casa dos fundos', '11999997777', 'amanda@email.com', 'amanda_l', SHA2('123', 256), 4);

-- Inserção massiva de Clientes (PF e PJ)
INSERT INTO Cliente 
    (nm_Cliente, cd_CPF, cd_CNPJ, nm_Logradouro, nm_Bairro, 
    nm_Cidade, sg_Estado, cd_CEP, cd_NumeroEndereco, ds_ComplementoEndereco, 
    cd_Telefone, ds_Email) 
VALUES
-- Clientes PF (1-40)
('Carlos Silva', 12345678901, NULL, 'Rua João Pessoa', 'Vila Belmiro', 'Santos', 'SP', 11055030, 63, 'Apto 12', 11999990000, 'carlos.silva@example.com'),
('Maria Souza', 23456789012, NULL, 'Av. Bernardino de Campos', 'Boqueirão', 'Santos', 'SP', 11060002, 48, 'Sala 3', 11988881111, 'maria.souza@example.com'),
('Fernando Lima', 34567890123, NULL, 'Rua Brás Cubas', 'Centro', 'Guarujá', 'SP', 11410000, 28, NULL, 13999992222, 'fernando.lima@example.com'),
('Juliana Costa', 45678901234, NULL, 'Praça Mauá', 'Valongo', 'Santos', 'SP', 11010000, 91, 'Loja 5', 13977773333, 'juliana.costa@example.com'),
('Roberto Almeida', 56789012345, NULL, 'Rua do Comércio', 'Encruzilhada', 'Santos', 'SP', 11055040, 37, 'Apto 45', 13966665555, 'roberto.almeida@example.com'),
('Tatiane Rocha', 67890123456, NULL, 'Av. Washington Luiz', 'Piratininga', 'São Vicente', 'SP', 11330000, 28, 'Casa 7', 13955557777, 'tatiane.rocha@example.com'),
('Marcos Ribeiro', 78901234567, NULL, 'Alameda Ari Barroso', 'Marapé', 'Santos', 'SP', 11055050, 11, 'Apto 201', 13944449999, 'marcos.ribeiro@example.com'),
('Vanessa Martins', 89012345678, NULL, 'Rua da Constituição', 'Gonzaga', 'Santos', 'SP', 11055010, 64, NULL, 13933338888, 'vanessa.martins@example.com'),
('Luciano Carvalho', 90123456789, NULL, 'Av. Pinheiro Machado', 'Vila Nova', 'Santos', 'SP', 11065030, 73, 'Sala 10', 13922221111, 'luciano.carvalho@example.com'),
('Priscila Ferreira', 12309876543, NULL, 'Rua São Bento', 'Centro', 'Praia Grande', 'SP', 11700000, 82, 'Apto 33', 13911116666, 'priscila.ferreira@example.com'),
('André Gomes', 11122233344, NULL, 'Rua das Flores', 'Centro', 'São Paulo', 'SP', 01001000, 120, 'Apto 101', 11987654321, 'andre.gomes@example.com'),
('Beatriz Nunes', 22233344455, NULL, 'Av. Paulista', 'Bela Vista', 'São Paulo', 'SP', 01310923, 1578, 'Sala 1201', 11976543210, 'beatriz.nunes@example.com'),
('Caio Santos', 33344455566, NULL, 'Rua Augusta', 'Consolação', 'São Paulo', 'SP', 01304901, 350, NULL, 11965432109, 'caio.santos@example.com'),
('Daniela Prado', 44455566677, NULL, 'Rua Vergueiro', 'Liberdade', 'São Paulo', 'SP', 01504001, 950, 'Casa 2', 11954321098, 'daniela.prado@example.com'),
('Eduardo Faria', 55566677788, NULL, 'Rua Haddock Lobo', 'Cerqueira César', 'São Paulo', 'SP', 01414001, 250, 'Cobertura', 11943210987, 'eduardo.faria@example.com'),
('Fernanda Alves', 66677788899, NULL, 'Av. Ipiranga', 'República', 'São Paulo', 'SP', 01045907, 678, 'Apto 23', 11932109876, 'fernanda.alves@example.com'),
('Gustavo Teles', 77788899900, NULL, 'Rua da Consolação', 'Consolação', 'São Paulo', 'SP', 01302000, 432, 'Apto 801', 11921098765, 'gustavo.teles@example.com'),
('Helena Ramos', 88899900011, NULL, 'Rua Frei Caneca', 'Consolação', 'São Paulo', 'SP', 01307001, 98, NULL, 11910987654, 'helena.ramos@example.com'),
('Igor Cardoso', 99900011122, NULL, 'Rua Treze de Maio', 'Bela Vista', 'São Paulo', 'SP', 01327000, 675, 'Casa 5', 11990876543, 'igor.cardoso@example.com'),
('Jéssica Moraes', 10111213141, NULL, 'Rua Dom Pedro II', 'Centro', 'Campinas', 'SP', 13010010, 15, 'Apto 34', 19999998888, 'jessica.moraes@example.com'),
('Luana Vieira', 12131415161, NULL, 'Av. Francisco Glicério', 'Centro', 'Campinas', 'SP', 13010030, 220, 'Sala 3', 19988887777, 'luana.vieira@example.com'),
('Marcelo Cunha', 13141516171, NULL, 'Rua Barão de Jaguara', 'Centro', 'Campinas', 'SP', 13015000, 74, NULL, 19977776666, 'marcelo.cunha@example.com'),
('Nathalia Rocha', 14151617181, NULL, 'Rua General Osório', 'Centro', 'Campinas', 'SP', 13010050, 300, 'Loja 1', 19966665555, 'nathalia.rocha@example.com'),
('Otávio Pires', 15161718191, NULL, 'Av. Brasil', 'Jardim Guanabara', 'Campinas', 'SP', 13073000, 890, 'Casa 1', 19955554444, 'otavio.pires@example.com'),
('Patrícia Ramos', 16171819201, NULL, 'Rua Boa Vista', 'Centro', 'Santo André', 'SP', 09010100, 60, 'Apto 502', 11444443333, 'patricia.ramos@example.com'),
('Rafael Dias', 17181920211, NULL, 'Av. Portugal', 'Centro', 'Santo André', 'SP', 09040100, 450, 'Sala 7', 11433332222, 'rafael.dias@example.com'),
('Simone Freitas', 18192021221, NULL, 'Rua das Figueiras', 'Jardim', 'Santo André', 'SP', 09080300, 300, 'Cobertura', 11422221111, 'simone.freitas@example.com'),
('Thiago Barros', 19102122231, NULL, 'Av. Atlântica', 'Guilhermina', 'Praia Grande', 'SP', 11702000, 101, 'Apto 701', 13987651234, 'thiago.barros@example.com'),
('Ursula Neves', 20212223241, NULL, 'Rua Jaú', 'Boqueirão', 'Santos', 'SP', 11045020, 140, 'Casa 3', 13976542345, 'ursula.neves@example.com'),
('Victor Lima', 21222324251, NULL, 'Rua Goiás', 'Gonzaga', 'Santos', 'SP', 11055040, 50, 'Apto 402', 13965433456, 'victor.lima@example.com'),
('Wesley Duarte', 22232425261, NULL, 'Rua Ceará', 'Marapé', 'Santos', 'SP', 11025060, 90, NULL, 13954324567, 'wesley.duarte@example.com'),
('Xênia Carvalho', 23242526271, NULL, 'Rua Pará', 'Campo Grande', 'Santos', 'SP', 11075100, 34, 'Casa 1', 13943215678, 'xenia.carvalho@example.com'),
('Yuri Antunes', 24252627281, NULL, 'Rua Bahia', 'Ponta da Praia', 'Santos', 'SP', 11030040, 78, 'Apto 201', 13932106789, 'yuri.antunes@example.com'),
('Zilda Campos', 25262728291, NULL, 'Rua Amazonas', 'Centro', 'São Vicente', 'SP', 11310050, 12, NULL, 13921097890, 'zilda.campos@example.com'),
('Henrique Monteiro', 26272829301, NULL, 'Rua Ceará', 'Centro', 'Guarujá', 'SP', 11410030, 40, 'Casa 4', 13919876543, 'henrique.monteiro@example.com'),
('Isabela Furtado', 27282930311, NULL, 'Av. Ademar de Barros', 'Centro', 'Guarujá', 'SP', 11410040, 80, 'Loja 2', 13918765432, 'isabela.furtado@example.com'),
('Jonas Azevedo', 28293031321, NULL, 'Rua Venezuela', 'Boqueirão', 'Santos', 'SP', 11045100, 55, 'Casa 6', 13917654321, 'jonas.azevedo@example.com'),
('Kelly Moraes', 29303132331, NULL, 'Rua México', 'Boqueirão', 'Santos', 'SP', 11045200, 65, 'Apto 305', 13916543210, 'kelly.moraes@example.com'),
('Lucas Peixoto', 30313233341, NULL, 'Rua Colômbia', 'Gonzaga', 'Santos', 'SP', 11055300, 75, 'Apto 807', 13915432109, 'lucas.peixoto@example.com'),
('Mariana Tavares', 31323334351, NULL, 'Rua Peru', 'Gonzaga', 'Santos', 'SP', 11055400, 85, 'Casa 8', 13914321098, 'mariana.tavares@example.com'),

-- Clientes PJ (41-60)
('Tech Solutions LTDA', NULL, 12345678000195, 'Rua das Inovações', 'Centro', 'São Paulo', 'SP', 01000000, 100, 'Andar 5', 1133221100, 'contato@techsolutions.com.br'),
('Comercial Andrade ME', NULL, 23456789000166, 'Av. Industrial', 'Distrito', 'Campinas', 'SP', 13000000, 245, 'Sala 2', 1923456789, 'vendas@andrademe.com.br'),
('Construtora Ideal S/A', NULL, 34567890000177, 'Rua das Obras', 'Engenho Velho', 'Santos', 'SP', 11075200, 80, NULL, 1334455566, 'suporte@construtoraideal.com.br'),
('Green Market Alimentos LTDA', NULL, 45678901000188, 'Alameda das Palmeiras', 'Jardins', 'São Vicente', 'SP', 11340000, 51, 'Loja A', 13988776655, 'sac@greenmarket.com.br'),
('Fast Courier Transportes', NULL, 56789012000199, 'Rodovia dos Bandeirantes', 'Polo Industrial', 'Guarujá', 'SP', 11420000, 3000, 'Galpão 3', 13999887766, 'logistica@fastcourier.com.br'),
('Sigma Tech Corp', NULL, 60708090000110, 'Rua do Progresso', 'Tecno Park', 'São Paulo', 'SP', 02000000, 500, 'Bloco A', 1133445566, 'contato@sigmatech.com'),
('Alpha Jurídico S/S', NULL, 61718192000121, 'Av. das Nações', 'Centro', 'Campinas', 'SP', 13000050, 350, 'Conj. 501', 1933556677, 'contato@alphajuridico.com.br'),
('Beta Financeira S/A', NULL, 62728293000132, 'Rua do Comércio', 'Centro', 'Santos', 'SP', 11015010, 200, 'Andar 10', 1333667788, 'relacionamento@betafinanceira.com.br'),
('Gamma Indústria LTDA', NULL, 63738394000143, 'Av. das Indústrias', 'Distrito Industrial', 'São Vicente', 'SP', 11350000, 800, NULL, 1344778899, 'contato@gammaind.com'),
('Delta Serviços ME', NULL, 64748596000154, 'Rua Projetada', 'Bairro Novo', 'Praia Grande', 'SP', 11703000, 45, 'Loja 4', 13912345678, 'contato@deltaservicos.com'),
('Epsilon Logística LTDA', NULL, 65758697000165, 'Rod. Anchieta', 'Polo Logístico', 'Santos', 'SP', 11080000, 9000, 'Galpão 1', 13923456789, 'operacoes@epsilonlog.com'),
('Omega Comercial S/A', NULL, 66768798000176, 'Rua Central', 'Centro', 'Guarujá', 'SP', 11411000, 60, 'Casa 10', 13934567890, 'contato@omegacomercial.com'),
('Nova Energia LTDA', NULL, 67778899000187, 'Av. Solar', 'Parque Verde', 'Campinas', 'SP', 13090000, 1000, 'Torre 2', 19345678901, 'contato@novaenergia.com'),
('Prime Saúde S/A', NULL, 68788991000198, 'Rua Vital', 'Jardim Saúde', 'São Paulo', 'SP', 04000000, 320, 'Bloco B', 11456789012, 'contato@primesaude.com'),
('Global Turismo ME', NULL, 69799002000109, 'Av. das Viagens', 'Centro', 'Santos', 'SP', 11020000, 40, 'Loja 10', 13367890123, 'contato@globalturismo.com'),
('Oceanic Navegações LTDA', NULL, 70709103000110, 'Porto Marítimo', 'Zona Portuária', 'Santos', 'SP', 11030000, 1, 'Cais 2', 13378901234, 'contato@oceanicnav.com'),
('Atlântica Seguros S/A', NULL, 71719204000121, 'Rua das Garantias', 'Centro', 'São Paulo', 'SP', 01002000, 210, 'Andar 12', 11389012345, 'contato@atlanticaseguros.com'),
('Vita Plano de Saúde', NULL, 72729305000132, 'Av. da Saúde', 'Vila Nova', 'Santos', 'SP', 11065060, 70, 'Bloco C', 13390123456, 'contato@vitaplan.com');


-- Inserção massiva de Processos
INSERT INTO Processo (cd_NumeroProcesso, nm_Autor, nm_Reu, ds_Juizo, ds_Acao, nm_Cidade, sg_Tribunal, vl_Causa) 
VALUES 
('0001111-20.2023.8.26.0001', 'Carlos Silva', 'Empresa XYZ Ltda', 'Vara Cível', 'Danos Morais', 'São Paulo', 'TJSP', 50000.00),
('0002222-30.2023.8.26.0002', 'Maria Souza', 'Banco ABC S/A', 'Vara Cível', 'Revisão Contratual', 'São Paulo', 'TJSP', 75000.00),
('0003333-40.2023.8.26.0003', 'Fernando Lima', 'Seguradora Segura', 'Vara Cível', 'Ação de Seguro', 'Santos', 'TJSP', 120000.00),
('0004444-50.2023.8.26.0004', 'Juliana Costa', 'Concessionária Vias', 'Vara de Fazenda Pública', 'Indenização por Acidente', 'Santos', 'TJSP', 95000.00),
('0005555-60.2023.8.26.0005', 'Roberto Almeida', 'Plano de Saúde Vida+', 'Vara Cível', 'Cobertura de Tratamento', 'São Vicente', 'TJSP', 300000.00),
('0006666-70.2023.8.26.0006', 'Tatiane Rocha', 'Loja de Eletrodomésticos EletroMax', 'Vara Cível', 'Defeito em Produto', 'São Vicente', 'TJSP', 10000.00),
('0007777-80.2023.8.26.0007', 'Marcos Ribeiro', 'Construtora ABC', 'Vara Cível', 'Rescisão Contratual', 'Guarujá', 'TJSP', 185000.00),
('0008888-90.2023.8.26.0008', 'Vanessa Martins', 'Operadora Móvel Telecom', 'Vara Cível', 'Cobrança Indevida', 'Guarujá', 'TJSP', 15000.00),
('0009999-00.2023.8.26.0009', 'Luciano Carvalho', 'Comércio de Veículos AutoCar', 'Vara Cível', 'Vício Oculto em Veículo', 'Praia Grande', 'TJSP', 45000.00),
('0010000-10.2023.8.26.0010', 'Priscila Ferreira', 'Faculdade Universitas', 'Vara do Consumidor', 'Cobrança Indevida de Mensalidade', 'Praia Grande', 'TJSP', 8000.00),
('0011000-11.2023.8.26.0011', 'André Gomes', 'Tech Solutions LTDA', 'Vara Cível', 'Cobrança de Serviços', 'São Paulo', 'TJSP', 150000.00),
('0012000-12.2023.8.26.0012', 'Beatriz Nunes', 'Banco XYZ S/A', 'Vara Cível', 'Revisão de Financiamento', 'São Paulo', 'TJSP', 200000.00),
('0013000-13.2023.8.26.0013', 'Caio Santos', 'Construtora Ideal S/A', 'Vara Cível', 'Rescisão Contratual', 'Santos', 'TJSP', 180000.00),
('0014000-14.2023.8.26.0014', 'Eduardo Faria', 'Fast Courier Transportes', 'Vara Cível', 'Indenização por Extravio de Encomenda', 'Guarujá', 'TJSP', 30000.00),
('0015000-15.2023.8.26.0015', 'Fernanda Alves', 'Prime Saúde S/A', 'Vara do Consumidor', 'Cobertura de Exame Médico', 'São Paulo', 'TJSP', 25000.00),
('0016000-16.2023.8.26.0016', 'Gustavo Teles', 'Vita Plano de Saúde', 'Vara do Consumidor', 'Reembolso de Despesa Médica', 'Santos', 'TJSP', 18000.00),
('0017000-17.2023.8.26.0017', 'Helena Ramos', 'Atlântica Seguros S/A', 'Vara Cível', 'Indenização Securitária', 'São Paulo', 'TJSP', 220000.00),
('0018000-18.2023.8.26.0018', 'Igor Cardoso', 'Gamma Indústria LTDA', 'Vara do Trabalho', 'Verbas Rescisórias', 'São Vicente', 'TRT2', 75000.00),
('0019000-19.2023.8.26.0019', 'Jéssica Moraes', 'Comercial Andrade ME', 'Vara Cível', 'Cobrança de Comissão', 'Campinas', 'TJSP', 40000.00),
('0020000-20.2023.8.26.0020', 'Luana Vieira', 'Nova Energia LTDA', 'Vara Cível', 'Responsabilidade Civil', 'Campinas', 'TJSP', 600000.00);

-- Associação Cliente_Processo
INSERT INTO Cliente_Processo (cd_Cliente, cd_Processo, cd_PosicaoAcao)
VALUES
    (1, 1, 1), (2, 2, 1), (3, 3, 1), (4, 4, 1),
    (5, 5, 1), (6, 6, 1), (7, 7, 1), (8, 8, 1),
    (9, 9, 1), (10, 10, 1), (11, 11, 1), (12, 12, 1),
    (13, 13, 1), (14, 14, 1), (15, 15, 1), (16, 16, 1),
    (17, 17, 1), (18, 18, 1), (19, 19, 1), (20, 20, 1);

-- Intimações distribuídas no tempo (passadas, recentes, futuras)
INSERT INTO Intimacao (dt_Recebimento, cd_Processo, ds_Intimacao) 
VALUES 
-- Antigas
('2024-02-01 00:00:00', 1, 'Intimação para apresentação de contestação no prazo de 15 dias.'),
('2024-05-15 00:00:00', 5, 'Intimação para juntada de documentos médicos.'),
('2024-09-10 00:00:00', 10, 'Intimação para manifestação sobre proposta de acordo.'),
('2025-01-20 00:00:00', 15, 'Intimação para apresentação de réplica.'),
('2025-03-05 00:00:00', 20, 'Intimação de designação de audiência de instrução.'),

-- 2025 em meses variados
('2025-06-10 00:00:00', 5, 'Intimação para especificação de provas.'),
('2025-08-22 00:00:00', 10, 'Intimação para apresentação de memoriais.'),
('2025-10-10 00:00:00', 15, 'Intimação para cumprimento de sentença.'),

-- Recentes (novembro/2025)
('2025-11-20 00:00:00', 1, 'Intimação para apresentar documentos complementares.'),
('2025-11-25 00:00:00', 2, 'Intimação para manifestação sobre laudo pericial.'),
('2025-11-28 00:00:00', 3, 'Intimação para apresentar rol de testemunhas.'),

-- Intimações com foco em tarefas a vencer (próxima semana)
('2025-12-01 00:00:00', 4, 'Intimação para contestação com prazo de 15 dias.'),
('2025-12-03 00:00:00', 6, 'Intimação para juntada de documentos em 5 dias.'),

-- Futuras em 2026
('2026-01-15 00:00:00', 7, 'Intimação para audiência de conciliação designada.'),
('2026-03-10 00:00:00', 8, 'Intimação para apresentação de cálculos de liquidação.'),
('2026-06-05 00:00:00', 9, 'Intimação para manifestação sobre impugnação ao cumprimento de sentença.');

-- Inserção de Tarefas (passadas, futuras e "a vencer")
INSERT INTO Tarefa (cd_Intimacao, dt_Registro, dt_Prazo, cd_Colaborador, cd_StatusTarefa, cd_TipoTarefa, ds_Tarefa) VALUES
-- 1) Prazos já vencidos
(1, '2024-02-01 09:00:00', '2024-02-16', 1, 3, 6, 'Protocolar contestação dentro do prazo legal.'),
(1, '2024-02-01 10:30:00', '2024-02-18', 2, 3, 10, 'Comprovar pagamento de custas iniciais.'),
(2, '2024-05-15 14:00:00', '2024-05-25', 3, 3, 5, 'Elaborar petição de juntada de documentos médicos.'),
(2, '2024-05-16 09:15:00', '2024-05-28', 4, 3, 9, 'Organizar laudos médicos recebidos do cliente.'),
(3, '2024-09-10 11:00:00', '2024-09-20', 5, 3, 15, 'Agendar reunião com cliente para avaliar proposta.'),
(3, '2024-09-11 16:00:00', '2024-09-25', 6, 3, 21, 'Reporte ao cliente sobre andamento da negociação.'),
(4, '2025-01-20 09:30:00', '2025-02-05', 7, 3, 5, 'Elaborar réplica detalhada.'),
(4, '2025-01-21 10:00:00', '2025-02-10', 8, 3, 11, 'Especificar provas a serem produzidas.'),
(5, '2025-03-05 13:00:00', '2025-03-25', 1, 3, 8, 'Arrolar testemunhas para audiência de instrução.'),
(5, '2025-03-06 09:45:00', '2025-03-28', 2, 3, 24, 'Analisar intimação e preparar estratégia para audiência.'),

-- 2) Tarefas futuras (prazos bem distantes)
(6, '2025-06-10 10:00:00', '2026-01-10', 3, 1, 9, 'Organizar documentos e definir provas adicionais.'),
(6, '2025-06-11 15:30:00', '2026-02-01', 4, 1, 22, 'Organização de documentos físicos do processo.'),
(7, '2025-08-22 09:00:00', '2026-03-15', 5, 1, 2, 'Preparar minuta de memoriais.'),
(7, '2025-08-23 11:30:00', '2026-03-20', 6, 2, 18, 'Solicitar pagamento (cliente) referente a honorários complementares.'),
(8, '2025-10-10 08:30:00', '2026-04-10', 7, 1, 14, 'Acompanhar cumprimento de sentença.'),
(8, '2025-10-11 16:45:00', '2026-04-20', 8, 2, 25, 'Comprovar cumprimento de obrigação pelo cliente.'),

-- 3) Tarefas recentes (novembro/2025)
(9, '2025-11-20 09:15:00', '2025-11-28', 1, 2, 4, 'Recolher custas complementares.'),
(9, '2025-11-21 10:00:00', '2025-11-30', 2, 2, 3, 'Incidente de desconsideração de personalidade jurídica.'),
(10, '2025-11-25 14:20:00', '2025-12-10', 3, 1, 13, 'Elaborar cálculo de liquidação.'),
(10, '2025-11-26 15:10:00', '2025-12-12', 4, 1, 20, 'Solicitar informações (cliente) para conferência dos cálculos.'),
(11, '2025-11-28 11:00:00', '2025-12-05', 5, 1, 17, 'Especificação de provas testemunhais.'),
(11, '2025-11-29 09:50:00', '2025-12-07', 6, 1, 19, 'Reporte ao cliente sobre estratégia probatória.'),

-- 4) Tarefas "a vencer" (até 2025-12-06, considerando 2025-12-03)
(12, '2025-12-01 09:00:00', '2025-12-04', 7, 1, 1, 'Analisar intimação e iniciar minuta de contestação.'),
(12, '2025-12-01 15:30:00', '2025-12-06', 8, 1, 6, 'Concluir e protocolar contestação.'),
(13, '2025-12-03 08:45:00', '2025-12-05', 1, 1, 5, 'Elaborar petição de juntada de documentos.'),
(13, '2025-12-03 10:15:00', '2025-12-06', 2, 1, 16, 'Cumprimento de sentença parcial relacionado aos documentos.'),

-- 5) Mais tarefas futuras para volume
(14, '2026-01-15 09:00:00', '2026-02-01', 3, 1, 7, 'Protocolar petição inicial de execução.'),
(14, '2026-01-16 10:30:00', '2026-02-10', 4, 1, 23, 'Análise de intimação e documentos anexos.'),
(15, '2026-03-10 11:40:00', '2026-03-25', 5, 1, 26, 'Despachar com juízo sobre cálculos apresentados.'),
(15, '2026-03-11 16:00:00', '2026-03-28', 6, 1, 27, 'Organizar documentos contábeis enviados pelo perito.'),
(16, '2026-06-05 09:20:00', '2026-06-20', 7, 1, 28, 'Preparar impugnação ao cumprimento de sentença.'),
(16, '2026-06-06 15:45:00', '2026-06-30', 8, 1, 29, 'Recurso - Apelação em caso de improcedência.');

-- Inserção de novos processos com a utilização da Stored Procedure
-- 1. Processo com Cliente 1 como Réu
CALL Proc_Insercao_ProcessoCliente(
    '0011111-11.2024.8.26.0011',   		-- Número do processo
    1,                             		-- cd_Cliente (Carlos Silva)
    2,                             		-- Posição na ação (2 = Réu)
    'Banco Nacional',              		-- Autor
    'Carlos Silva',                		-- Réu (nosso cliente)
    'Vara Cível',                  		-- Juízo
    'Execução de Título Extrajudicial', -- Ação
    'São Paulo',                   		-- Cidade
    'TJSP',                        		-- Tribunal
    25000.00                       		-- Valor da causa
);

-- 2. Processo com Cliente 3 como Réu
CALL Proc_Insercao_ProcessoCliente(
    '0012222-22.2024.8.26.0012',  	 	-- Número do processo
    3,                             		-- cd_Cliente (Fernando Lima)
    2,                             		-- Posição na ação (2 = Réu)
    'Construtora Alfa',            		-- Autor
    'Fernando Lima',               		-- Réu (nosso cliente)
    'Vara Cível',                  		-- Juízo
    'Indenização por Obra Inacabada', 	-- Ação
    'Santos',                      		-- Cidade
    'TJSP',                        		-- Tribunal
    180000.00                      		-- Valor da causa
);

-- 3. Processo com Cliente 5 como Réu
CALL Proc_Insercao_ProcessoCliente(
    '0013333-33.2024.8.26.0013',   -- Número do processo
    5,                             -- cd_Cliente (Roberto Almeida)
    2,                             -- Posição na ação (2 = Réu)
    'Plano de Saúde Vital',        -- Autor
    'Roberto Almeida',             -- Réu (nosso cliente)
    'Vara do Consumidor',          -- Juízo
    'Cobrança Indevida',           -- Ação
    'São Vicente',                 -- Cidade
    'TJSP',                        -- Tribunal
    12000.00                       -- Valor da causa
);

-- 4. Processo com Cliente 7 como Terceiro
CALL Proc_Insercao_ProcessoCliente(
    '0014444-44.2024.8.26.0014',   -- Número do processo
    7,                             -- cd_Cliente (Marcos Ribeiro)
    3,                             -- Posição na ação (3 = Terceiro)
    'João da Silva',               -- Autor
    'Empresa Beta',                -- Réu
    'Vara Cível',                  -- Juízo
    'Responsabilidade Civil',      -- Ação
    'Guarujá',                     -- Cidade
    'TJSP',                        -- Tribunal
    75000.00                       -- Valor da causa
);

-- 5. Processo com Cliente 9 como Terceiro
CALL Proc_Insercao_ProcessoCliente(
    '0015555-55.2024.8.26.0015',   -- Número do processo
    9,                             -- cd_Cliente (Luciano Carvalho)
    3,                             -- Posição na ação (3 = Terceiro)
    'Maria Oliveira',              -- Autor
    'Concessionária Delta',        -- Réu
    'Vara Cível',                  -- Juízo
    'Vício Oculto em Veículo',     -- Ação
    'Praia Grande',                -- Cidade
    'TJSP',                        -- Tribunal
    35000.00                       -- Valor da causa
);

USE bd_aj;
SELECT * FROM Processo;
SELECT * FROM Cliente;
SELECT * FROM Colaborador;
SELECT * FROM Tarefa;
SELECT * FROM Intimacao;
SELECT COUNT(*) FROM Processo;
SELECT * FROM TipoTarefa;

SELECT 
    i.cd_Intimacao,
    i.dt_Recebimento,
    i.ds_Intimacao,
    p.cd_NumeroProcesso,
    p.nm_Autor,
    p.nm_Reu
FROM 
    Intimacao i
JOIN 
    Processo p ON i.cd_Processo = p.cd_Processo
LEFT JOIN 
    Cliente_Processo cp ON p.cd_Processo = cp.cd_Processo
LEFT JOIN 
    Cliente c ON cp.cd_Cliente = c.cd_Cliente
WHERE 
    p.cd_NumeroProcesso = '0003333-40.2023.8.26.0003'
    AND (
        p.nm_Autor LIKE 'Fernando Lima' OR
        p.nm_Reu LIKE 'Fernando Lima' OR
        c.nm_Cliente LIKE 'Fernando Lima'
    );
    
    
SELECT 
	c.nm_Cliente AS 'Cliente',
    GROUP_CONCAT(p.cd_NumeroProcesso SEPARATOR '\n') AS 'Processo'
FROM Cliente_Processo cp
INNER JOIN Cliente c ON c.cd_Cliente = cp.cd_Cliente
INNER JOIN Processo p ON p.cd_Processo = cp.cd_Processo
GROUP BY c.nm_Cliente; -- Esse só traz UM UNICO processo (Não serve)

SELECT c.*, p.cd_NumeroProcesso, p.cd_Processo
FROM Cliente_Processo cp
INNER JOIN Cliente c ON c.cd_Cliente = cp.cd_Cliente
INNER JOIN Processo p ON p.cd_Processo = cp.cd_Processo;

SELECT
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
                GROUP_CONCAT(p.cd_NumeroProcesso SEPARATOR ' @ ') AS 'cd_numProcessos'
            FROM Cliente c
            INNER JOIN Cliente_Processo cp ON cp.cd_Cliente = c.cd_Cliente
            INNER JOIN Processo p ON cp.cd_Processo = p.cd_Processo
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
                c.ds_Email;
                
SELECT C.nm_Cliente, C.cd_Telefone, C.ds_Email, P.cd_Processo, P.cd_NumeroProcesso, 
                P.nm_Autor, P.nm_Reu, P.nm_Cidade, P.vl_Causa, P.ds_Juizo, P.ds_Acao, P.sg_Tribunal
                FROM Processo P
                JOIN Cliente_Processo CP ON CP.cd_Processo = P.cd_Processo
                JOIN Cliente C ON C.cd_Cliente = CP.cd_Cliente
                WHERE P.nm_Autor = "Carlos Silva";
                
CALL PDFDownloadCase(3, 1, "");

-- TESTE DE "STRESS" (ATUALIZADO)
-- Objetivo: gerar grande volume de dados com datas coerentes em torno de 2025-11-30

-- 1) Inserir 200 clientes de teste adicionais (PF)
INSERT INTO Cliente (nm_Cliente, cd_CPF, cd_CNPJ, nm_Logradouro, nm_Bairro, nm_Cidade, sg_Estado, cd_CEP, cd_NumeroEndereco, ds_ComplementoEndereco, cd_Telefone, ds_Email)
SELECT 
    CONCAT('Cliente ', n) AS nm_Cliente,
    80000000000 + n AS cd_CPF,
    NULL AS cd_CNPJ,
    CONCAT('Rua Teste ', n) AS nm_Logradouro,
    'Centro' AS nm_Bairro,
    CASE WHEN n % 4 = 0 THEN 'Santos'
         WHEN n % 4 = 1 THEN 'São Vicente'
         WHEN n % 4 = 2 THEN 'Guarujá'
         ELSE 'Praia Grande' END AS nm_Cidade,
    'SP' AS sg_Estado,
    11000000 + n AS cd_CEP,
    n AS cd_NumeroEndereco,
    'Apto 10' AS ds_ComplementoEndereco,
    13990000000 + n AS cd_Telefone,
    CONCAT('cliente.teste', n, '@teste.com') AS ds_Email
FROM (
    SELECT @rownum2 := @rownum2 + 1 AS n FROM 
    (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 
     UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL 
     SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a,
    (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 
     UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL 
     SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b,
    (SELECT 0 UNION ALL SELECT 1) c, -- 10*10*2 = 200
    (SELECT @rownum2 := 0) r
) t
LIMIT 200;

-- 2) Cada novo cliente recebe 5 processos em 2025/2026
INSERT INTO Processo (cd_NumeroProcesso, nm_Autor, nm_Reu, ds_Juizo, ds_Acao, nm_Cidade, sg_Tribunal, vl_Causa, cd_FaseProcesso)
SELECT 
    CONCAT(LPAD(c.cd_Cliente, 6, '0'), '-', LPAD(p, 2, '0'), '.2025.8.26.0001') AS cd_NumeroProcesso,
    c.nm_Cliente AS nm_Autor,
    CONCAT('Empresa Ré ', p) AS nm_Reu,
    'Vara Cível' AS ds_Juizo,
    'Ação de Cobrança de Teste' AS ds_Acao,
    c.nm_Cidade AS nm_Cidade,
    'TJSP' AS sg_Tribunal,
    5000 * p AS vl_Causa,
    FLOOR(1 + RAND() * 4) AS cd_FaseProcesso
FROM Cliente c
JOIN (SELECT 1 AS p UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) x
WHERE c.nm_Cliente LIKE 'Cliente %';

-- 3) Vincula cada cliente de stress aos seus processos como Autor
INSERT INTO Cliente_Processo (cd_Cliente, cd_Processo, cd_PosicaoAcao)
SELECT 
    c.cd_Cliente,
    p.cd_Processo,
    1 AS cd_PosicaoAcao
FROM Cliente c
JOIN Processo p ON p.nm_Autor = c.nm_Cliente
WHERE c.nm_Cliente LIKE 'Cliente %';

-- 4) Gera 3 intimações por processo, com datas espalhadas em 2025/2026
-- - Uma em data passada (~2025-09)
-- - Uma perto de hoje (~2025-11/12)
-- - Uma mais futura (~2026)
INSERT INTO Intimacao (dt_Recebimento, cd_Processo, ds_Intimacao)
SELECT 
    DATE_ADD('2025-09-01', INTERVAL FLOOR(RAND() * 30) DAY) AS dt_Recebimento,
    p.cd_Processo,
    CONCAT('Intimação passada para processo ', p.cd_NumeroProcesso) AS ds_Intimacao
FROM Processo p
WHERE p.nm_Autor LIKE 'Cliente %';

INSERT INTO Intimacao (dt_Recebimento, cd_Processo, ds_Intimacao)
SELECT 
    DATE_ADD('2025-11-20', INTERVAL FLOOR(RAND() * 20) DAY) AS dt_Recebimento,
    p.cd_Processo,
    CONCAT('Intimação atual para processo ', p.cd_NumeroProcesso) AS ds_Intimacao
FROM Processo p
WHERE p.nm_Autor LIKE 'Cliente %';

INSERT INTO Intimacao (dt_Recebimento, cd_Processo, ds_Intimacao)
SELECT 
    DATE_ADD('2026-02-01', INTERVAL FLOOR(RAND() * 120) DAY) AS dt_Recebimento,
    p.cd_Processo,
    CONCAT('Intimação futura para processo ', p.cd_NumeroProcesso) AS ds_Intimacao
FROM Processo p
WHERE p.nm_Autor LIKE 'Cliente %';

-- 5) Cria 4 tarefas para cada intimação
--   - 2 com prazo já vencido (prazo 10-20 dias após dt_Recebimento em 2025-09 ou 2025-11)
--   - 1 com prazo "a vencer" (entre 2025-12-03 e 2025-12-06)
--   - 1 com prazo bem futuro (ao longo de 2026)
INSERT INTO Tarefa (cd_Intimacao, dt_Registro, dt_Prazo, cd_Colaborador, cd_StatusTarefa, cd_TipoTarefa, ds_Tarefa)
SELECT 
    i.cd_Intimacao,
    i.dt_Recebimento,
    DATE_ADD(i.dt_Recebimento, INTERVAL 10 DAY) AS dt_Prazo,
    FLOOR(1 + RAND() * 8) AS cd_Colaborador,
    3 AS cd_StatusTarefa,
    (SELECT cd_TipoTarefa FROM TipoTarefa ORDER BY RAND() LIMIT 1),
    CONCAT('Tarefa vencida automática (1) para intimação ', i.cd_Intimacao)
FROM Intimacao i
JOIN Processo p ON p.cd_Processo = i.cd_Processo
WHERE p.nm_Autor LIKE 'Cliente %';

INSERT INTO Tarefa (cd_Intimacao, dt_Registro, dt_Prazo, cd_Colaborador, cd_StatusTarefa, cd_TipoTarefa, ds_Tarefa)
SELECT 
    i.cd_Intimacao,
    DATE_ADD(i.dt_Recebimento, INTERVAL 1 DAY) AS dt_Registro,
    DATE_ADD(i.dt_Recebimento, INTERVAL 20 DAY) AS dt_Prazo,
    FLOOR(1 + RAND() * 8) AS cd_Colaborador,
    2 AS cd_StatusTarefa,
    (SELECT cd_TipoTarefa FROM TipoTarefa ORDER BY RAND() LIMIT 1),
    CONCAT('Tarefa vencida automática (2) para intimação ', i.cd_Intimacao)
FROM Intimacao i
JOIN Processo p ON p.cd_Processo = i.cd_Processo
WHERE p.nm_Autor LIKE 'Cliente %';

-- Tarefas a vencer: prazo fixo entre 2025-12-03 e 2025-12-06
INSERT INTO Tarefa (cd_Intimacao, dt_Registro, dt_Prazo, cd_Colaborador, cd_StatusTarefa, cd_TipoTarefa, ds_Tarefa)
SELECT 
    i.cd_Intimacao,
    '2025-12-01 09:00:00' AS dt_Registro,
    DATE_ADD('2025-12-03', INTERVAL (i.cd_Intimacao % 4) DAY) AS dt_Prazo,
    FLOOR(1 + RAND() * 8) AS cd_Colaborador,
    1 AS cd_StatusTarefa,
    (SELECT cd_TipoTarefa FROM TipoTarefa ORDER BY RAND() LIMIT 1),
    CONCAT('Tarefa a vencer automática para intimação ', i.cd_Intimacao)
FROM Intimacao i
JOIN Processo p ON p.cd_Processo = i.cd_Processo
WHERE p.nm_Autor LIKE 'Cliente %';

-- Tarefas futuras: prazo em 2026
INSERT INTO Tarefa (cd_Intimacao, dt_Registro, dt_Prazo, cd_Colaborador, cd_StatusTarefa, cd_TipoTarefa, ds_Tarefa)
SELECT 
    i.cd_Intimacao,
    DATE_ADD(i.dt_Recebimento, INTERVAL 5 DAY) AS dt_Registro,
    -- Garantir prazos longos em 2026: base 2026-01-01 + até ~300 dias
    DATE_ADD('2026-01-01', INTERVAL (i.cd_Intimacao % 300) DAY) AS dt_Prazo,
    FLOOR(1 + RAND() * 8) AS cd_Colaborador,
    1 AS cd_StatusTarefa,
    (SELECT cd_TipoTarefa FROM TipoTarefa ORDER BY RAND() LIMIT 1),
    CONCAT('Tarefa futura automática (2026) para intimação ', i.cd_Intimacao)
FROM Intimacao i
JOIN Processo p ON p.cd_Processo = i.cd_Processo
WHERE p.nm_Autor LIKE 'Cliente %';

-- RESULTADO ESPERADO (valores aproximados, dependem dos dados já existentes)
SELECT COUNT(*) FROM Cliente;   
SELECT COUNT(*) FROM Processo;  
SELECT COUNT(*) FROM Intimacao;
SELECT COUNT(*) FROM Tarefa;    
