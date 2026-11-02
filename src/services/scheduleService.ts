import { v4 as uuid } from 'uuid';
import { httpClient } from './httpClient';
import type { Installment } from '../types/installment';

type CreatePortabilityRequest = {
  beneficiarioId: string;
  contaDestino: string;
  parcelas: string[];
};

type CreatePortabilityResponse = {
  id?: string;
};

type StoredIdempotencyKey = {
  fingerprint: string;
  key: string;
};

export async function getBeneficiarySchedule(
  beneficiaryId: string,
): Promise<Installment[]> {
  const { data } = await httpClient.get<Installment[]>(
    `/beneficiarios/${encodeURIComponent(beneficiaryId)}/agenda`,
  );
  return data;
}

async function createRequestFingerprint(
  request: CreatePortabilityRequest,
): Promise<string> {
  const encodedRequest = new TextEncoder().encode(JSON.stringify(request));
  const digest = await window.crypto.subtle.digest('SHA-256', encodedRequest);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

function getIdempotencyKey(
  beneficiaryId: string,
  fingerprint: string,
): string {
  const storageKey = `portabilidade:${beneficiaryId}`;
  const storedValue = window.sessionStorage.getItem(storageKey);

  if (storedValue) {
    try {
      const savedKey = JSON.parse(storedValue) as StoredIdempotencyKey;
      if (
        savedKey.fingerprint === fingerprint &&
        typeof savedKey.key === 'string'
      ) {
        return savedKey.key;
      }
    } catch {
      window.sessionStorage.removeItem(storageKey);
    }
  }

  const key = uuid();
  window.sessionStorage.setItem(
    storageKey,
    JSON.stringify({ fingerprint, key } satisfies StoredIdempotencyKey),
  );
  return key;
}

export async function createPortability(
  request: CreatePortabilityRequest,
): Promise<string> {
  const fingerprint = await createRequestFingerprint(request);
  const idempotencyKey = getIdempotencyKey(
    request.beneficiarioId,
    fingerprint,
  );
  const { data } = await httpClient.post<CreatePortabilityResponse>(
    '/operacoes',
    request,
    { headers: { 'Idempotency-Key': idempotencyKey } },
  );

  if (typeof data.id !== 'string' || !data.id) {
    throw new Error(
      'A API recebeu a solicitação, mas não retornou o identificador da operação.',
    );
  }

  window.sessionStorage.removeItem(`portabilidade:${request.beneficiarioId}`);
  return data.id;
}
