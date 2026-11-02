import { useState } from 'react';

export type PortabilityStep = 'authorization' | 'schedule' | 'operation';

export function usePortabilityFlow() {
  const [beneficiaryId, setBeneficiaryId] = useState('');
  const [operationId, setOperationId] = useState('');
  const [currentStep, setCurrentStep] =
    useState<PortabilityStep>('authorization');

  function completeAuthorization(id: string) {
    setBeneficiaryId(id);
    setCurrentStep('schedule');
  }

  function completePortabilityRequest(id: string) {
    setOperationId(id);
    setCurrentStep('operation');
  }

  return {
    beneficiaryId,
    operationId,
    currentStep,
    completeAuthorization,
    completePortabilityRequest,
    returnToAuthorization: () => setCurrentStep('authorization'),
    returnToSchedule: () => setCurrentStep('schedule'),
  };
}
