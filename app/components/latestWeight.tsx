import {Badge, Card} from "flowbite-react";
import {ArrowDown, ArrowUp} from "flowbite-react-icons/outline";
import {useEffect, useState} from "react";
import {DocumentData} from "firebase/firestore";
import {filterData} from "~/domain/filterData";

interface CurrentWeightProps {
    weightData: DocumentData[] | undefined;
    timeRange: "daily" | "weekly" | "monthly";
}

const LatestWeight = ({weightData = [], timeRange}: CurrentWeightProps) => {
    const [percentageChange, setPercentageChange] = useState(0);
    const [currentWeight, setCurrentWeight] = useState(0);

    const filteredData = filterData(weightData, timeRange);

    useEffect(() => {
        if (filteredData.length >= 2) {
            const currentWeight = filteredData[filteredData.length - 1].value[0];
            const previousWeight = filteredData[filteredData.length - 1].value[1];

            const change = ((currentWeight - previousWeight) / previousWeight) * 100;

            setCurrentWeight(Math.round(currentWeight * 100) / 100);
            setPercentageChange(isNaN(change) ? 0 : change);

        } else {
            const weight = filteredData.length > 0 ? filteredData[filteredData.length - 1].value[0] : 0;
            setCurrentWeight(Math.round(weight * 100) / 100);
        }
    }, [filteredData, timeRange]);

    return (
        <Card className="flex-grow bg-red-50 shadow-none">
            <h5 className="md:text-lg text-sm tracking-tight text-gray-900 dark:text-white">
                Latest Weight
            </h5>
            <div className="flex flex-row justify-between">
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-400">
                    {currentWeight > 0 ? `${currentWeight} kg` : "No data"}
                </p>
                {weightData.length >= 2 && ( // Only show Badge if there are at least 2 data points
                    <Badge
                        color={percentageChange >= 0 ? "success" : "failure"}
                        icon={percentageChange >= 0 ? ArrowUp : ArrowDown}
                    >
                        {Math.round(percentageChange * 100) / 100}%
                    </Badge>
                )}
            </div>
        </Card>
    );
};

export default LatestWeight;
