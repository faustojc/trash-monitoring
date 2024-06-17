import {useEffect, useState} from "react";
import {subMonths} from "date-fns";
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

            initialData.forEach((item) => {
                item.created_at = item.created_at.toDate();
            });

            setWeightData(initialData);
        });

        // Listen for updates in the "weights" collection
        const unsubscribe = onSnapshot(collection(firebaseDatabase, "weights"), (snapshot) => {
                snapshot.docChanges()
                    .filter((change) => change.type === "added")
                    .forEach((change) => {
                        const item = change.doc.data();
                        item.created_at = item.created_at.toDate();

                        setWeightData((prev) => {
                            if (prev.some((prevItem) => prevItem.created_at.getTime() === item.created_at.getTime())) {
                                return prev;
                            } else {
                                return [...prev, item];
                            }
                        });
                    });
            },
            (error) => {
                console.log("Error listening for changes:", error);
            }
        );

        return unsubscribe();
    }, []);

    return weightData;
}
