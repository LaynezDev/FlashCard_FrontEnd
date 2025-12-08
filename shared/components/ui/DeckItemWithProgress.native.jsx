import React, { useEffect, useState } from 'react';
import { ProgressBar } from 'react-native'; // O un componente de barra simple
import { Block, Text, Button, theme } from 'galio-framework';
import { getDeckProgress } from '../../api/progressService';
import { COLORS } from '../../constants/theme';

const DeckItemWithProgress = ({ deck, onStudy }) => {
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        getDeckProgress(deck.id_deck)
            .then(data => setPercentage(data.percentage))
            .catch(e => console.log(e));
    }, [deck.id_deck]);

    const getProgressColor = (p) => {
        if (p < 30) return COLORS.ERROR;
        if (p < 70) return '#FF9800';
        return COLORS.PRIMARY;
    };

    return (
        <Block card style={styles.card}>
            <Block row space="between" style={{ marginBottom: 5 }}>
                <Text h6 bold>{deck.nombre_deck}</Text>
                <Text bold color={getProgressColor(percentage)}>{percentage}%</Text>
            </Block>
            
            <Text muted size={12} style={{ marginBottom: 10 }}>{deck.descripcion}</Text>

            {/* Barra de Progreso (Alto de línea, estilo iOS/Android) */}
            <Block style={{ height: 6, backgroundColor: '#f0f0f0', borderRadius: 3, overflow: 'hidden', marginBottom: 15 }}>
                <Block style={{ 
                    height: '100%', 
                    width: `${percentage}%`, 
                    backgroundColor: getProgressColor(percentage) 
                }} />
            </Block>

            <Button 
                color={COLORS.PRIMARY} 
                round 
                size="small"
                onPress={() => onStudy(deck.id_deck)}
                style={{ width: '100%' }}
            >
                {percentage === 100 ? 'REPASAR' : 'ESTUDIAR'}
            </Button>
        </Block>
    );
};

const styles = {
    card: { backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 8, elevation: 2 }
};

export default DeckItemWithProgress;