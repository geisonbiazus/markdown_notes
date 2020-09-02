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
  const { text, active = false, href = '#' } = props;

  const onClickIcon = (e: SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
    window.confirm('Are you sure?');
  };

  return (
    <Nav.Item as="li">
      <Nav.Link className="nav-item" active={active} as={Link} to={href}>
        {text}
        <div style={{ float: 'right' }}>
          <BsTrash onClick={onClickIcon} />
        </div>
      </Nav.Link>
    </Nav.Item>
  );
};
