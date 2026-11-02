import { useState, type FormEvent } from 'react';
import { registerAuthorization } from '../services/authorizationService';
import { getApiErrorMessage } from '../utils/apiError';

const initialBeneficiaryId = 'BEN001';

export function useAuthorization(onAuthorized: (id: string) => void) {
  const [beneficiaryId, setBeneficiaryId] = useState(initialBeneficiaryId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function submitAuthorization(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedId = beneficiaryId.trim().toUpperCase();

    if (!normalizedId) {
      setErrorMessage('Informe o identificador do beneficiário para continuar.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await registerAuthorization(normalizedId);
      onAuthorized(normalizedId);
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'Não foi possível registrar a autorização. Verifique a conexão e tente novamente.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    beneficiaryId,
    setBeneficiaryId,
    errorMessage,
    isSubmitting,
    submitAuthorization,
  };
}
