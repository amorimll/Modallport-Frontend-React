// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import { useParams } from 'react-router';
import Modal from 'react-bootstrap/Modal';

const Vistorias = () => {
	const [processosData, setProcessosData] = useState([]);
	const [loading, setLoading] = useState(true);
	const { id } = useParams();
	var itemById;
	const [show, setShow] = useState(false);

	useEffect(() => {
		const fetchData = async (id) => {
			const res = await axios.get(
				`https://localhost:44350/api/Vistorias/${id}`
			);

			if (res) {
				setProcessosData(res.data);
				setLoading(false);
			}
		};

		if (id) {
			fetchData(id);
		}
	}, []);

	async function getByIdWithItems(value) {
		const res = await axios.get(
			`https://localhost:44350/api/Vistorias/itens/${value}`
		);
		const elementTitle = document.getElementById('title-process');
		const elementProcess = document.getElementById('data-process');
		const descriptionProcess = document.getElementById('description-process');
		const itemProcess = document.getElementById('item-process');

		const data = res.data;

		itemById = data;
		elementTitle.innerHTML = `ID: ${data[0].idVistoria}`;
		elementProcess.innerHTML = `Processo: ${data[0].processo}`;
		descriptionProcess.innerHTML = `Descricao: ${data[0].descricao}`;
		console.log(itemById);
		const itemsSorted = data[0].items
			? data[0].items.sort((a, b) => a.ordem - b.ordem)
			: [];

		const itemsByTipo = {};

		itemsSorted.forEach((item) => {
			const tipo = item.tipo;

			if (itemsByTipo[tipo]) {
				itemsByTipo[tipo].push(item);
			} else {
				itemsByTipo[tipo] = [item];
			}
		});

		const itemsArray = Object.entries(itemsByTipo).map(([tipo, items]) => ({
			tipo,
			items,
		}));

		console.log(itemsArray);

		if (itemsArray.length > 0) {
			itemsArray.map((result) => {
				switch (parseInt(result.tipo)) {
					case 1: // FOTO
						itemProcess.innerHTML += `Tipo: Foto <div>Descricao : ${result.items[0].descricao}</div> <input id="input-item-file-picture" type="file" className="add-item-btn myInput" placeholder="Adicionar item" />`;
						break;
					case 2: // TEXTO 2
						itemProcess.innerHTML += `Tipo: Texto <div>Descricao : ${result.items[0].descricao}</div> <textarea id="input-item-text" type="text" className="add-item-btn myInput" placeholder="Adicionar resposta" />`;
						break;
					case 3: // NUMERICO
						itemProcess.innerHTML += `Tipo: Numerico <div>Descricao : ${result.items[0].descricao}</div> <input id="input-number" type="number" className="add-item-btn myInput" placeholder="Adicionar resposta" />`;
						break;
					case 4: // MULTIPLA ESCOLHA 4
						itemProcess.innerHTML += `Tipo: Multipla Escolha <div>Descricao : ${
							result.items[0].descricao
						}</div> ${result.items
							.map(
								(item) =>
									`<label><input type="checkbox" className="multi-responses" value="${item.opcao}">${item.opcao}</label>`
							)
							.join('')}`;
						break;
					case 5: // UNICA ESCOLHA 5
						itemProcess.innerHTML += `Tipo: Unica Escolha <div>Descricao : ${
							result.items[0].descricao
						}</div> ${result.items
							.map(
								(item) =>
									`<label><input type="radio" className="unique-response" value="${item.opcao}">${item.opcao}</label>`
							)
							.join('')}`;
						break;
					case 6: // ASSINATURA
						itemProcess.innerHTML += `Tipo: Assinatura <div>Descricao : ${result.items[0].descricao}</div> <input id="input-item-file-sign" type="file" className="add-item-btn myInput" placeholder="Adicionar assinatura" />`;
						break;
				}
			});
		} else {
			itemProcess.innerHTML += 'Nenhum item registrado...';
		}
	}

	function openModal(item) {
		console.log('drop-1');
		getByIdWithItems(item);
		setShow(true);
		// element.classList.add('show')
	}

	function finishVistoria() {}

	const closeModal = () => {
		setShow(false);
		console.log(show);
	};

	if (loading) {
		return <>Loading...</>;
	}

	return (
		<>
			<Modal
				id='myModalProcess'
				show={show}
				className='bs-example'
				onHide={closeModal}>
				<>
					<Modal.Header closeButton>
						<Modal.Title>
							{' '}
							<h5 onClick={() => alert('TEST')} className='modal-title'>
								Inserir dados
							</h5>
						</Modal.Title>
					</Modal.Header>
					<div className='modal-body'>
						<div id='title-process' className='process-item'></div>
						<div id='data-process' className='process-item'></div>
						<div id='description-process' className='process-item'></div>
						<div id='item-process' className='process-item item-data'></div>
					</div>

					<Modal.Body
						style={{
							padding: '14px',
							display: 'flex',
							flexDirection: 'column',
							gap: '12px',
						}}>
						<div
							style={{
								background: '#373737',
								padding: '14px',
								display: 'flex',
								flexDirection: 'column',
								gap: '12px',
								borderRadius: '6px',
							}}>
							<div id='data-input' className='hide'>
								<input
									type='text'
									className='form-control'
									id='textInput'
									placeholder='Inserir multiplos dados'
								/>
							</div>
							<div id='data-input-unique' className='hide-2'>
								<input
									type='text'
									className='form-control'
									id='textInputUnique'
									placeholder='Inserir dado unico'
								/>
							</div>

							<div id='output'></div>
							<div id='itemList' className='d-flex flex-column'></div>

							<div id='data-image' className='hide-3 image-input'>
								<div className='image-upload'>
									<input type='file' id='imageInput' accept='image/*' />
									<label htmlFor='imageInput'>
										<i className='fas fa-upload'></i> Adicionar imagem
									</label>
								</div>
								<div id='fileName' className='document-name'>
									Nenhum arquivo selecionado
								</div>
							</div>
						</div>
					</Modal.Body>
					<div className='modal-footer'>
						<button
							type='button'
							onClick={finishVistoria()}
							className='btn btn-primary close-btn'
							data-dismiss='modal'>
							Salvar
						</button>
						<button
							type='button'
							onClick={() => closeModal()()}
							className='btn btn-danger close-btn'
							data-dismiss='modal'>
							Cancelar
						</button>
					</div>
				</>
			</Modal>
			<div className='processos container'>
				<div className='processos-div' style={{ width: '100%' }}>
					<div className='border-radius p-5 w-100'>
						<div className='border-radius p-5 w-100'>
							<table className='table table-bordered'>
								<thead>
									<tr>
										<th scope='col'>ID</th>
										<th scope='col'>PROCESSO</th>
										<th scope='col'>DESCRICAO</th>
									</tr>
								</thead>
								<tbody id='operacional-list'>
									{processosData.map((product) => (
										<tr
											key={
												product.idVistoria * product.processo * Math.random()
											}
											className='hover'
											onClick={() => openModal(product.idVistoria)}
											data-toggle='modal'
											data-target='#myModalProcess'>
											<td className='w-5'>{product.idVistoria}</td>
											<td className='w-5'>{product.processo}</td>
											<td className='w-20 process-description'>
												{product.descricao}
											</td>
										</tr>
									))}
								</tbody>
								<thead>
									<tr>
										<th scope='col'>ID</th>
										<th scope='col'>PROCESSO</th>
										<th scope='col'>DESCRICAO</th>
									</tr>
								</thead>
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Vistorias;
