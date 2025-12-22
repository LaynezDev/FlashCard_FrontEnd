import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../constants/theme";

// Importamos las pantallas (Las crearemos en el Paso 5)
import DashboardScreen from "./screens/DashboardScreen";
import StudyScreen from "./screens/StudyScreen";
import AdminDecksScreen from "./screens/AdminDecksScreen";
import DeckEditorScreen from "./screens/DeckEditorScreen";
import StudentsManagerScreen from "./screens/StudentsManagerScreen";
import CourseDecksScreen from "./screens/CourseDecksScreen";
import AdminCoursesScreen from "./screens/AdminCoursesScreen";
import AdminCourseDetailsScreen from "./screens/AdminCourseDetailsScreen";
import TeachersManagerScreen from "./screens/TeachersManagerScreen";
import SchoolStructureScreen from "./screens/SchoolStructureScreen";
import TeacherProgressScreen from './screens/TeacherProgressScreen';
// Componente simple de Navbar para la Web
const Navbar = ({ signOut, user }) => {
    // Verificamos si es profesor o admin
    const isAdminOrProf = user?.tipo_usuario === "Profesor" || user?.tipo_usuario === "Admin";
    const isAdmin = user?.tipo_usuario === "Admin";

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 30px",
                backgroundColor: COLORS.WHITE,
                borderBottom: "1px solid #e0e0e0",
                alignItems: "center",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <h2 style={{ margin: 0, color: COLORS.PRIMARY }}>Flash⚡Card🃏</h2>

                {/* ENLACES DE NAVEGACIÓN */}
                <Link to="/" style={linkStyle}>
                    Mis Cursos
                </Link>
            </div>

            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                {/* 🔒 CONDICIONAL: Solo mostramos esto si NO es alumno */}
                {isAdminOrProf && (
                    <>
                        <Link to="/admin" style={adminLinkStyle}>
                            ⚙️ Gestión Académica
                        </Link>
                        <Link to="/students" style={adminLinkStyle}>
                            👥 Alumnos
                        </Link>
                        {isAdmin && (
                            <Link to="/teachers" style={adminLinkStyle}>
                                👨‍🏫 Profesores
                            </Link>
                        )}
                    </>
                )}

                <span style={{ color: COLORS.MUTED }}>
                    {user?.nombre || user?.email} ({user?.tipo_usuario})
                </span>

                <button
                    onClick={signOut}
                    style={{
                        background: "transparent",
                        border: `1px solid ${COLORS.ERROR}`,
                        color: COLORS.ERROR,
                        padding: "5px 15px",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Salir
                </button>
            </div>
        </nav>
    );
};

const MainAppStack = () => {
    const { signOut, user } = useAuth();

    // Nota: BrowserRouter debe estar aquí o en index.js.
    // Si index.js ya tiene Router, cambia esto por un simple <div>
    return (
        <Router>
            <div
                style={{
                    minHeight: "100vh",
                    backgroundColor: COLORS.BACKGROUND,
                    fontFamily: "Arial, sans-serif",
                }}
            >
                <Navbar signOut={signOut} user={user} />

                <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
                    <Routes>
                        <Route path="/" element={<DashboardScreen />} />
                        <Route path="/study/:deckId" element={<StudyScreen />} />
                        {/* RUTAS DEL BACKOFFICE */}
                        {/* <Route path="/admin" element={<AdminDecksScreen />} /> */}
                        {/* <Route path="/admin/deck/:deckId" element={<DeckEditorScreen />} /> */}
                        <Route path="/students" element={<StudentsManagerScreen />} />
                        <Route path="/course/:courseId" element={<CourseDecksScreen />} /> {/* Nueva Pantalla */}
                        {/* <Route path="/study/:deckId" element={<StudyScreen />} /> */}
                        <Route path="*" element={<Navigate to="/" />} />
                        {/* RUTA PRINCIPAL ADMIN: LISTA DE CURSOS */}
                        <Route path="/admin" element={<AdminCoursesScreen />} />
                        {/* RUTA NIVEL 2: DECKS DENTRO DE UN CURSO */}
                        <Route path="/admin/course/:courseId" element={<AdminCourseDetailsScreen />} />
                        {/* RUTA NIVEL 3: EDITOR DE TARJETAS (Ya existía) */}
                        <Route path="/admin/deck/:deckId" element={<DeckEditorScreen />} />
                        <Route path="/teachers" element={<TeachersManagerScreen />} />
                        <Route path="/structure" element={<SchoolStructureScreen />} />
                        <Route path="/progress-report" element={<TeacherProgressScreen />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};
const adminLinkStyle = {
    textDecoration: "none",
    color: COLORS.SECONDARY,
    fontWeight: "bold",
    border: `1px solid ${COLORS.SECONDARY}`,
    padding: "5px 10px",
    borderRadius: "4px",
};
const linkStyle = { textDecoration: "none", color: COLORS.TEXT, fontWeight: "bold" };
export default MainAppStack;
