import type { Installment } from '../types/installment';
import { formatCurrency, formatDiscountDate } from '../utils/scheduleFormatters';

type InstallmentListProps = {
  installments: Installment[];
  selectedInstallmentIds: Set<string>;
  onToggleInstallment: (installmentId: string) => void;
};

export default function InstallmentList({
  installments,
  selectedInstallmentIds,
  onToggleInstallment,
}: InstallmentListProps) {
  return (
    <div className="installment-list">
      <div className="installment-header" aria-hidden="true">
        <span>Parcela</span>
        <span>Data do desconto</span>
        <span>Valor</span>
        <span>Status</span>
      </div>
      {installments.map((installment) => {
        const isOpen = installment.status === 'ABERTA';
        const isSelected = selectedInstallmentIds.has(installment.parcelaId);

        return (
          <label
            className={`installment-row${isSelected ? ' is-selected' : ''}${!isOpen ? ' is-disabled' : ''}`}
            key={installment.parcelaId}
          >
            <span className="installment-name">
              <input
                checked={isSelected}
                disabled={!isOpen}
                onChange={() => onToggleInstallment(installment.parcelaId)}
                type="checkbox"
              />
              <span className="custom-checkbox" aria-hidden="true">
                ✓
              </span>
              <span>
                <strong>{installment.parcelaId}</strong>
                <small>{installment.convenioId}</small>
              </span>
            </span>
            <span className="installment-date">
              {formatDiscountDate(installment.dataDesconto)}
            </span>
            <strong className="installment-value">
              {formatCurrency(installment.valor)}
            </strong>
            <span className={`badge ${isOpen ? 'badge-open' : 'badge-muted'}`}>
              <span />
              {installment.status}
            </span>
          </label>
        );
      })}
    </div>
  );
}
