import type { OperationStatus } from '../types/operation';

export const operationStatusDetails: Record<
  OperationStatus,
  { title: string; description: string; style: string }
> = {
  PENDENTE: {
    title: 'Solicitação em análise',
    description:
      'A Central está processando sua solicitação. Esta página será atualizada automaticamente.',
    style: 'pending',
  },
  CONFIRMADA: {
    title: 'Portabilidade confirmada',
    description:
      'Tudo certo. A Central confirmou a portabilidade das parcelas selecionadas.',
    style: 'success',
  },
  REJEITADA: {
    title: 'Solicitação não aprovada',
    description:
      'A Central não conseguiu concluir esta portabilidade. Veja o motivo abaixo.',
    style: 'rejected',
  },
  ERRO: {
    title: 'Não foi possível concluir o envio',
    description:
      'Houve uma falha de comunicação com a Central. Sua operação foi registrada e este status não representa uma confirmação.',
    style: 'error',
  },
};

export const finalOperationStatuses: OperationStatus[] = [
  'CONFIRMADA',
  'REJEITADA',
  'ERRO',
];

export function isOperationStatus(value: string): value is OperationStatus {
  return Object.prototype.hasOwnProperty.call(operationStatusDetails, value);
}
