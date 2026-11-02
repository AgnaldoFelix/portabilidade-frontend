import type { FormEvent } from 'react';
import { formatCurrency } from '../utils/scheduleFormatters';

type PortabilityRequestFormProps = {
  selectedCount: number;
  selectedTotal: number;
  destinationAccount: string;
  isSubmitting: boolean;
  onDestinationAccountChange: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
};

export default function PortabilityRequestForm({
  selectedCount,
  selectedTotal,
  destinationAccount,
  isSubmitting,
  onDestinationAccountChange,
  onBack,
  onSubmit,
}: PortabilityRequestFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="operation-form" onSubmit={handleSubmit}>
      <div className="operation-form-heading">
        <div>
          <span className="section-kicker">QUASE LÁ</span>
          <h3>Onde você quer receber?</h3>
        </div>
        <div className="selection-total">
          <span>
            {selectedCount} selecionada{selectedCount === 1 ? '' : 's'}
          </span>
          <strong>{formatCurrency(selectedTotal)}</strong>
        </div>
      </div>
      <label className="field-label" htmlFor="destination-account">
        Conta de destino
      </label>
      <input
        autoComplete="off"
        className="text-input"
        id="destination-account"
        maxLength={80}
        onChange={(event) => onDestinationAccountChange(event.target.value)}
        placeholder="Ex.: conta-123"
        value={destinationAccount}
      />
      <div className="form-actions">
        <button className="button button-quiet" onClick={onBack} type="button">
          ← Voltar
        </button>
        <button
          className="button button-primary"
          disabled={
            isSubmitting || selectedCount === 0 || !destinationAccount.trim()
          }
          type="submit"
        >
          {isSubmitting ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Enviando solicitação
            </>
          ) : (
            <>
              Solicitar portabilidade
              <span aria-hidden="true">→</span>
            </>
          )}
        </button>
      </div>
      <p className="idempotency-note">
        <span aria-hidden="true">⛨</span>
        Sua solicitação é protegida contra envios duplicados.
      </p>
    </form>
  );
}
