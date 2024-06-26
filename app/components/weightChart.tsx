import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {DocumentData} from "firebase/firestore";
import CustomTooltip from "~/components/customTooltip";
import {filterData} from "~/domain/filterData";
import formatData from "~/domain/formatData";

interface ChartProps {
    weightData: DocumentData[];
    timeRange: "daily" | "weekly" | "monthly";
}

export default function WeightChart({weightData, timeRange}: Readonly<ChartProps>) {
    const filteredData = filterData(weightData, timeRange);

    const formattedData = formatData(filteredData, timeRange);

    const chartData = Object.entries(formattedData).map(([key, value]) => {
        const averageValue = value.reduce((acc, item) => acc + item, 0) / value.length;

        return {
            created_at: key,
            value: Math.round(averageValue * 100) / 100
        };
    });

    return (
        <ResponsiveContainer width={"100%"} height={400}>
            <BarChart
                data={chartData.length === 0 ? [{created_at: "No data", value: 0}] : chartData}
                margin={{top: 5, bottom: 30}}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="created_at"
                       interval={0}
                       angle={(chartData.length > 8 ? 45 : 0)}
                       textAnchor={chartData.length > 8 ? "start" : "middle"}
                       allowDataOverflow={false}
                />
                <YAxis domain={['dataMin', 'auto']}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="value" fill={'#84c4d8'} barSize={chartData.length > 8 ? '4%' : '10%'} isAnimationActive={true}/>
            </BarChart>
        </ResponsiveContainer>
    );
}
