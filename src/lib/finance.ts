import type { Goal, Investment, Transaction } from "@prisma/client";
import { defaultSettings, type FinanceSettings } from "@/lib/settings";

export function currentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
}

export function sumBy<T>(items: T[], getValue: (item: T) => number) {
  return items.reduce((total, item) => total + getValue(item), 0);
}

export function dashboardMetrics(
  transactions: Transaction[],
  investments: Investment[],
  goals: Goal[],
  settings: Pick<
    FinanceSettings,
    "ownerName" | "partnerName" | "sharedName" | "thirdPartyName"
  > = defaultSettings
) {
  const { start, end } = currentMonthRange();
  const monthTransactions = transactions.filter(
    (item) =>
      item.date >= start && item.date <= end && item.status !== "cancelado"
  );

  const monthlyIncome = sumBy(
    monthTransactions.filter((item) => item.type === "entrada"),
    (item) => item.amount
  );
  const monthlyExpenses = sumBy(
    monthTransactions.filter(
      (item) => item.type === "saida" && item.paymentMethod !== "cartao"
    ),
    (item) => item.amount
  );
  const grossMonthlyExpenses = sumBy(
    monthTransactions.filter((item) => item.type === "saida"),
    (item) => item.amount
  );
  const myMonthlyExpenses = sumBy(
    monthTransactions.filter((item) => item.type === "saida"),
    (item) => personalExpenseAmount(item, settings)
  );
  const silianeMonthlyExpenses = sumBy(
    monthTransactions.filter(
      (item) => item.type === "saida" && item.responsible === settings.partnerName
    ),
    (item) => item.amount
  );
  const thirdPartyMonthlyExpenses = sumBy(
    monthTransactions.filter(
      (item) => item.type === "saida" && item.responsible === settings.thirdPartyName
    ),
    (item) => item.amount
  );
  const pendingReceivable = sumBy(
    transactions.filter(
      (item) => item.type === "a_receber" && item.status === "pendente"
    ),
    (item) => item.amount
  );
  const cardTotal = sumBy(
    monthTransactions.filter(
      (item) =>
        item.paymentMethod === "cartao" &&
        item.type === "saida"
    ),
    (item) => item.amount
  );
  const investedTotal = sumBy(investments, (item) => item.investedAmount);
  const currentInvestedValue = sumBy(investments, (item) => item.currentValue);
  const expectedBalance = monthlyIncome - myMonthlyExpenses;
  const netWorth = currentInvestedValue;
  const reserveGoal = goals.find((goal) =>
    goal.name.toLowerCase().includes("reserva")
  );
  const reserveProgress = reserveGoal
    ? reserveGoal.currentAmount / reserveGoal.targetAmount
    : 0;

  return {
    monthlyIncome,
    monthlyExpenses,
    grossMonthlyExpenses,
    myMonthlyExpenses,
    silianeMonthlyExpenses,
    thirdPartyMonthlyExpenses,
    expectedBalance,
    pendingReceivable,
    cardTotal,
    investedTotal,
    netWorth,
    reserveProgress
  };
}

export function groupMoney<T>(
  items: T[],
  getKey: (item: T) => string,
  getValue: (item: T) => number
) {
  const grouped = new Map<string, number>();
  for (const item of items) {
    const key = getKey(item);
    grouped.set(key, (grouped.get(key) ?? 0) + getValue(item));
  }
  return Array.from(grouped, ([name, value]) => ({ name, value }));
}

export function personalExpenseAmount(
  transaction: Transaction,
  settings: Pick<FinanceSettings, "ownerName" | "sharedName"> = defaultSettings
) {
  if (transaction.responsible === settings.ownerName) return transaction.amount;
  if (transaction.responsible === settings.sharedName) return transaction.amount / 2;
  return 0;
}
