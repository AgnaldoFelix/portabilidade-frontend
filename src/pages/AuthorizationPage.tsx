import AlertMessage from '../components/AlertMessage';
import SectionHeading from '../components/SectionHeading';
import { useAuthorization } from '../hooks/useAuthorization';

const demoBeneficiaries = [
  { id: 'BEN001', outcome: 'confirma' },
  { id: 'BEN002', outcome: 'rejeita' },
  { id: 'BEN_ERRO', outcome: 'indisponível' },
];

export default function AuthorizationPage({
  onAuthorized,
}: {
  onAuthorized: (beneficiaryId: string) => void;
}) {
  const {
    beneficiaryId,
    setBeneficiaryId,
    errorMessage,
    isSubmitting,
    submitAuthorization,
  } = useAuthorization(onAuthorized);

  return (
    <section className="flow-section" aria-labelledby="authorization-title">
      <SectionHeading
        eyebrow="PRIMEIRO, SUA AUTORIZAÇÃO"
        title="Quem vai fazer a portabilidade?"
        description="Informe o identificador do beneficiário. Com sua autorização, consultaremos as parcelas disponíveis na Central."
        id="authorization-title"
        icon={
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 3 19 6v5c0 4.5-2.9 7.7-7 9.5C7.9 18.7 5 15.5 5 11V6l7-3Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        }
      />

      <form
        className="form-stack"
        onSubmit={(event) => void submitAuthorization(event)}
      >
        <label className="field-label" htmlFor="beneficiary-id">
          Identificador do beneficiário
        </label>
        <input
          autoComplete="off"
          className="text-input"
          id="beneficiary-id"
          maxLength={60}
          onChange={(event) => setBeneficiaryId(event.target.value)}
          placeholder="Ex.: BEN001"
          value={beneficiaryId}
        />
        <span className="field-hint">
          Para demonstração, escolha um dos beneficiários de teste:
        </span>
        <div className="demo-options" aria-label="Beneficiários de demonstração">
          {demoBeneficiaries.map(({ id, outcome }) => {
            const isSelected = beneficiaryId.toUpperCase() === id;
            return (
              <button
                aria-pressed={isSelected}
                className={`demo-chip${isSelected ? ' is-selected' : ''}`}
                key={id}
                onClick={() => setBeneficiaryId(id)}
                type="button"
              >
                {id}
                <span>{outcome}</span>
              </button>
            );
          })}
        </div>

        {errorMessage && <AlertMessage>{errorMessage}</AlertMessage>}

        <div className="form-actions">
          <span className="privacy-caption">
            <span className="lock-icon" aria-hidden="true">
              ◈
            </span>
            Você poderá revisar as parcelas antes de confirmar.
          </span>
          <button
            className="button button-primary"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Enviando autorização
              </>
            ) : (
              <>
                Autorizar e continuar
                <span aria-hidden="true">→</span>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="info-strip">
        <span className="info-strip-icon" aria-hidden="true">
          i
        </span>
        <p>
          A autorização permite apenas consultar sua agenda e enviar uma
          solicitação de portabilidade. Nenhuma parcela será movida sem sua
          confirmação.
        </p>
      </div>
    </section>
  );
}
