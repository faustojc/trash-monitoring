import {DocumentData} from "firebase/firestore";
import {Table} from "flowbite-react";
import {format} from "date-fns";

interface LogTableProps {
    weightData: DocumentData[];
}

const LogTable = ({weightData}: LogTableProps) => {
    return (
        <div className={'overflow-x-auto mb-4'}>
            <Table>
                <Table.Head>
                    <Table.HeadCell>#</Table.HeadCell>
                    <Table.HeadCell>Weight</Table.HeadCell>
                    <Table.HeadCell>Date</Table.HeadCell>
                </Table.Head>
                <Table.Body className={'divide-y'}>
                    {weightData.map((item: DocumentData, index) => (
                        <Table.Row key={index} className={'bg-white dark:border-gray-700 dark:bg-gray-800'}>
                            <Table.Cell className={'whitespace-nowrap font-medium text-gray-900 dark:text-white'}>{index + 1}</Table.Cell>
                            <Table.Cell>{item.value} kg</Table.Cell>
                            <Table.Cell>{format(item.created_at, 'MMM d h:mm a')}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};

export default LogTable;
