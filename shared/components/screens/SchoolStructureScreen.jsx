import React, { useEffect, useState } from "react";
import { getGrades, createGrade, getSections, createSection } from "../../api/schoolService";
import { COLORS } from "../../constants/theme";

const SchoolStructureScreen = () => {
    const [grades, setGrades] = useState([]);
    const [newGrade, setNewGrade] = useState("");

    // Para manejar secciones, necesitamos saber qué grado está "abierto"
    const [expandedGradeId, setExpandedGradeId] = useState(null);
    const [sectionsMap, setSectionsMap] = useState({}); // Mapa { id_grado: [secciones] }
    const [newSectionNames, setNewSectionNames] = useState({}); // Mapa { id_grado: "texto" }

    useEffect(() => {
        loadGrades();
    }, []);

    const loadGrades = async () => {
        const data = await getGrades();
        setGrades(data);
    };

    const handleCreateGrade = async () => {
        if (!newGrade) return;
        await createGrade(newGrade);
        setNewGrade("");
        loadGrades();
    };

    const toggleGrade = async (gradeId) => {
        if (expandedGradeId === gradeId) {
            setExpandedGradeId(null); // Cerrar
        } else {
            setExpandedGradeId(gradeId); // Abrir
            // Cargar secciones de este grado
            const sects = await getSections(gradeId);
            setSectionsMap((prev) => ({ ...prev, [gradeId]: sects }));
        }
    };

    const handleCreateSection = async (gradeId) => {
        const name = newSectionNames[gradeId];
        if (!name) return;

        await createSection(name, gradeId);

        // Limpiar input y recargar
        setNewSectionNames((prev) => ({ ...prev, [gradeId]: "" }));
        const sects = await getSections(gradeId);
        setSectionsMap((prev) => ({ ...prev, [gradeId]: sects }));
    };

    return (
        <div>
            <h1 style={{ color: COLORS.SECONDARY }}>Estructura Académica</h1>

            {/* CREAR GRADO */}
            <div style={styles.createBox}>
                <input placeholder="Nuevo Grado (Ej: 1ro Básico)" value={newGrade} onChange={(e) => setNewGrade(e.target.value)} style={styles.input} />
                <button onClick={handleCreateGrade} style={styles.btnPrimary}>
                    + Agregar Grado
                </button>
            </div>

            {/* LISTA DE GRADOS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                {grades.map((grade) => (
                    <div key={grade.id_grado} style={styles.card}>
                        <div style={styles.gradeHeader} onClick={() => toggleGrade(grade.id_grado)}>
                            <h3 style={{ margin: 0 }}>{grade.nombre_grado}</h3>
                            <span>{expandedGradeId === grade.id_grado ? "▼" : "▶"}</span>
                        </div>

                        {/* SECCIÓN EXPANDIBLE (SECCIONES) */}
                        {expandedGradeId === grade.id_grado && (
                            <div style={styles.sectionsContainer}>
                                <h4 style={{ marginTop: 0 }}>Secciones:</h4>

                                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 15 }}>
                                    {sectionsMap[grade.id_grado]?.map((sec) => (
                                        <div key={sec.id_seccion} style={styles.badge}>
                                            Sección {sec.nombre_seccion}
                                        </div>
                                    ))}
                                    {(!sectionsMap[grade.id_grado] || sectionsMap[grade.id_grado].length === 0) && <span style={{ color: "#999" }}>Sin secciones</span>}
                                </div>

                                {/* Crear Sección */}
                                <div style={{ display: "flex", gap: 10 }}>
                                    <input placeholder="Nombre (Ej: A)" value={newSectionNames[grade.id_grado] || ""} onChange={(e) => setNewSectionNames({ ...newSectionNames, [grade.id_grado]: e.target.value })} style={{ ...styles.input, padding: 5 }} />
                                    <button onClick={() => handleCreateSection(grade.id_grado)} style={styles.btnSecondary}>
                                        + Sección
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    createBox: { backgroundColor: "#fff", padding: 20, borderRadius: 8, marginBottom: 20, display: "flex", gap: 10 },
    input: { flex: 1, padding: 10, borderRadius: 4, border: "1px solid #ccc" },
    btnPrimary: { backgroundColor: COLORS.PRIMARY, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 4, cursor: "pointer" },
    btnSecondary: { backgroundColor: COLORS.SECONDARY, color: "#fff", border: "none", padding: "5px 15px", borderRadius: 4, cursor: "pointer" },
    card: { backgroundColor: "#fff", borderRadius: 8, border: "1px solid #ddd", overflow: "hidden" },
    gradeHeader: { padding: 15, backgroundColor: "#f9f9f9", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" },
    sectionsContainer: { padding: 15, borderTop: "1px solid #eee" },
    badge: { backgroundColor: "#E3F2FD", color: "#1565C0", padding: "5px 10px", borderRadius: 15, fontSize: 14, fontWeight: "bold" },
};

export default SchoolStructureScreen;
