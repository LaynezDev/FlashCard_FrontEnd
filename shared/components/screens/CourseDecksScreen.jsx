import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDecksByCourse } from '../../api/courseService';
import { COLORS } from '../../constants/theme';
import DeckItemWithProgress from '../ui/DeckItemWithProgress';
const CourseDecksScreen = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const loadData = async () => {
        const data = await getDecksByCourse(courseId);
        setDecks(data);
    };
    loadData();
  }, [courseId]);

  return (
    <div>
      <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20 }}>← Volver a Cursos</button>
      <h1 style={{ color: COLORS.SECONDARY }}>Contenido del Curso</h1>

      {decks.length === 0 && <p>Este curso aún no tiene mazos de tarjetas.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {decks.map((deck) => (
        // Reemplazamos el div manual por el componente
        <DeckItemWithProgress 
            key={deck.id_deck} 
            deck={deck} 
            onStudy={(id) => navigate(`/study/${id}`)} 
        />
    ))}
      </div>
      
    </div>
  );
};

const styles = {
    deckCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderLeft: `5px solid ${COLORS.PRIMARY}` },
    studyBtn: { marginTop: '15px', backgroundColor: COLORS.PRIMARY, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }
};

export default CourseDecksScreen;