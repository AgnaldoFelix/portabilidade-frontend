import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createPortability,
  getBeneficiarySchedule,
} from '../services/scheduleService';
import type { Installment } from '../types/installment';
import { getApiErrorMessage } from '../utils/apiError';

export function useSchedule(
  beneficiaryId: string,
  onOperationCreated: (operationId: string) => void,
) {
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [selectedInstallmentIds, setSelectedInstallmentIds] = useState<
    Set<string>
  >(() => new Set());
  const [destinationAccount, setDestinationAccount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let isMounted = true;

    getBeneficiarySchedule(beneficiaryId)
      .then((schedule) => {
        if (!isMounted) return;
        setInstallments(schedule);
        setErrorMessage('');
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        setErrorMessage(
          getApiErrorMessage(
            error,
            'Não foi possível carregar sua agenda. Tente novamente.',
          ),
        );
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [beneficiaryId, loadAttempt]);

  const openInstallments = useMemo(
    () => installments.filter((installment) => installment.status === 'ABERTA'),
    [installments],
  );

  const selectedTotal = useMemo(
    () =>
      openInstallments
        .filter((installment) =>
          selectedInstallmentIds.has(installment.parcelaId),
        )
        .reduce((total, installment) => total + installment.valor, 0),
    [openInstallments, selectedInstallmentIds],
  );

  const allInstallmentsSelected =
    openInstallments.length > 0 &&
    openInstallments.every((installment) =>
      selectedInstallmentIds.has(installment.parcelaId),
    );

  const toggleInstallment = useCallback((installmentId: string) => {
    setSelectedInstallmentIds((currentSelection) => {
      const nextSelection = new Set(currentSelection);
      if (nextSelection.has(installmentId)) nextSelection.delete(installmentId);
      else nextSelection.add(installmentId);
      return nextSelection;
    });
  }, []);

  const toggleAllInstallments = useCallback(() => {
    setSelectedInstallmentIds(
      allInstallmentsSelected
        ? new Set()
        : new Set(openInstallments.map((installment) => installment.parcelaId)),
    );
  }, [allInstallmentsSelected, openInstallments]);

  function retryScheduleLoad() {
    setErrorMessage('');
    setIsLoading(true);
    setLoadAttempt((attempt) => attempt + 1);
  }

  async function submitPortability() {
    const account = destinationAccount.trim();
    const installmentIds = openInstallments
      .filter((installment) =>
        selectedInstallmentIds.has(installment.parcelaId),
      )
      .map((installment) => installment.parcelaId);

    if (installmentIds.length === 0) {
      setErrorMessage('Selecione ao menos uma parcela aberta para continuar.');
      return;
    }

    if (!account) {
      setErrorMessage('Informe a conta de destino para receber as parcelas.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const operationId = await createPortability({
        beneficiarioId: beneficiaryId,
        contaDestino: account,
        parcelas: installmentIds,
      });
      onOperationCreated(operationId);
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          error instanceof Error
            ? error.message
            : 'Não foi possível iniciar a portabilidade. Sua solicitação pode ser reenviada com segurança.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    installments,
    openInstallments,
    selectedInstallmentIds,
    selectedCount: selectedInstallmentIds.size,
    selectedTotal,
    destinationAccount,
    setDestinationAccount,
    errorMessage,
    isLoading,
    isSubmitting,
    allInstallmentsSelected,
    toggleInstallment,
    toggleAllInstallments,
    retryScheduleLoad,
    submitPortability,
  };
}
