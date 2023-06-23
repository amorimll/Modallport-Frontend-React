import React, { useState } from 'react';
import menuIcon from '../../../assets/icons/menu.svg';
import {
	Close,
	Container,
	Content,
	DropdownContainer,
	DropdownOption,
	Item,
	MenuIcon,
	Title,
} from './styles';
import { options } from '../LeftMenu/static';

const TopMenu = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isHovered, setIsHovered] = useState<string>('');
	const [isContentVisible, setContentVisible] = useState(false);

	const handleButtonClick = () => {
	  setContentVisible(!isContentVisible);
	};

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
			<Title>Modal Port</Title>
			<MenuIcon onClick={handleButtonClick}>
				<img alt='' src={menuIcon} />
			</MenuIcon>
			<Content isVisible={isContentVisible}>
				<Close onClick={handleButtonClick}>X</Close>
				{options.map((item) => (
					<div
						onMouseEnter={() => handleMouseEnter(item.primary)}
						onMouseLeave={handleMouseLeave}>
						<Item>{item.primary}</Item>
						{item.sub.map((subitem) => (
							<DropdownContainer isOpen={isHovered == item.primary}>
								<DropdownOption href={subitem.url}>{subitem.name}</DropdownOption>
							</DropdownContainer>
						))}
					</div>
				))}
			</Content>
		</Container>
	);
};

export default TopMenu;
