import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeckEditorData, createFlashcard, deleteFlashcard } from '../../api/deckService';
import { COLORS } from '../../constants/theme';

const DeckEditorScreen = () => {
    const { deckId } = useParams();
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    
    // Formulario nuevo
    const [pregunta, setPregunta] = useState('');
    const [respuesta, setRespuesta] = useState('');

    const loadData = async () => {
        const data = await getDeckEditorData(deckId);
        setCards(data.cards);
    };

    useEffect(() => { loadData(); }, [deckId]);

    const handleAddCard = async (e) => {
        e.preventDefault();
        if (!pregunta || !respuesta) return;

        try {
            await createFlashcard(deckId, { pregunta, respuesta });
            setPregunta('');
            setRespuesta('');
            loadData(); // Recargar lista
        } catch (error) {
            alert('Error al guardar tarjeta');
        }
    };

    const handleDeleteCard = async (id) => {
        if (window.confirm('¿Borrar tarjeta?')) {
            await deleteFlashcard(id);
            loadData();
        }
    };

    return (
        <div style={{ paddingBottom: 50 }}>
            <button onClick={() => navigate('/admin')} style={{ cursor: 'pointer', border: 'none', background: 'transparent', marginBottom: 20 }}>
                ← Volver a Mis Cursos
            </button>
            
            <h1 style={{ color: COLORS.PRIMARY }}>Editor de Contenido</h1>
            
            {/* FORMULARIO DE AGREGAR */}
            <div style={styles.formCard}>
                <h3>Agregar Nueva Tarjeta</h3>
                <form onSubmit={handleAddCard} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                    <input 
                        placeholder="Pregunta (Anverso)" 
                        value={pregunta} 
                        onChange={e => setPregunta(e.target.value)} 
                        style={styles.input}
                    />
                    <textarea 
                        placeholder="Respuesta (Reverso)" 
                        value={respuesta} 
                        onChange={e => setRespuesta(e.target.value)} 
                        style={{ ...styles.input, height: 80 }}
                    />
                    <button type="submit" style={styles.btnAdd}>+ Agregar Tarjeta</button>
                </form>
            </div>

            {/* LISTA DE TARJETAS EXISTENTES */}
            <h3 style={{ marginTop: 40 }}>Tarjetas en este curso ({cards.length})</h3>
            <div style={styles.listContainer}>
                {cards.length === 0 && <p style={{ color: '#888' }}>No hay tarjetas aún.</p>}
                
                {cards.map((card, index) => (
                    <div key={card.id_flashcard} style={styles.itemRow}>
                        <div style={{ width: '30px', fontWeight: 'bold', color: '#ccc' }}>{index + 1}</div>
                        <div style={{ flex: 1, fontWeight: 'bold' }}>{card.pregunta}</div>
                        <div style={{ flex: 1, color: '#555' }}>{card.respuesta}</div>
                        <button onClick={() => handleDeleteCard(card.id_flashcard)} style={styles.btnDelSmall}>
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    formCard: { backgroundColor: '#fff', padding: 25, borderRadius: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto' },
    input: { padding: 12, borderRadius: 5, border: '1px solid #ddd', fontSize: 16, width: '100%', boxSizing: 'border-box' },
    btnAdd: { backgroundColor: COLORS.PRIMARY, color: '#fff', padding: 12, border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold', fontSize: 16 },
    listContainer: { marginTop: 20, backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid #eee' },
    itemRow: { display: 'flex', padding: '15px 20px', borderBottom: '1px solid #eee', alignItems: 'center', gap: 20 },
    btnDelSmall: { backgroundColor: '#FFEBEE', color: 'red', border: 'none', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

export default DeckEditorScreen;