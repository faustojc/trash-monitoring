import {Badge, Card} from "flowbite-react";
import {ArrowDown, ArrowUp} from "flowbite-react-icons/outline";
import {useEffect, useState} from "react";
import {DocumentData} from "firebase/firestore";
import {subDays, subMonths, subWeeks} from "date-fns";
import {filterData} from "~/domain/filterData";

interface AverageWeightProps {
    weightData: DocumentData[];
    timeRange: "daily" | "weekly" | "monthly";
}

const AverageWeight = ({weightData = [], timeRange}: AverageWeightProps) => {
    const [averageWeight, setAverageWeight] = useState(0);
    const [percentageChange, setPercentageChange] = useState(0);

    useEffect(() => {
        const now = new Date();
        const currentRangeData = filterData(weightData, now, timeRange);

        let prevDate: Date;
        if (timeRange === "daily") {
            prevDate = subDays(now, 1);
        } else if (timeRange === "weekly") {
            prevDate = subWeeks(now, 1);
        } else {
            prevDate = subMonths(now, 1);
        }

        const previousRangeData = filterData(weightData, prevDate, timeRange);

        // Calculate average weights
        const currentWeekAverage = currentRangeData.length
            ? currentRangeData.reduce((sum, item) => sum + item.value, 0) / currentRangeData.length
            : 0;
        const previousWeekAverage = previousRangeData.length
            ? previousRangeData.reduce((sum, item) => sum + item.value, 0) / previousRangeData.length
            : 0;

        // Calculate percentage change
        const change = previousWeekAverage === 0
            ? 0
            : ((currentWeekAverage - previousWeekAverage) / previousWeekAverage) * 100;

        setPercentageChange(isNaN(change) ? 0 : change);
        setAverageWeight(Math.round(currentWeekAverage * 100) / 100);
    }, [weightData, timeRange]);


    return (
        <Card className="flex-grow bg-blue-50 shadow-none">
            <h5 className="md:text-lg text-sm tracking-tight text-gray-900 dark:text-white">
                Average Weight
            </h5>
            <div className="flex flex-row justify-between">
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-400">
                    {Math.round(averageWeight * 100) / 100} kg
                </p>
                <Badge
                    color={percentageChange >= 0 ? "success" : "failure"}
                    icon={percentageChange >= 0 ? ArrowUp : ArrowDown}
                >
                    {Math.round(percentageChange * 100) / 100}%
                </Badge>
            </div>
        </Card>
    );
};

export default AverageWeight;
