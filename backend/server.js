

require("dotenv").config();
import express, { json } from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(json());
app.use(cors());

// Conexão com o MySQL
const db = createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("Conectado ao MySQL");
});

// CRUD para Clientes

// Adicionar um cadastro de cliente
app.post("/cadastro", (req, res) => {
  const { cd_CPF, ds_Endereco, nm_Bairro, nm_Cidade, sg_Estado, cd_Telefone, ds_Email } = req.body;
  const query = `INSERT INTO Cliente (cd_CPF, ds_Endereco, nm_Bairro, nm_Cidade, sg_Estado, cd_Telefone, ds_Email) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(query, [cd_CPF, ds_Endereco, nm_Bairro, nm_Cidade, sg_Estado, cd_Telefone, ds_Email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Cliente criado com sucesso!" });
  });
});

// Listar todos os clientes da página main
app.get("/main", (req, res) => {
  db.query("SELECT * FROM Cliente", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Atualizar um cliente
app.put("/clientes/:id", (req, res) => {
  const { id } = req.params;
  const { cd_CPF, ds_Endereco, nm_Bairro, nm_Cidade, sg_Estado, cd_Telefone, ds_Email } = req.body;
  const query = `UPDATE Cliente SET cd_CPF=?, ds_Endereco=?, nm_Bairro=?, nm_Cidade=?, sg_Estado=?, cd_Telefone=?, ds_Email=? WHERE cd_Cliente=?`;
  db.query(query, [cd_CPF, ds_Endereco, nm_Bairro, nm_Cidade, sg_Estado, cd_Telefone, ds_Email, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cliente atualizado com sucesso!" });
  });
});

// Deletar um cliente
app.delete("/clientes/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM Cliente WHERE cd_Cliente=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cliente deletado com sucesso!" });
  });
});

app.listen(5000, () => {
  console.log("Servidor rodando na porta 5000");
});
