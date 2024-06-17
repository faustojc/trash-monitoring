import {Badge, Card} from "flowbite-react";
import {ArrowDown, ArrowUp} from "flowbite-react-icons/outline";
import {useEffect, useState} from "react";
import {DocumentData} from "firebase/firestore";
import {filterData} from "~/domain/filterData";

interface CurrentWeightProps {
    weightData: DocumentData[] | undefined;
    timeRange: "daily" | "weekly" | "monthly";
}

const CurrentWeight = ({weightData = [], timeRange}: CurrentWeightProps) => {
    const [percentageChange, setPercentageChange] = useState(0);
    const filteredData = filterData(weightData, new Date(), timeRange);

    useEffect(() => {
        if (filteredData.length >= 2) {
            const currentWeight = filteredData[0]?.value || 0;
            const previousWeight = filteredData[1]?.value || 0;

            const change = ((currentWeight - previousWeight) / previousWeight) * 100;
            setPercentageChange(isNaN(change) ? 0 : change);
        } else {
            setPercentageChange(0);
        }
    }, [filteredData, timeRange]);

    return (
        <Card className="flex-grow bg-red-50 shadow-none">
            <h5 className="md:text-lg text-sm tracking-tight text-gray-900 dark:text-white">
                Current Weight
            </h5>
            <div className="flex flex-row justify-between">
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-400">
                    {weightData.length > 0 ? `${filteredData[0].value.toFixed(2)} kg` : "No data"}
                </p>
                {weightData.length >= 2 && ( // Only show Badge if there are at least 2 data points
                    <Badge
                        color={percentageChange >= 0 ? "success" : "failure"}
                        icon={percentageChange >= 0 ? ArrowUp : ArrowDown}
                    >
                        {Math.abs(percentageChange).toFixed(2)}%
                    </Badge>
                )}
            </div>
        </Card>
    );
};

export default CurrentWeight;
