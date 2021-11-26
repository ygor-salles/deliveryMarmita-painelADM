# Delivery Marmita

## Instalar dependências:

```bash
yarn
```

## Rodar o projeto

- Necessário preencher as variáveis de ambiente criando um arquivo `.env`

- No arquivo `.env.example` há um exemplo de todas as variáveis de ambiente que devem ser preenchidas

- Roda o comando abaixo:

```bash
yarn start
```

- OBS: a pasta envoironments com os arquivos `environment.ts` e `environment.prod.ts` do Angular são criados em tempo de compilação através do script `src/assets/scripts/setEnv.ts`.

## Executar o build gerando a pasta dist

```bash
yarn build
```

## Comando do build para produção:

```bash
npm run build
```
