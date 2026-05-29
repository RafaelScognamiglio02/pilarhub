# Checklist de Lançamento Web

## Antes de publicar

- Criar banco Postgres em Neon, Supabase ou provedor equivalente.
- Configurar `DATABASE_URL` na hospedagem.
- Rodar `npm run db:deploy`.
- Rodar `npm run build`.
- Criar uma conta teste em `/login`.
- Confirmar que uma segunda conta não vê os dados da primeira.
- Conferir Dashboard, Lançamentos, Cartões, Investimentos, Projetos, Metas e Configurações.

## Deploy sugerido

- Vercel para o Next.js.
- Postgres gerenciado para persistência.
- Domínio próprio após validar o primeiro deploy.

## O que não enviar

- `.env`
- `node_modules`
- `.next`
- bancos locais antigos

## Próximo passo comercial

Criar uma landing page pública separada da área logada.
