import React, { useEffect, useState } from 'react';
import { getDeckProgress } from '../../api/progressService';
import { COLORS } from '../../constants/theme';

const DeckItemWithProgress = ({ deck, onStudy }) => {
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        // Cargar progreso individualmente
        getDeckProgress(deck.id_deck).then(data => setPercentage(data.percentage));
    }, [deck.id_deck]);

    // Color dinámico de la barra según progreso
    const getProgressColor = (p) => {
        if (p < 30) return COLORS.ERROR;   // Rojo
        if (p < 70) return '#FF9800';      // Naranja
        return COLORS.PRIMARY;             // Verde
    };

    return (
        <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>{deck.nombre_deck}</h3>
                <span style={{ fontWeight: 'bold', color: getProgressColor(percentage) }}>
                    {percentage}%
                </span>
            </div>
            
            <p style={{ color: '#888', fontSize: '14px' }}>{deck.descripcion}</p>

            {/* Barra de Progreso CSS */}
            <div style={styles.progressContainer}>
                <div style={{ 
                    ...styles.progressBar, 
                    width: `${percentage}%`,
                    backgroundColor: getProgressColor(percentage) 
                }} />
            </div>

            <button onClick={() => onStudy(deck.id_deck)} style={styles.button}>
                {percentage === 100 ? 'REPASAR' : 'ESTUDIAR'}
            </button>
        </div>
    );
};

const styles = {
    card: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: '1px solid #eee' },
    button: { marginTop: '15px', backgroundColor: COLORS.PRIMARY, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold' },
    progressContainer: { height: '8px', width: '100%', backgroundColor: '#eee', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' },
    progressBar: { height: '100%', transition: 'width 0.5s ease-in-out' }
};

export default DeckItemWithProgress;