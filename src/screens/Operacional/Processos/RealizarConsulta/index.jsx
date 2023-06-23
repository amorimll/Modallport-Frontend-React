// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import './styles.css';
import Frame from '../../../../components/Frame';

const RealizarConsulta = () => {
	const [processosData, setProcessosData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredProcessos, setFilteredProcessos] = useState([]);
	const [processoSelected, setProcessoSelected] = useState();
	const [show, setShow] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const res = await axios.get(
				'https://localhost:44350/api/VistoriasRealizadas/'
			);

			if (res) {
				setProcessosData(res.data);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		const filtered = processosData.filter(
			(processo) =>
				processo.idVistoriaRealizada.toString().includes(searchQuery) ||
				processo.descricao.toLowerCase().includes(searchQuery.toLowerCase())
		);

		setFilteredProcessos(filtered);
	}, [searchQuery, processosData]);

	function openModal(item) {
		if (typeof item.itens == 'string') {
			if (Object.keys(item.itens).length > 0) {
				item.itens = JSON.parse(item.itens);
			} else {
				item.itens = [];
			}
		} else{
			if(item.itens.length == undefined){
				item.itens = [];
			}
		}

		setProcessoSelected(item);
		setShow(true);
	}

	const closeModal = () => {
		setShow(false);
		setProcessoSelected();
	};

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
				<img alt='' src={value.item.opcoes[0]} />
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
					disabled
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
					disabled
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
				<div>Descricao : {value.item.descricao}</div>
				{value?.item.opcoes?.map((res) => (
					<div key={parseInt(value.item.tipo) * 1200 * Math.random()}>
						<label style={{ display: 'flex', gap: 12 }}>
							<input
								checked
								disabled
								type='checkbox'
								className='multi-responses'
								value={res.opcao}
							/>
							{res}
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
				<div>Descricao : {value.item.descricao}</div>{' '}
				{value?.item.opcoes?.map((res) => (
					<div key={parseInt(value.item.tipo) * 1200 * Math.random()}>
						<label style={{ display: 'flex', gap: 12 }}>
							<input
								checked
								disabled
								type='checkbox'
								className='multi-responses'
								value={res.opcao}
							/>
							{res}
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
				<div>Descricao : {value.item.descricao}</div>{' '}
				<input
					id='input-item-file-sign'
					type='file'
					className='add-item-btn myInput'
					placeholder='Adicionar assinatura'
				/>
			</div>
		);
	};

	if (loading) {
		return <></>;
	}

	return (
		<Frame>
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
							ID: {processoSelected?.idVistoriaRealizada}
						</div>
						<div id='data-process' className='process-item'>
							Processo: {processoSelected?.processo}
						</div>
						<div id='description-process' className='process-item'>
							Descricao: {processoSelected?.descricao}
						</div>
						<div id='item-process' className='item-data'>
							{processoSelected?.itens?.length === 0 &&
								'Nenhum item registrado...'}
							{processoSelected?.itens.length > 0 &&
								processoSelected?.itens?.map((res) => (
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
				</>
			</Modal>
			<div className='processos container'>
				<div className='input-group'>
					<input
						type='text'
						className='input-busca form-control'
						placeholder='Buscar pelo nome ou ID...'
						aria-describedby='basic-addon1'
						value={searchQuery}
						onChange={(event) => setSearchQuery(event.target.value)}
					/>
				</div>

				<div className='processos-div' style={{ width: '100%' }}>
					<table className='table table-bordered'>
						<thead>
							<tr>
								<th scope='col'>ID</th>
								<th scope='col'>DESCRICAO</th>
								<th scope='col'>DATA</th>
							</tr>
						</thead>
						<tbody id='vistorias-list'>
							{filteredProcessos.map((product) => (
								<tr
									key={product.idVistoriaRealizada}
									className='hover'
									onClick={() => openModal(product)}
									data-toggle='modal'
									data-target='#myModalProcess'>
									<td className='w-25'>{product.idVistoriaRealizada}</td>
									<td className='w-50'>{product.descricao}</td>
									<td className='w-25'>
										{new Date(product.dataDeCadastro).toLocaleDateString(
											'pt-BR'
										)}
									</td>
								</tr>
							))}
						</tbody>
						<thead>
							<tr>
								<th scope='col'>ID</th>
								<th scope='col'>DESCRICAO</th>
								<th scope='col'>DATA</th>
							</tr>
						</thead>
					</table>
				</div>
			</div>
		</Frame>
	);
};

export default RealizarConsulta;
