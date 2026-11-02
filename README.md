# Cielo Convênios — Frontend

Aplicação React + TypeScript para registrar a autorização do beneficiário,
consultar e selecionar parcelas e acompanhar uma solicitação de portabilidade.
O frontend consome a API Java; não chama o simulador da Central diretamente.

## Executar localmente

São necessários Java 17+, Node.js e npm. Mantenha os três processos abaixo
rodando em terminais separados.

### Terminal 1 — simulador da Central

Na pasta do backend, onde está `mock-central.js`:

```powershell
node mock-central.js
```

O simulador ficará disponível em `http://localhost:4000`.

### Terminal 2 — API Java

Na raiz do backend:

```powershell
.\mvnw.cmd spring-boot:run
```

A API ficará disponível em `http://localhost:8082`. O backend deve estar
configurado para comunicar-se com o simulador.

### Terminal 3 — frontend

Na pasta `frontend`:

```powershell
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite, normalmente `http://localhost:5173`. O
proxy de desenvolvimento encaminha `/api` para `http://localhost:8082`, sem
necessidade de configurar CORS no navegador.

Se a API estiver em outra porta, configure a URL antes de iniciar o Vite:

```powershell
$env:VITE_API_URL="http://localhost:8083/api"
npm run dev
```

### Cenários de demonstração

- `BEN001`: agenda com duas parcelas; portabilidade confirmada.
- `BEN002`: agenda com uma parcela; portabilidade rejeitada por margem.
- `BEN_ERRO`: falha simulada de comunicação ao enviar a operação.

## Decisões de implementação

- O fluxo é dividido em autorização, agenda e acompanhamento para deixar claro
  o que o beneficiário está autorizando e em que etapa está.
- Somente parcelas com status `ABERTA` podem ser selecionadas; o total é
  atualizado antes do envio.
- A criação da operação envia a chave `Idempotency-Key`. Ela é persistida na
  sessão do navegador e reutilizada para a mesma solicitação, evitando criar
  operações duplicadas em uma nova tentativa.
- O acompanhamento consulta a API automaticamente enquanto a operação está
  pendente e também oferece atualização manual. Erros, rejeições e confirmações
  são apresentados em estados distintos.
- As responsabilidades ficam separadas em `pages/`, `components/`, `hooks/`,
  `services/`, `utils/` e `types/`; assim, telas não concentram chamadas HTTP ou
  regras auxiliares.
- O frontend usa o proxy do Vite no desenvolvimento. Em outros ambientes, a URL
  da API pode ser definida por `VITE_API_URL`.

## Bibliotecas

### Aplicação

- **React / React DOM**: componentes e renderização da interface.
- **Axios**: chamadas HTTP à API e acesso estruturado às respostas de erro.
- **uuid**: geração de chaves únicas para idempotência.
- **TypeScript**: tipagem das telas, estados e contratos da API.

### Desenvolvimento e build

- **Vite** e **@vitejs/plugin-react**: servidor de desenvolvimento e build.
- **ESLint**, **typescript-eslint**, **eslint-plugin-react-hooks** e
  **eslint-plugin-react-refresh**: análise estática e verificação de padrões
  React/TypeScript.

## Uso de IA

Usei um assistente de IA como apoio para estruturar e implementar a interface,
organizar responsabilidades, revisar o tratamento de erros e idempotência e
ajustar a documentação. Validei as alterações com `npm run lint` e
`npm run build`.

## Escopo e próximos passos

O frontend não implementa autenticação, histórico de operações, testes
automatizados próprios nem configuração de implantação em produção. Esses itens
ficaram fora do escopo atual; como próximos passos, adicionaria testes para os
fluxos de sucesso e erro, configuração de ambiente para produção e acesso ao
histórico de operações, caso a API passe a oferecê-lo.

## Comandos úteis

```powershell
npm run lint
npm run build
npm run preview
```
