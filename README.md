# Flagdle

Primeira versao de um jogo diario de bandeiras inspirado em `pokedle.net`.

Stack atual:

- React 19
- Vite 7
- Tailwind CSS 4
- `pnpm`
- deploy pronto para Vercel

## Rodando localmente

```bash
pnpm dev
```

O app sobe em `http://localhost:5173` por padrao e o modo principal fica em `/daily`.

## Build de producao

```bash
pnpm build
pnpm preview
```

## O que ja existe

- rota `/daily` com desafio diario deterministico por data
- busca de paises com aliases como `EUA`, `UK` e `Holanda`
- feedback por continente, cores da bandeira, hemisferio, populacao e area territorial
- persistencia local do progresso diario no navegador
- layout migrado para React com Tailwind

## Deploy na Vercel

O projeto ja inclui [`vercel.json`](./vercel.json) com:

- `buildCommand` apontando para `pnpm build`
- `outputDirectory` em `dist`
- rewrite para SPA funcionar em rotas como `/daily`

Fluxo simples:

```bash
pnpm add -g vercel
vercel
```

## Proximos passos sugeridos

- aumentar o dataset com todos os paises
- adicionar bandeiras em SVG em vez de emoji
- criar mais modos alem do diario
- incluir estatisticas, streak e compartilhamento
