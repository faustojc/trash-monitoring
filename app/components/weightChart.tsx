import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {DocumentData} from "firebase/firestore";
import {format} from "date-fns";
import {filterData} from "~/domain/filterData";
import CustomTooltip from "~/components/customTooltip";

interface ChartProps {
    weightData: DocumentData[];
    timeRange: "daily" | "weekly" | "monthly";
}

export default function WeightChart({weightData, timeRange}: Readonly<ChartProps>) {
    const tickFormatter = (tick: string) => {
        if (timeRange === "daily") {
            return format(new Date(tick), "h:mm aa");
        } else if (timeRange === "weekly") {
            return format(new Date(tick), "MMM d, h:mm aa");
        } else {
            return format(new Date(tick), "MMM d");
        }
    };

    // Getting the filtered data from the custom hook
    const filteredData = filterData(weightData, new Date(), timeRange);

    const chartData = filteredData.map((item) => ({
        created_at: format(item.created_at, "MMM d, h:mm aa"),
        value: item.value,
    }));

    return (
        <ResponsiveContainer width={"100%"} height={400}>
            <BarChart
                data={chartData}
                margin={{top: 5, bottom: 30}}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="created_at"
                       tickFormatter={tickFormatter}
                       interval={0}
                       angle={(chartData.length > 8 ? 45 : 0)}
                       textAnchor={chartData.length > 8 ? "start" : "middle"}
                       allowDataOverflow={true}
                />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="value" fill={'#84c4d8'} barSize={chartData.length > 8 ? '4%' : '10%'} isAnimationActive={true}/>
            </BarChart>
        </ResponsiveContainer>
    );
}
