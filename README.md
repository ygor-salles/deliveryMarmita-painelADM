# Delivery Marmita

<h1 align="center">
    <img alt="vivinio" title="" src="./src/assets/img/logo-brasa.jpg" width="250px" />
</h1>

<h4 align="center">
    :computer: Aplicação administrativa para delivery de marmitas
</h4>

<p align="center">
    <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#rocket-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#user-content-clipboard-instruções">Instruções</a></p>

<img alt="Interface" src="./src/assets/img/Imagem2.png" width="100%" align="center">
<br/>

## 💻 Projeto

Frontend App em Angular. Aplicação administrativa para cadastramento de marmitas e bebidas, inclusão de fretes e adições as masmitas, visualização e filtragem de pedidos e histórico de pedidos, painel dashboard das vendas no ultimo dia, semana e mês.

<br>

## :rocket: Tecnologias

- [Angular](https://angular.io/) 
- [Material](https://material.angular.io/)
- [Typescript](https://www.typescriptlang.org/)
- [HTML5](https://developer.mozilla.org/pt-BR/docs/Web/Guide/HTML/HTML5)
- [CSS3](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
- [SCSS/SASS](https://sass-lang.com/)

----
## :clipboard: Instruções

## INTERFACE - FRONTEND

- Execute `$ yarn` para instalar todas as dependencias.
- Necessário preencher as variáveis de ambiente criando um arquivo `.env`
- No arquivo `.env.example` há um exemplo de todas as variáveis de ambiente que devem ser preenchidas
- Após todas as dependencias serem instaladas, Pronto! Basta executar  `yarn start` para iniciar a interface frontend.
- OBS: a pasta envoironments com os arquivos `environment.ts` e `environment.prod.ts` do Angular são criados em tempo de compilação através do script `src/assets/scripts/setEnv.ts`.

## Executar o build gerando a pasta dist

```bash
yarn build
```

## Comando do build para produção:

```bash
npm run build
```
