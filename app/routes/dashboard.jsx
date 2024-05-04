import {Card, Dropdown, Navbar, NavbarCollapse, Table} from "flowbite-react";
import {signOut} from "firebase/auth";
import {firebaseAuth, firebaseDatabase} from "../domain/firebase.js";
import {useNavigate} from "@remix-run/react";
import {useEffect, useState} from "react";
import {collection, getDocs, limit, orderBy, query} from 'firebase/firestore';

import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const initialData = generateData('daily');

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
    },
};

export const data = {
    labels: initialData.labels,
    datasets: [{
        label: 'Waste Weight',
        data: initialData.data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }],
};

function generateData(range) {
    switch (range) {
        case 'daily':
            return {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                data: [12, 19, 3, 5, 2, 3, 11]
            };
        case 'weekly':
            return {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                data: [30, 50, 70, 45]
            };
        case 'monthly':
            return {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                data: [150, 200, 250, 300, 200, 180, 220, 250, 300, 200, 180, 220]
            };
        default:
            return {
                labels: ['2021', '2022', '2023', '2024', '2025'],
                data: [1000, 1500, 2000, 1800, 2500]
            };
    }
}

export default function Dashboard() {
    const navigate = useNavigate();

    const [today, setToday] = useState(new Date());
    const [weightData, setWeightData] = useState([]);

    const fetchData = async () => {
        const q = query(
            collection(firebaseDatabase, "weights"),
            orderBy("created_at", "desc"),
            limit(5)
        );

        const snapshot = await getDocs(q);
        setWeightData(snapshot.docs.map(doc => doc.data()));
    }

    useEffect(() => {
        fetchData().then(r => null);

        const timer = setInterval(() => setToday(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = async () => {
        localStorage.clear();

        try {
            await signOut(firebaseAuth);
            navigate("/")
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <Navbar fluid rounded>
                <Navbar.Brand>
                    <img src="../../app/resources/images/logo.png" className="mr-3 h-6 sm:h-9" alt="logo"/>
                    <span
                        className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Monitoring
                </span>
                </Navbar.Brand>
                <div className="flex md:order-2">
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                            </svg>
                        }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm font-bold">Admin</span>
                        </Dropdown.Header>
                        <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
                    </Dropdown>
                    <Navbar.Toggle/>
                </div>
                <NavbarCollapse>
                    <p className="text-sm font-bold">{today.toDateString()} {today.toLocaleTimeString()}</p>
                </NavbarCollapse>
            </Navbar>
            <div className={'w-screen h-screen m-auto container my-10'}>
                <div className={'flex justify-between'}>
                    <div>
                        <Card className={"max-w-[540px] mb-10"}
                              imgAlt={'Monitor image'}
                              imgSrc="../../app/resources/images/net.jpg"
                        >
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Monitoring Image
                            </h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                This image shows the current state of the waste.
                            </p>
                        </Card>
                        <Card className={"max-w-[540px]"}>
                            <div className={'flex justify-between'}>
                                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Weight Graph
                                </h5>
                                <Dropdown label="Select time range" dismissOnClick={true}>
                                    <Dropdown.Item>Hourly</Dropdown.Item>
                                    <Dropdown.Item>Daily</Dropdown.Item>
                                    <Dropdown.Item>Weekly</Dropdown.Item>
                                </Dropdown>
                            </div>
                            <canvas id="myChart"></canvas>
                        </Card>
                    </div>
                    <div className={'flex flex-col items-end'}>
                        <Card className={"max-w-[540px] mb-10"}>
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Sensor Data
                            </h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                This table shows the current state of the weight data.
                            </p>
                            <Table hoverable={true}>
                                <Table.Head>
                                    <Table.HeadCell>Weight</Table.HeadCell>
                                    <Table.HeadCell>High Capacity</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {weightData.map((item, index) => (
                                        <Table.Row key={index}
                                                   className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell
                                                className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {item.value}
                                            </Table.Cell>
                                            <Table.Cell>{item.isHighCapacity ? 'True' : 'False'}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Card>
                        <div className={'flex gap-4 mt-10'}>
                            <Card className={'max-w-[540px]'}>
                                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Average Weight
                                </h5>
                                <p className="font-normal text-gray-700 dark:text-gray-400">
                                    230 kg
                                </p>
                                <p className="font-normal text-gray-700 dark:text-gray-400">
                                    average daily weight
                                </p>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <script src="../../app/domain/chart_monitor.js" type="module"></script>
        </>
    );
}
