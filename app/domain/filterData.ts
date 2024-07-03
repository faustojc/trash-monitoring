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
            let key: number = 0;

            switch (timeRange) {
                case 'daily':
                    key = date.getHours();
                    break;
                case 'weekly':
                    key = date.getDay();
                    break;
                case 'monthly':
                    key = date.getMonth();
                    break;
            }

            const containsKey = acc.some((item) => predicate(item, key, timeRange));

            if (!containsKey) {
                acc.push({
                    created_at: date,
                    value: [item.value]
                });
            } else {
                const index = acc.findIndex((item) => predicate(item, key, timeRange));
                acc[index].value.push(item.value);
            }
        }

        return acc;
    }, []);

    // then sort the data by earliest date
    filteredData.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

    return filteredData;
}

const filterDateRange = (weightData: DocumentData[], startDate: Date, endDate: Date) => {
    return weightData.filter((item) => {
        return item.created_at >= startDate && item.created_at <= endDate;
    });
}

const predicate = (item: { created_at: Date, value: number[] }, key: number, timeRange: "daily" | "weekly" | "monthly" = "daily") => {
    switch (timeRange) {
        case 'daily':
            return item.created_at.getHours() === key;
        case 'weekly':
            return item.created_at.getDay() === key;
        case 'monthly':
            return item.created_at.getMonth() === key;
    }
}
