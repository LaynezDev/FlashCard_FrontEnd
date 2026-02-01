import React, { useEffect, useState } from "react";
import { getStudents, createStudent } from "../../api/userService";
import { getMyCourses, enrollStudentInCourse } from "../../api/courseService"; // Nuevas funciones
import { getGrades, getSections } from "../../api/schoolService";
import { COLORS } from "../../constants/theme";

const StudentsManagerScreen = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]); // Lista de cursos disponibles para asignar

    // Estados del formulario registro
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Estados para filtros de grado y sección
    const [grades, setGrades] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState("");
    const [selectedSection, setSelectedSection] = useState("");

    // Estados del MODAL de asignación
    const [selectedStudent, setSelectedStudent] = useState(null); // Alumno a inscribir
    const [selectedCourseId, setSelectedCourseId] = useState(""); // Curso seleccionado

    // Cargar grados al inicio
    useEffect(() => {
        getGrades().then(setGrades);
    }, []);

    // Cargar secciones cuando cambia el grado
    useEffect(() => {
        if (selectedGrade) {
            getSections(selectedGrade).then(setSections);
        } else {
            setSections([]);
        }
    }, [selectedGrade]);

    // Cargar datos iniciales
    const loadData = async () => {
        try {
            const studentsData = await getStudents();
            setStudents(studentsData);

            // También cargamos los cursos del profesor para llenar el select
            const coursesData = await getMyCourses();
            setCourses(coursesData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // ... handleRegister (igual que antes) ...
    const handleRegister = async (e) => {
        e.preventDefault();
        // ... (Tu lógica de registro existente)
        await createStudent({ nombre, email, password });
        loadData();
        // ...
        await createStudent({ nombre, email, password, id_seccion: selectedSection });
    };

    // Nueva función: Inscribir
    const handleEnroll = async () => {
        if (!selectedCourseId || !selectedStudent) return;
        try {
            await enrollStudentInCourse(selectedStudent.id_usuario, selectedCourseId);
            alert(`Alumno inscrito en el curso correctamente.`);
            setSelectedStudent(null); // Cerrar modal
        } catch (error) {
            alert("Error: El alumno ya está inscrito o hubo un fallo.");
        }
    };

    return (
        <div style={{ paddingBottom: 50, position: "relative" }}>
            <h1 style={{ color: COLORS.SECONDARY }}>Mis Alumnos</h1>

            {/* ... (Formulario de Registro y Tabla igual que antes) ... */}

            <div style={{ display: "flex", gap: "40px", marginTop: "30px", flexWrap: "wrap" }}>
                {/* COLUMNA IZQ: Formulario (Mantén tu código anterior aquí) */}
                {/* COLUMNA IZQUIERDA: Formulario de Registro */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={styles.formCard}>
                        <h3 style={{ marginTop: 0 }}>Matricular Nuevo Alumno</h3>
                        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input 
                                placeholder="Nombre Completo" 
                                value={nombre} onChange={e => setNombre(e.target.value)} 
                                style={styles.input} required
                            />
                            <input 
                                placeholder="Correo Electrónico" type="email"
                                value={email} onChange={e => setEmail(e.target.value)} 
                                style={styles.input} required
                            />
                            <input 
                                placeholder="Contraseña Temporal" 
                                value={password} onChange={e => setPassword(e.target.value)} 
                                style={styles.input} required
                            />
                            <button type="submit" style={styles.btnAdd}>Registrar Alumno</button>
                        </form>
                    </div>
                </div>

                {/* COLUMNA DER: Tabla */}
                <div style={{ flex: 2, minWidth: "300px" }}>
                    <div style={styles.tableCard}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                                    <th style={{ padding: 10 }}>Nombre</th>
                                    <th style={{ padding: 10 }}>Email</th>
                                    <th style={{ padding: 10 }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id_usuario} style={{ borderBottom: "1px solid #eee" }}>
                                        <td style={{ padding: 10, fontWeight: "bold" }}>{student.nombre}</td>
                                        <td style={{ padding: 10 }}>{student.email}</td>
                                        <td style={{ padding: 10 }}>
                                            <button onClick={() => setSelectedStudent(student)} style={styles.btnEnroll}>
                                                + Asignar Curso
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL DE ASIGNACIÓN (Simple Overlay) --- */}
            {selectedStudent && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3>Inscribir a {selectedStudent.nombre}</h3>
                        <p>Selecciona el curso al que deseas darle acceso:</p>

                        <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} style={styles.select}>
                            <option value="">-- Selecciona un Curso --</option>
                            {courses.map((course) => (
                                <option key={course.id_curso} value={course.id_curso}>
                                    {course.nombre_curso}
                                </option>
                            ))}
                        </select>
                        <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} style={styles.input}>
                            <option value="">-- Selecciona Grado --</option>
                            {grades.map((g) => (
                                <option key={g.id_grado} value={g.id_grado}>
                                    {g.nombre_grado}
                                </option>
                            ))}
                        </select>

                        <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} style={styles.input} disabled={!selectedGrade}>
                            <option value="">-- Selecciona Sección --</option>
                            {sections.map((s) => (
                                <option key={s.id_seccion} value={s.id_seccion}>
                                    {s.nombre_seccion}
                                </option>
                            ))}
                        </select>
                        <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "flex-end" }}>
                            <button onClick={() => setSelectedStudent(null)} style={styles.btnCancel}>
                                Cancelar
                            </button>
                            <button onClick={handleEnroll} style={styles.btnConfirm}>
                                Guardar Inscripción
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Agrega estos estilos a tu objeto styles existente
const styles = {
    // ... tus estilos anteriores ...
    btnEnroll: { backgroundColor: COLORS.PRIMARY, color: "#fff", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 12 },

    // Estilos del Modal
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 30,
        borderRadius: 10,
        width: "400px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    },
    formCard: { backgroundColor: '#fff', padding: 25, borderRadius: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
    tableCard: { backgroundColor: '#fff', padding: 20, borderRadius: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.05)', overflowX: 'auto' },
    input: { padding: 12, borderRadius: 5, border: '1px solid #ddd', fontSize: 16 },
    select: { width: "100%", padding: 10, borderRadius: 5, border: "1px solid #ccc", marginTop: 10 },
    btnAdd: { backgroundColor: COLORS.SECONDARY, color: '#fff', padding: 12, border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold' },
    badge: { backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
    btnCancel: { backgroundColor: "#ccc", border: "none", padding: "10px 15px", borderRadius: 5, cursor: "pointer" },
    btnConfirm: { backgroundColor: COLORS.PRIMARY, color: "#fff", border: "none", padding: "10px 15px", borderRadius: 5, cursor: "pointer", fontWeight: "bold" },
};

export default StudentsManagerScreen;
