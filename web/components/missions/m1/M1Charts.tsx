"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Scatter } from "react-chartjs-2";
import {
  BUDGET_ROWS,
  PERSONNEL_DIVISIONS,
  SERVER_ANOMALY_INDEX,
  SERVER_LOAD,
  SERVER_MONTHS,
} from "@/lib/game/m1/data";
import type { LeadId } from "@/lib/game/m1/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, Tooltip);

const chartFont = { family: "Tahoma, sans-serif", size: 10 };

type ServerProps = {
  activeLead: LeadId | null;
  onAnomaly: () => void;
  onWrong: () => void;
};

export function M1ServerChart({ activeLead, onAnomaly, onWrong }: ServerProps) {
  const colors = SERVER_LOAD.map((_, i) => (i === SERVER_ANOMALY_INDEX ? "#f79421" : "#4a7fc1"));

  return (
    <div className="chart-wrap" style={{ padding: 16 }}>
      <div className="chart-ttl">Server Load — FY 2003</div>
      <Bar
        data={{
          labels: SERVER_MONTHS,
          datasets: [
            {
              data: SERVER_LOAD,
              backgroundColor: colors,
              borderRadius: 2,
              barPercentage: 0.85,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          onClick: (_, elements) => {
            if (!elements.length) return;
            const i = elements[0].index;
            if (i === SERVER_ANOMALY_INDEX && activeLead === "compute") onAnomaly();
            else onWrong();
          },
          plugins: {
            tooltip: {
              callbacks: {
                afterLabel: (ctx) =>
                  ctx.dataIndex === SERVER_ANOMALY_INDEX ? "Ticket: Archived — DO NOT REOPEN" : "",
              },
            },
          },
          scales: {
            x: { ticks: { font: chartFont, color: "#555" }, grid: { display: false } },
            y: { max: 130, ticks: { font: chartFont, color: "#555" }, grid: { color: "#eee" } },
          },
        }}
        height={200}
      />
    </div>
  );
}

type BudgetProps = {
  activeLead: LeadId | null;
  onAnomaly: () => void;
  onWrong: () => void;
};

export function M1BudgetChart({ activeLead, onAnomaly, onWrong }: BudgetProps) {
  const amounts = BUDGET_ROWS.map((r) => parseFloat(r.amount.replace(/[$M]/g, "")) * (r.amount.includes("M") ? 1 : 0.001));
  const colors = BUDGET_ROWS.map((r) => (r.anomaly ? "#f79421" : "#4a7fc1"));

  return (
    <div className="chart-wrap" style={{ padding: 16 }}>
      <div className="chart-ttl">Budget Allocation — Q3 FY2003</div>
      <Bar
        data={{
          labels: BUDGET_ROWS.map((r) => r.centre),
          datasets: [{ data: amounts, backgroundColor: colors, borderRadius: 2 }],
        }}
        options={{
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          onClick: (_, elements) => {
            if (!elements.length) return;
            const i = elements[0].index;
            if (BUDGET_ROWS[i].anomaly) {
              if (activeLead === "funding") onAnomaly();
              else onWrong();
            } else onWrong();
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const row = BUDGET_ROWS[ctx.dataIndex];
                  return `${row.amount} · Owner: ${row.owner}`;
                },
              },
            },
          },
          scales: {
            x: { ticks: { font: chartFont }, grid: { color: "#eee" } },
            y: { ticks: { font: chartFont, color: "#333" }, grid: { display: false } },
          },
        }}
        height={220}
      />
    </div>
  );
}

type PersonnelProps = {
  activeLead: LeadId | null;
  onAnomaly: () => void;
  onWrong: () => void;
};

export function M1PersonnelChart({ activeLead, onAnomaly, onWrong }: PersonnelProps) {
  const points = PERSONNEL_DIVISIONS.map((d, i) => ({
    x: i + 1,
    y: d.hours,
    label: d.label,
    anomaly: d.anomaly,
  }));

  return (
    <div className="chart-wrap" style={{ padding: 16 }}>
      <div className="chart-ttl">September Overtime — by Division</div>
      <Scatter
        data={{
          datasets: [
            {
              data: points,
              pointBackgroundColor: points.map((p) => (p.anomaly ? "#f79421" : "#4a7fc1")),
              pointRadius: points.map((p) => (p.anomaly ? 9 : 6)),
              pointHoverRadius: 10,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          onClick: (_, elements) => {
            if (!elements.length) return;
            const i = elements[0].index;
            if (points[i].anomaly) {
              if (activeLead === "personnel") onAnomaly();
              else onWrong();
            } else onWrong();
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (ctx) => `${points[ctx.dataIndex].label}: ${points[ctx.dataIndex].y}h`,
              },
            },
          },
          scales: {
            x: { display: false, min: 0, max: points.length + 1 },
            y: { ticks: { font: chartFont }, grid: { color: "#eee" }, title: { display: true, text: "Hours", font: chartFont } },
          },
        }}
        height={200}
      />
    </div>
  );
}
