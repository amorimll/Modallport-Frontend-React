import styled from 'styled-components';

interface ComponentsProps {
	isVisible: boolean;
}

export const Container = styled.div`
	visibility: hidden;
	display: none;
	z-index: 999;
	@media (max-width: 1023px) {
		visibility: visible;
		display: flex;
		gap: 22px;
		background: gray;
		width: 100%;
		padding: 0 24px;
		transition: 0.3s ease-in-out;
	}
`;

export const MenuIcon = styled.div`
	visibility: hidden;
	@media (max-width: 1023px) {
		visibility: visible;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		transition: 0.3s ease-in-out;
		> img {
			width: 18px;
		}
	}
`;

export const Title = styled.div`
	visibility: hidden;
	@media (max-width: 1023px) {
		visibility: visible;
		width: 100%;
		height: 100%;
		display: flex;
		padding: 16px;
		flex-direction: column;
		gap: 12px;
		font-weight: 600;
		color: white;
	}
`;

export const Content = styled.div<ComponentsProps>`
	visibility: hidden;
	display: none;
	@media (max-width: 1023px) {
		visibility: visible;
		display: flex;
		z-index: 999;
		flex-direction: column;
		gap: 22px;
		background: gray;
		width: 100%;
		left: ${(props) => (props.isVisible ? '0%' : '-100%')};
		height: 100vh;
		position: absolute;
		padding: 24px;
		transition: 0.3s ease-in-out;
	}
`;

export const Close = styled.div`
	width: 100%;
	text-align: right;
	color: white;
	font-weight: 500;
`;

export const Item = styled.div`
	visibility: hidden;
	@media (max-width: 1023px) {
		visibility: visible;
		cursor: pointer;
		font-weight: 500;
		color: white;
	}
`;

interface DropdownProps {
	isOpen?: boolean;
}

export const DropdownContainer = styled.div<DropdownProps>`
	position: relative;
`;

export const DropdownOption = styled.a`
	padding: 5px;
	cursor: pointer;
	color: white;
	transition: 0.3s;
	&:hover {
		opacity: 0.5;
	}
`;
