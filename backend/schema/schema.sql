-- Criação do Banco de Dados
-- DROP DATABASE IF EXISTS BD_AJ;
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
		SET @mensagem = CONCAT(	'Não foi possível concluir a exclusão, pois o cliente está vinculado aos autos: ', 
								(SELECT GROUP_CONCAT(p.cd_NumeroProcesso SEPARATOR ', ')
								FROM Processo p
								INNER JOIN Cliente_Processo cp ON cp.cd_Processo = p.cd_Processo
								WHERE cp.cd_Cliente = 1));
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
    IF NOT EXISTS (	SELECT cd_Intimacao
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

-- INSERÇÃO DE DADOS

-- Inserção de Tribunais
INSERT INTO Tribunal (sg_Tribunal, nm_Tribunal) 
VALUES  ('TJSP', 'Tribunal de Justiça de São Paulo'),
        ('TRT2', 'Tribunal Regional do Trabalho da 2ª Região'),
        ('TRF3', 'Tribunal Regional Federal da 3ª Região'),
        ('TST', 'Superior Tribunal do Trabalho'),
        ('STJ', 'Superior Tribunal de Justiça'),
        ('STF', 'Supremo Tribunal Federal');
	
-- Inserção de Fases de Processo
INSERT INTO FaseProcesso (cd_FaseProcesso, nm_FaseProcesso)
VALUES	(1, 'Conhecimento'),
        (2, 'Recursal'),
        (3, 'Execução'),
        (4, 'Finalizado'),
        (5, 'Cancelado');

-- Inserção de tipo de Colaborador
INSERT INTO TipoColaborador (cd_TipoColaborador, nm_TipoColaborador) 
VALUES
(1, 'Administrador do Sistema'),
(2, 'Advogado'),
(3, 'Assistente'),
(4, 'Estagiário');

-- Inserção de tipos de participação do cliente no processo
INSERT INTO Posicao_na_Acao (cd_PosicaoAcao, nm_PosicaoAcao)
VALUES
    (1, 'Autor'),
    (2, 'Réu'),
    (3, 'Terceiro');    

-- Inserção de Status da Tarefa
INSERT INTO StatusTarefa (cd_StatusTarefa, nm_StatusTarefa) 
VALUES
(1, 'Aguardando'),
(2, 'Em andamento'),
(3, 'Concluído');

INSERT INTO TipoTarefa (nm_TipoTarefa) VALUES
-- Petições e atos processuais
('Despachar com Juízo'),
('Diligência externa'),
('Incidente de Desconsideração PJ'),
('Pedido de habilitação'),
('Petição Diversa'),
('Petição Inicial'),
('Protocolar petição'),

-- Provas
('Arrolar testemunhas'),
('Especificação de provas'),

-- Custas e cálculos
('Comprovar pagamento'),
('Comprovar recolhimento de custas'),
('Elaborar cálculo'),
('Recolher custas'),

-- Execução
('Cumprimento de Sentença'),

-- Comunicação com cliente
('Agendar reunião com cliente'),
('Reporte ao cliente'),
('Solicitar cumprimento de obrigação (cliente)'),
('Solicitar documento (cliente)'),
('Solicitar informações (cliente)'),
('Solicitar pagamento (cliente)'),
('Comprovar cumprimento de obrigação'),

-- Administração
('Organização de documentos'),
('Análise de intimação'),

-- Recursos
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
        
-- Inserção Colaborador
INSERT INTO Colaborador (
    nm_Colaborador, cd_CPF, nm_Logradouro, nm_Bairro, 
    nm_Cidade, sg_Estado, cd_CEP, cd_NumeroEndereco, ds_ComplementoEndereco, 
    cd_Telefone, ds_Email, nm_Usuario, ds_Senha, cd_TipoColaborador)
VALUES
('Ana Paula', 45678901234, 'Rua XV de Novembro', 'Gonzaga', 'Santos', 'SP', 11055000, 191, 'Apto 32', '11977773333', 'ana@email.com', 'ana_paula', SHA2('123', 256), 2),
('João Mendes', 56789012345, 'Avenida Ana Costa', 'Boqueirão', 'Santos', 'SP', 11060001, 71, 'Sala 5', '13966664444', 'joao@email.com', 'joao_mendes', SHA2('123', 256), 4),
('Laura Ferreira', 67890123456, 'Rua São Francisco', 'Centro', 'São Vicente', 'SP', 11310000, 86, 'Casa 2', '13955552222', 'laura@email.com', 'laura_ferreira', SHA2('123', 256), 3),
('Carlos Magalhães', 78901234567, 'Praça dos Expedicionários', 'Embaré', 'Santos', 'SP', 11015000, 84, 'Bloco B', '13944441111', 'carlos@email.com', 'carlos_m', SHA2('123', 256), 2),
('Paula Amaral', 89012345678, 'Avenida Conselheiro Nébias', 'Campo Grande', 'Santos', 'SP', 11045001, 94, 'Apto 101', '13933336666', 'paula@email.com', 'paula_amaral', SHA2('123', 256), 2),
('Felipe Borges', 90123456789, 'Rua Euclides da Cunha', 'Vila Mathias', 'Santos', 'SP', 11065000, 17, NULL, '13922227777', 'felipe@email.com', 'felipe_borges', SHA2('123', 256), 4),
('Renata Xavier', 12309876543, 'Alameda Dino Bueno', 'Ponta da Praia', 'Santos', 'SP', 11030000, 8, 'Apto 302', '11911118888', 'renata@email.com', 'renata_x', SHA2('123', 256), 3),
('Amanda Lopes', 34509876543, 'Rua Oswaldo Cruz', 'José Menino', 'Santos', 'SP', 11065050, 63, 'Casa dos fundos', '11999997777', 'amanda@email.com', 'amanda_l', SHA2('123', 256), 4);

-- Inserção Clientes
INSERT INTO Cliente 
    (nm_Cliente, cd_CPF, cd_CNPJ, nm_Logradouro, nm_Bairro, 
    nm_Cidade, sg_Estado, cd_CEP, cd_NumeroEndereco, ds_ComplementoEndereco, 
    cd_Telefone, ds_Email) 
VALUES
('Carlos Silva', 12345678901, NULL, 'Rua João Pessoa', 'Vila Belmiro', 'Santos', 'SP', 11055030, 63, 'Apto 12', '11999990000', 'carlos@email.com'),
('Maria Souza', 23456789012, NULL, 'Avenida Bernardino de Campos', 'Boqueirão', 'Santos', 'SP', 11060002, 48, 'Sala 3', '11988881111', 'maria@email.com'),
('Fernando Lima', 34567890123, NULL, 'Rua Brás Cubas', 'Centro', 'Guarujá', 'SP', 11410000, 28, NULL, '13999992222', 'fernando@email.com'),
('Juliana Costa', 45678901234, NULL, 'Praça Mauá', 'Valongo', 'Santos', 'SP', 11010000, 91, 'Loja 5', '13977773333', 'juliana@email.com'),
('Roberto Almeida', 56789012345, NULL, 'Rua do Comércio', 'Encruzilhada', 'Santos', 'SP', 11055040, 37, 'Apto 45', '13966665555', 'roberto@email.com'),
('Tatiane Rocha', 67890123456, NULL, 'Avenida Washington Luiz', 'Piratininga', 'São Vicente', 'SP', 11330000, 28, 'Casa 7', '13955557777', 'tatiane@email.com'),
('Marcos Ribeiro', 78901234567, NULL, 'Alameda Ari Barroso', 'Marapé', 'Santos', 'SP', 11055050, 11, 'Apto 201', '13944449999', 'marcos@email.com'),
('Vanessa Martins', 89012345678, NULL, 'Rua da Constituição', 'Gonzaga', 'Santos', 'SP', 11055010, 64, NULL, '13933338888', 'vanessa@email.com'),
('Luciano Carvalho', 90123456789, NULL, 'Avenida Pinheiro Machado', 'Vila Nova', 'Santos', 'SP', 11065030, 73, 'Sala 10', '13922221111', 'luciano@email.com'),
('Priscila Ferreira', 12309876543, NULL, 'Rua São Bento', 'Centro', 'Praia Grande', 'SP', 11700000, 82, 'Apto 33', '13911116666', 'priscila@email.com'),
('Tech Solutions LTDA', NULL, 12345678000195, 'Rua das Inovações', 'Centro', 'São Paulo', 'SP', 01000000, 100, 'Andar 5', '1133221100', 'contato@techsolutions.com.br'),
('Comercial Andrade ME', NULL, 23456789000166, 'Avenida Industrial', 'Distrito', 'Campinas', 'SP', 13000000, 245, 'Sala 2', '1923456789', 'vendas@andrademe.com.br'),
('Construtora Ideal S/A', NULL, 34567890000177, 'Rua das Obras', 'Engenho Velho', 'Santos', 'SP', 11075200, 80, NULL, '1334455566', 'suporte@construtoraideal.com.br'),
('Green Market Alimentos LTDA', NULL, 45678901000188, 'Alameda das Palmeiras', 'Jardins', 'São Vicente', 'SP', 11340000, 51, 'Loja A', '13988776655', 'sac@greenmarket.com.br'),
('Fast Courier Transportes', NULL, 56789012000199, 'Rodovia dos Bandeirantes', 'Polo Industrial', 'Guarujá', 'SP', 11420000, 3000, 'Galpão 3', '13999887766', 'logistica@fastcourier.com.br');


-- Inserção de Processos
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
('0010000-10.2023.8.26.0010', 'Priscila Ferreira', 'Faculdade Universitas', 'Vara do Consumidor', 'Cobrança Indevida de Mensalidade', 'Praia Grande', 'TJSP', 8000.00);

INSERT INTO Cliente_Processo (cd_Cliente, cd_Processo, cd_PosicaoAcao)
VALUES
    (1, 1, 1),
    (2, 2, 1),
    (3, 3, 1),
    (4, 4, 1),
    (5, 5, 1),
    (6, 6, 1),
    (7, 7, 1),
    (8, 8, 1),
    (9, 9, 1),
    (10, 10, 1);

-- Inserção de Intimações
INSERT INTO Intimacao (dt_Recebimento, cd_Processo, ds_Intimacao) 
VALUES 
('2024-02-01', 1, 'Intimação para apresentação de contestação no prazo de 15 dias.'),
('2024-02-03', 2, 'Intimação para juntada de documentos comprobatórios.'),
('2024-02-05', 3, 'Intimação para audiência de conciliação agendada para 15/06/2025.'),
('2024-02-08', 4, 'Intimação para manifestação sobre o laudo pericial.'),
('2024-02-10', 5, 'Intimação sobre deferimento de pedido de tutela antecipada.'),
('2024-02-12', 6, 'Intimação para comparecimento à audiência preliminar em 20/07/2025.'),
('2024-02-15', 7, 'Intimação sobre abertura de prazo para razões finais.'),
('2024-02-18', 8, 'Intimação para apresentação de provas periciais até 01/06/2025.'),
('2024-02-20', 9, 'Intimação para responder ao recurso interposto pela parte ré.'),
('2024-02-22', 10, 'Intimação sobre despacho saneador e designação de audiência de instrução.'),
('2024-02-25', 1, 'Intimação para apresentação de contrarrazões ao agravo de instrumento.'),
('2024-02-28', 2, 'Intimação sobre decisão de improcedência do pedido e abertura de prazo recursal.'),
('2024-03-01', 3, 'Intimação para esclarecimento de pontos obscuros na petição inicial.'),
('2024-03-03', 4, 'Intimação para cumprimento de sentença no prazo de 30 dias.'),
('2024-03-05', 5, 'Intimação para retirada de alvará judicial expedido em favor do cliente.');

-- Inserção de Tarefas
INSERT INTO Tarefa (cd_Intimacao, dt_Registro, dt_Prazo, cd_Colaborador, cd_StatusTarefa, cd_TipoTarefa, ds_Tarefa) VALUES
(15, '2025-06-06 00:00:00', '2025-06-25', 8, 3, 10, 'Tarefa relacionada ao tipo 10.'),
(9, '2025-05-31 00:00:00', '2025-06-07', 7, 3, 21, 'Tarefa relacionada ao tipo 21.'),
(2, '2025-05-08 00:00:00', '2025-05-28', 3, 2, 11, 'Tarefa relacionada ao tipo 11.'),
(8, '2025-06-10 00:00:00', '2025-06-22', 1, 3, 26, 'Tarefa relacionada ao tipo 26.'),
(11, '2025-09-14 00:00:00', '2025-09-30', 5, 2, 33, 'Tarefa relacionada ao tipo 33.'),
(7, '2025-08-05 00:00:00', '2025-08-25', 6, 1, 17, 'Tarefa relacionada ao tipo 17.'),
(14, '2025-07-11 00:00:00', '2025-07-28', 2, 1, 5, 'Tarefa relacionada ao tipo 5.'),
(1, '2025-04-18 00:00:00', '2025-04-30', 8, 2, 8, 'Tarefa relacionada ao tipo 8.'),
(3, '2025-03-25 00:00:00', '2025-04-10', 4, 3, 40, 'Tarefa relacionada ao tipo 40.'),
(10, '2025-07-20 00:00:00', '2025-07-31', 7, 2, 19, 'Tarefa relacionada ao tipo 19.'),
(13, '2025-05-01 00:00:00', '2025-05-15', 7, 1, 6, 'Tarefa relacionada ao tipo 6.'),
(5, '2025-06-03 00:00:00', '2025-06-15', 5, 2, 4, 'Tarefa relacionada ao tipo 4.'),
(6, '2025-08-18 00:00:00', '2025-09-05', 3, 1, 28, 'Tarefa relacionada ao tipo 28.'),
(4, '2025-02-10 00:00:00', '2025-02-20', 2, 3, 13, 'Tarefa relacionada ao tipo 13.'),
(12, '2025-06-25 00:00:00', '2025-07-01', 6, 2, 23, 'Tarefa relacionada ao tipo 23.'),
(1, '2025-04-02 00:00:00', '2025-04-18', 1, 3, 30, 'Tarefa relacionada ao tipo 30.'),
(2, '2025-05-15 00:00:00', '2025-06-05', 4, 1, 1, 'Tarefa relacionada ao tipo 1.'),
(3, '2025-06-08 00:00:00', '2025-06-20', 6, 2, 14, 'Tarefa relacionada ao tipo 14.'),
(4, '2025-06-29 00:00:00', '2025-07-10', 8, 1, 35, 'Tarefa relacionada ao tipo 35.'),
(5, '2025-05-12 00:00:00', '2025-05-25', 7, 3, 9, 'Tarefa relacionada ao tipo 9.'),
(6, '2025-07-05 00:00:00', '2025-07-19', 6, 2, 32, 'Tarefa relacionada ao tipo 32.'),
(7, '2025-08-10 00:00:00', '2025-08-22', 5, 1, 2, 'Tarefa relacionada ao tipo 2.'),
(8, '2025-09-01 00:00:00', '2025-09-15', 4, 3, 24, 'Tarefa relacionada ao tipo 24.'),
(9, '2025-06-01 00:00:00', '2025-06-10', 3, 1, 39, 'Tarefa relacionada ao tipo 39.'),
(10, '2025-07-12 00:00:00', '2025-07-26', 2, 2, 12, 'Tarefa relacionada ao tipo 12.'),
(11, '2025-08-15 00:00:00', '2025-08-31', 1, 1, 7, 'Tarefa relacionada ao tipo 7.'),
(12, '2025-07-18 00:00:00', '2025-07-30', 5, 2, 20, 'Tarefa relacionada ao tipo 20.'),
(13, '2025-05-09 00:00:00', '2025-05-20', 8, 3, 34, 'Tarefa relacionada ao tipo 34.'),
(14, '2025-09-10 00:00:00', '2025-09-25', 7, 2, 3, 'Tarefa relacionada ao tipo 3.'),
(15, '2025-06-17 00:00:00', '2025-06-27', 6, 3, 25, 'Tarefa relacionada ao tipo 25.'),
(1, '2025-03-12 00:00:00', '2025-03-28', 5, 1, 15, 'Tarefa relacionada ao tipo 15.'),
(2, '2025-05-28 00:00:00', '2025-06-08', 4, 2, 22, 'Tarefa relacionada ao tipo 22.'),
(3, '2025-07-01 00:00:00', '2025-07-12', 3, 3, 29, 'Tarefa relacionada ao tipo 29.'),
(4, '2025-06-11 00:00:00', '2025-06-30', 2, 1, 16, 'Tarefa relacionada ao tipo 16.'),
(5, '2025-08-03 00:00:00', '2025-08-18', 1, 3, 18, 'Tarefa relacionada ao tipo 18.'),
(6, '2025-07-14 00:00:00', '2025-07-24', 4, 2, 36, 'Tarefa relacionada ao tipo 36.'),
(7, '2025-08-06 00:00:00', '2025-08-20', 8, 1, 27, 'Tarefa relacionada ao tipo 27.'),
(8, '2025-09-05 00:00:00', '2025-09-15', 7, 2, 37, 'Tarefa relacionada ao tipo 37.'),
(9, '2025-07-22 00:00:00', '2025-08-01', 6, 3, 31, 'Tarefa relacionada ao tipo 31.'),
(10, '2025-06-07 00:00:00', '2025-06-21', 5, 1, 38, 'Tarefa relacionada ao tipo 38.');

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

