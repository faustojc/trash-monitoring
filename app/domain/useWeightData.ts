import {useEffect, useState} from "react";
import {endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek, subMonths} from "date-fns";
import {collection, DocumentData, getDocs, onSnapshot, query, Timestamp, where} from "firebase/firestore";
import {firebaseDatabase} from "~/domain/firebase";

export function useWeightData(timeRange: "daily" | "weekly" | "monthly" = "daily") {
    const [weightData, setWeightData] = useState<DocumentData[]>([]);

    useEffect(() => {
        const now = new Date();

        const initialQuery = query(
            collection(firebaseDatabase, "weights"),
            where("created_at", ">=", Timestamp.fromDate(subMonths(now, 1))),
            where("created_at", "<=", Timestamp.fromDate(now))
        );
        getDocs(initialQuery).then((snapshot) => {
            const initialData = snapshot.docs.map((doc) => doc.data());
            setWeightData(initialData);
        });

        // Listen for updates in the "weights" collection
        const unsubscribe = onSnapshot(collection(firebaseDatabase, "weights"), (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        setWeightData(prevData => [...prevData, change.doc.data()]);
                    }
                });
            },
            (error) => {
                console.log("Error listening for changes:", error);
            }
        );

        return () => unsubscribe();
    }, []);

    let filteredData = weightData;

    if (timeRange === "daily") {
        const startOfCurrentRange = startOfDay(new Date());
        const endOfCurrentRange = endOfDay(new Date());

        filteredData = weightData.filter((item) => {
            const itemDate = new Date(item.created_at);
            return itemDate >= startOfCurrentRange && itemDate <= endOfCurrentRange;
        });
    } else if (timeRange === "weekly") {
        const startOfCurrentRange = startOfWeek(new Date());
        const endOfCurrentRange = endOfWeek(new Date());

        filteredData = weightData.filter((item) => {
            const itemDate = new Date(item.created_at);
            return itemDate >= startOfCurrentRange && itemDate <= endOfCurrentRange;
        });
    } else { //monthly
        const startOfCurrentRange = startOfMonth(new Date());
        const endOfCurrentRange = endOfMonth(new Date());

        filteredData = weightData.filter((item) => {
            const itemDate = new Date(item.created_at);
            return itemDate >= startOfCurrentRange && itemDate <= endOfCurrentRange;
        });
    }

    return {filteredData, weightData};
}
