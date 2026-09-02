# Fluxo oficial de release do WP Definitivo

## Fonte única

Edite o tema somente neste repositório:

`C:\Users\leand\Documents\Codex\2026-08-25\e\work\wp-definitivo-project`

O caminho `C:\Users\leand\Documents\WP Definitivo\theme-source` é apenas uma junção para este mesmo repositório; não é uma cópia.

## Pacote de submissão

Mantenha somente o ZIP vigente em:

`C:\Users\leand\Documents\WP Definitivo\submission`

Os pacotes e as árvores de auditorias anteriores ficam em `C:\Users\leand\Documents\WP Definitivo\artifacts\archive` e não devem ser editados nem submetidos.

## Staging oficial do tema

Use exclusivamente este ambiente para instalar e validar o pacote distribuível:

`C:\Users\leand\Local Sites\staging-tema-defaul`

O ambiente `staging-2` é reservado para testes de integrações. Ele não é fonte do tema e não deve receber sincronizações de release.

## Sequência

1. Edite a fonte única.
2. Execute `npm run release:check`.
3. Gere o ZIP em `Documents\WP Definitivo\submission`.
4. Sincronize e valide somente no `staging-tema-defaul`.
5. Faça commit e push da mesma fonte aprovada.
