import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {DocumentData} from "firebase/firestore";
import {format} from "date-fns";
import {filterData} from "~/domain/filterData";

interface ChartProps {
    weightData: DocumentData[];
    timeRange: "daily" | "weekly" | "monthly";
}

export default function WeightChart({weightData, timeRange}: Readonly<ChartProps>) {
    const tickFormatter = (tick: string) => tick;

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
                margin={{top: 5, bottom: 5}}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="created_at"
                       tickFormatter={tickFormatter}
                       interval={0}
                       allowDataOverflow={true}
                />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']}/>
                <Tooltip/>
                <Bar dataKey="value" fill={'#84c4d8'} barSize={'10%'} isAnimationActive={true}/>
            </BarChart>
        </ResponsiveContainer>
    );
}
