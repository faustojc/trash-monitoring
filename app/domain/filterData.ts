import {DocumentData} from "firebase/firestore";
import {endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek} from "date-fns";

export function filterData(weightData: DocumentData[], date: Date, timeRange: "daily" | "weekly" | "monthly" = "daily") {
    let filteredData = weightData;

    if (timeRange === "daily") {
        const startOfCurrentRange = startOfDay(new Date());
        const endOfCurrentRange = endOfDay(new Date());

        filteredData = weightData.filter((item) => {
            return item.created_at >= startOfCurrentRange && item.created_at <= endOfCurrentRange;
        });
    } else if (timeRange === "weekly") {
        const startOfCurrentRange = startOfWeek(new Date());
        const endOfCurrentRange = endOfWeek(new Date());

        filteredData = weightData.filter((item) => {
            return item.created_at >= startOfCurrentRange && item.created_at <= endOfCurrentRange;
        });
    } else { //monthly
        const startOfCurrentRange = startOfMonth(new Date());
        const endOfCurrentRange = endOfMonth(new Date());

        filteredData = weightData.filter((item) => {
            return item.created_at >= startOfCurrentRange && item.created_at <= endOfCurrentRange;
        });
    }

    return filteredData;
}
