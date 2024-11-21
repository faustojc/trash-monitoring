import {Card, Tabs, Toast} from "flowbite-react";
import {useState} from "react";

import {useWeightData} from "~/domain/useWeightData";
import LatestWeight from "~/components/latestWeight";
import TotalWeight from "~/components/totalWeight";
import WeightChart from "~/components/weightChart";
import Navigation from "~/components/navigation";
import LogTable from "~/components/logTable";
import AlertTooltip from "~/components/alertTooltip";


export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<string>("daily");
    const weightData = useWeightData();

    return (
        <div className={'relative'}>
            <Navigation/>
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
                              } else {
                                  setActiveTab('history')
                              }
                          }}
                    >
                        <Tabs.Item title='Daily' active={activeTab === 'daily'}/>
                        <Tabs.Item title='Weekly' active={activeTab === 'weekly'}/>
                        <Tabs.Item title='History' active={activeTab === 'history'}>
                            <LogTable weightData={weightData}/>
                        </Tabs.Item>
                    </Tabs>
                </div>
                {activeTab !== 'history' && (
                    <div className={'flex flex-col gap-5 md:mx-0 mx-4 mb-3'}>
                        <div className={'flex flex-row gap-4 items-stretch'}>
                            <LatestWeight weightData={weightData} timeRange={activeTab}/>
                            <TotalWeight weightData={weightData} timeRange={activeTab}/>
                        </div>
                        <div className={'flex lg:flex-row flex-col gap-4 items-stretch mb-10'}>
                            <Card className={'flex-grow'}>
                                <h5 className="text-lg md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Weight Graph (Average kg)
                                </h5>
                                <WeightChart weightData={weightData} timeRange={activeTab}/>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
            <div className={'fixed w-full flex justify-center top-0 z-10 p-3'}>
                <AlertTooltip weightData={weightData}/>
            </div>
        </div>
    );
}
