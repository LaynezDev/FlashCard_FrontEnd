import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDecks, createDeck, deleteDeck } from '../../api/deckService';
import { COLORS } from '../../constants/theme';

const AdminDecksScreen = () => {
    const [decks, setDecks] = useState([]);
    const [newDeckName, setNewDeckName] = useState('');
    const navigate = useNavigate();

    const loadDecks = async () => {
        const data = await getDecks();
        setDecks(data);
    };

    useEffect(() => { loadDecks(); }, []);

    const handleCreate = async () => {
        if (!newDeckName.trim()) return;
        try {
            // id_curso es null por ahora, id_creador lo toma el backend del token
            await createDeck({ nombre_deck: newDeckName, descripcion: 'Creado en Backoffice' });
            setNewDeckName('');
            loadDecks();
        } catch (e) {
            alert('Error al crear deck');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro? Se borrarán todas las tarjetas.')) {
            await deleteDeck(id);
            loadDecks();
        }
    };

    return (
        <div>
            <h1 style={{ color: COLORS.SECONDARY }}>Gestión de Cursos (Backoffice)</h1>

            {/* CREAR NUEVO DECK */}
            <div style={styles.createBox}>
                <input 
                    type="text" 
                    placeholder="Nombre del nuevo curso..." 
                    value={newDeckName}
                    onChange={(e) => setNewDeckName(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleCreate} style={styles.btnPrimary}>+ Crear Curso</button>
            </div>

            {/* LISTA DE DECKS */}
            <div style={styles.grid}>
                {decks.map(deck => (
                    <div key={deck.id_deck} style={styles.card}>
                        <h3>{deck.nombre_deck}</h3>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                            <button 
                                onClick={() => navigate(`/admin/deck/${deck.id_deck}`)}
                                style={styles.btnEdit}
                            >
                                ✏️ Editar Contenido
                            </button>
                            <button 
                                onClick={() => handleDelete(deck.id_deck)}
                                style={styles.btnDelete}
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    createBox: { backgroundColor: '#fff', padding: 20, borderRadius: 8, marginBottom: 30, display: 'flex', gap: 10 },
    input: { flex: 1, padding: 10, borderRadius: 4, border: '1px solid #ccc' },
    btnPrimary: { backgroundColor: COLORS.PRIMARY, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 8, borderLeft: `4px solid ${COLORS.SECONDARY}`, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    btnEdit: { flex: 1, backgroundColor: '#E0E0E0', border: 'none', padding: 8, borderRadius: 4, cursor: 'pointer' },
    btnDelete: { backgroundColor: '#FFEBEE', color: COLORS.ERROR, border: 'none', padding: 8, borderRadius: 4, cursor: 'pointer' }
};

export default AdminDecksScreen;