# Deploy Web

Este projeto agora está preparado para rodar como site web multiusuário.

## Arquitetura recomendada

- Vercel para hospedar o Next.js.
- Neon, Supabase ou outro Postgres gerenciado para o banco.
- Prisma com `DATABASE_URL`.
- Login próprio com e-mail e senha.
- Sessões em cookie HTTP-only gravadas no banco.

## Variáveis de ambiente

Configure no provedor de hospedagem:

```txt
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
DIRECT_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
```

No Supabase:

- `DATABASE_URL`: use a string do pooler/session para a aplicação.
- `DIRECT_URL`: use a string direta do banco ou session pooler para o Prisma CLI.

## Deploy

1. Crie um banco Postgres.
2. Configure `DATABASE_URL` e `DIRECT_URL`.
3. Rode localmente ou no painel do provedor:

```bash
npm install
npm run db:deploy
npm run build
```

4. Publique o projeto na Vercel.

## Primeiro acesso

Abra o site publicado e crie uma conta em `/login`.

Cada usuário terá:

- lançamentos próprios
- cartões próprios
- investimentos próprios
- projetos próprios
- metas próprias
- configurações próprias

## Conta demo opcional

Se quiser criar uma conta demo, configure:

```txt
SEED_USER_EMAIL=demo@seudominio.com
SEED_USER_PASSWORD=uma-senha-segura
```

Depois rode:

```bash
npm run db:seed
```

## Importante

Não use SQLite em produção web. O banco precisa ser Postgres persistente.
