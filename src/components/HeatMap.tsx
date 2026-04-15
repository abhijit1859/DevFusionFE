import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useEffect, useState } from "react";
import { apiClient } from "../services/apiClient";

export default function Heatmap() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await apiClient.get("/user-activity");

      const formatted = Object.entries(res.data.activity).map(
        ([date, count]: any) => ({
          date,
          count,
        })
      );

      setData(formatted);
    };

    fetch();
  }, []);

  return (
    <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-white tracking-wide">
          Activity
        </h2>

        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Less</span>
          <div className="w-3 h-3 bg-[#161b22] rounded-sm" />
          <div className="w-3 h-3 bg-[#0e4429] rounded-sm" />
          <div className="w-3 h-3 bg-[#26a641] rounded-sm" />
          <div className="w-3 h-3 bg-[#39d353] rounded-sm" />
          <span>More</span>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <CalendarHeatmap
          startDate={
            new Date(new Date().setFullYear(new Date().getFullYear() - 1))
          }
          endDate={new Date()}
          values={data}
          gutterSize={3} // spacing between squares
          showWeekdayLabels={true}
          classForValue={(value: any) => {
            if (!value || value.count === 0) return "fill-[#161b22]";

            if (value.count >= 5) return "fill-[#39d353]";
            if (value.count >= 3) return "fill-[#26a641]";
            if (value.count >= 1) return "fill-[#0e4429]";

            return "fill-[#161b22]";
          }}
        />
      </div>
    </div>
  );
}