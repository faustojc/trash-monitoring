import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {DocumentData} from "firebase/firestore";
import {
    eachDayOfInterval,
    eachMonthOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    startOfMonth,
    startOfWeek
} from "date-fns";
import {useMemo} from "react";

interface ChartProps {
    weightData: DocumentData[];
    timeRange: "daily" | "weekly" | "monthly";
}

export default function WeightChart({weightData, timeRange}: Readonly<ChartProps>) {
    // Calculate average weight for each date or month
    const averagedData = weightData.reduce(
        (
            acc: { [key: string]: { value: number; count: number } },
            item
        ) => {
            const dateKey = timeRange === "weekly"
                ? format(item.created_at.toDate(), "EEE")
                : format(item.created_at.toDate(), "MMM");

            acc[dateKey] = acc[dateKey] || {value: 0, count: 0};
            acc[dateKey].value += item.value;
            acc[dateKey].count++;
            return acc;
        },
        {}
    );

    const chartData = Object.entries(averagedData).map(([date, {value, count}]) => ({
        created_at: date,
        value: Math.round(value / count),
    }));

    const tickFormatter = (tick: string) => tick;

    // Dynamic domain based on time range
    const domain = useMemo(() => {
        if (timeRange === "weekly") {
            const now = new Date();
            return [
                format(startOfWeek(now), "EEE"),
                format(endOfWeek(now), "EEE"),
            ];
        } else {
            const now = new Date();
            return [
                format(startOfMonth(now), "MMM"),
                format(endOfMonth(now), "MMM"),
            ];
        }
    }, [timeRange]);

    const ticks = useMemo(() => {
        const now = new Date();

        if (timeRange === "weekly") {
            return eachDayOfInterval({
                start: startOfWeek(now),
                end: endOfWeek(now)
            }).map((date) => format(date, "EEE"));
        } else {
            return eachMonthOfInterval({
                start: startOfMonth(now),
                end: endOfMonth(now),
            }).map((date) => format(date, "MMM"));
        }
    }, [timeRange]);

    return (
        <ResponsiveContainer width={"100%"} height={400}>
            <LineChart data={chartData} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid strokeDasharray="5 5" stroke="#ccc"/>
                <XAxis dataKey="created_at" tickFormatter={tickFormatter} domain={domain} ticks={ticks}/>
                <YAxis/>
                <Line type="monotone" dataKey="value" stroke="#8884d8"/>
                <Tooltip/>
            </LineChart>
        </ResponsiveContainer>
    );
}
