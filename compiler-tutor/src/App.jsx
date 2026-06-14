import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Module1 from './modules/Module1_Languages';
import Module2 from './modules/Module2_Regex';
import Module3 from './modules/Module3_Automata';
import Module4 from './modules/Module4_LexicalAnalysis';
import Module5 from './modules/Module5_CFG';
import Module6 from './modules/Module6_Transformations';
import Module7 from './modules/Module7_LL1';
import Module8 from './modules/Module8_SDD';

const PHASE_1_MODULES = [
  { id: 1, title: 'Linguagens Formais', icon: '📖', component: Module1, phase: 1 },
  { id: 2, title: 'Expressões Regulares', icon: '🔤', component: Module2, phase: 1 },
  { id: 3, title: 'Autômatos Finitos', icon: '⚙️', component: Module3, phase: 1 },
  { id: 4, title: 'Análise Léxica', icon: '🔍', component: Module4, phase: 1 },
];

const PHASE_2_MODULES = [
  { id: 5, title: 'Gramáticas (GLC)', icon: '🌳', component: Module5, phase: 2 },
  { id: 6, title: 'Transformações', icon: '🔄', component: Module6, phase: 2 },
  { id: 7, title: 'Análise LL(1)', icon: '📊', component: Module7, phase: 2 },
  { id: 8, title: 'SDDs', icon: '📝', component: Module8, phase: 2 },
];

const ALL_MODULES = [...PHASE_1_MODULES, ...PHASE_2_MODULES];
const PHASE_1_IDS = PHASE_1_MODULES.map(m => m.id);

const STORAGE_KEY = 'compiler-tutor-progress';

// Synchronous fallback for localStorage reads
function loadProgressFallback() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return new Set(parsed);
    }
  } catch {
    // Ignore corrupted storage
  }
  return new Set();
}

export default function App() {
  const [currentModule, setCurrentModule] = useState(1);
  const [completedModules, setCompletedModules] = useState(new Set());
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const phase2Unlocked = PHASE_1_IDS.every(id => completedModules.has(id));

  // Load progress on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/progress')
      .then(res => {
        if (!res.ok) throw new Error('API server unreachable');
        return res.json();
      })
      .then(data => {
        if (isMounted) {
          if (data.completedModules) {
            setCompletedModules(new Set(data.completedModules));
          }
          if (data.currentModule) {
            setCurrentModule(data.currentModule);
          }
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.warn('Falling back to local browser storage:', err);
        if (isMounted) {
          setCompletedModules(loadProgressFallback());
          try {
            const rawCur = localStorage.getItem('compiler-tutor-current-module');
            if (rawCur) {
              const cur = parseInt(rawCur, 10);
              if (cur >= 1 && cur <= ALL_MODULES.length) {
                setCurrentModule(cur);
              }
            }
          } catch {}
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Save progress when changed (only after initial load)
  useEffect(() => {
    if (isLoading) return;

    const completedArr = [...completedModules];

    // Persist to local JSON file db via API
    fetch('/api/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completedModules: completedArr,
        currentModule: currentModule,
      }),
    }).catch(err => {
      console.error('Failed to sync progress to database api:', err);
    });

    // Mirror to localStorage fallback
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedArr));
      localStorage.setItem('compiler-tutor-current-module', String(currentModule));
    } catch {}
  }, [completedModules, currentModule, isLoading]);

  const handleComplete = useCallback((moduleId) => {
    setCompletedModules(prev => {
      const next = new Set(prev);
      next.add(moduleId);

      // Check if Phase 2 just got unlocked
      const wasUnlocked = PHASE_1_IDS.every(id => prev.has(id));
      const nowUnlocked = PHASE_1_IDS.every(id => next.has(id));
      if (!wasUnlocked && nowUnlocked) {
        setJustUnlocked(true);
        setTimeout(() => setJustUnlocked(false), 4000);
      }

      return next;
    });
  }, []);

  const handleNext = () => {
    handleComplete(currentModule);
    if (currentModule < ALL_MODULES.length) {
      const nextId = currentModule + 1;
      const nextMod = ALL_MODULES.find(m => m.id === nextId);
      // Only advance to Phase 2 if unlocked
      if (nextMod && nextMod.phase === 2 && !phase2Unlocked) {
        return; // Stay; unlock banner will show
      }
      setCurrentModule(nextId);
    }
  };

  const handlePrev = () => {
    if (currentModule > 1) {
      setCurrentModule(currentModule - 1);
    }
  };

  const handleSelectModule = (moduleId) => {
    const mod = ALL_MODULES.find(m => m.id === moduleId);
    if (!mod) return;
    if (mod.phase === 2 && !phase2Unlocked) return;
    setCurrentModule(moduleId);
  };

  const ActiveModule = ALL_MODULES.find(m => m.id === currentModule)?.component;

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'system-ui, sans-serif',
        background: '#0B0F19',
        color: '#FFFFFF'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #1E293B',
          borderTop: '4px solid #3B82F6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }} />
        <p style={{ color: '#94A3B8' }}>Loading local study database...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Layout
      phase1Modules={PHASE_1_MODULES}
      phase2Modules={PHASE_2_MODULES}
      currentModule={currentModule}
      completedModules={completedModules}
      phase2Unlocked={phase2Unlocked}
      justUnlocked={justUnlocked}
      onSelectModule={handleSelectModule}
    >
      {ActiveModule ? (
        <ActiveModule
          onNext={handleNext}
          onPrev={handlePrev}
          moduleNumber={currentModule}
          totalModules={ALL_MODULES.length}
        />
      ) : (
        <div className="content-wrapper fade-in">
          <div className="module-header">
            <span className="module-header-badge">
              {ALL_MODULES[currentModule - 1]?.icon} Módulo {currentModule}
            </span>
            <h1>{ALL_MODULES[currentModule - 1]?.title}</h1>
            <p>Este módulo será disponibilizado em breve. Complete os módulos anteriores primeiro!</p>
          </div>
          <div className="module-footer">
            <button className="btn btn-secondary" onClick={handlePrev}>
              ← Anterior
            </button>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Módulo {currentModule} de {ALL_MODULES.length}
            </span>
          </div>
        </div>
      )}
    </Layout>
  );
}
