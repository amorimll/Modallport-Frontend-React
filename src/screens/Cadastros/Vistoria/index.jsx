import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router'
import "./styles.css";

const ModelosVistoria = () => {
  const navigate = useNavigate()
  const [vistoriasData, setProcessosData] = useState([]);
  const [itens, setItens] = useState([]);
  const [error, setError] = useState("");
  const [itensEditar, setItensEditar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    descricao: "",
    processo: "",
  });
  const [opcoes, setOpcoes] = useState("")
  const [respostas, setRespostas] = useState([])
  const [itensData, setItensData] = useState({
    descricaoItem: "",
    ordem: "",
    tipo: "",
    opcoes: [],
    respostas: []
  });
  const [editingId, setEditingId] = useState()
  const tipoOptions = [
    { value: 1, label: '1 - FOTO' },
    { value: 2, label: '2 - TEXTO' },
    { value: 3, label: '3 - NUMÉRICO' },
    { value: 4, label: '4 - MÚLTIPLA ESCOLHA' },
    { value: 5, label: '5 - ÚNICA ESCOLHA' },
    { value: 6, label: '6 - ASSINATURA' },
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVistorias, setFilteredVistorias] = useState([]);

  const handleAddItem = () => {
    const newItem = {
      descricao: itensData.descricaoItem,
      ordem: Number(itensData.ordem),
      tipo: Number(itensData.tipo),
      opcoes: itensData.opcoes,
      respostas: itensData.respostas
    };

    setItens([...itens, newItem]);
    setItensData({ ...itensData, opcoes: [], respostas: [] });
    console.log(itensData)
  };

  const adicionarOpcao = () => {
    if (opcoes.trim() !== '') {
      const novaOpcao = opcoes;
      const opcoesAtualizadas = [...itensData.opcoes, novaOpcao];
      setItensData({ ...itensData, opcoes: opcoesAtualizadas });
      setOpcoes('');
      console.log(itensData.opcoes)
    }
  }

  const adicionarResposta = () => {
    if (respostas.trim() !== '') {
      const novaResposta = respostas;
      const respostasAtualizadas = [...itensData.respostas, novaResposta];
      setItensData({ ...itensData, respostas: respostasAtualizadas });
      setRespostas('');
      console.log(itensData.respostas)
    }
  }

  const handleItemChange = (itemId, field, value) => {
    const updatedItens = itensEditar.map((item) => {
      if (item.idItem === itemId) {
        return {
          ...item,
          [field]: value
        };
      }
      return item;
    });
    setItensEditar(updatedItens);
  };

  const handlePostAndPut = async () => {
    if (!editingId) {
      if (formData.descricao == "" || formData.processo == "") {
        setError("Dados inválidos.")
      } else {
        const res = await axios.post("https://localhost:44350/api/Vistorias", {
          descricao: formData.descricao,
          processo: Number(formData.processo)
        });

        if (itensData.descricaoItem == "" || itensData.ordem == "" || itensData.tipo == "") {
          setError("Dados inválidos.")
        } else {
          if (res) {
            itens.forEach(async (item) => {
              const itemRes = await axios.post(`https://localhost:44350/api/Itens?idVistoria=${res.data.idVistoria}`, {
                descricao: item.descricao,
                ordem: Number(item.ordem),
                tipo: Number(item.tipo)
              })
  
              if (item.opcoes && item.respostas) {
                item.opcoes.forEach(async (opcao) => {
                  await axios.post(`https://localhost:44350/api/Opcoes?idItem=${itemRes.data.idItem}`, {
                    opcao
                  })
                })
      
                item.respostas.forEach(async (resposta) => {
                  await axios.post(`https://localhost:44350/api/Respostas?idItem=${itemRes.data.idItem}`, {
                    resposta
                  })
                })
              }
              console.log(itemRes)
            })
          }
          navigate(0);
        }
      }
    } else {
      if (formData.descricao == "" || formData.processo == "") {
        setError("Dados inválidos.")
      } else {
        await axios.put(`https://localhost:44350/api/Vistorias/${editingId}`, {
          descricao: formData.descricao,
          processo: formData.processo
        });

        itensEditar.forEach(async (item) => {
          if (item.descricao == "" || item.ordem == "") {
            setError("Dados inválidos.")
          } else {
            await axios.put(`https://localhost:44350/api/Itens/${item.idItem}`, {
              descricao: item.descricao,
              ordem: Number(item.ordem),
              tipo: Number(item.tipo)
            })
          }
        })
        navigate(0);
      }
    }
  }

  const handleDelete = async (id) => {
    await axios.delete(`https://localhost:44350/api/Vistorias/${id}`)
    navigate(0)
  }

  const handleDeleteItem = async (id) => {
    await axios.delete(`https://localhost:44350/api/Itens/${id}`)
    navigate(0)
  }

  const handleClean = () => {
    setEditingId()
    setFormData({...formData, descricao: "", processo: ""})
    setError("")
  }

  useEffect(() => {
    const fetchData = async () => {
      const vistoriasRes = await axios.get("https://localhost:44350/api/Vistorias");

      if (vistoriasRes) {
        setProcessosData(vistoriasRes.data);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (editingId) {
      const fetchData = async () => {
        const itensRes = await axios.get(
          `https://localhost:44350/api/Itens/${editingId}`
        );

        if (itensRes) {
          setItensEditar(itensRes.data);
          setLoading(false);
        }
      };
      fetchData();
      console.log(itensEditar)
    }
  }, [editingId]);

  useEffect(() => {
    const filtered = vistoriasData.filter((vistoria) =>
      vistoria.idVistoria.toString().includes(searchQuery) ||
      vistoria.descricao.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredVistorias(filtered);
  }, [searchQuery, vistoriasData]);

  if (loading) {
    return <></>;
  }

  return (
    <div className="processos container">

      <div className="input-group">
        <input type="text" className="input-busca form-control" placeholder="Buscar pelo nome ou ID..." aria-label="Username" aria-describedby="basic-addon1" onChange={(event) => setSearchQuery(event.target.value)}/>
      </div>

      {/* Modal */}

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Criar Vistoria</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                placeholder="Descricao"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={formData?.descricao}
                onChange={(event) => setFormData({...formData, descricao: event.target.value})}
              />
              <input
                type="number"
                className="form-control"
                placeholder="Processo"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={formData?.processo}
                onChange={(event) => setFormData({...formData, processo: event.target.value})}
              />

              <div className="itens modal-body" style={{backgroundColor: "#F1F1F1", borderRadius: "5px", marginTop: "10px"}}>
                <h5>Inserir Itens</h5>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Descricao"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  value={itensData?.descricaoItem}
                  onChange={(event) => setItensData({...itensData, descricaoItem: event.target.value})}
                />
                <div className="itens-ordem-tipo">
                  <input
                    type="number"
                    className="item-ordem form-control"
                    placeholder="Ordem"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    value={itensData?.ordem}
                    onChange={(event) => setItensData({...itensData, ordem: event.target.value})}
                  />
                  <select
                    className="item-tipo form-control"
                    placeholder="Tipo"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    defaultValue={tipoOptions[0].value}
                    onChange={(event) =>
                      setItensData({ ...itensData, tipo: event.target.value })
                    }
                  >
                    {tipoOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                {itensData.tipo === "4" || itensData.tipo === "5" ? (
                  <>
                    <h5>Opções</h5>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Opção"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      value={opcoes}
                      onChange={(event) => setOpcoes(event.target.value)}
                    />
                    <button
                      type="button"
                      className="vistoria-opcoes-button btn btn-primary"
                      onClick={adicionarOpcao}
                    >
                      Adicionar Opção
                    </button>
                  </>
                ) : null}
                <h5>Respostas</h5>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Resposta"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  value={respostas}
                  onChange={(event) => setRespostas(event.target.value)}
                />
                <button type="button" className="vistoria-respostas-button btn btn-primary" onClick={adicionarResposta}>Adicionar Resposta</button>
                </div>
                <button type="button" className="btn btn-primary" onClick={handleAddItem}>
                  Adicionar Item
                </button>
              </div>
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

      {/* Modal Editar */}

      <div className="modal fade" id="exampleModalEditar" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Criar Vistoria</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setError("")}></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                placeholder="Descricao"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={formData?.descricao}
                onChange={(event) => setFormData({...formData, descricao: event.target.value})}
              />
              <input
                type="number"
                className="form-control"
                placeholder="Processo"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={formData?.processo}
                onChange={(event) => setFormData({...formData, processo: event.target.value})}
              />
              <h5>Editar Itens</h5>
              {itensEditar.map((item) => (
                <div className="itens-editar-render" key={item.idItem}>
                  <button
                    type="button"
                    className="btn-editar btn btn-danger"
                    onClick={() => handleDeleteItem(item.idItem)}
                  >
                    X
                  </button>
                  <input
                    type="text"
                    className="item-editar-input form-control"
                    placeholder="Descricao"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    value={item.descricao}
                    onChange={(event) =>
                      handleItemChange(item.idItem, "descricao", event.target.value)
                    }
                  />
                  <input
                    type="number"
                    className="item-editar-input form-control"
                    placeholder="Ordem"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    value={item.ordem}
                    onChange={(event) =>
                      handleItemChange(item.idItem, "ordem", event.target.value)
                    }
                  />
                  <select
                    className="item-tipo form-control"
                    placeholder="Tipo"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    value={item.tipo}
                    onChange={(event) =>
                      handleItemChange(item.idItem, "tipo", event.target.value)
                    }
                  >
                    {tipoOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
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

      <div className="processos-div"  style={{width: "100%"}}>
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Criar Vistoria
        </button>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">AÇÕES</th>
                <th scope="col">IDVISTORIA</th>
                <th scope="col">PROCESSO</th>
                <th scope="col">DESCRIÇÃO</th>
                <th scope="col">DATA DE CADASTRO</th>
              </tr>
            </thead>
            <tbody>
              {filteredVistorias.map((vistoria) => (
                <tr key={vistoria.idVistoria}>
                  <td className="td-button">
                    <button type="button" className="button-vistoria btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModalEditar" onClick={() => {setEditingId(vistoria.idVistoria); setFormData({...formData, descricao: vistoria.descricao, processo: vistoria.processo})}}>
                      Editar
                    </button>
                    <button type="button" className="button-vistoria btn btn-danger" onClick={() => handleDelete(vistoria.idVistoria)}>
                      Excluir
                    </button>
                  </td>
                  <td>{vistoria.idVistoria}</td>
                  <td>{vistoria.processo}</td>
                  <td>{vistoria.descricao}</td>
                  <td>{new Date(vistoria.dataDeCadastro).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ModelosVistoria;
