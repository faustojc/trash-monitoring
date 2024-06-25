import {format} from "date-fns";

export default function formatData(data: { created_at: Date, value: number[] }[], timeRange: "daily" | "weekly" | "monthly") {
    return data.reduce((acc: { [key: string]: number[] }, item) => {
        let key: string;

        if (timeRange === 'daily') {
            key = format(item.created_at, "h a");
        } else if (timeRange === 'weekly') {
            key = format(item.created_at, "EEEE");
        } else {
            key = format(item.created_at, "MMM");
        }

        if (!Object.hasOwn(acc, key)) {
            acc[key] = item.value;
        } else {
            acc[key].push(...item.value);
        }

        return acc;
    }, {});
}
