import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    bgColor: string;
    iconColor: string;
    textColor: string;
}

function StatCard({ title, value, icon, bgColor, iconColor, textColor }: StatCardProps) {
    return (
        <div className={`${bgColor} border border-opacity-20 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className={`text-sm font-medium ${textColor} opacity-90 mb-1`}>{title}</p>
                    <p className={`text-3xl font-semibold ${textColor}`}>{value}</p>
                </div>
                <div className={`${iconColor} p-3 rounded-lg bg-white bg-opacity-30`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

interface CRFStatsProps {
    totalCRF: number;
    inProgress: number;
    completed: number;
    pending: number;
    acknowledged?: number;
}

export default function CRFStats({ 
    totalCRF, 
    inProgress, 
    completed, 
    pending 
}: CRFStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-2">
            
            <StatCard
                title="Pending"
                value={pending}
                icon={<AlertCircle className="w-6 h-6" />}
                bgColor="bg-gradient-to-br from-orange-400 to-orange-500"
                iconColor="text-orange-500"
                textColor="text-white"
            />
            <StatCard
                title="In Progress"
                value={inProgress}
                icon={<Clock className="w-6 h-6" />}
                bgColor="bg-gradient-to-br from-blue-400 to-blue-500"
                iconColor="text-blue-500"
                textColor="text-white"
            />
            <StatCard
                title="Completed"
                value={completed}
                icon={<CheckCircle className="w-6 h-6" />}
                bgColor="bg-gradient-to-br from-green-400 to-green-500"
                iconColor="text-green-500"
                textColor="text-white"
            />
            <StatCard
                title="Total CRF"
                value={totalCRF}
                icon={<FileText className="w-6 h-6" />}
                bgColor="bg-gradient-to-br from-purple-400 to-purple-500"
                iconColor="text-purple-500"
                textColor="text-white"
            />
        </div>
    );
}