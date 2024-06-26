import {Card, Tabs} from "flowbite-react";
import {useState} from "react";

import {useWeightData} from "~/domain/useWeightData";
import LatestWeight from "~/components/latestWeight";
import AverageWeight from "~/components/averageWeight";
import WeightChart from "~/components/weightChart";
import Navigation from "~/components/navigation";
import ImageDisplay from "~/components/imageDisplay";


export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">("daily");
    const weightData = useWeightData(activeTab);

    return (
        <>
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
                        <LatestWeight weightData={weightData} timeRange={activeTab}/>
                        <AverageWeight weightData={weightData} timeRange={activeTab}/>
                    </div>
                    <div className={'flex lg:flex-row flex-col gap-4 items-stretch mb-10'}>
                        <Card className={'flex-grow'}>
                            <h5 className="text-lg md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Weight Graph
                            </h5>
                            <WeightChart weightData={weightData} timeRange={activeTab}/>
                        </Card>
                        <ImageDisplay/>
                    </div>
                </div>
            </div>
        </>
    );
}
