import AlertMessage from '../components/AlertMessage';
import OperationStatusPanel from '../components/OperationStatusPanel';
import SectionHeading from '../components/SectionHeading';
import { useOperationTracking } from '../hooks/useOperationTracking';
import { finalOperationStatuses } from '../utils/operationStatus';

export default function OperationPage({
  operationId,
  beneficiaryId,
  onBack,
}: {
  operationId: string;
  beneficiaryId: string;
  onBack: () => void;
}) {
  const {
    operation,
    errorMessage,
    isRefreshing,
    refreshOperation,
  } = useOperationTracking(operationId);
  const isFinalStatus = operation
    ? finalOperationStatuses.includes(operation.status)
    : false;

  return (
    <section
      className="flow-section operation-result"
      aria-labelledby="operation-title"
    >
      <SectionHeading
        eyebrow="ACOMPANHAMENTO"
        title="Sua solicitação está registrada"
        description={
          <>
            Beneficiário{' '}
            <strong className="inline-id">{beneficiaryId}</strong>
            <span className="heading-separator">·</span>
            Consulte o resultado da Central por aqui.
          </>
        }
        id="operation-title"
        icon={
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M5 12a7 7 0 1 0 2-4.9" />
            <path d="M5 5v4h4M12 8v4l2.5 1.5" />
          </svg>
        }
      />

      {!operation ? (
        <div className="empty-state operation-loading" aria-live="polite">
          <span className="spinner spinner-large" aria-hidden="true" />
          <strong>Consultando a Central</strong>
          <span>
            Estamos buscando a atualização mais recente da sua operação.
          </span>
          {errorMessage && <AlertMessage>{errorMessage}</AlertMessage>}
        </div>
      ) : (
        <>
          <OperationStatusPanel operation={operation} />
          {errorMessage && <AlertMessage>{errorMessage}</AlertMessage>}
        </>
      )}

      <div className="operation-footer">
        <span className="refresh-caption" aria-live="polite">
          {operation?.status === 'PENDENTE'
            ? 'Atualização automática a cada poucos segundos'
            : isFinalStatus
              ? 'Acompanhamento automático concluído'
              : 'A consulta será repetida automaticamente'}
        </span>
        <div className="form-actions">
          <button className="button button-quiet" onClick={onBack} type="button">
            ← Voltar à agenda
          </button>
          <button
            className="button button-secondary"
            disabled={isRefreshing}
            onClick={() => void refreshOperation()}
            type="button"
          >
            {isRefreshing ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Atualizando
              </>
            ) : (
              <>
                <span aria-hidden="true">↻</span>
                Atualizar agora
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
