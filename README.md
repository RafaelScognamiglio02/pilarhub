# PilarHub

Site web multiusuário para controle financeiro pessoal.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Prisma
- Postgres
- Recharts

## Rodar em desenvolvimento

Crie um arquivo `.env` com:

```txt
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
```

Depois rode:

```bash
npm install
npm run db:push
npm run dev
```

Acesse:

```txt
http://localhost:3000
```

Crie sua conta em `/login`.

## Deploy

Veja [DEPLOY_WEB.md](./DEPLOY_WEB.md).

## Segurança dos dados

Cada usuário tem dados isolados por conta:

- lançamentos
- cartões
- investimentos
- projetos
- metas
- configurações

O site usa sessões HTTP-only gravadas no banco.
