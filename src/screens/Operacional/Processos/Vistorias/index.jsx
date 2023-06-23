// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import { useNavigate, useParams } from 'react-router';
import Modal from 'react-bootstrap/Modal';
import Frame from '../../../../components/Frame';

const Vistorias = () => {
	const [processosData, setProcessosData] = useState([]);
	const [items, setItems] = useState([]);
	const [processoSelected, setProcessoSelected] = useState();
	const [loading, setLoading] = useState(true);
	const { id } = useParams();
	var itemById;
	const [show, setShow] = useState(false);
	const navigate = useNavigate();

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
		setProcessoSelected(res.data[0]);
		const itemProcess = document.getElementById('item-process');
		console.log(res.data[0]);
		const data = res.data;

		itemById = data;

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

		setItems(itemsArray);
		/*

		if (itemsArray.length > 0) {
			itemsArray.map((result) => {
				switch (parseInt(result.tipo)) {
					case 6: // ASSINATURA
						itemProcess.innerHTML += `Tipo: Assinatura <div>Descricao : ${result.items[0].descricao}</div> <input id="input-item-file-sign" type="file" className="add-item-btn myInput" placeholder="Adicionar assinatura" />`;
						break;
				}
			});
		} else {
			itemProcess.innerHTML += 'Nenhum item registrado...';
		}
		*/
	}

	function openModal(item) {
		console.log('drop-1');
		getByIdWithItems(item);
		setShow(true);
		// element.classList.add('show')
	}

	function getSelectedOptions() {
		var checkboxes = document.getElementsByClassName('multi-responses');
		var selectedOptions = [];
		// Convert HTMLCollection to array
		var checkboxArray = Array.from(checkboxes);
		checkboxArray.map(function (checkbox) {
			if (checkbox.checked) {
				console.log(checkbox.value);
				selectedOptions.push(checkbox.value);
			}
		});
		return selectedOptions;
	}

	function getSelectedUniqueOption() {
		var checkboxes = document.getElementsByClassName('unique-response');
		console.log(checkboxes);
		var selectedOptions = [];
		// Convert HTMLCollection to array
		var checkboxArray = Array.from(checkboxes);
		checkboxArray.map(function (checkbox) {
			selectedOptions.push(checkbox.value);
		});
		console.log(selectedOptions);
		return selectedOptions;
	}

	function fileToBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = () => {
				const base64String = reader.result.split(',')[1]; // Extract the Base64 data from the Data URL
				resolve(base64String);
			};

			reader.onerror = (error) => {
				reject(error);
			};

			reader.readAsDataURL(file);
		});
	}

	async function finishVistoria() {
		// LOGIC HANDLER

		const dataVistoria = {
			idVistoriaRealizada: processoSelected?.idVistoria,
			descricao: processoSelected?.descricao,
			processo: processoSelected?.processo,
			ativo: processoSelected?.ativo,
			dataDeCadastro: new Date().toISOString(),
			dhAlteracao: new Date().toISOString(),
		};
		const subItems = [];
		console.log('FINISHED ---------------');
		const numberResponse = document.getElementById('input-number')?.value;
		if (numberResponse) {
			const res = processoSelected?.items.filter((item) => item.tipo === 3);
			const numberData = {
				descricao: res[0].descricao,
				ordem: res[0].ordem,
				tipo: res[0].tipo,
				opcoes: numberResponse,
			};
			subItems.push(numberData);
		}
		const textResponse = document.getElementById('input-item-text')?.value;
		if (textResponse) {
			const res = processoSelected?.items.filter((item) => item.tipo === 2);
			const textData = {
				descricao: res[0].descricao,
				ordem: res[0].ordem,
				tipo: res[0].tipo,
				opcoes: textResponse,
			};
			subItems.push(textData);
		}
		const multiResponses = getSelectedOptions();
		if (multiResponses.length > 0) {
			const res = processoSelected?.items.filter((item) => item.tipo === 4);
			const multi = {
				descricao: res[0].descricao,
				ordem: res[0].ordem,
				tipo: res[0].tipo,
				opcoes: multiResponses,
			};
			subItems.push(multi);
		}
		const uniqueResponse = getSelectedUniqueOption();
		if (uniqueResponse.length > 0) {
			const res = processoSelected?.items.filter((item) => item.tipo === 5);
			const uniqueData = {
				descricao: res[0].descricao,
				ordem: res[0].ordem,
				tipo: res[0].tipo,
				opcoes: uniqueResponse,
			};
			subItems.push(uniqueData);
		}
		const inputItemPicture = document.getElementById('input-item-file-picture')
			?.files[0];
		if (inputItemPicture) {
			const res = processoSelected?.items.filter((item) => item.tipo === 1);
			const pictureData = {
				descricao: res[0].descricao,
				ordem: res[0].ordem,
				tipo: res[0].tipo,
				opcoes: inputItemPicture,
			};
			subItems.push(pictureData);
		}
		const inputItemSign = document.getElementById('input-item-file-sign')
			?.files[0];
		if (inputItemSign) {
			const base64String = await fileToBase64(inputItemSign);
			const signData = {
				opcoes: base64String,
			};

			subItems.push(signData);
		}
		dataVistoria.itens = JSON.stringify(subItems);
		console.log(dataVistoria);

		// REQUEST

		try {
			const response = await axios
				.post(`https://localhost:44350/api/VistoriasRealizadas`, dataVistoria)
				.then((res) => res);

			navigate(0);
			console.log(response);
		} catch (error) {
			console.error(error);
			// handle error
		}
	}

	const ImageResponse = (value) => {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 12,
					borderBottom: '1px solid black',
					paddingBottom: 12,
				}}>
				Tipo: Foto
				<div>Descricao : {value.item.items[0].descricao}</div>{' '}
				<input
					id='input-item-file-picture'
					type='file'
					className='add-item-btn myInput'
					placeholder='Adicionar item'
				/>
			</div>
		);
	};

	const TextResponse = (value) => {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 12,
					borderBottom: '1px solid black',
					paddingBottom: 12,
				}}>
				Tipo: Texto
				<div>Descricao : {value.item.items[0].descricao}</div>{' '}
				<textarea
					id='input-item-text'
					type='text'
					className='add-item-btn myInput'
					placeholder='Adicionar resposta'
				/>
			</div>
		);
	};

	const NumberResponse = (value) => {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 12,
					borderBottom: '1px solid black',
					paddingBottom: 12,
				}}>
				Tipo: Numerico
				<div>Descricao : {value.item.items[0].descricao}</div>{' '}
				<input
					id='input-number'
					type='number'
					className='add-item-btn myInput'
					placeholder='Adicionar resposta'
				/>
			</div>
		);
	};

	const MultiplesResponse = (value) => {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 12,
					borderBottom: '1px solid black',
					paddingBottom: 12,
				}}>
				Tipo: Multipla Escolha
				<div>Descricao : {value.item.items[0].descricao}</div>
				{value?.item.items?.map((res) => (
					<div key={parseInt(value.item.tipo) * 1200 * Math.random()}>
						<label style={{ display: 'flex', gap: 12 }}>
							<input
								type='checkbox'
								className='multi-responses'
								value={res.opcao}
							/>
							{res.opcao}
						</label>
					</div>
				))}
			</div>
		);
	};

	const UniqueResponse = (value) => {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 12,
					borderBottom: '1px solid black',
					paddingBottom: 12,
				}}>
				Tipo: Unica Escolha
				<div>Descricao : {value.item.items[0].descricao}</div>{' '}
				{value?.item.items?.map((res) => (
					<div key={parseInt(value.item.tipo) * 1200 * Math.random()}>
						<label style={{ display: 'flex', gap: 12 }}>
							<input
								type='radio'
								className='unique-response'
								value={res.opcao}
							/>
							{res.opcao}
						</label>
					</div>
				))}
			</div>
		);
	};

	const ToSignResponse = (value) => {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 12,
					borderBottom: '1px solid black',
					paddingBottom: 12,
				}}>
				Tipo: Assinatura
				<div>Descricao : {value.item.items[0].descricao}</div>{' '}
				<input
					id='input-item-file-sign'
					type='file'
					className='add-item-btn myInput'
					placeholder='Adicionar assinatura'
				/>
			</div>
		);
	};

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
							<h5 className='modal-title'>Inserir dados</h5>
						</Modal.Title>
					</Modal.Header>
					<div className='modal-body'>
						<div id='title-process' className='process-item'>
							ID: {processoSelected?.idVistoria}
						</div>
						<div id='data-process' className='process-item'>
							Processo: {processoSelected?.processo}
						</div>
						<div id='description-process' className='process-item'>
							Descricao: {processoSelected?.descricao}
						</div>
						<div id='item-process' className='item-data'>
							{items.length === 0 && 'Nenhum item registrado...'}
							{items.length > 0 &&
								items.map((res) => (
									<div key={parseInt(res.tipo) * 1200 * Math.random()}>
										{parseInt(res.tipo) == 1 && <ImageResponse item={res} />}
										{parseInt(res.tipo) == 2 && <TextResponse item={res} />}
										{parseInt(res.tipo) == 3 && <NumberResponse item={res} />}
										{parseInt(res.tipo) == 4 && (
											<MultiplesResponse item={res} />
										)}
										{parseInt(res.tipo) == 5 && <UniqueResponse item={res} />}
										{parseInt(res.tipo) == 6 && <ToSignResponse item={res} />}
									</div>
								))}
						</div>
					</div>
					<div className='modal-footer'>
						<button
							type='button'
							onClick={finishVistoria}
							className='btn btn-primary close-btn'
							data-dismiss='modal'>
							Salvar
						</button>
						<button
							type='button'
							onClick={closeModal}
							className='btn btn-danger close-btn'
							data-dismiss='modal'>
							Cancelar
						</button>
					</div>
				</>
			</Modal>
			<Frame>
				<div className='processos container'>
					<div className='processos-div' style={{ width: '100%' }}>
						<div className='border-radius w-100'>
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
			</Frame>
		</>
	);
};

export default Vistorias;
