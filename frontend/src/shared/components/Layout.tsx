import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import './Layout.css';

export interface AppBarProps {
  title: string;
  href: string;
  rightComponent?: React.ReactElement;
}

export const AppBar: React.FC<AppBarProps> = (props) => {
  const { title, href, rightComponent } = props;

  return (
    <Navbar className="appbar" bg="dark" variant="dark">
      <Navbar.Brand href={href}>{title}</Navbar.Brand>
      <Nav className="mr-auto"></Nav>
      <Nav>{rightComponent}</Nav>
    </Navbar>
  );
};

export const AppContainer: React.FC = ({ children }) => {
  return (
    <Container fluid className="pt-3">
      {children}
    </Container>
  );
};

export const CenteredContainer: React.FC = ({ children }) => {
  return <div className="centered-container">{children}</div>;
};

export const NarrowContainer: React.FC = ({ children }) => {
  return <div className="narrow-container">{children}</div>;
};
