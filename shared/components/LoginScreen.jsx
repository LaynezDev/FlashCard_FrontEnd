import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [keepSession, setKeepSession] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
        } catch (err) {
            setError(err?.response?.data?.msg || 'Credenciales inválidas. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                * { margin: 0; padding: 0; box-sizing: border-box; }
                .lc-container {
                    display: flex;
                    min-height: 100vh;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }

                /* LEFT PANEL */
                .lc-left {
                    flex: 0 0 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #fff;
                    padding: 40px;
                }
                .lc-left-inner {
                    width: 100%;
                    max-width: 420px;
                }
                .lc-logo-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 32px;
                }
                .lc-logo-text {
                    font-size: 22px;
                    font-weight: 700;
                    color: #111827;
                }
                .lc-badge {
                    background: #F3F4F6;
                    color: #4B5563;
                    font-size: 12px;
                    font-weight: 500;
                    padding: 4px 10px;
                    border-radius: 12px;
                    margin-left: auto;
                }
                .lc-heading {
                    font-size: 32px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 8px;
                }
                .lc-subtitle {
                    font-size: 15px;
                    color: #6B7280;
                    line-height: 1.5;
                    margin-bottom: 32px;
                }
                .lc-field { margin-bottom: 20px; }
                .lc-label {
                    display: block;
                    font-size: 12px;
                    font-weight: 600;
                    color: #4B5563;
                    letter-spacing: 0.05em;
                    margin-bottom: 6px;
                }
                .lc-input-wrap {
                    display: flex;
                    align-items: center;
                    border: 1px solid #E5E7EB;
                    border-radius: 10px;
                    padding: 12px 14px;
                    background: #fff;
                    transition: border-color 0.2s;
                }
                .lc-input-wrap:focus-within { border-color: #0D9488; }
                .lc-input-icon { margin-right: 10px; font-size: 14px; color: #9CA3AF; }
                .lc-input {
                    border: none;
                    outline: none;
                    font-size: 15px;
                    color: #1F2937;
                    background: transparent;
                    width: 100%;
                }
                .lc-eye-btn {
                    border: none;
                    background: none;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 0;
                    margin-left: 8px;
                    color: #9CA3AF;
                }
                .lc-forgot {
                    display: inline-block;
                    margin-top: 6px;
                    font-size: 13px;
                    color: #0D9488;
                    text-decoration: none;
                    font-weight: 500;
                }
                .lc-forgot:hover { text-decoration: underline; }
                .lc-checkbox-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 24px;
                    cursor: pointer;
                }
                .lc-checkbox {
                    width: 18px;
                    height: 18px;
                    accent-color: #0D9488;
                    cursor: pointer;
                }
                .lc-checkbox-label { font-size: 14px; color: #374151; }
                .lc-error {
                    background: #FEF2F2;
                    color: #DC2626;
                    padding: 10px 14px;
                    border-radius: 8px;
                    font-size: 14px;
                    margin-bottom: 16px;
                }
                .lc-submit {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #0D9488, #14B8A6);
                    color: #fff;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }
                .lc-submit:hover { opacity: 0.9; }
                .lc-submit:disabled { opacity: 0.7; cursor: not-allowed; }
                .lc-footer {
                    display: flex;
                    gap: 10px;
                    margin-top: 32px;
                    padding: 16px;
                    background: #F9FAFB;
                    border-radius: 10px;
                    border: 1px solid #E5E7EB;
                }
                .lc-footer-icon { color: #0D9488; font-size: 16px; font-weight: 700; flex-shrink: 0; }
                .lc-footer-text { font-size: 13px; color: #6B7280; line-height: 1.5; }

                /* RIGHT PANEL */
                .lc-right {
                    flex: 0 0 50%;
                    background: linear-gradient(160deg, #0F766E 0%, #0D9488 40%, #14B8A6 100%);
                    border-radius: 24px 0 0 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                    overflow: hidden;
                }
                .lc-right-inner { width: 100%; max-width: 440px; }
                .lc-right-badge {
                    display: inline-block;
                    background: rgba(255,255,255,0.15);
                    color: #fff;
                    font-size: 13px;
                    font-weight: 500;
                    padding: 6px 14px;
                    border-radius: 20px;
                    margin-bottom: 24px;
                }
                .lc-right-heading {
                    font-size: 34px;
                    font-weight: 700;
                    color: #fff;
                    line-height: 1.2;
                    margin-bottom: 16px;
                }
                .lc-right-sub {
                    font-size: 15px;
                    color: rgba(255,255,255,0.8);
                    line-height: 1.6;
                    margin-bottom: 32px;
                }
                .lc-card1 {
                    background: #fff;
                    border-radius: 16px;
                    padding: 20px;
                    margin-bottom: 16px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                }
                .lc-card1-head {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }
                .lc-card1-tag { font-size: 11px; font-weight: 600; color: #0D9488; letter-spacing: 0.05em; }
                .lc-card1-id { font-size: 12px; color: #9CA3AF; font-family: monospace; }
                .lc-card1-word { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 6px; }
                .lc-card1-trans { font-size: 14px; color: #6B7280; font-style: italic; }
                .lc-card2 {
                    background: #fff;
                    border-radius: 16px;
                    padding: 20px;
                    margin-bottom: 24px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                    text-align: center;
                }
                .lc-card2-head {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }
                .lc-card2-tag { font-size: 11px; font-weight: 600; color: #0D9488; letter-spacing: 0.05em; }
                .lc-card2-count { font-size: 13px; color: #9CA3AF; }
                .lc-card2-sun { font-size: 32px; margin-bottom: 8px; }
                .lc-card2-word { font-size: 28px; font-weight: 700; color: #111827; margin-bottom: 4px; }
                .lc-card2-pron { font-size: 14px; color: #9CA3AF; margin-bottom: 16px; }
                .lc-card2-foot {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid #F3F4F6;
                    padding-top: 12px;
                }
                .lc-card2-ret { font-size: 14px; font-weight: 600; color: #0D9488; }
                .lc-card2-hint { font-size: 13px; color: #9CA3AF; }
                .lc-testimonial {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 12px;
                    padding: 14px 18px;
                }
                .lc-test-avatar {
                    width: 40px; height: 40px; border-radius: 50%;
                    background: rgba(255,255,255,0.2);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 20px; flex-shrink: 0;
                }
                .lc-test-name { color: #fff; font-weight: 600; font-size: 14px; }
                .lc-test-streak { color: rgba(255,255,255,0.8); font-size: 13px; }
                .lc-test-quote { color: rgba(255,255,255,0.7); font-size: 13px; font-style: italic; margin-top: 2px; }

                @media (max-width: 768px) {
                    .lc-container { flex-direction: column; }
                    .lc-left { flex: 1; padding: 24px; }
                    .lc-right { flex: 1; border-radius: 0; padding: 24px; }
                }
            `}</style>

            <div className="lc-container">
                {/* LEFT PANEL */}
                <div className="lc-left">
                    <div className="lc-left-inner">
                        <div className="lc-logo-row">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <rect width="32" height="32" rx="8" fill="#0D9488" />
                                <path d="M8 12h16M8 16h12M8 20h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span className="lc-logo-text">FlashCard</span>
                            <span className="lc-badge">Método SRS</span>
                        </div>

                        <h1 className="lc-heading">¡Hola de nuevo! 👋</h1>
                        <p className="lc-subtitle">
                            Inicia sesión para continuar tu racha de estudio de inglés y repasar tus flashcards de hoy.
                        </p>

                        <form onSubmit={handleLogin}>
                            <div className="lc-field">
                                <label className="lc-label">CORREO ELECTRÓNICO</label>
                                <div className="lc-input-wrap">
                                    <span className="lc-input-icon">✉</span>
                                    <input
                                        className="lc-input"
                                        type="email"
                                        placeholder="correo@estudiante.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="lc-field">
                                <label className="lc-label">CONTRASEÑA</label>
                                <div className="lc-input-wrap">
                                    <span className="lc-input-icon">🔒</span>
                                    <input
                                        className="lc-input"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{ flex: 1 }}
                                    />
                                    <button
                                        type="button"
                                        className="lc-eye-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? '🙈' : '👁'}
                                    </button>
                                </div>
                                {/* <a href="#" className="lc-forgot">¿Olvidaste tu contraseña?</a> */}
                            </div>

                            <label className="lc-checkbox-row">
                                <input
                                    type="checkbox"
                                    className="lc-checkbox"
                                    checked={keepSession}
                                    onChange={(e) => setKeepSession(e.target.checked)}
                                />
                                <span className="lc-checkbox-label">Mantener sesión iniciada</span>
                            </label>

                            {error && <div className="lc-error">{error}</div>}

                            <button type="submit" className="lc-submit" disabled={loading}>
                                {loading ? 'Ingresando...' : 'Ingresar a mis cursos →'}
                            </button>
                        </form>

                        <div className="lc-footer">
                            <span className="lc-footer-icon">ℹ</span>
                            <span className="lc-footer-text">
                                <strong>Acceso exclusivo institucional:</strong> Las cuentas son provistas y gestionadas
                                directamente por tu institución. Si eres estudiante o docente y aún no cuentas con
                                credenciales activas, por favor solicítalas con tu administrador escolar.
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="lc-right">
                    <div className="lc-right-inner">
                        <span className="lc-right-badge">Algoritmo de Repetición Espaciada</span>

                        <h2 className="lc-right-heading">
                            Aprende vocabulario que se queda en tu memoria.
                        </h2>
                        <p className="lc-right-sub">
                            Repasa flashcards optimizadas científicamente para recordar palabras en inglés en menos de 10 minutos al día.
                        </p>

                        <div className="lc-card1">
                            <div className="lc-card1-head">
                                <span className="lc-card1-tag">ESPAÑOL (REVERSO)</span>
                                <span className="lc-card1-id">#RD-042</span>
                            </div>
                            <div className="lc-card1-word">despertarse</div>
                            <div className="lc-card1-trans">"wake up at 7:00 every morning."</div>
                        </div>

                        <div className="lc-card2">
                            <div className="lc-card2-head">
                                <span className="lc-card2-tag">● INGLÉS • ANVERSO</span>
                                <span className="lc-card2-count">12 / 30</span>
                            </div>
                            <div className="lc-card2-sun">☀️</div>
                            <div className="lc-card2-word">wake up</div>
                            <div className="lc-card2-pron">/weik ʌp/</div>
                            <div className="lc-card2-foot">
                                <span className="lc-card2-ret">✓ 85% retención</span>
                                <span className="lc-card2-hint">Presiona espacio</span>
                            </div>
                        </div>

                        {/* <div className="lc-testimonial">
                            <div className="lc-test-avatar">👩</div>
                            <div>
                                <span className="lc-test-name">Sofia Martínez</span>
                                <span className="lc-test-streak"> · 🔥 7 días</span>
                                <div className="lc-test-quote">
                                    "Duplicué mi vocabulario con 15 minutos diarios."
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginScreen;
