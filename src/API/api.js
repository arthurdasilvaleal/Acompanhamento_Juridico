import axios from "axios";

const API_URL = "http://localhost:5000";

export const getClientes = async () => {
  const response = await axios.get(`${API_URL}/clientes`);
  return response.data;
};

export const createCliente = async (cliente) => {
  await axios.post(`${API_URL}/clientes`, cliente);
};

export const updateCliente = async (id, cliente) => {
  await axios.put(`${API_URL}/clientes/${id}`, cliente);
};

export const deleteCliente = async (id) => {
  await axios.delete(`${API_URL}/clientes/${id}`);
};
