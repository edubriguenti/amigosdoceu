# Histórico de alterações

Registro cumulativo, mais recente primeiro. Planejamento em `docs/proximas-etapas.md`.

## 2026-10-13: calendário litúrgico mais completo e validado

- **Problema:** só 21/365 dias tinham santo do dia; 3 santos cadastrados (São Sebastião, Dom Bosco, Santa Rita) nunca apareciam no "Hoje". Além disso, março tinha a chave `"25"` repetida: Santa Catarina de Sena (duplicada, a memória real é 29/04) escondia a Anunciação do Senhor.
- **Solução:** novas celebrações ligadas a santos existentes (20/01, 31/01, 22/02, 22/05, 11/07); removida a duplicata; `validate:album` agora dá erro para slug inexistente e dia repetido, e avisa sobre santo sem festa.
- **Arquivos:** `data/calendario-liturgico.json`, `scripts/validate-album.mjs`, `docs/proximas-etapas.md`.
- **Testes:** `validate:album`, `validate:relacoes`, `validate:imagens`, `lint` (0 erros, 19 avisos preexistentes) e `build` passaram. Não houve teste visual no navegador.
- **Pendências:** cobertura 25/365 (7%); falta conteúdo (mais santos e celebrações), Etapa 2.2. Datas 21/03 (São Bento) e 25/03 já existentes não foram revisadas.
