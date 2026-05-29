import { pbkdf2Sync, randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 100_000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function currentMonthDate(day: number) {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), day, 12, 0, 0);
}

async function main() {
  const email = process.env.SEED_USER_EMAIL ?? "demo@financas.local";
  const password = process.env.SEED_USER_PASSWORD ?? "demo123";

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Demo",
      email,
      passwordHash: hashPassword(password),
      settings: {
        create: {
          brandName: "Finanças Demo",
          ownerName: "Demo",
          partnerName: "Parceiro",
          sharedName: "Ambos",
          thirdPartyName: "Terceiros",
          cardsCsv: "Nubank,Itaú,PicPay,Outro",
          projectsCsv: "Nenhum,Projeto A,Projeto B"
        }
      }
    }
  });

  const transactionCount = await prisma.transaction.count({
    where: { userId: user.id }
  });
  if (transactionCount === 0) {
    await prisma.transaction.createMany({
      data: [
        {
          userId: user.id,
          date: currentMonthDate(5),
          type: "entrada",
          category: "Salário",
          description: "Salário principal",
          amount: 3600,
          responsible: "Demo",
          paymentMethod: "conta",
          project: "Nenhum",
          status: "recebido"
        },
        {
          userId: user.id,
          date: currentMonthDate(8),
          type: "saida",
          category: "Cartão",
          description: "Fatura Nubank",
          amount: 480,
          responsible: "Demo",
          paymentMethod: "cartao",
          card: "Nubank",
          project: "Nenhum",
          status: "pendente"
        },
        {
          userId: user.id,
          date: currentMonthDate(10),
          type: "saida",
          category: "Mercado",
          description: "Compra compartilhada",
          amount: 320,
          responsible: "Ambos",
          paymentMethod: "debito",
          project: "Nenhum",
          status: "pago"
        },
        {
          userId: user.id,
          date: currentMonthDate(22),
          type: "a_receber",
          category: "Reembolso",
          description: "Reembolso pendente",
          amount: 225,
          responsible: "Terceiros",
          paymentMethod: "pix",
          project: "Nenhum",
          status: "pendente"
        }
      ]
    });
  }

  const investmentCount = await prisma.investment.count({
    where: { userId: user.id }
  });
  if (investmentCount === 0) {
    await prisma.investment.createMany({
      data: [
        {
          userId: user.id,
          asset: "Reserva",
          category: "Reserva",
          quantity: 1,
          averagePrice: 1200,
          investedAmount: 1200,
          currentPrice: 1200,
          currentValue: 1200
        },
        {
          userId: user.id,
          asset: "ETF Exemplo",
          category: "ETF",
          quantity: 10,
          averagePrice: 100,
          investedAmount: 1000,
          currentPrice: 108,
          currentValue: 1080
        }
      ]
    });
  }

  const project = await prisma.project.upsert({
    where: {
      userId_name: {
        userId: user.id,
        name: "Projeto A"
      }
    },
    update: {},
    create: {
      userId: user.id,
      name: "Projeto A",
      category: "Produto digital",
      investedAmount: 500,
      revenueAmount: 0,
      status: "Ativo"
    }
  });

  const projectResultCount = await prisma.projectMonthlyResult.count({
    where: { projectId: project.id }
  });
  if (projectResultCount === 0) {
    await prisma.projectMonthlyResult.create({
      data: {
        projectId: project.id,
        month: currentMonthDate(1),
        revenue: 800,
        cost: 200,
        profit: 600,
        projection: 1000
      }
    });
  }

  const goalCount = await prisma.goal.count({
    where: { userId: user.id }
  });
  if (goalCount === 0) {
    await prisma.goal.create({
      data: {
        userId: user.id,
        name: "Reserva de emergência",
        category: "Segurança",
        targetAmount: 10000,
        currentAmount: 1200,
        deadline: new Date(new Date().getFullYear(), 11, 31)
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
