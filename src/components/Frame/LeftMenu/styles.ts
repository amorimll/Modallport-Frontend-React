import styled from 'styled-components';

export const Container = styled.div`
	visibility: hidden;
	display: none;
	z-index: 999;
	@media (min-width: 1023px) {
		visibility: visible;
		display: flex;
		flex-direction: column;
		gap: 22px;
		background: gray;
		width: 280px;
		left: -220px;
		height: 100vh;
		position: absolute;
		padding: 4px;
		transition: 0.3s ease-in-out;
		> div {
			> img {
				transition: 0.3s ease-in-out;
			}
		}
		&:hover {
			left: 0px;
			> div {
				> img {
					transform: rotate(90deg);
				}
			}
		}
	}
`;

export const MenuIcon = styled.div`
	visibility: hidden;
	@media (min-width: 1023px) {
		visibility: visible;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		padding: 16px;
		transition: 0.3s ease-in-out;
	}
`;

export const Content = styled.div`
	visibility: hidden;
	@media (min-width: 1023px) {
		visibility: visible;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 22px;
	}
`;

export const Item = styled.div`
	visibility: hidden;
	@media (min-width: 1023px) {
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
