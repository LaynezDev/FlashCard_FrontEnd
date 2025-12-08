// shared/components/ui/Button.native.jsx (usa Galio)

import React from 'react';
// import { Button as GButton } from 'galio-framework';
// No necesitas la importación nativa si usas Galio

const Button = ({ title, onPress, color = 'blue' }) => (
    <GButton 
        onPress={onPress} 
        color={color} // Galio usa props de color
    >
        {title}
    </GButton>
);

export default Button;