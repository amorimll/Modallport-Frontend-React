import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Processos from '../screens/Cadastros/Processos';
import ModelosVistoria from '../screens/Cadastros/Vistoria';
import Operacional from '../screens/Operacional/Processos';
import Vistorias from '../screens/Operacional/Processos/Vistorias';
import RealizarConsulta from '../screens/Operacional/Processos/RealizarConsulta';

const RoutesPaths = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/cadastros/processos' element={<Processos />}></Route>
				<Route
					path='/cadastros/vistorias'
					element={<ModelosVistoria />}></Route>
				<Route path='/operacional/' element={<Operacional />}></Route>
				<Route
					path='/operacional/processos/:id'
					element={<Vistorias />}></Route>
				<Route
					path='/operacional/consultas'
					element={<RealizarConsulta />}></Route>
			</Routes>
		</BrowserRouter>
	);
};

export default RoutesPaths;
