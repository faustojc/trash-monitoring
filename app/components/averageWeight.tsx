import {Card} from "flowbite-react";
import {useEffect, useState} from "react";
import {DocumentData} from "firebase/firestore";
import {filterData} from "~/domain/filterData";
import formatData from "~/domain/formatData";

interface AverageWeightProps {
    weightData: DocumentData[];
    timeRange: "daily" | "weekly" | "monthly";
}

const AverageWeight = ({weightData = [], timeRange}: AverageWeightProps) => {
    const [averageWeight, setAverageWeight] = useState(0);

    useEffect(() => {
        if (weightData.length != 0) {
            const filteredData = filterData(weightData, timeRange);

            if (filteredData.length === 0) {
                setAverageWeight(0);
            } else if (filteredData.length === 1) {
                const averageWeight = filteredData[0].value.reduce((acc, item) => acc + item, 0) / filteredData[0].value.length;

                setAverageWeight(averageWeight);
            } else if (filteredData.length > 1) {
                const data = formatData(filteredData, timeRange);

                const latestKey = Object.keys(data)[Object.keys(data).length - 1];
                const latestData = data[latestKey].reduce((acc, item) => acc + item, 0) / data[latestKey].length;

                const previousKey = Object.keys(data)[Object.keys(data).length - 2];
                const previousData = data[previousKey].reduce((acc, item) => acc + item, 0) / data[previousKey].length;

                const average = (latestData + previousData) / 2;

                setAverageWeight(Math.round(average * 100) / 100);
            }
        }

    }, [weightData, timeRange]);


    return (
        <Card className="flex-grow bg-blue-50 shadow-none">
            <h5 className="md:text-lg text-sm tracking-tight text-gray-900 dark:text-white">
                Average Weight
            </h5>
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-400">
                {Math.round(averageWeight * 100) / 100} kg
            </p>
        </Card>
    );
};

export default AverageWeight;
