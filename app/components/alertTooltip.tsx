import {DocumentData} from "firebase/firestore";
import {Toast} from "flowbite-react";
import {useEffect, useState} from "react";

const AlertTooltip = ({weightData}: { weightData: DocumentData[] }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [prevWeight, setPrevWeight] = useState(weightData[0]?.value);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (weightData.length > 0) {
            if (weightData[0].value === 0 && prevWeight === 0) {
                setShowTooltip(false);
            }
            else if (weightData[0].value === 0 && prevWeight !== 0) {
                setShowTooltip(true);
                timer = setTimeout(() => setShowTooltip(false), 3000);
            }

            setPrevWeight(weightData[0].value);
            return () => clearTimeout(timer);
        }
    }, [weightData]);

    if (!showTooltip) {
        return null;
    }

    return (
        <Toast>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                     viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5"/>
                </svg>
            </div>
            <div className="ml-3 text-sm font-normal text-black">Waste collected</div>
            <Toast.Toggle/>
        </Toast>
    );
}

export default AlertTooltip;
