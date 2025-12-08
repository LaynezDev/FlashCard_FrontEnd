// shared/components/ui/Button.jsx

import React from 'react';

const Button = ({ title, onPress, color = 'blue' }) => (
    <button 
        onClick={onPress} 
        style={{ backgroundColor: color, /* ... estilos DOM ... */ }}
    >
        {title}
    </button>
);

export default Button;