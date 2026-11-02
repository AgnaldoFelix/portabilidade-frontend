import AlertMessage from '../components/AlertMessage';
import InstallmentList from '../components/InstallmentList';
import PortabilityRequestForm from '../components/PortabilityRequestForm';
import SectionHeading from '../components/SectionHeading';
import { useSchedule } from '../hooks/useSchedule';

export default function SchedulePage({
  beneficiaryId,
  onBack,
  onOperationCreated,
}: {
  beneficiaryId: string;
  onBack: () => void;
  onOperationCreated: (operationId: string) => void;
}) {
  const schedule = useSchedule(beneficiaryId, onOperationCreated);

  return (
    <section className="flow-section" aria-labelledby="schedule-title">
      <SectionHeading
        eyebrow="SUA AGENDA DE DESCONTOS"
        title="Escolha as parcelas para portar"
        description={
          <>
            Beneficiário{' '}
            <strong className="inline-id">{beneficiaryId}</strong>
            <span className="heading-separator">·</span>
            Marque uma ou mais parcelas abertas.
          </>
        }
        id="schedule-title"
        icon={
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="4" y="5" width="16" height="15" rx="2" />
            <path d="M8 3v4M16 3v4M4 10h16M8 14h3M8 17h6" />
          </svg>
        }
      />

      <div className="agenda-toolbar">
        <div className="agenda-summary">
          <span className="summary-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 6.5h16M4 12h16M4 17.5h10" />
              <circle cx="18" cy="17.5" r="2.5" />
            </svg>
          </span>
          <span>
            <strong>{schedule.openInstallments.length}</strong>
            <span>
              {' '}
              parcela{schedule.openInstallments.length === 1 ? '' : 's'} aberta
              {schedule.openInstallments.length === 1 ? '' : 's'}
            </span>
          </span>
        </div>
        {schedule.openInstallments.length > 0 && (
          <button
            className="text-button"
            onClick={schedule.toggleAllInstallments}
            type="button"
          >
            {schedule.allInstallmentsSelected
              ? 'Limpar seleção'
              : 'Selecionar todas'}
          </button>
        )}
      </div>

      {schedule.errorMessage && (
        <AlertMessage>{schedule.errorMessage}</AlertMessage>
      )}

      {schedule.isLoading ? (
        <div className="installment-list">
          <div className="empty-state" aria-live="polite">
            <span className="spinner spinner-large" aria-hidden="true" />
            <strong>Buscando sua agenda</strong>
            <span>Estamos consultando as parcelas na Central.</span>
          </div>
        </div>
      ) : schedule.installments.length === 0 ? (
        <div className="installment-list">
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">
              —
            </span>
            <strong>Nenhuma parcela encontrada</strong>
            <span>
              Confira o identificador ou tente consultar a agenda novamente.
            </span>
          </div>
          <button
            className="text-button retry-button"
            onClick={schedule.retryScheduleLoad}
            type="button"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <InstallmentList
          installments={schedule.installments}
          selectedInstallmentIds={schedule.selectedInstallmentIds}
          onToggleInstallment={schedule.toggleInstallment}
        />
      )}

      {!schedule.isLoading && schedule.openInstallments.length > 0 && (
        <PortabilityRequestForm
          selectedCount={schedule.selectedCount}
          selectedTotal={schedule.selectedTotal}
          destinationAccount={schedule.destinationAccount}
          isSubmitting={schedule.isSubmitting}
          onDestinationAccountChange={schedule.setDestinationAccount}
          onBack={onBack}
          onSubmit={() => void schedule.submitPortability()}
        />
      )}
    </section>
  );
}
