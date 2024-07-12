import {Card} from "flowbite-react";
import {useEffect, useState} from "react";
import {DocumentData} from "firebase/firestore";

interface CurrentWeightProps {
    weightData: DocumentData[] | undefined;
    timeRange: "daily" | "weekly" | "monthly";
}

const LatestWeight = ({weightData = [], timeRange}: CurrentWeightProps) => {
    const [currentWeight, setCurrentWeight] = useState(0);

    useEffect(() => {
        if (weightData.length > 0) {
            const weight = weightData[0].value;
            setCurrentWeight(Math.round(weight * 100) / 100);
        }
    }, [weightData, timeRange]);

    return (
        <Card className="flex-grow bg-red-50 shadow-none">
            <h5 className="md:text-lg text-sm tracking-tight text-gray-900 dark:text-white">
                Latest Weight
            </h5>
            <div className="flex flex-row justify-between">
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-400">
                    {weightData?.length > 0 ? `${currentWeight} kg` : "No data"}
                </p>
            </div>
        </Card>
    );
};

export default LatestWeight;
