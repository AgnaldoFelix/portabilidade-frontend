export type OperationStatus =
  | 'PENDENTE'
  | 'CONFIRMADA'
  | 'REJEITADA'
  | 'ERRO';

export interface Operation {
  id: string;
  beneficiarioId: string;
  status: OperationStatus;
  protocoloCentral?: string;
  motivoRejeicao?: string;
}
