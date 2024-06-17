import {useNavigate} from "@remix-run/react";
import {signOut} from "firebase/auth";
import {Card, Dropdown, Navbar, NavbarCollapse, Tabs} from "flowbite-react";
import {useEffect, useState} from "react";

import {firebaseAuth} from "~/domain/firebase";

import logo from "../resources/images/logo.png";
import net from "../resources/images/net.jpg";

import {useWeightData} from "~/domain/useWeightData";
import CurrentWeight from "~/components/currentWeight";
import AverageWeight from "~/components/averageWeight";
import WeightChart from "~/components/weightChart";


export default function Dashboard() {
    const navigate = useNavigate();

    const [today, setToday] = useState(new Date());
    const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">("daily");

    const weightData = useWeightData(activeTab);

    useEffect(() => {
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
            <Navbar fluid rounded className={'shadow'}>
                <Navbar.Brand>
                    <img src={`${logo}`} className="mr-3 h-6 sm:h-9" alt="logo"/>
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
                    <p className="text-sm font-bold text-center">{today.toDateString()} {today.toLocaleTimeString()}</p>
                </NavbarCollapse>
            </Navbar>
            <div className={'w-screen h-screen m-auto container my-10'}>
                <div className={'md:mx-0 mx-4'}>
                    <Tabs aria-label={'Monitoring Date'}
                          style={'underline'}
                          defaultValue={'weekly'}
                          onActiveTabChange={(tab) => {
                              if (tab === 0) {
                                  setActiveTab('daily')
                              } else if (tab === 1) {
                                  setActiveTab('weekly')
                              } else if (tab === 2) {
                                  setActiveTab('monthly')
                              }
                          }}
                    >
                        <Tabs.Item active={activeTab === "daily"} title="Daily"/>
                        <Tabs.Item title={'Weekly'} active={activeTab === 'weekly'}/>
                        <Tabs.Item title={'Monthly'} active={activeTab === 'monthly'}/>
                    </Tabs>
                </div>
                <div className={'flex flex-col gap-5 md:mx-0 mx-4'}>
                    <div className={'flex flex-row gap-4 items-stretch'}>
                        <CurrentWeight weightData={weightData} timeRange={activeTab}/>
                        <AverageWeight weightData={weightData} timeRange={activeTab}/>
                    </div>
                    <div className={'flex lg:flex-row flex-col gap-4 items-stretch mb-10'}>
                        <Card className={'flex-grow'}>
                            <h5 className="text-lg md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Weight Graph
                            </h5>
                            <WeightChart weightData={weightData} timeRange={activeTab}/>
                        </Card>
                        <Card className={"flex-3 lg:w-1/3 max-w-full"}
                              imgAlt={'Monitor image'}
                              imgSrc={`${net}`}
                        >
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Monitoring Image
                            </h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                This image shows the current state of the waste.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
