import {DocumentData} from "firebase/firestore";
import {endOfDay, endOfWeek, endOfYear, startOfDay, startOfWeek, startOfYear} from "date-fns";

export function filterData(weightData: DocumentData[], timeRange: "daily" | "weekly" | "monthly" = "daily") {
    const now = new Date();

    let filteredData: { 'created_at': Date, value: number[] }[] = [];
    let startOfCurrentRange: Date;
    let endOfCurrentRange: Date;

    if (timeRange === 'daily') {
        startOfCurrentRange = startOfDay(now);
        endOfCurrentRange = endOfDay(now);
    } else if (timeRange === 'weekly') {
        startOfCurrentRange = startOfWeek(now);
        endOfCurrentRange = endOfWeek(now);
    } else {
        startOfCurrentRange = startOfYear(now);
        endOfCurrentRange = endOfYear(now);
    }


    filteredData = filterDateRange(weightData, startOfCurrentRange, endOfCurrentRange).reduce((acc: { 'created_at': Date, value: number[] }[], item) => {
        const date = item.created_at;

        // check if the date is within the current range
        if (date >= startOfCurrentRange && date <= endOfCurrentRange) {
            const key = date.toDateString();

            if (!acc.some((item) => item.created_at.toDateString() === key)) {
                acc.push({
                    created_at: date,
                    value: [item.value]
                });
            } else {
                const index = acc.findIndex((item) => item.created_at.toDateString() === key);
                acc[index].value.push(item.value);
            }
        }

        return acc;
    }, []);

    // then sort the data by earliest date
    filteredData.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

    return filteredData;
}

function filterDateRange(weightData: DocumentData[], startDate: Date, endDate: Date) {
    return weightData.filter((item) => {
        return item.created_at >= startDate && item.created_at <= endDate;
    });
}
