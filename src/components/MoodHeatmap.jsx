import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useMoods } from "../hooks/useMoods";
import { format, parseISO, subMonths } from "date-fns";
import "./MoodHeatmap.css";

const MoodHeatmap = () => {
  const { items } = useMoods();

  const startDate = subMonths(new Date(), 3);
  const endDate = new Date();

  // Transform mood data for heatmap
  const heatmapValues = items.map((m) => ({
    date: format(parseISO(m.timestamp), "yyyy-MM-dd"),
    count: m.score, // Using score as the "count" for color intensity
  }));

  // Color scale based on mood score (1-10)
  const getColorClass = (value) => {
    if (!value) return "color-empty";
    if (value.count <= 3) return "color-scale-1"; // Red (low mood)
    if (value.count <= 5) return "color-scale-2"; // Orange
    if (value.count <= 7) return "color-scale-3"; // Yellow
    if (value.count <= 8) return "color-scale-4"; // Light green
    return "color-scale-5"; // Green (high mood)
  };

  return (
    <div className="mood-heatmap-container">
      <h3 className="heatmap-title">📅 Mood Frequency (Past 90 Days)</h3>
      <p className="heatmap-subtitle">
        Track your emotional patterns over time
      </p>

      <div className="heatmap-wrapper">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={heatmapValues}
          classForValue={getColorClass}
          tooltipDataAttrs={(value) => {
            if (!value || !value.date) {
              return { "data-tip": "No entry" };
            }
            return {
              "data-tip": `${value.date}: Mood ${value.count}/10`,
            };
          }}
          showWeekdayLabels
        />
      </div>

      <div className="heatmap-legend">
        <span className="legend-label">Low</span>
        <div className="legend-colors">
          <div className="legend-color color-empty" title="No data"></div>
          <div className="legend-color color-scale-1" title="1-3"></div>
          <div className="legend-color color-scale-2" title="4-5"></div>
          <div className="legend-color color-scale-3" title="6-7"></div>
          <div className="legend-color color-scale-4" title="8"></div>
          <div className="legend-color color-scale-5" title="9-10"></div>
        </div>
        <span className="legend-label">High</span>
      </div>

      {items.length === 0 && (
        <div className="heatmap-empty">
          <p>📝 Start logging moods to see your patterns here</p>
        </div>
      )}
    </div>
  );
};

export default MoodHeatmap;
