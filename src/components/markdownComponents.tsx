import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/cjs/styles/prism";
import CopyButton from "../common/ui/CopyButton";
import { cn } from "../utils/cn";
import type { Components } from "react-markdown";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ---------------- Chart Data Type ----------------
type ChartDataItem = {
  [key: string]: string | number;
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a28dd0"];

const markdownComponents: Components = {
  // ---------------- Code Blocks ----------------
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");

    // ---------------- Charts ----------------
    if (match?.[1] === "chart") {
      let chartData: {
        type: string;
        data: ChartDataItem[];
        xKey: string;
        yKey: string;
      };
      try {
        chartData = JSON.parse(String(children));

        // Ensure numbers are numbers
        chartData.data = chartData.data.map((item: ChartDataItem) => ({
          ...item,
          [chartData.yKey]: Number(item[chartData.yKey]),
        }));
      } catch {
        return <div className="text-red-500">Invalid chart JSON</div>;
      }

      const { type, data, xKey, yKey } = chartData;

      return (
        <div className="my-6 w-full h-80 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            {type === "bar" ? (
              <BarChart
                data={data}
                barCategoryGap="20%"
                barGap={5}
              >
                <XAxis dataKey={xKey} />
                <YAxis
                  allowDecimals={false}
                  domain={[
                    0,
                    (dataMax: number) => (dataMax < 5 ? 5 : dataMax + 2),
                  ]}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey={yKey}
                  fill="#8884d8"
                  barSize={40}
                  label
                  minPointSize={20}
                />
              </BarChart>
            ) : type === "line" ? (
              <LineChart data={data}>
                <XAxis dataKey={xKey} />
                <YAxis
                  allowDecimals={false}
                  domain={[
                    0,
                    (dataMax: number) => (dataMax < 5 ? 5 : dataMax + 2),
                  ]}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={yKey}
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  label
                />
              </LineChart>
            ) : type === "pie" ? (
              <PieChart>
                <Pie
                  data={data}
                  dataKey={yKey}
                  nameKey={xKey}
                  outerRadius={100}
                  label
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <div /> // fallback
            )}
          </ResponsiveContainer>
        </div>
      );
    }

    // ---------------- Regular Code ----------------
    return match ? (
      <div className="bg-gray-800 rounded-md my-4 font-mono overflow-hidden">
        <div className="flex items-center justify-between px-4 py-1 bg-gray-700 text-xs text-gray-400">
          <span>{match[1]}</span>
          <CopyButton text={String(children).trim()} />
        </div>
        <SyntaxHighlighter
          language={match[1]}
          style={oneDark}
          customStyle={{ margin: 0, padding: "1rem" }}
          PreTag="div"
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code
        className={cn(
          className,
          "bg-gray-700 text-red-400 rounded-sm px-1 py-0.5 text-xs font-mono"
        )}
        {...props}
      >
        {children}
      </code>
    );
  },

  // ---------------- Tables ----------------
  table({ children }) {
    return (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border border-gray-600 rounded-md">
          {children}
        </table>
      </div>
    );
  },
  thead({ children }) {
    return <thead className="bg-background text-primary">{children}</thead>;
  },
  tbody({ children }) {
    return <tbody className="divide-y divide-gray-100">{children}</tbody>;
  },
  tr({ children }) {
    return <tr className="hover:bg-light-background">{children}</tr>;
  },
  th({ children }) {
    return (
      <th className="px-4 py-2 text-left text-sm font-semibold border-b border-gray-500">
        {children}
      </th>
    );
  },
  td({ children }) {
    return (
      <td className="px-4 py-2 text-sm text-primary border-b border-gray-500">
        {children}
      </td>
    );
  },
};

export default markdownComponents;
