import {useEffect, useState} from "react";
import {collection, DocumentData, getDocs, onSnapshot} from "firebase/firestore";
import {firebaseDatabase} from "~/domain/firebase";

export function useWeightData(timeRange: "daily" | "weekly" | "monthly" = "daily") {
    const [weightData, setWeightData] = useState<DocumentData[]>([]);

    const unsubscribe = onSnapshot(
        collection(firebaseDatabase, "weights"),
        (snapshot) => {
            snapshot.docChanges()
                .filter((change) => change.type === "added")
                .forEach((change) => {
                    const item = change.doc.data();
                    item.created_at = item.created_at.toDate();

                    setWeightData((prev) => {
                        const existingEntry = prev.some(
                            (prevItem) => prevItem.created_at.getTime() === item.created_at.getTime()
                        );

                        if (existingEntry) {
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

    useEffect(() => {
        getDocs(collection(firebaseDatabase, "weights")).then((snapshot) => {
            const initialData = snapshot.docs.map((doc) => doc.data());

            initialData.forEach((item) => {
                item.created_at = item.created_at.toDate();
            });

            // sort the data by latest date
            initialData.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

            setWeightData(initialData);
        });

        return unsubscribe;
    }, []);

    return weightData;
}
