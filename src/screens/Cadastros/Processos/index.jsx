// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router'
import "./styles.css";

const Processos = () => {
  const navigate = useNavigate();
  const [processosData, setProcessosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [descricao, setDescricao] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProcessos, setFilteredProcessos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("https://localhost:44350/api/Processos");

      if (res) {
        setProcessosData(res.data);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = processosData.filter((processo) =>
      processo.idProcesso.toString().includes(searchQuery) ||
      processo.descricao.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredProcessos(filtered);
  }, [searchQuery, processosData]);

  const handleDescricaoChange = (event) => {
    setDescricao(event.target.value);
  };

  const handlePostAndPut = async () => {
    if (!descricao) {
      setError("Descrição inválida")
    } else {
      if (!editingId) {
        await axios.post("https://localhost:44350/api/Processos", {
          descricao,
        });
        navigate(0);
      } else {
        await axios.put(`https://localhost:44350/api/Processos/${editingId}`, {
          descricao,
        });
        navigate(0);
      }
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://localhost:44350/api/Processos/${id}`);
    navigate(0);
  };

  const handleClean = () => {
    setEditingId();
    setDescricao("");
    setError("");
  };

  if (loading) {
    return <></>;
  }

  return (
    <div className="processos container">
      <div className="input-group">
        <input
          type="text"
          className="input-busca form-control"
          placeholder="Buscar pelo nome ou ID..."
          aria-describedby="basic-addon1"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      {/* Modal */}

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Criar Processo</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => handleClean()}></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                placeholder="Descricao"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={descricao}
                onChange={handleDescricaoChange}
              />
              <div style={{color: "red"}}>{error}</div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => handleClean()}>Cancelar</button>
              <button type="button" className="btn btn-primary" onClick={() => handlePostAndPut()}>Enviar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}

      <div className="processos-div" style={{width: "100%"}}>
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Criar Processo
        </button>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">AÇÕES</th>
                <th scope="col">IDPROCESSO</th>
                <th scope="col">DESCRIÇÃO</th>
                <th scope="col">DATA DE CADASTRO</th>
              </tr>
            </thead>
            <tbody>
              {filteredProcessos.map((processo) => (
                <tr key={processo.idProcesso}>
                  <td className="td-button">
                      <button type="button" className="button-processo btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => {setEditingId(processo.idProcesso); setDescricao(processo.descricao)}}>
                        Editar
                      </button>
                      <button type="button" className="button-processo btn btn-danger" onClick={() => handleDelete(processo.idProcesso)}>
                        Excluir
                      </button>
                  </td>
                  <td>{processo.idProcesso}</td>
                  <td>{processo.descricao}</td>
                  <td>{new Date(processo.dataDeCadastro).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Processos;
