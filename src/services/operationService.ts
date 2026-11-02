import { httpClient } from './httpClient';
import type { Operation } from '../types/operation';

export async function getOperation(operationId: string): Promise<Operation> {
  const { data } = await httpClient.get<Operation>(
    `/operacoes/${encodeURIComponent(operationId)}`,
  );
  return data;
}
