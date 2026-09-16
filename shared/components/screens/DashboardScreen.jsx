import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCourses } from "../../api/courseService";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../constants/theme";

const formatLastInteraction = (dateStr) => {
    if (!dateStr) return "Sin actividad";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `Hace ${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Hace ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Hace ${days}d`;
};

const DashboardScreen = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const isProfesor = user?.tipo_usuario === "Profesor" || user?.tipo_usuario === "Admin";

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
                <h2>Cargando...</h2>
            </div>
        );
    }

    return (
        <div>
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
                    {courses.map((course) => {
                        const pct = course.total_cards > 0
                            ? Math.round((course.cards_mastered_5 / course.total_cards) * 100)
                            : 0;
                        return (
                            <div key={course.id_curso} style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <span style={{ fontSize: 30 }}>📘</span>
                                    {pct === 100 && <span style={styles.badge100}>100%</span>}
                                </div>

                                <h2 style={{ margin: "15px 0 10px 0", color: COLORS.TEXT, fontSize: "1.2rem" }}>{course.nombre_curso}</h2>
                                {course.nombre_profesor && (
                                    <p style={{ color: "#888", fontSize: "0.8rem", margin: "0 0 8px" }}>Prof. {course.nombre_profesor}</p>
                                )}
                                <p style={{ color: "#888", fontSize: "0.9rem", flex: 1 }}>{course.descripcion || "Sin descripción disponible."}</p>

                                <div style={styles.statsGrid}>
                                    <div style={styles.statItem}>
                                        <span style={styles.statValue}>{course.total_decks}</span>
                                        <span style={styles.statLabel}>Decks</span>
                                    </div>
                                    <div style={styles.statItem}>
                                        <span style={styles.statValue}>{course.total_cards}</span>
                                        <span style={styles.statLabel}>Cards</span>
                                    </div>
                                    <div style={styles.statItem}>
                                        <span style={{ ...styles.statValue, color: course.cards_mastered_5 > 0 ? "#0D9488" : undefined }}>{course.cards_mastered_5}</span>
                                        <span style={styles.statLabel}>Dominio 5</span>
                                    </div>
                                    <div style={styles.statItem}>
                                        <span style={styles.statValue}>{formatLastInteraction(course.last_interaction)}</span>
                                        <span style={styles.statLabel}>Última vez</span>
                                    </div>
                                </div>

                                {course.total_cards > 0 && (
                                    <div style={styles.progressWrap}>
                                        <div style={styles.progressBg}>
                                            <div style={{ ...styles.progressFill, width: `${pct}%` }} />
                                        </div>
                                        <span style={styles.progressText}>{pct}% dominado</span>
                                    </div>
                                )}

                                <button onClick={() => navigate(`/course/${course.id_curso}`)} style={styles.button} onMouseOver={(e) => (e.target.style.backgroundColor = "#388E3C")} onMouseOut={(e) => (e.target.style.backgroundColor = COLORS.SECONDARY)}>
                                    {isProfesor ? "VER CONTENIDO" : "ESTUDIAR AHORA"} →
                                </button>
                            </div>
                        );
                    })}
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
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    badge100: {
        backgroundColor: "#0D9488",
        color: "#fff",
        fontSize: "12px",
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: "10px",
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "10px",
        marginTop: "15px",
        padding: "12px",
        backgroundColor: "#F9FAFB",
        borderRadius: "8px",
    },
    statItem: {
        textAlign: "center",
    },
    statValue: {
        display: "block",
        fontSize: "18px",
        fontWeight: 700,
        color: "#111827",
    },
    statLabel: {
        fontSize: "11px",
        color: "#6B7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },
    progressWrap: {
        marginTop: "12px",
    },
    progressBg: {
        height: "6px",
        backgroundColor: "#E5E7EB",
        borderRadius: "3px",
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#0D9488",
        borderRadius: "3px",
        transition: "width 0.3s",
    },
    progressText: {
        fontSize: "12px",
        color: "#6B7280",
        marginTop: "4px",
        display: "block",
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
