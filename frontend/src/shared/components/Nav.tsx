import React from 'react';
import { Nav } from 'react-bootstrap';
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
  const { text, active = false, href = '#' } = props;

  return (
    <Nav.Item as="li">
      <Nav.Link className="nav-item" active={active} as={Link} to={href}>
        {text}
      </Nav.Link>
    </Nav.Item>
  );
};
