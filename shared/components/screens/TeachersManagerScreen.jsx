import React, { useEffect, useState } from 'react';
import { getTeachers, createTeacher } from '../../api/userService';
import { COLORS } from '../../constants/theme';

const TeachersManagerScreen = () => {
    const [teachers, setTeachers] = useState([]);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loadData = async () => {
        try {
            const data = await getTeachers();
            setTeachers(data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { loadData(); }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await createTeacher({ nombre, email, password });
            setNombre(''); setEmail(''); setPassword('');
            alert('Profesor creado');
            loadData();
        } catch (e) { alert('Error al crear'); }
    };

    return (
        <div>
            <h1 style={{ color: COLORS.SECONDARY }}>Claustro de Profesores</h1>
            
            <div style={{ display: 'flex', gap: 40, marginTop: 20 }}>
                {/* Formulario */}
                <div style={{ flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 8 }}>
                    <h3>Contratar Nuevo Profesor</h3>
                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <input placeholder="Nombre" value={nombre} onChange={e=>setNombre(e.target.value)} style={styles.input} required />
                        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={styles.input} required />
                        <input placeholder="Contraseña Inicial" value={password} onChange={e=>setPassword(e.target.value)} style={styles.input} required />
                        <button type="submit" style={styles.btn}>Crear Cuenta</button>
                    </form>
                </div>

                {/* Lista */}
                <div style={{ flex: 2 }}>
                    {teachers.map(t => (
                        <div key={t.id_usuario} style={styles.item}>
                            <div style={{ fontWeight: 'bold' }}>{t.nombre}</div>
                            <div style={{ color: '#666' }}>{t.email}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    input: { padding: 10, borderRadius: 4, border: '1px solid #ccc' },
    btn: { padding: 10, backgroundColor: COLORS.PRIMARY, color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' },
    item: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 4, borderLeft: `4px solid ${COLORS.SECONDARY}`, display: 'flex', justifyContent: 'space-between' }
};

export default TeachersManagerScreen;