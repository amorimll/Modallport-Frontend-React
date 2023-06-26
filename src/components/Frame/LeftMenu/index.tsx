import React, { useState } from 'react';
import menuIcon from '../../../assets/icons/menu.svg';
import {
	Container,
	Content,
	DropdownContainer,
	DropdownOption,
	Item,
	MenuIcon,
} from './styles';
import { options } from './static';

const LeftMenu = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isHovered, setIsHovered] = useState<string>('');

	const handleMouseEnter = (id: string) => {
		setIsHovered(id);
	};

	const handleMouseLeave = () => {
		setIsHovered('');
	};

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};
	return (
		<Container>
			<MenuIcon>
				<img alt='' src={menuIcon} />
			</MenuIcon>
			<Content>
				{options.map((item) => (
					<div
						onMouseEnter={() => handleMouseEnter(item.primary)}
						onMouseLeave={handleMouseLeave}>
						<Item>{item.primary}</Item>
						{item.sub.map((subitem) => (
							<DropdownContainer isOpen={isHovered == item.primary}>
								<DropdownOption href={subitem.url}>
									{subitem.name}
								</DropdownOption>
							</DropdownContainer>
						))}
					</div>
				))}
			</Content>
		</Container>
	);
};

export default LeftMenu;
