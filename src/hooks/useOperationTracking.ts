import { useCallback, useEffect, useRef, useState } from 'react';
import { getOperation } from '../services/operationService';
import type { Operation } from '../types/operation';
import { getApiErrorMessage } from '../utils/apiError';
import {
  finalOperationStatuses,
  isOperationStatus,
} from '../utils/operationStatus';

export function useOperationTracking(operationId: string) {
  const [operation, setOperation] = useState<Operation | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const activeRequest = useRef(false);
  const retryAfterError = useRef(false);

  const refreshOperation = useCallback(async (): Promise<boolean> => {
    if (activeRequest.current) return true;
    activeRequest.current = true;
    setIsRefreshing(true);

    try {
      const latestOperation = await getOperation(operationId);
      if (!latestOperation || !isOperationStatus(latestOperation.status)) {
        throw new Error('A API retornou um status de operação desconhecido.');
      }

      setOperation(latestOperation);
      setErrorMessage('');
      retryAfterError.current = false;
      return !finalOperationStatuses.includes(latestOperation.status);
    } catch (error: unknown) {
      retryAfterError.current = true;
      setErrorMessage(
        getApiErrorMessage(
          error,
          error instanceof Error
            ? error.message
            : 'Não foi possível consultar a operação. Vamos tentar novamente.',
        ),
      );
      return true;
    } finally {
      activeRequest.current = false;
      setIsRefreshing(false);
    }
  }, [operationId]);

  useEffect(() => {
    let isMounted = true;
    let timer: number;

    async function refreshUntilFinalStatus() {
      const shouldContinue = await refreshOperation();
      if (isMounted && shouldContinue) {
        timer = window.setTimeout(
          () => void refreshUntilFinalStatus(),
          retryAfterError.current ? 5000 : 2500,
        );
      }
    }

    timer = window.setTimeout(() => void refreshUntilFinalStatus(), 0);
    return () => {
      isMounted = false;
      window.clearTimeout(timer);
    };
  }, [refreshOperation]);

  return { operation, errorMessage, isRefreshing, refreshOperation };
}
