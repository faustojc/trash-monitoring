import {Card} from "flowbite-react";
import {useEffect, useState} from "react";
import {DocumentData} from "firebase/firestore";
import {filterData} from "~/domain/filterData";

interface AverageWeightProps {
    weightData: DocumentData[];
    timeRange: string;
}

const TotalWeight = ({weightData = [], timeRange}: AverageWeightProps) => {
    const [totalWeight, setTotalWeight] = useState(0);

    useEffect(() => {
        if (weightData.length != 0) {
            const filteredData = filterData(weightData, timeRange);

            const total = filteredData
                .map((item) => item.value.reduce((acc, curr) => acc + curr, 0))
                .reduce((acc, curr) => acc + curr, 0);

            setTotalWeight(total);
        }

    }, [weightData, timeRange]);


    return (
        <Card className="flex-grow bg-blue-50 shadow-none">
            <h5 className="md:text-lg text-sm tracking-tight text-gray-900 dark:text-white">
                Total Weight
            </h5>
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-400">
                {Math.round(totalWeight * 100) / 100} kg
            </p>
        </Card>
    );
};

export default TotalWeight;
