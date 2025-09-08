import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function MacroDonut({
  protein,
  carbs,
  fat,
}: {
  protein: number;
  carbs: number;
  fat: number;
}) {
  const total = protein + carbs + fat;
  const data = [
    { name: "Protein", value: protein, color: "#10b981" },
    { name: "Carbs", value: carbs, color: "#38bdf8" },
    { name: "Fat", value: fat, color: "#f59e0b" },
  ];
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={36} outerRadius={64} paddingAngle={4}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => `${Math.round((v / total) * 100)}%`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
