import {Badge, Card} from "flowbite-react";
import {ArrowDown, ArrowUp} from "flowbite-react-icons/outline";
import {useEffect, useState} from "react";
import {DocumentData} from "firebase/firestore";
import {filterData} from "~/domain/filterData";
import formatData from "~/domain/formatData";

interface CurrentWeightProps {
    weightData: DocumentData[] | undefined;
    timeRange: "daily" | "weekly" | "monthly";
}

const LatestWeight = ({weightData = [], timeRange}: CurrentWeightProps) => {
    const [percentageChange, setPercentageChange] = useState(0);
    const [currentWeight, setCurrentWeight] = useState(0);

    useEffect(() => {
        const filteredData = filterData(weightData, timeRange);

        if (filteredData.length >= 2) {
            const formattedData = formatData(filteredData, timeRange);

            const currentWeight = formattedData[Object.keys(formattedData)[Object.keys(formattedData).length - 1]].reduce((acc, item) => acc + item, 0) / formattedData[Object.keys(formattedData)[Object.keys(formattedData).length - 1]].length;
            const previousWeight = formattedData[Object.keys(formattedData)[Object.keys(formattedData).length - 2]].reduce((acc, item) => acc + item, 0) / formattedData[Object.keys(formattedData)[Object.keys(formattedData).length - 2]].length;

            const change = ((currentWeight - previousWeight) / previousWeight) * 100;

            setCurrentWeight(Math.round(currentWeight * 100) / 100);
            setPercentageChange(isNaN(change) ? 0 : change);

        } else if (filteredData.length === 1) {
            const weight = filteredData[0].value.reduce((acc, item) => acc + item, 0) / filteredData[0].value.length;
            setCurrentWeight(Math.round(weight * 100) / 100);
        } else {
            setPercentageChange(0);
            setCurrentWeight(0);
        }
    }, [weightData, timeRange]);

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
