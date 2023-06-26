import LeftMenu from './LeftMenu';
import TopMenu from './TopMenu';
import * as S from './styles';
import React from 'react';

interface FrameProps {
	children?: React.ReactNode;
	hideLeftMenu?: boolean | undefined;
}

const Frame: React.FC<FrameProps> = ({ children, hideLeftMenu }) => {

	return (
		<S.Container>
            <LeftMenu/>
			<TopMenu/>
			<S.Content>{children}</S.Content>
		</S.Container>
	);
};

export default Frame;
