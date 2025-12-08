import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDecksByCourse } from '../../api/courseService';
import { createDeck, deleteDeck } from '../../api/deckService';
import { COLORS } from '../../constants/theme';

const AdminCourseDetailsScreen = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [decks, setDecks] = useState([]);
    const [newDeckName, setNewDeckName] = useState('');

    const loadData = async () => {
        const data = await getDecksByCourse(courseId);
        setDecks(data);
    };

    useEffect(() => { loadData(); }, [courseId]);

    const handleCreateDeck = async () => {
        if (!newDeckName) return;
        try {
            // AQUÍ VINCULAMOS EL DECK AL CURSO
            await createDeck({ 
                nombre_deck: newDeckName, 
                descripcion: 'Creado en curso', 
                id_curso: courseId // <--- CLAVE
            });
            setNewDeckName('');
            loadData();
        } catch (e) { alert('Error creando deck'); }
    };

    const handleDeleteDeck = async (id) => {
        if (confirm('¿Borrar deck y sus tarjetas?')) {
            await deleteDeck(id);
            loadData();
        }
    };

    return (
        <div>
            <button onClick={() => navigate('/admin')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 15 }}>← Volver a Cursos</button>
            <h1 style={{ color: COLORS.SECONDARY }}>Contenido del Curso</h1>

            <div style={styles.createBox}>
                <input 
                    placeholder="Nombre del nuevo Mazo/Tema (Ej: Verbos)" 
                    value={newDeckName} onChange={e => setNewDeckName(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleCreateDeck} style={styles.btnPrimary}>+ Agregar Mazo</button>
            </div>

            <div style={styles.list}>
                {decks.length === 0 && <p>No hay mazos en este curso.</p>}
                {decks.map(deck => (
                    <div key={deck.id_deck} style={styles.item}>
                        <div style={{ flex: 1 }}>
                            <h3>{deck.nombre_deck}</h3>
                            <span style={{ color: '#888', fontSize: 12 }}>ID: {deck.id_deck}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button 
                                onClick={() => navigate(`/admin/deck/${deck.id_deck}`)} // Ir al editor de tarjetas
                                style={styles.btnEdit}
                            >
                                ✏️ Editar Tarjetas
                            </button>
                            <button onClick={() => handleDeleteDeck(deck.id_deck)} style={styles.btnDelete}>🗑️</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    createBox: { backgroundColor: '#fff', padding: 20, borderRadius: 8, marginBottom: 20, display: 'flex', gap: 10 },
    input: { flex: 1, padding: 10, borderRadius: 4, border: '1px solid #ccc' },
    btnPrimary: { backgroundColor: COLORS.PRIMARY, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 4, cursor: 'pointer' },
    list: { display: 'flex', flexDirection: 'column', gap: 15 },
    item: { backgroundColor: '#fff', padding: 15, borderRadius: 8, display: 'flex', alignItems: 'center', borderLeft: `4px solid ${COLORS.PRIMARY}`, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    btnEdit: { backgroundColor: COLORS.SECONDARY, color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' },
    btnDelete: { backgroundColor: '#FFEBEE', border: 'none', padding: '8px', borderRadius: 4, cursor: 'pointer' }
};

export default AdminCourseDetailsScreen;