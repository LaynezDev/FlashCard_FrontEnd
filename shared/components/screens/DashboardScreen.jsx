import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCourses } from "../../api/courseService";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../constants/theme";

const DashboardScreen = () => {
    const { user } = useAuth(); // Obtenemos el usuario decodificado del contexto
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 1. Verificar si es Profesor o Admin para mostrar el panel superior
    const isProfesor = user?.tipo_usuario === "Profesor" || user?.tipo_usuario === "Admin";
    const isAdmin = user?.tipo_usuario === "Admin";
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
            <div style={{ padding: 50, textAlign: "center", color: COLORS.PRIMARY }}>
                <h2>⏳ Cargando...</h2>
            </div>
        );
    }

    return (
        <div>
            {/* ==============================================
          SECCIÓN ADMINISTRATIVA (SOLO PROFESORES/ADMIN)
         ============================================== */}
            {isProfesor && (
                <div style={styles.adminSection}>
                    <h2 style={{ color: "#2E7D32", marginTop: 0, display: "flex", alignItems: "center", gap: 10 }}>⚙️ Panel de Gestión</h2>
                    <p style={{ margin: "0 0 20px 0", color: "#555" }}>Herramientas para administrar tu centro educativo.</p>

                    <div style={styles.adminGrid}>
                        {/* BOTÓN 1: GESTIONAR CURSOS */}
                        <div style={styles.adminCard} onClick={() => navigate("/admin")}>
                            <div style={styles.iconCircle}>📚</div>
                            <div>
                                <h3 style={{ margin: "0 0 5px 0" }}>Cursos y Contenido</h3>
                                <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>Crear cursos, decks y tarjetas.</p>
                            </div>
                        </div>

                        {/* BOTÓN 2: GESTIONAR ALUMNOS */}
                        <div style={styles.adminCard} onClick={() => navigate("/students")}>
                            <div style={styles.iconCircle}>👥</div>
                            <div>
                                <h3 style={{ margin: "0 0 5px 0" }}>Mis Alumnos</h3>
                                <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>Inscribir estudiantes a cursos.</p>
                            </div>
                        </div>

                        {/* BOTÓN 3: ESTRUCTURA ACADÉMICA (NUEVO) */}
                        {isAdmin && (
                            <div style={styles.adminCard} onClick={() => navigate("/structure")}>
                                <div style={styles.iconCircle}>🏫</div>
                                <div>
                                    <h3 style={{ margin: "0 0 5px 0" }}>Grados y Secciones</h3>
                                    <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>Configurar aulas (1ro A, 1ro B).</p>
                                </div>
                            </div>
                        )}

                        <div style={styles.adminCard} onClick={() => navigate("/progress-report")}>
                            <div style={styles.iconCircle}>📊</div>
                            <div>
                                <h3 style={{ margin: "0 0 5px 0" }}>Reportes</h3>
                                <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>Ver avance de alumnos.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ==============================================
          SECCIÓN DE CURSOS (PARA TODOS)
         ============================================== */}
            <div style={{ borderBottom: "1px solid #eee", paddingBottom: 10, marginBottom: 20, marginTop: 30 }}>
                <h1 style={{ color: COLORS.SECONDARY, margin: 0 }}>{isProfesor ? "Vista Previa de Mis Cursos" : "Mis Cursos de Estudio"}</h1>
                <p style={{ color: COLORS.MUTED, margin: "5px 0 0 0" }}>{isProfesor ? "Estos son los cursos que estás impartiendo actualmente." : "Selecciona un curso para comenzar a practicar."}</p>
            </div>

            {courses.length === 0 ? (
                <div style={styles.emptyState}>
                    <h3>No tienes cursos asignados todavía.</h3>
                    {isProfesor ? <p>Usa el botón "Cursos y Contenido" arriba para crear el primero.</p> : <p>Pide a tu profesor que te inscriba en un curso.</p>}
                </div>
            ) : (
                <div style={styles.grid}>
                    {courses.map((course) => (
                        <div key={course.id_curso} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <span style={{ fontSize: 30 }}>📘</span>
                            </div>

                            <h2 style={{ margin: "15px 0 10px 0", color: COLORS.TEXT, fontSize: "1.2rem" }}>{course.nombre_curso}</h2>

                            <p style={{ color: "#888", fontSize: "0.9rem", flex: 1 }}>{course.descripcion || "Sin descripción disponible."}</p>

                            {/* Botón de Acción */}
                            <button onClick={() => navigate(`/course/${course.id_curso}`)} style={styles.button} onMouseOver={(e) => (e.target.style.backgroundColor = "#388E3C")} onMouseOut={(e) => (e.target.style.backgroundColor = COLORS.SECONDARY)}>
                                {isProfesor ? "VER CONTENIDO" : "ESTUDIAR AHORA"} →
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- ESTILOS CSS-IN-JS ---
const styles = {
    // Panel Administrativo
    adminSection: {
        backgroundColor: "#E8F5E9", // Verde muy claro
        padding: "25px",
        borderRadius: "12px",
        marginBottom: "40px",
        border: `1px solid #C8E6C9`,
        boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
    },
    adminGrid: {
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
    },
    adminCard: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        minWidth: "260px",
        flex: 1,
        transition: "transform 0.2s, box-shadow 0.2s",
        border: "1px solid #eee",
    },
    iconCircle: {
        width: "45px",
        height: "45px",
        borderRadius: "50%",
        backgroundColor: "#F1F8E9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "20px",
    },

    // Grid de Cursos
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "25px",
    },
    card: {
        backgroundColor: "#fff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        borderTop: `5px solid ${COLORS.PRIMARY}`,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxSizing: "border-box",
        transition: "transform 0.2s",
    },
    button: {
        marginTop: "20px",
        padding: "12px",
        width: "100%",
        backgroundColor: COLORS.SECONDARY,
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "background-color 0.2s",
    },
    emptyState: {
        textAlign: "center",
        padding: 50,
        backgroundColor: "#fff",
        borderRadius: 12,
        border: "2px dashed #ddd",
        color: "#888",
    },
};

export default DashboardScreen;
