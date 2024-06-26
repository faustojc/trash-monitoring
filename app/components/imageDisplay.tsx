import {useLoaderData} from "~/domain/useLoaderData";
import {Card} from "flowbite-react";

const ImageDisplay = () => {
    const imageData = useLoaderData();

    return (
        <Card className={"flex-3 lg:w-1/3 max-w-full"}
              imgAlt={'Monitor image'}
              imgSrc={`${imageData}`}
        >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Monitoring Image
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
                This image shows the current state of the waste.
            </p>
        </Card>
    );
}

export default ImageDisplay;
