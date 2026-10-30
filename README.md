# Meus Hábitos

App web para acompanhar hábitos diários: adicione hábitos (com emoji e cor), marque-os como concluídos a cada dia, veja a sequência de dias consecutivos 🔥 e acompanhe o progresso geral no Painel.

Os dados ficam salvos no navegador (localStorage); não há servidor.

## Como rodar

```bash
npm install
npm run dev     # abre em http://localhost:5173 (Ctrl + C para parar)
npm test        # testes da lógica de datas, sequências e armazenamento
npm run build   # versão de produção em dist/
```

## Estrutura

- `src/lib/` — lógica pura: datas, cálculo de sequências, armazenamento
- `src/hooks/useHabits.ts` — estado dos hábitos
- `src/components/` — telas (formulário, cartões, painel, seletor de emoji)

Feito com React, TypeScript e Vite.
