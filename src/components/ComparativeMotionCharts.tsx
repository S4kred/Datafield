import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { motion } from "framer-motion";

/** =========================
 * Datos (de fuentes citadas arriba)
 * ========================= */
const miningTimeDays = { tradicional: 14, drone: 3 };              // turn0search7
const miningErrorPct = { tradicional: 1.3, drone: 2.6 };           // turn0search1/5
const miningEfficiencyX = 6.5;                                     // turn0search12
const constructionFasterPct = 60;                                  // turn0search15  (tiempo)
const oilCostReductionPct = 70;                                    // turn0search6
const oilDowntimeReductionPct = 90;                                // turn0search6
// Nota: también podrías mostrar el potencial de ahorro (US$50bn, turn0news41) como KPI aparte.

/** Utilidad para inicializar chart imperativamente */
function useEChart(initOptions?: echarts.EChartsInitOpts) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current, undefined, initOptions);
    function handleResize() { chart.resize(); }
    window.addEventListener("resize", handleResize);
    return () => { chart.dispose(); window.removeEventListener("resize", handleResize); };
  }, []);
  return ref;
}

export default function ComparativeMotionCharts() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
        Impacto cuantitativo de drones vs. métodos tradicionales
      </h2>
      <p className="mt-2 text-white/60">Minería, Construcción y Oil &amp; Gas: velocidad, precisión y ahorro.</p>

      <div className="grid lg:grid-cols-3 gap-8 mt-10">
        <ChartCard title="Minería · Tiempo de levantamiento (días)" subtitle="Tradicional vs Drone">
          <MiningTimeChart />
        </ChartCard>

        <ChartCard title="Minería · Error en cubicaciones (%)" subtitle="Ambos dentro de ±3% tolerable">
          <MiningAccuracyChart />
        </ChartCard>

        <ChartCard title="Ahorro y eficiencia · O&G / Construcción" subtitle="Costos, downtime y velocidad">
          <OGConstructionSavingsChart />
        </ChartCard>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6 text-sm text-white/60">
        <KPI label="Eficiencia minería (LiDAR drone)" value={`${miningEfficiencyX.toFixed(1)}×`} />
        <KPI label="Construcción más rápido" value={`-${constructionFasterPct}% tiempo`} />
        <KPI label="Oil & Gas: ahorro de costos" value={`-${oilCostReductionPct}%`} />
      </div>
    </section>
  );
}

/** ---------- Wrappers con motion ---------- */
function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6 }}
      className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"
    >
      <div className="mb-3">
        <h3 className="text-base font-medium">{title}</h3>
        {subtitle && <p className="text-xs text-white/50">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
    >
      <div className="text-white/60">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </motion.div>
  );
}

/** ---------- Charts ---------- */
function MiningTimeChart() {
  const ref = useEChart();
  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.getInstanceByDom(ref.current)!;
    chart.setOption({
      grid: { left: 40, right: 16, top: 20, bottom: 40 },
      xAxis: { 
        type: "category", 
        data: ["Tradicional", "Drone"], 
        axisLabel: { 
          color: "#aaa",
          fontSize: 11
        } 
      },
      yAxis: { type: "value", axisLabel: { color: "#aaa" } },
      tooltip: { trigger: "axis" },
      series: [{
        type: "bar",
        data: [miningTimeDays.tradicional, miningTimeDays.drone],
        label: { 
          show: true, 
          position: "top", 
          color: "#ddd",
          fontSize: 12,
          distance: 8
        },
        itemStyle: { opacity: 0.9 }
      }]
    });
  }, [ref]);
  return <div ref={ref} className="h-64 w-full" />;
}

function MiningAccuracyChart() {
  const ref = useEChart();
  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.getInstanceByDom(ref.current)!;
    chart.setOption({
      grid: { left: 40, right: 16, top: 20, bottom: 40 },
      xAxis: { 
        type: "category", 
        data: ["Tradicional", "Drone"], 
        axisLabel: { 
          color: "#aaa",
          fontSize: 11
        } 
      },
      yAxis: { type: "value", axisLabel: { color: "#aaa" } },
      tooltip: { trigger: "axis" },
      series: [{
        type: "bar",
        data: [miningErrorPct.tradicional, miningErrorPct.drone],
        label: { 
          show: true, 
          position: "top", 
          color: "#ddd", 
          formatter: ({ value }: any) => `${value}%`,
          fontSize: 12,
          distance: 8
        },
        itemStyle: { opacity: 0.9 }
      }]
    });
  }, [ref]);
  return <div ref={ref} className="h-64 w-full" />;
}

function OGConstructionSavingsChart() {
  const ref = useEChart();
  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.getInstanceByDom(ref.current)!;
    chart.setOption({
      grid: { left: 40, right: 16, top: 20, bottom: 60 },
      xAxis: { 
        type: "category", 
        data: ["O&G\nCostos", "O&G\nDowntime", "Construcción\nTiempo"], 
        axisLabel: { 
          color: "#aaa", 
          interval: 0,
          fontSize: 10,
          lineHeight: 14,
          rich: {
            a: {
              fontSize: 10,
              lineHeight: 12
            }
          }
        } 
      },
      yAxis: { type: "value", axisLabel: { color: "#aaa" } },
      tooltip: { trigger: "axis" },
      series: [{
        type: "bar",
        data: [oilCostReductionPct, oilDowntimeReductionPct, constructionFasterPct],
        label: { 
          show: true, 
          position: "top", 
          color: "#ddd", 
          formatter: ({ value }: any) => `-${value}%`,
          fontSize: 12,
          distance: 8
        },
        itemStyle: { opacity: 0.9 }
      }]
    });
  }, [ref]);
  return <div ref={ref} className="h-64 w-full" />;
}
