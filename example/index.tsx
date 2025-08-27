import React from 'react'
import { createRoot } from 'react-dom/client'

const App = () => {
    return (
        <div>
            <h1>Hello from React!</h1>
            <p>Welcome to my React application</p>
        </div>
    );
};


const container = document.getElementById('root')
const root = createRoot(container)
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
