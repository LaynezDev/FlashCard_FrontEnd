import React, { useEffect, useState } from "react";
import { getMyCourses, getDecksByCourse } from "../../api/courseService";
import { getTeacherReport } from "../../api/progressService";
import { COLORS } from "../../constants/theme";

const TeacherProgressScreen = () => {
    // Estados de Selección
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");

    const [decks, setDecks] = useState([]);
    const [selectedDeck, setSelectedDeck] = useState("");

    // Estado de Datos
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Cargar Cursos al inicio
    useEffect(() => {
        getMyCourses().then(setCourses);
    }, []);

    // 2. Cargar Decks cuando selecciona Curso
    useEffect(() => {
        if (selectedCourse) {
            getDecksByCourse(selectedCourse).then(setDecks);
            setReportData([]); // Limpiar tabla anterior
            setSelectedDeck("");
        }
    }, [selectedCourse]);

    // 3. Generar Reporte cuando selecciona Deck
    useEffect(() => {
        if (selectedCourse && selectedDeck) {
            loadReport();
        }
    }, [selectedDeck]);

    const loadReport = async () => {
        setLoading(true);
        try {
            const data = await getTeacherReport(selectedCourse, selectedDeck);
            setReportData(data.students);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Helper para color de barra
    const getBarColor = (p) => {
        if (p < 30) return "#FF5252"; // Rojo
        if (p < 70) return "#FF9800"; // Naranja
        return "#4CAF50"; // Verde
    };

    return (
        <div style={{ paddingBottom: 50 }}>
            <h1 style={{ color: COLORS.SECONDARY }}>Monitor de Progreso</h1>
            <p style={{ color: "#666" }}>Selecciona un curso y un tema para ver el rendimiento de la clase.</p>

            {/* BARRA DE FILTROS */}
            <div style={styles.filterBar}>
                <div style={styles.filterGroup}>
                    <label style={{ fontWeight: "bold", fontSize: 12 }}>CURSO:</label>
                    <select style={styles.select} value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                        <option value="">-- Selecciona --</option>
                        {courses.map((c) => (
                            <option key={c.id_curso} value={c.id_curso}>
                                {c.nombre_curso}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={styles.filterGroup}>
                    <label style={{ fontWeight: "bold", fontSize: 12 }}>TEMA / MAZO:</label>
                    <select style={styles.select} value={selectedDeck} onChange={(e) => setSelectedDeck(e.target.value)} disabled={!selectedCourse}>
                        <option value="">-- Selecciona --</option>
                        {decks.map((d) => (
                            <option key={d.id_deck} value={d.id_deck}>
                                {d.nombre_deck}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* TABLA DE RESULTADOS */}
            <div style={styles.resultsContainer}>
                {!selectedDeck ? (
                    <div style={{ padding: 40, textAlign: "center", color: "#999" }}>Selecciona un tema para cargar los datos.</div>
                ) : loading ? (
                    <div style={{ padding: 40, textAlign: "center" }}>Cargando datos...</div>
                ) : reportData.length === 0 ? (
                    <div style={{ padding: 40, textAlign: "center", color: "#999" }}>No hay alumnos inscritos en este curso o nadie ha estudiado aún.</div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #eee", textAlign: "left", color: "#666" }}>
                                <th style={{ padding: 15 }}>Alumno</th>
                                <th style={{ padding: 15, width: "50%" }}>Progreso de Dominio</th>
                                <th style={{ padding: 15 }}>%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((student) => (
                                <tr key={student.id} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={{ padding: 15 }}>
                                        <div style={{ fontWeight: "bold" }}>{student.name}</div>
                                        <div style={{ fontSize: 12, color: "#999" }}>{student.email}</div>
                                    </td>
                                    <td style={{ padding: 15 }}>
                                        <div style={styles.progressBg}>
                                            <div
                                                style={{
                                                    ...styles.progressBar,
                                                    width: `${student.percentage}%`,
                                                    backgroundColor: getBarColor(student.percentage),
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td style={{ padding: 15, fontWeight: "bold", color: getBarColor(student.percentage) }}>{student.percentage}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

const styles = {
    filterBar: { display: "flex", gap: 20, marginBottom: 30, backgroundColor: "#fff", padding: 20, borderRadius: 8, boxShadow: "0 2px 5px rgba(0,0,0,0.05)" },
    filterGroup: { flex: 1, display: "flex", flexDirection: "column", gap: 5 },
    select: { padding: 10, borderRadius: 4, border: "1px solid #ccc", fontSize: 14 },
    resultsContainer: { backgroundColor: "#fff", borderRadius: 8, boxShadow: "0 2px 5px rgba(0,0,0,0.05)", overflow: "hidden" },
    progressBg: { width: "100%", height: 10, backgroundColor: "#f0f0f0", borderRadius: 5, overflow: "hidden" },
    progressBar: { height: "100%", transition: "width 0.5s ease" },
};

export default TeacherProgressScreen;
