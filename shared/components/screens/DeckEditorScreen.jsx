import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosService';
import { getFlashcardsByDeck } from '../../api/courseService'; // Asegúrate que esté exportada
import { COLORS } from '../../constants/theme';

const DeckEditorScreen = () => {
    const { deckId } = useParams();
    const [cards, setCards] = useState([]); // Estado para la lista
    const [loading, setLoading] = useState(true);

    // Estados del formulario
    const [tipo, setTipo] = useState('texto');
    const [pregunta, setPregunta] = useState('');
    const [respuesta, setRespuesta] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef();

    // 1. Cargar tarjetas al iniciar y al crear una nueva
    const loadCards = async () => {
        try {
            const data = await getFlashcardsByDeck(deckId);
            setCards(data);
        } catch (error) {
            console.error("Error cargando tarjetas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCards();
    }, [deckId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('id_deck', deckId);
        formData.append('pregunta', pregunta);
        formData.append('respuesta', respuesta);
        formData.append('tipo', tipo);

        if (tipo === 'imagen' && imageFile) {
            formData.append('imagen', imageFile);
        }

        try {
            await api.post('decks/cards', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Limpiar y Recargar
            setPregunta('');
            setRespuesta('');
            setImageFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            
            loadCards(); // <--- Recarga la lista automáticamente
            alert('Tarjeta añadida');
        } catch (error) {
            alert('Error al guardar');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar esta tarjeta?')) {
            try { 
                await api.delete(`decks/cards/${id}`);
                // await api.delete(`${id}/cards`);
                loadCards();
            } catch (error) {
                alert('No se pudo eliminar');
            }
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h2>Añadir Nueva Tarjeta</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={styles.input}>
                        <option value="texto">Texto Plano</option>
                        <option value="imagen">Imagen (Visual)</option>
                        <option value="narrado">Dictado (Voz)</option>
                    </select>

                    <textarea 
                        placeholder={tipo === 'narrado' ? "Escribe el texto que el sistema leerá..." : "Pregunta"}
                        value={pregunta} 
                        onChange={(e) => setPregunta(e.target.value)}
                        style={styles.textarea} required 
                    />

                    {tipo === 'imagen' && (
                        <div style={styles.fileBox}>
                            <input type="file" ref={fileInputRef} onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" required />
                        </div>
                    )}

                    <input 
                        placeholder="Respuesta Correcta"
                        value={respuesta} 
                        onChange={(e) => setRespuesta(e.target.value)}
                        style={styles.input} required 
                    />

                    <button type="submit" style={styles.button}>GUARDAR TARJETA</button>
                </form>

                <hr style={{ margin: '40px 0' }} />

                <h3>Tarjetas en este Mazo ({cards.length})</h3>
                {loading ? <p>Cargando...</p> : (
                    <div style={styles.list}>
                        {cards.map((card) => (
                            <div key={card.id_flashcard} style={styles.cardItem}>
                                <div style={{ flex: 1 }}>
                                    <span style={styles.badge}>{card.tipo.toUpperCase()}</span>
                                    <p style={{ margin: '10px 0 5px 0', fontWeight: 'bold' }}>{card.pregunta}</p>
                                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>R: {card.respuesta}</p>
                                </div>
                                {card.tipo === 'imagen' && (
                                    <img 
                                        crossorigin="anonymous"
                                        src={`${api.defaults.baseURL.replace('/api/v1', '')}${card.imagen_url}`} 
                                        style={styles.thumb} 
                                        alt="preview"
                                    />
                                )}
                                <button onClick={() => handleDelete(card.id_flashcard)} style={styles.delBtn}>🗑️</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: { backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' },
    container: { maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd' },
    textarea: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px' },
    button: { padding: '15px', backgroundColor: COLORS.PRIMARY, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
    cardItem: { display: 'flex', alignItems: 'center', padding: '15px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '10px', gap: '15px' },
    badge: { fontSize: '10px', backgroundColor: '#e3f2fd', color: '#1976d2', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' },
    thumb: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' },
    delBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }
};

export default DeckEditorScreen;