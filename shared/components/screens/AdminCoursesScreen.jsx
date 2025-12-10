import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyCourses, createCourse, deleteCourse } from '../../api/courseService';
import { COLORS } from '../../constants/theme';
import { getTeachers } from '../../api/userService'; 
import { useAuth } from '../../context/AuthContext';

const AdminCoursesScreen = () => {
    const { user } = useAuth();
    const isAdmin = user?.tipo_usuario === 'Admin';

    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]); // Lista para el select
    const [newName, setNewName] = useState('');
    const [selectedProfesor, setSelectedProfesor] = useState(''); // ID del profe seleccionado
    const navigate = useNavigate();

    const loadData = async () => {
        const data = await getMyCourses();
        setCourses(data);
        // Si soy admin, cargo la lista de profesores para el select
        if (isAdmin) {
            const tData = await getTeachers();
            setTeachers(tData);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleCreate = async () => {
        if (!newName.trim()) return;
        // Si soy admin y no elegí profesor, error
        if (isAdmin && !selectedProfesor) {
            return alert("Debes asignar un profesor al curso.");
        }
        try {
           await createCourse({ 
                nombre_curso: newName, 
                descripcion: 'Curso escolar',
                id_profesor: selectedProfesor // Enviamos el ID
            });
            setNewName('');
            setSelectedProfesor('');
            loadData();
        } catch (e) { alert('Error creando curso'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Borrar curso completo?')) {
            await deleteCourse(id);
            loadData();
        }
    };

    return (
        <div>
            <h1 style={{ color: COLORS.SECONDARY }}>Gestión de Cursos (Profesor)</h1>
            
            {/* CREAR CURSO */}
            <div style={styles.createBox}>
                <input 
                    placeholder="Nombre del nuevo curso (Ej: Matemáticas 101)" 
                    value={newName} onChange={e => setNewName(e.target.value)}
                    style={styles.input}
                />
                {/* SELECT DE PROFESORES (Solo visible para Admin) */}
                {isAdmin && (
                    <select 
                        value={selectedProfesor}
                        onChange={e => setSelectedProfesor(e.target.value)}
                        style={styles.select}
                    >
                        <option value="">-- Asignar Profesor --</option>
                        {teachers.map(t => (
                            <option key={t.id_usuario} value={t.id_usuario}>
                                {t.nombre}
                            </option>
                        ))}
                    </select>
                )}
                <button onClick={handleCreate} style={styles.btnPrimary}>+ Crear Curso</button>
            </div>

            {/* LISTA */}
            <div style={styles.grid}>
                {courses.map(course => (
                    <div key={course.id_curso} style={styles.card}>
                        <h2 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{course.nombre_curso}</h2>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button 
                                onClick={() => navigate(`/admin/course/${course.id_curso}`)} // Navegar al detalle
                                style={styles.btnManage}
                            >
                                📂 Gestionar Decks
                            </button>
                            <button onClick={() => handleDelete(course.id_curso)} style={styles.btnDelete}>🗑️</button>
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
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 8, borderLeft: `5px solid ${COLORS.SECONDARY}`, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    btnManage: { flex: 1, backgroundColor: '#E0E0E0', border: 'none', padding: 8, borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' },
    btnDelete: { backgroundColor: '#FFEBEE', border: 'none', padding: 8, borderRadius: 4, cursor: 'pointer' }
};

export default AdminCoursesScreen;