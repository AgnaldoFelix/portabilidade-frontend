import type { Operation } from '../types/operation';
import { operationStatusDetails } from '../utils/operationStatus';

export default function OperationStatusPanel({
  operation,
}: {
  operation: Operation;
}) {
  const details = operationStatusDetails[operation.status];

  return (
    <>
      <div className={`result-panel result-${details.style}`}>
        <div className="result-symbol" aria-hidden="true">
          {operation.status === 'PENDENTE' && (
            <span className="spinner spinner-large" />
          )}
          {operation.status === 'CONFIRMADA' && '✓'}
          {operation.status === 'REJEITADA' && '×'}
          {operation.status === 'ERRO' && '!'}
        </div>
        <div className="result-copy">
          <div className={`status-label status-${details.style}`}>
            <span />
            {operation.status}
          </div>
          <h3>{details.title}</h3>
          <p>{details.description}</p>
        </div>
      </div>

      {(operation.protocoloCentral || operation.id) && (
        <div className="operation-meta">
          {operation.protocoloCentral && (
            <div>
              <span>Protocolo da Central</span>
              <strong>{operation.protocoloCentral}</strong>
            </div>
          )}
          <div>
            <span>Identificador da operação</span>
            <strong>{operation.id}</strong>
          </div>
        </div>
      )}

      {operation.motivoRejeicao && (
        <div className="alert alert-warning" role="status">
          <span className="alert-icon" aria-hidden="true">
            i
          </span>
          <span>
            <strong>Motivo informado pela Central:</strong>{' '}
            {operation.motivoRejeicao}
          </span>
        </div>
      )}
    </>
  );
}
