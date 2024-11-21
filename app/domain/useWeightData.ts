import {useEffect, useState} from "react";
import {collection, DocumentData, getDocs, onSnapshot} from "firebase/firestore";
import {firebaseDatabase} from "~/domain/firebase";

export function useWeightData() {
    const [weightData, setWeightData] = useState<DocumentData[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(firebaseDatabase, "weights"),
            (snapshot) => {
                const changes = snapshot.docChanges()
                    .filter((change) => change.type === "added")
                    .map((change) => {
                        const item = change.doc.data();
                        item.created_at = item.created_at.toDate();
                        item.value = (item.value <= 0) ? 0 : item.value;

                        return item;
                    });

                setWeightData((prev) => {
                    const updatedData = [...changes, ...prev];

                    updatedData.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

                    return updatedData;
                });
            },
            (error) => {
                console.log("Error listening for changes:", error);
            }
        );

        getDocs(collection(firebaseDatabase, "weights")).then((snapshot) => {
            const initialData = snapshot.docs.map((doc) => {
                const item = doc.data();
                item.created_at = item.created_at.toDate();
                item.value = (item.value <= 0) ? 0 : item.value;
                return item;
            });

            initialData.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
            setWeightData(initialData);
        });

        return unsubscribe;
    }, []);

    return weightData;
}
