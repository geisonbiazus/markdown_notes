import React, { SyntheticEvent } from 'react';
import { Nav } from 'react-bootstrap';
import { BsTrash } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import './Nav.css';

export const VerticalNav: React.FC = ({ children }) => {
  return (
    <Nav className="flex-column mt-2" as="ul">
      {children}
    </Nav>
  );
};

export interface NavItemProps {
  text: string;
  active?: boolean;
  href?: string;
}

export const NavItem: React.FC<NavItemProps> = (props) => {
  const { text, active = false, href = '#', children } = props;

  return (
    <Nav.Item as="li">
      <Nav.Link className="nav-item" active={active} as={Link} to={href}>
        {text}
        {children}
      </Nav.Link>
    </Nav.Item>
  );
};

export interface NavIconProps {
  onClick?: () => void;
}

export const NavIcon: React.FC<NavIconProps> = (props) => {
  const { onClick } = props;

  const onClickIcon = (e: SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClick?.();
  };

  return (
    <div className="float-right" onClick={onClickIcon}>
      <BsTrash />
    </div>
  );
};
