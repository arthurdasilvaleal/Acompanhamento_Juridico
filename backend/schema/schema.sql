-- Criação do Banco de Dados
DROP DATABASE IF EXISTS BD_AJ;
CREATE DATABASE BD_AJ;
USE BD_AJ;

-- Criação das tabelas

CREATE TABLE TipoLogradouro(
	cd_TipoLogradouro int NOT NULL,
    nm_TipoLogradouro varchar(25) NULL,
    PRIMARY KEY (cd_TipoLogradouro)
);

CREATE TABLE TipoColaborador(
	cd_TipoColaborador int NOT NULL,
    nm_TipoColaborador varchar(25) NULL,
    PRIMARY KEY (cd_TipoColaborador)
);

CREATE TABLE Colaborador(
    cd_Colaborador INT AUTO_INCREMENT NOT NULL,
    nm_Colaborador VARCHAR(40) NULL,
    cd_CPF NUMERIC(11) NULL,
    cd_TipoLogradouro int NOT NULL,
    nm_Logradouro VARCHAR(40) NULL,
    nm_Bairro VARCHAR(30) NULL,
    nm_Cidade VARCHAR(20) NULL,
    sg_Estado char(2) NULL,
    cd_CEP NUMERIC(8),
    cd_NumeroEndereco INT NULL,
    ds_ComplementoEndereco VARCHAR(20) NULL,
    cd_Telefone VARCHAR(20) NULL,
    ds_Email VARCHAR(80) NULL,
    nm_Usuario VARCHAR(15) NULL UNIQUE,
    ds_Senha VARCHAR(64) NULL,
    cd_TipoColaborador int NOT NULL,
    PRIMARY KEY (cd_Colaborador)
);

CREATE TABLE Cliente(
    cd_Cliente INT AUTO_INCREMENT NOT NULL,
    nm_Cliente VARCHAR(40) NULL,
    cd_CPF NUMERIC(11) NULL,
    cd_TipoLogradouro int NOT NULL,
    nm_Logradouro VARCHAR(40) NULL,
    nm_Bairro VARCHAR(30) NULL,
    nm_Cidade VARCHAR(20) NULL,
    sg_Estado char(2) NULL,
    cd_CEP NUMERIC(8),
    cd_NumeroEndereco INT NULL,
    ds_ComplementoEndereco VARCHAR(20) NULL,
    cd_Telefone NUMERIC(11) NULL,
    ds_Email VARCHAR(80) NULL,
    PRIMARY KEY (cd_Cliente)
);

CREATE TABLE Tribunal(
    sg_Tribunal VARCHAR(6) NOT NULL,
    nm_Tribunal VARCHAR(50),
    PRIMARY KEY (sg_Tribunal)
);

CREATE TABLE Processo(
    cd_Processo INT AUTO_INCREMENT NOT NULL,
    cd_NumeroProcesso VARCHAR(25) NULL,
    cd_Cliente INT NOT NULL,
    nm_Autor VARCHAR(40) NULL,
    nm_Reu VARCHAR(40) NULL,
    ds_Juizo VARCHAR(30) NULL,
    ds_Acao VARCHAR(50) NULL,
    nm_Cidade VARCHAR(20) NULL,
    sg_Tribunal VARCHAR(6) NOT NULL,
    vl_Causa DECIMAL(10,2) NULL,
    PRIMARY KEY (cd_Processo)
);

CREATE TABLE Intimacao(
    cd_Intimacao INT AUTO_INCREMENT NOT NULL,
    dt_Recebimento DATE NULL,
    cd_Processo INT NOT NULL,
    ds_Intimacao TEXT NULL,
    PRIMARY KEY (cd_Intimacao)
);

CREATE TABLE StatusTarefa(
	cd_StatusTarefa int NOT NULL,
    nm_StatusTarefa VARCHAR(12) NULL,
    PRIMARY KEY (cd_StatusTarefa)
);

CREATE TABLE Tarefa(
    cd_Tarefa INT AUTO_INCREMENT NOT NULL,
    cd_Intimacao INT NOT NULL,
    dt_Registro DATE NULL,
    dt_Prazo DATE NULL,
    cd_Colaborador INT NOT NULL,
    cd_StatusTarefa int NOT NULL,
    PRIMARY KEY (cd_Tarefa)
);

-- Criação das Chaves Estrangeiras

ALTER TABLE Processo
ADD CONSTRAINT FK_Processo_Cliente
	FOREIGN KEY (cd_Cliente) REFERENCES Cliente (cd_Cliente);

ALTER TABLE Processo
ADD CONSTRAINT FK_Processo_Tribunal
	FOREIGN KEY (sg_Tribunal) REFERENCES Tribunal (sg_Tribunal);

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

ALTER TABLE Cliente
ADD CONSTRAINT FK_Cliente_TipoLogradouro
	FOREIGN KEY (cd_TipoLogradouro) REFERENCES TipoLogradouro (cd_TipoLogradouro);

ALTER TABLE Colaborador
ADD CONSTRAINT FK_Colaborador_TipoLogradouro
	FOREIGN KEY (cd_TipoLogradouro) REFERENCES TipoLogradouro (cd_TipoLogradouro);
    
ALTER TABLE Colaborador
ADD	CONSTRAINT FK_Colaborador_TipoColaborador
	FOREIGN KEY (cd_TipoColaborador) REFERENCES TipoColaborador (cd_TipoColaborador);
    
-- Criação de restrições CHECK

ALTER TABLE TipoColaborador
ADD CONSTRAINT CHK_TipoColaborador
	CHECK (nm_TipoColaborador IN 
    ('Estagiário', 'Assistente', 'Advogado', 'Administrador do Sistema'));

ALTER TABLE StatusTarefa
ADD	CONSTRAINT CHK_StatusTarefa
	CHECK (nm_StatusTarefa IN ('Aguardando', 'Em andamento', 'Concluído'));
    
ALTER TABLE TipoLogradouro
ADD	CONSTRAINT CHK_TipoLogradouro
	CHECK (nm_TipoLogradouro IN ('Alameda', 'Avenida', 'Rua', 'Travessa', 'Praça',
    'Rodovia', 'Estrada', 'Viela', 'Beco', 'Largo', 'Vila', 'Quadra', 'Setor', 
    'Conjunto', 'Chácara', 'Fazenda', 'Sítio', 'Parque', 'Jardim', 
    'Passarela', 'Via', 'Marginal', 'Núcleo', 'Residencial', 'Área', 'Patio', 
    'Terminal', 'Complexo', 'Distrito', 'Favela', 'Morro', 'Vale', 'Ponte', 
    'Viaduto', 'Perimetral', 'Travessia', 'Viaduto'));
    
-- INSERÇÃO DE DADOS

-- Inserção de Tribunais
INSERT INTO Tribunal (sg_Tribunal, nm_Tribunal) 
VALUES  ('TJSP', 'Tribunal de Justiça de São Paulo'),
		('TRT2', 'Tribunal Regional do Trabalho da 2ª Região'),
		('TRF3', 'Tribunal Regional Federal da 3ª Região'),
		('STJ', 'Superior Tribunal de Justiça'),
        ('TST', 'Superior Tribunal do Trabalho'),
		('STF', 'Supremo Tribunal Federal');
        
        
-- Inserção Tipo de Logradouro
INSERT INTO TipoLogradouro (cd_TipoLogradouro, nm_TipoLogradouro) VALUES
(1, 'Alameda'),
(2, 'Área'),
(3, 'Avenida'),
(4, 'Beco'),
(5, 'Chácara'),
(6, 'Complexo'),
(7, 'Conjunto'),
(8, 'Distrito'),
(9, 'Estrada'),
(10, 'Favela'),
(11, 'Fazenda'),
(12, 'Jardim'),
(13, 'Largo'),
(14, 'Marginal'),
(15, 'Morro'),
(16, 'Núcleo'),
(17, 'Parque'),
(18, 'Passarela'),
(19, 'Patio'),
(20, 'Perimetral'),
(21, 'Ponte'),
(22, 'Praça'),
(23, 'Quadra'),
(24, 'Residencial'),
(25, 'Rodovia'),
(26, 'Rua'),
(27, 'Setor'),
(28, 'Sítio'),
(29, 'Terminal'),
(30, 'Travessa'),
(31, 'Travessia'),
(32, 'Vale'),
(33, 'Via'),
(34, 'Viaduto'),
(35, 'Viela'),
(36, 'Vila');
        
-- Inserção de tipo de Colaborador
INSERT INTO TipoColaborador (cd_TipoColaborador, nm_TipoColaborador) VALUES
(1, 'Administrador do Sistema'),
(2, 'Advogado'),
(3, 'Assistente'),
(4, 'Estagiário');

-- Inserção de Status da Tarefa
INSERT INTO StatusTarefa (cd_StatusTarefa, nm_StatusTarefa) VALUES
(1, 'Aguardando'),
(2, 'Em andamento'),
(3, 'Concluído');
        
-- Inserção Colaborador
INSERT INTO Colaborador (
    nm_Colaborador, cd_CPF, cd_TipoLogradouro, nm_Logradouro, nm_Bairro, 
    nm_Cidade, sg_Estado, cd_CEP, cd_NumeroEndereco, ds_ComplementoEndereco, 
    cd_Telefone, ds_Email, nm_Usuario, ds_Senha, cd_TipoColaborador
) VALUES
('Ana Paula', 45678901234, 26, 'Rua XV de Novembro', 'Gonzaga', 'Santos', 'SP', 11055000, 191, 'Apto 32', '11977773333', 'ana@email.com', 'ana_paula', SHA2('123', 256), 2),
('João Mendes', 56789012345, 3, 'Avenida Ana Costa', 'Boqueirão', 'Santos', 'SP', 11060001, 71, 'Sala 5', '13966664444', 'joao@email.com', 'joao_mendes', SHA2('123', 256), 4),
('Laura Ferreira', 67890123456, 26, 'Rua São Francisco', 'Centro', 'São Vicente', 'SP', 11310000, 86, 'Casa 2', '13955552222', 'laura@email.com', 'laura_ferreira', SHA2('123', 256), 3),
('Carlos Magalhães', 78901234567, 22, 'Praça dos Expedicionários', 'Embaré', 'Santos', 'SP', 11015000, 84, 'Bloco B', '13944441111', 'carlos@email.com', 'carlos_m', SHA2('123', 256), 2),
('Paula Amaral', 89012345678, 3, 'Avenida Conselheiro Nébias', 'Campo Grande', 'Santos', 'SP', 11045001, 94, 'Apto 101', '13933336666', 'paula@email.com', 'paula_amaral', SHA2('123', 256), 2),
('Felipe Borges', 90123456789, 26, 'Rua Euclides da Cunha', 'Vila Mathias', 'Santos', 'SP', 11065000, 17, NULL, '13922227777', 'felipe@email.com', 'felipe_borges', SHA2('123', 256), 4),
('Renata Xavier', 12309876543, 1, 'Alameda Dino Bueno', 'Ponta da Praia', 'Santos', 'SP', 11030000, 8, 'Apto 302', '11911118888', 'renata@email.com', 'renata_x', SHA2('123', 256), 3),
('Amanda Lopes', 34509876543, 26, 'Rua Oswaldo Cruz', 'José Menino', 'Santos', 'SP', 11065050, 63, 'Casa dos fundos', '11999997777', 'amanda@email.com', 'amanda_l', SHA2('123', 256), 4);

-- Inserção Cliente
INSERT INTO Cliente (
    nm_Cliente, cd_CPF, cd_TipoLogradouro, nm_Logradouro, nm_Bairro, 
    nm_Cidade, sg_Estado, cd_CEP, cd_NumeroEndereco, ds_ComplementoEndereco, 
    cd_Telefone, ds_Email
) VALUES
('Carlos Silva', 12345678901, 26, 'Rua João Pessoa', 'Vila Belmiro', 'Santos', 'SP', 11055030, 63, 'Apto 12', '11999990000', 'carlos@email.com'),
('Maria Souza', 23456789012, 3, 'Avenida Bernardino de Campos', 'Boqueirão', 'Santos', 'SP', 11060002, 48, 'Sala 3', '11988881111', 'maria@email.com'),
('Fernando Lima', 34567890123, 26, 'Rua Brás Cubas', 'Centro', 'Guarujá', 'SP', 11410000, 28, NULL, '13999992222', 'fernando@email.com'),
('Juliana Costa', 45678901234, 22, 'Praça Mauá', 'Valongo', 'Santos', 'SP', 11010000, 91, 'Loja 5', '13977773333', 'juliana@email.com'),
('Roberto Almeida', 56789012345, 26, 'Rua do Comércio', 'Encruzilhada', 'Santos', 'SP', 11055040, 37, 'Apto 45', '13966665555', 'roberto@email.com'),
('Tatiane Rocha', 67890123456, 3, 'Avenida Washington Luiz', 'Piratininga', 'São Vicente', 'SP', 11330000, 28, 'Casa 7', '13955557777', 'tatiane@email.com'),
('Marcos Ribeiro', 78901234567, 1, 'Alameda Ari Barroso', 'Marapé', 'Santos', 'SP', 11055050, 11, 'Apto 201', '13944449999', 'marcos@email.com'),
('Vanessa Martins', 89012345678, 26, 'Rua da Constituição', 'Gonzaga', 'Santos', 'SP', 11055010, 64, NULL, '13933338888', 'vanessa@email.com'),
('Luciano Carvalho', 90123456789, 3, 'Avenida Pinheiro Machado', 'Vila Nova', 'Santos', 'SP', 11065030, 73, 'Sala 10', '13922221111', 'luciano@email.com'),
('Priscila Ferreira', 12309876543, 26, 'Rua São Bento', 'Centro', 'Praia Grande', 'SP', 11700000, 82, 'Apto 33', '13911116666', 'priscila@email.com');

-- Inserção de Processos
INSERT INTO Processo (cd_NumeroProcesso, cd_Cliente, nm_Autor, nm_Reu, ds_Juizo, ds_Acao, nm_Cidade, sg_Tribunal, vl_Causa) 
VALUES 
('0001111-20.2023.8.26.0001', 1, 'Carlos Silva', 'Empresa XYZ Ltda', 'Vara Cível', 'Danos Morais', 'São Paulo', 'TJSP', 50000.00),
('0002222-30.2023.8.26.0002', 2, 'Maria Souza', 'Banco ABC S/A', 'Vara Cível', 'Revisão Contratual', 'São Paulo', 'TJSP', 75000.00),
('0003333-40.2023.8.26.0003', 3, 'Fernando Lima', 'Seguradora Segura', 'Vara Cível', 'Ação de Seguro', 'Santos', 'TJSP', 120000.00),
('0004444-50.2023.8.26.0004', 4, 'Juliana Costa', 'Concessionária Vias', 'Vara de Fazenda Pública', 'Indenização por Acidente', 'Santos', 'TJSP', 95000.00),
('0005555-60.2023.8.26.0005', 5, 'Roberto Almeida', 'Plano de Saúde Vida+', 'Vara Cível', 'Cobertura de Tratamento', 'São Vicente', 'TJSP', 300000.00),
('0006666-70.2023.8.26.0006', 6, 'Tatiane Rocha', 'Loja de Eletrodomésticos EletroMax', 'Vara Cível', 'Defeito em Produto', 'São Vicente', 'TJSP', 10000.00),
('0007777-80.2023.8.26.0007', 7, 'Marcos Ribeiro', 'Construtora ABC', 'Vara Cível', 'Rescisão Contratual', 'Guarujá', 'TJSP', 185000.00),
('0008888-90.2023.8.26.0008', 8, 'Vanessa Martins', 'Operadora Móvel Telecom', 'Vara Cível', 'Cobrança Indevida', 'Guarujá', 'TJSP', 15000.00),
('0009999-00.2023.8.26.0009', 9, 'Luciano Carvalho', 'Comércio de Veículos AutoCar', 'Vara Cível', 'Vício Oculto em Veículo', 'Praia Grande', 'TJSP', 45000.00),
('0010000-10.2023.8.26.0010', 10, 'Priscila Ferreira', 'Faculdade Universitas', 'Vara do Consumidor', 'Cobrança Indevida de Mensalidade', 'Praia Grande', 'TJSP', 8000.00);

-- Inserção de Intimações
INSERT INTO Intimacao (dt_Recebimento, cd_Processo, ds_Intimacao) 
VALUES 
('2024-02-01', 1, 'Intimação para apresentação de contestação no prazo de 15 dias.'),
('2024-02-03', 2, 'Intimação para juntada de documentos comprobatórios.'),
('2024-02-05', 3, 'Intimação para audiência de conciliação agendada para 15/03/2024.'),
('2024-02-08', 4, 'Intimação para manifestação sobre o laudo pericial.'),
('2024-02-10', 5, 'Intimação sobre deferimento de pedido de tutela antecipada.'),
('2024-02-12', 6, 'Intimação para comparecimento à audiência preliminar em 20/03/2024.'),
('2024-02-15', 7, 'Intimação sobre abertura de prazo para razões finais.'),
('2024-02-18', 8, 'Intimação para apresentação de provas periciais até 01/04/2024.'),
('2024-02-20', 9, 'Intimação para responder ao recurso interposto pela parte ré.'),
('2024-02-22', 10, 'Intimação sobre despacho saneador e designação de audiência de instrução.'),
('2024-02-25', 1, 'Intimação para apresentação de contrarrazões ao agravo de instrumento.'),
('2024-02-28', 2, 'Intimação sobre decisão de improcedência do pedido e abertura de prazo recursal.'),
('2024-03-01', 3, 'Intimação para esclarecimento de pontos obscuros na petição inicial.'),
('2024-03-03', 4, 'Intimação para cumprimento de sentença no prazo de 30 dias.'),
('2024-03-05', 5, 'Intimação para retirada de alvará judicial expedido em favor do cliente.');

-- Inserção de Tarefas
INSERT INTO Tarefa (cd_Intimacao, dt_Registro, dt_Prazo, cd_Colaborador, cd_StatusTarefa) 
VALUES 
(1, '2025-05-01', '2025-05-10', 1, 1),
(2, '2025-05-01', '2025-05-15', 2, 2),
(3, '2025-05-02', '2025-05-20', 3, 1),
(4, '2025-05-02', '2025-05-25', 4, 3),
(5, '2025-05-03', '2025-06-01', 5, 1),
(6, '2025-05-03', '2025-06-05', 6, 2),
(7, '2025-05-04', '2025-06-10', 7, 1),
(8, '2025-05-04', '2025-06-15', 8, 1),
(9, '2025-05-05', '2025-06-20', 1, 2),
(10, '2025-05-05', '2025-06-25', 2, 3),
(11, '2025-05-06', '2025-06-30', 3, 1),
(12, '2025-05-06', '2025-07-05', 4, 2),
(13, '2025-05-07', '2025-07-10', 5, 1),
(14, '2025-05-07', '2025-07-15', 6, 3),
(15, '2025-05-08', '2025-07-20', 7, 1);