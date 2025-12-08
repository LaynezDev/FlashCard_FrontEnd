import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getMyCourses } from '../../api/courseService'; // Asegúrate de haber creado este servicio
import { COLORS } from '../../constants/theme';

const DashboardScreen = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
      try {
        const data = await getMyCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error al cargar cursos", error);
      } finally {
        setLoading(false);
      }
  };

  if (loading) {
      return (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
              <h3 style={{ color: COLORS.PRIMARY }}>Cargando tus cursos...</h3>
          </div>
      );
  }

  return (
    <div>
      {/* Encabezado */}
      <div style={{ borderBottom: '1px solid #eee', paddingBottom: 10, marginBottom: 20 }}>
        <h1 style={{ color: COLORS.SECONDARY, margin: 0 }}>Mis Cursos</h1>
        <p style={{ color: COLORS.MUTED, margin: '5px 0 0 0' }}>Selecciona un curso para ver su contenido</p>
      </div>
      
      {/* Contenido */}
      {courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, backgroundColor: '#fff', borderRadius: 8 }}>
              <p>No tienes cursos asignados todavía.</p>
          </div>
      ) : (
          <div style={styles.grid}>
            {courses.map((course) => (
                <div key={course.id_curso} style={styles.card}>
                    <div style={styles.cardHeader}>
                        <span style={{ fontSize: 30 }}>📚</span>
                    </div>
                    
                    <h2 style={{ margin: '15px 0 10px 0', color: COLORS.TEXT, fontSize: '1.2rem' }}>
                        {course.nombre_curso}
                    </h2>
                    
                    <p style={{ color: '#888', fontSize: '0.9rem', flex: 1 }}>
                        {course.descripcion || 'Sin descripción disponible.'}
                    </p>
                    
                    <button 
                        onClick={() => navigate(`/course/${course.id_curso}`)}
                        style={styles.button}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        VER CONTENIDO →
                    </button>
                </div>
            ))}
          </div>
      )}
    </div>
  );
};

// Estilos CSS-in-JS
const styles = {
    grid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '25px' 
    },
    card: { 
        backgroundColor: '#fff', 
        padding: '25px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
        borderTop: `5px solid ${COLORS.PRIMARY}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease',
        height: '100%', // Para que todas las cards tengan la misma altura
        boxSizing: 'border-box'
    },
    cardHeader: {
        marginBottom: 10
    },
    button: { 
        marginTop: '20px', 
        padding: '12px', 
        width: '100%', 
        backgroundColor: COLORS.SECONDARY, 
        color: '#fff', 
        border: 'none', 
        borderRadius: '6px', 
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.2s'
    }
};

export default DashboardScreen;