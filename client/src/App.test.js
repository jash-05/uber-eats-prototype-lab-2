import { BrowserRouter as Router} from "react-router-dom";
import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomerLogin from './components/customer.login';
import WelcomeUser from './components/welcome.user';
import Dashboard from './components/dashboard';
import '@testing-library/jest-dom/extend-expect';

test('Renders welcome page', () => {
    render(
        <React.StrictMode>
            <Router>
                <WelcomeUser />
            </Router>
        </React.StrictMode>
    )
    const linkElement = screen.getByText(/I am a Customer/i);
    expect(linkElement).toBeInTheDocument();  
})

test('Renders customer login page', () => {
    render(
        <React.StrictMode>
            <Router>
                <CustomerLogin />
            </Router>
        </React.StrictMode>
    )
    const linkElement = screen.getByText(/Email address/i);
    expect(linkElement).toBeInTheDocument();
})

test('Renders dashboard page', () => {
    render(
        <React.StrictMode>
            <Router>
                <Dashboard />
            </Router>
        </React.StrictMode>
    )
    const linkElement = screen.getByText(/Food options/i);
    expect(linkElement).toBeInTheDocument();  
})