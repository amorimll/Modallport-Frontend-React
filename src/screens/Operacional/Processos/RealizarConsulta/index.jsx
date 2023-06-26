// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const RealizarConsulta = () => {
	const [processosData, setProcessosData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredProcessos, setFilteredProcessos] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const res = await axios.get('https://localhost:44350/api/VistoriasRealizadas/');

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

	if (loading) {
		return <></>;
	}

	return (
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

			{/* Modal */}

			<div className='processos-div' style={{ width: '100%' }}>
				<table className='table table-bordered'>
					<thead>
						<tr>
							<th scope='col'>ID</th>
							<th scope='col'>DESCRICAO</th>
              <th scope="col">DATA</th>
						</tr>
					</thead>
					<tbody id='vistorias-list'>
						{filteredProcessos.map((product) => (
							<tr
								key={product.idVistoriaRealizada}
								className='hover'
								onClick='openModal(${product.idVistoriaRealizada})'
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
              <th scope="col">DATA</th>
						</tr>
					</thead>
				</table>
			</div>
		</div>
	);
};

export default RealizarConsulta;
