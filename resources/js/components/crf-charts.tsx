import { useState } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface TrendData {
    date: string;
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
}

interface DepartmentData {
    department: string;
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
}

interface CRFChartsProps {
    trendData: {
        daily: TrendData[];
        weekly: TrendData[];
        monthly: TrendData[];
    };
    departmentData: DepartmentData[];
}

export default function CRFCharts({ trendData, departmentData }: CRFChartsProps) {
    const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

    const currentTrendData = trendData[timeRange];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 p-2">
            {/* Line Chart - CRF Trends Over Time */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>CRF Trends Over Time</CardTitle>
                    <Select
                        value={timeRange}
                        onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setTimeRange(value)}
                    >
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={currentTrendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="date" 
                                tick={{ fontSize: 12 }}
                                stroke="#6b7280"
                            />
                            <YAxis 
                                tick={{ fontSize: 12 }}
                                stroke="#6b7280"
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'white', 
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend 
                                wrapperStyle={{ fontSize: '12px' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="total" 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                name="Total CRFs"
                                dot={{ fill: '#3b82f6' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="pending" 
                                stroke="#f97316" 
                                strokeWidth={2}
                                name="Pending"
                                dot={{ fill: '#f97316' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="inProgress" 
                                stroke="#eab308" 
                                strokeWidth={2}
                                name="In Progress"
                                dot={{ fill: '#eab308' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="completed" 
                                stroke="#22c55e" 
                                strokeWidth={2}
                                name="Completed"
                                dot={{ fill: '#22c55e' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Bar Chart - CRFs by Department */}
            <Card>
                <CardHeader>
                    <CardTitle>CRFs by Department</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={departmentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="department" 
                                tick={{ fontSize: 11 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                stroke="#6b7280"
                            />
                            <YAxis 
                                tick={{ fontSize: 12 }}
                                stroke="#6b7280"
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'white', 
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend 
                                wrapperStyle={{ fontSize: '12px' }}
                            />
                            <Bar 
                                dataKey="pending" 
                                fill="#f97316" 
                                name="Pending"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar 
                                dataKey="inProgress" 
                                fill="#eab308" 
                                name="In Progress"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar 
                                dataKey="completed" 
                                fill="#22c55e" 
                                name="Completed"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}