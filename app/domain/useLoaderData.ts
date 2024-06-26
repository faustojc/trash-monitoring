import {collection, onSnapshot} from 'firebase/firestore';
import {firebaseDatabase, firebaseStorage} from "~/domain/firebase";
import {useEffect, useState} from "react";
import {getDownloadURL, ref} from "@firebase/storage";


export function useLoaderData() {
    const [url, setUrl] = useState<string>('');

    const unsubscribe = onSnapshot(
        collection(firebaseDatabase, "images"),
        async (snapshot) => {
            const data = snapshot.docChanges()
                .filter((change) => change.type === "added")
                .sort((a, b) => b.doc.data().timestamp - a.doc.data().timestamp)
                .map((change) => change.doc.data())
                .at(0);

            if (data) {
                const imageRef = ref(firebaseStorage, data.url);
                const imageUrl = await getDownloadURL(imageRef);

                setUrl(imageUrl);
            }
        }, (error) => {
            console.log("Error listening for changes for image:", error);
        });

    useEffect(() => {
        return unsubscribe;
    }, []);

    return url;
}
