import React from 'react';

export default function Layout({
  phase1Modules,
  phase2Modules,
  currentModule,
  completedModules,
  phase2Unlocked,
  justUnlocked,
  onSelectModule,
  children,
}) {
  const allModules = [...phase1Modules, ...phase2Modules];
  const progress = (completedModules.size / allModules.length) * 100;

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentModule]);

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">⚡</div>
            <h1>Compiler Tutor</h1>
          </div>
          <div className="sidebar-subtitle">INE5622 — Compiladores</div>
        </div>

        <nav className="module-nav">
          {/* ── Phase 1 ── */}
          <div className="phase-divider">
            <span className="phase-divider-label">Fase 1 — Fundamentos</span>
          </div>
          {phase1Modules.map((mod) => {
            const isActive = mod.id === currentModule;
            const isCompleted = completedModules.has(mod.id);

            return (
              <div
                key={mod.id}
                className={`module-nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => onSelectModule(mod.id)}
              >
                <div className="module-nav-number">
                  {isCompleted ? '✓' : mod.id}
                </div>
                <span className="module-nav-label">
                  {mod.icon} {mod.title}
                </span>
              </div>
            );
          })}

          {/* ── Phase 2 ── */}
          <div className={`phase-divider phase-2 ${phase2Unlocked ? 'unlocked' : ''} ${justUnlocked ? 'just-unlocked' : ''}`}>
            <span className="phase-divider-label">
              Fase 2 — Análise Sintática
            </span>
            <span className="phase-divider-lock">
              {phase2Unlocked ? '🔓' : '🔒'}
            </span>
          </div>
          {phase2Modules.map((mod) => {
            const isActive = mod.id === currentModule;
            const isCompleted = completedModules.has(mod.id);
            const isLocked = !phase2Unlocked;

            return (
              <div
                key={mod.id}
                className={`module-nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
                onClick={() => !isLocked && onSelectModule(mod.id)}
              >
                <div className="module-nav-number">
                  {isLocked ? '🔒' : isCompleted ? '✓' : mod.id}
                </div>
                <span className="module-nav-label">
                  {mod.icon} {mod.title}
                </span>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-progress">
          <div className="progress-label">
            <span>Progresso geral</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </aside>

      <main className="main-content">
        {justUnlocked && (
          <div className="phase-unlock-banner fade-in">
            <div className="unlock-banner-content">
              <span className="unlock-banner-icon">🎉</span>
              <div>
                <strong>Fase 2 Desbloqueada!</strong>
                <p>Parabéns! Você completou todos os fundamentos. Os módulos de Análise Sintática estão disponíveis.</p>
              </div>
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
