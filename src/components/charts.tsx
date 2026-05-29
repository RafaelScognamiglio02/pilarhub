"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { money } from "@/lib/format";

type MoneyPoint = {
  name: string;
  value: number;
};

const colors = ["#2dd4bf", "#f4c95d", "#60a5fa", "#fb7185", "#a78bfa"];

const tooltipStyle = {
  background: "#151b27",
  border: "1px solid #334155",
  borderRadius: 8,
  color: "#f8fafc",
  boxShadow: "0 16px 40px rgba(0, 0, 0, 0.35)"
};

const tooltipTextStyle = {
  color: "#f8fafc",
  fontWeight: 600
};

export function MoneyBarChart({ data }: { data: MoneyPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid stroke="#252d3b" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#9ba7b7"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            stroke="#9ba7b7"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickFormatter={(value) => money(Number(value)).replace("R$", "")}
          />
          <Tooltip
            cursor={{ fill: "rgba(45, 212, 191, 0.08)" }}
            contentStyle={tooltipStyle}
            itemStyle={tooltipTextStyle}
            labelStyle={tooltipTextStyle}
            formatter={(value) => money(Number(value))}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#2dd4bf" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DistributionChart({ data }: { data: MoneyPoint[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-[240px_1fr] md:items-center">
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={92}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              itemStyle={tooltipTextStyle}
              labelStyle={tooltipTextStyle}
              formatter={(value) => money(Number(value))}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="truncate text-sm text-textSoft">{entry.name}</span>
            </div>
            <span className="text-sm font-medium text-white">{money(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
