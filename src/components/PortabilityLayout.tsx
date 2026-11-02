import type { ReactNode } from 'react';
import type { PortabilityStep } from '../hooks/usePortabilityFlow';

const steps: { id: PortabilityStep; number: string; title: string }[] = [
  { id: 'authorization', number: '01', title: 'Autorização' },
  { id: 'schedule', number: '02', title: 'Parcelas' },
  { id: 'operation', number: '03', title: 'Acompanhamento' },
];

export default function PortabilityLayout({
  currentStep,
  children,
}: {
  currentStep: PortabilityStep;
  children: ReactNode;
}) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Cielo Convênios, início">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M16 3.5 28 10v12L16 28.5 4 22V10L16 3.5Z" />
              <path d="m10 16 4 4 8-9" />
            </svg>
          </span>
          <span className="brand-name">
            cielo<span>convênios</span>
          </span>
        </a>
        <div className="topbar-note">
          <span className="status-dot" />
          <span>Portabilidade segura e transparente</span>
        </div>
      </header>

      <main className="main-content">
        <section className="intro">
          <div className="intro-copy">
            <span className="eyebrow">PORTABILIDADE DE CONVÊNIOS</span>
            <h1>Seu próximo passo, com clareza.</h1>
            <p>
              Autorize, escolha as parcelas e acompanhe sua solicitação em um
              só lugar.
            </p>
          </div>
          <div className="intro-art" aria-hidden="true">
            <span className="art-orbit orbit-one" />
            <span className="art-orbit orbit-two" />
            <span className="art-card">
              <span className="art-card-icon">↗</span>
              <span className="art-card-line" />
              <span className="art-card-line short" />
              <span className="art-card-pill" />
            </span>
            <span className="art-sparkle">✳</span>
          </div>
        </section>

        <nav className="stepper" aria-label="Etapas da portabilidade">
          {steps.map((step, index) => {
            const isComplete = index < currentStepIndex;
            const isActive = index === currentStepIndex;

            return (
              <div
                className={`stepper-item${isActive ? ' is-active' : ''}${isComplete ? ' is-complete' : ''}`}
                key={step.id}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className="step-number">
                  {isComplete ? '✓' : step.number}
                </span>
                <span className="step-title">{step.title}</span>
                {index < steps.length - 1 && (
                  <span className="step-connector" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </nav>

        <div className="content-card">{children}</div>

        <div className="trust-note">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 2.5 16 5v4.3c0 3.9-2.5 6.7-6 8.2-3.5-1.5-6-4.3-6-8.2V5l6-2.5Z" />
            <path d="m7.5 9.8 1.7 1.7 3.5-3.7" />
          </svg>
          Seus dados são usados somente para processar esta solicitação.
        </div>
      </main>

      <footer className="footer">
        <span>© 2026 Cielo Convênios</span>
        <span>Uma jornada simples, do início ao acompanhamento.</span>
      </footer>
    </div>
  );
}
