// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import { useNavigate } from 'react-router';

const Operacional = () => {
	const [processosData, setProcessosData] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			const res = await axios.get('https://localhost:44350/api/Processos');

			if (res) {
				setProcessosData(res.data);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return <>Loading...</>;
	}

	return (
		<div className='processos container'>
			<div className='processos-div' style={{ width: '100%' }}>
				<div className='border-radius p-5 w-100'>
					<table className='table'>
						<thead>
							<tr>
								<th scope='col'>ID</th>
								<th scope='col'>DESCRICAO</th>
							</tr>
						</thead>
						<tbody id='operacional-list'>
							{processosData.map((product) => (
								<tr
									key={product.idProcesso * Math.random() * 1000}
									className='hover'
									onClick={() =>
										navigate('processos/' + product.idProcesso)
									}>
									<td className='w-5'>{product.idProcesso}</td>
									<td className='w-5'>{product.descricao}</td>
								</tr>
							))}
						</tbody>
						<thead>
							<tr>
								<th scope='col'>ID</th>
								<th scope='col'>DESCRICAO</th>
							</tr>
						</thead>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Operacional;
