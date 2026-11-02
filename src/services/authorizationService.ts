import { httpClient } from './httpClient';

export async function registerAuthorization(
  beneficiaryId: string,
): Promise<void> {
  await httpClient.post('/autorizacoes', { beneficiarioId: beneficiaryId });
}
