import styled from 'styled-components';

interface ContainerProps {
	bg?: any;
}

export const Container = styled.div<ContainerProps>`
	display: flex;
	flex-direction: column;
	@media (min-width: 1023px) {
		flex-direction: row;
	}
`;

export const Content = styled.div<ContainerProps>`
	width: 100%;
`;
