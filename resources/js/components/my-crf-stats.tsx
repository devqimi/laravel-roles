import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface MyStatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    bgColor: string;
    iconColor: string;
    textColor: string;
    description?: string;
}

function MyStatCard({ title, value, icon, bgColor, iconColor, textColor, description }: MyStatCardProps) {
    return (
        <div className={`${bgColor} border border-opacity-20 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className={`text-sm font-medium ${textColor} opacity-90 mb-1`}>{title}</p>
                    <p className={`text-3xl font-semibold ${textColor} mb-2`}>{value}</p>
                    {description && (
                        <p className={`text-xs ${textColor} opacity-75`}>{description}</p>
                    )}
                </div>
                <div className={`${iconColor} p-3 rounded-lg bg-white bg-opacity-30`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

interface MyCRFStatsProps {
    myPending: number;
    myInProgress: number;
    myCompleted: number;
    myTotal: number;
    myThisMonth?: number;
}

export default function MyCRFStats({ 
    myPending, 
    myInProgress, 
    myCompleted, 
    myTotal,
    myThisMonth = 0
}: MyCRFStatsProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2 px-3">
                <h2 className="text-xl font-semibold text-gray-900">CRFs Progress</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
                
                <MyStatCard
                    title="Pending Approval"
                    value={myPending}
                    icon={<AlertCircle className="w-6 h-6" />}
                    bgColor="bg-gradient-to-br from-orange-400 to-orange-500"
                    iconColor="text-orange-500"
                    textColor="text-white"
                    description="Awaiting HOU approval"
                />
                
                <MyStatCard
                    title="In Progress"
                    value={myInProgress}
                    icon={<Clock className="w-6 h-6" />}
                    bgColor="bg-gradient-to-br from-blue-400 to-blue-500"
                    iconColor="text-blue-500"
                    textColor="text-white"
                    description="Being worked on"
                />
                
                <MyStatCard
                    title="Completed"
                    value={myCompleted}
                    icon={<CheckCircle className="w-6 h-6" />}
                    bgColor="bg-gradient-to-br from-green-400 to-green-500"
                    iconColor="text-green-500"
                    textColor="text-white"
                    description="Successfully resolved"
                />
                
                <MyStatCard
                    title="Total Submitted"
                    value={myTotal}
                    icon={<FileText className="w-6 h-6" />}
                    bgColor="bg-gradient-to-br from-purple-400 to-purple-500"
                    iconColor="text-purple-500"
                    textColor="text-white"
                    description={`${myThisMonth} this month`}
                />
                
            </div>
        </div>
    );
}