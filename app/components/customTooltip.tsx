import {TooltipProps} from "recharts";
import {Card} from "flowbite-react";

interface CustomTooltipProps extends TooltipProps<number, number> {}

export default function CustomTooltip({active, payload, label}: CustomTooltipProps) {
    if (active && payload && label != undefined) {
        return (
            <Card>
                <p className="text-gray-700 dark:text-gray-400">
                    Date: {label}
                </p>
                <div className={'flex flex-row'}>
                    <p className={'me-1'}>Weight:</p>
                    <p className="font-bold">
                        {payload[0].value} kg
                    </p>
                </div>
            </Card>
        );
    }

    return null;
}
