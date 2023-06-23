import Frame from '../../components/Frame';
import './styles.css';

function WelcomeMessage() {
	return (
		<Frame>
			<div className='welcome-container'>
				Bem-vindo ao nosso aplicativo! Esperamos que você tenha uma ótima
				experiência...
			</div>
		</Frame>
	);
}

export default WelcomeMessage;
