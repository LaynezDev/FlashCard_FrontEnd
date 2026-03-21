import React, { useState } from "react";
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

const Sidebar = ({ signOut, user, isOpen }) => {
    const isAdminOrProf = user?.tipo_usuario === "Profesor" || user?.tipo_usuario === "Admin";
    const isAdmin = user?.tipo_usuario === "Admin";

    return (
        <aside style={{ ...sidebarStyle, transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
            <div style={sidebarInnerStyle}>
                {/* --- Cabecera del Sidebar --- */}
                <div style={sidebarHeaderStyle}>
                    <h3 style={{ margin: '0 0 5px 0', color: COLORS.PRIMARY }}>Bienvenido</h3>
                    <span style={{ fontSize: '14px', color: COLORS.MUTED }}>
                        Usted es <strong>{user?.tipo_usuario}</strong>
                    </span>
                    <span style={{ fontSize: '12px', color: COLORS.MUTED, wordBreak: 'break-all' }}>
                        {user?.nombre || user?.email}
                    </span>
                </div>

                {/* --- Enlaces de Navegación --- */}
                <nav style={navStyle}>
                    <Link to="/" style={linkStyle}>
                        📚 Mis Cursos
                    </Link>

                    {/* 🔒 CONDICIONAL: Solo mostramos esto si NO es alumno */}
                    {isAdminOrProf && (
                        <>
                            <hr style={separatorStyle} />
                            <span style={sectionTitleStyle}>Gestión</span>
                            <Link to="/admin" style={linkStyle}>
                                ⚙️ Cursos y Contenidos
                            </Link>
                            <Link to="/students" style={linkStyle}>
                                👥 Alumnos
                            </Link>
                            {isAdmin && (
                                <Link to="/teachers" style={linkStyle}>
                                    👨‍🏫 Profesores
                                </Link>
                            )}
                            {isAdmin && (                                
                                <Link to="/structure" style={linkStyle}>
                                    🏫 Grados y Secciones
                                </Link>
                            )}
                            {isAdmin && (
                                <Link to="/progress-report" style={linkStyle}>
                                    📊 Reportes
                                </Link>)}
                            
                        </>
                    )}
                </nav>

                {/* --- Botón de Salir (al final) --- */}
                <div style={sidebarFooterStyle}>
                    <button onClick={signOut} style={logoutButtonStyle}>
                        🚪 Salir
                    </button>
                </div>
            </div>
        </aside>
    );
};

const HamburgerButton = ({ onClick }) => (
    <button onClick={onClick} style={hamburgerStyle}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
    </button>
);

const Backdrop = ({ isOpen, onClick }) => (
    <div
        onClick={onClick}
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999, // Justo debajo del sidebar
            opacity: isOpen ? 1 : 0,
            visibility: isOpen ? 'visible' : 'hidden',
            transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
        }}
    />
);

const MainAppStack = () => {
    const { signOut, user } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Nota: BrowserRouter debe estar aquí o en index.js.
    // Si index.js ya tiene Router, cambia esto por un simple <div>
    return (
        <Router>
            <div
                style={mainContainerStyle}
            >
                <Backdrop isOpen={isSidebarOpen} onClick={() => setSidebarOpen(false)} />
                <Sidebar signOut={signOut} user={user} isOpen={isSidebarOpen} />

                <main style={mainContentStyle}>
                    <header style={topHeaderStyle}>
                        <HamburgerButton onClick={() => setSidebarOpen(!isSidebarOpen)} />
                        <h2 style={{ margin: 0, color: COLORS.PRIMARY }}>Flash⚡Card🃏</h2>
                    </header>
                    <div style={{ padding: "30px" }}>
                        <Routes>
                            <Route path="/" element={<DashboardScreen />} />
                            <Route path="/study/:deckId" element={<StudyScreen />} />
                            <Route path="/students" element={<StudentsManagerScreen />} />
                            <Route path="/course/:courseId" element={<CourseDecksScreen />} />
                            <Route path="/admin" element={<AdminCoursesScreen />} />
                            <Route path="/admin/course/:courseId" element={<AdminCourseDetailsScreen />} />
                            <Route path="/admin/deck/:deckId" element={<DeckEditorScreen />} />
                            <Route path="/teachers" element={<TeachersManagerScreen />} />
                            <Route path="/structure" element={<SchoolStructureScreen />} />
                            <Route path="/progress-report" element={<TeacherProgressScreen />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </Router>
    );
};

// --- Estilos para el nuevo Layout ---

const SIDEBAR_WIDTH = '260px';

const mainContainerStyle = {
    minHeight: "100vh",
    backgroundColor: COLORS.BACKGROUND,
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
};

const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    height: '100vh',
    backgroundColor: COLORS.WHITE,
    borderRight: `1px solid #e0e0e0`,
    boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s ease-in-out',
    zIndex: 1000,
};

const sidebarInnerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '98%',
    padding: '20px',
};

const sidebarHeaderStyle = {
    paddingBottom: '20px',
    borderBottom: `1px solid #eee`,
    marginBottom: '20px',
};

const navStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flexGrow: 1, // Ocupa el espacio disponible, empujando el footer hacia abajo
};

const linkStyle = {
    textDecoration: "none",
    color: COLORS.TEXT,
    fontWeight: "500",
    padding: '10px 15px',
    borderRadius: '6px',
    transition: 'background-color 0.2s, color 0.2s',
};

const sidebarFooterStyle = {
    marginTop: 'auto', // Ancla el footer al final
};

const logoutButtonStyle = {
    width: '100%',
    background: COLORS.ERROR_LIGHT,
    border: 'none',
    color: COLORS.ERROR,
    padding: "12px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 'bold',
    textAlign: 'left',
    transition: 'background-color 0.2s',
};

const mainContentStyle = {
    // La transición de 'margin-left' ya no es necesaria
    // El contenido principal ya no se mueve, el sidebar es un overlay.
};

const topHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '15px 30px',
    backgroundColor: COLORS.WHITE,
    borderBottom: '1px solid #e0e0e0',
};

const hamburgerStyle = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: COLORS.PRIMARY,
};

const separatorStyle = {
    border: 'none',
    borderTop: '1px solid #eee',
    margin: '15px 0',
};

const sectionTitleStyle = {
    color: COLORS.MUTED,
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    padding: '0 15px',
    marginTop: '10px',
};

export default MainAppStack;
