import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

export interface AppBarProps {
  title: string;
  href: string;
}

export const AppBar: React.FC<AppBarProps> = (props) => {
  const { title, href } = props;

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href={href}>{title}</Navbar.Brand>
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
