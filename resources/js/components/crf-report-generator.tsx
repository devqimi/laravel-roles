import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileDown, Loader2 } from 'lucide-react';
import { router } from '@inertiajs/react';

interface Category {
    id: number;
    cname: string;
}

interface User {
    id: number;
    name: string;
}

interface ReportGeneratorProps {
    categories: Category[];
    vendors: User[];
}

export default function CRFReportGenerator({ categories, vendors }: ReportGeneratorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        actionBy: '',
        selectedCategories: [] as number[],
        reportType: 'all', // 'all', 'pending', 'completed', 'in_progress'
    });

    const handleCategoryToggle = (categoryId: number) => {
        setFilters(prev => ({
            ...prev,
            selectedCategories: prev.selectedCategories.includes(categoryId)
                ? prev.selectedCategories.filter(id => id !== categoryId)
                : [...prev.selectedCategories, categoryId]
        }));
    };

    const handleSelectAllCategories = () => {
        if (filters.selectedCategories.length === categories.length) {
            setFilters(prev => ({ ...prev, selectedCategories: [] }));
        } else {
            setFilters(prev => ({ 
                ...prev, 
                selectedCategories: categories.map(c => c.id) 
            }));
        }
    };

    const handleGenerateReport = () => {
        setIsGenerating(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (filters.startDate) params.append('start_date', filters.startDate);
        if (filters.endDate) params.append('end_date', filters.endDate);
        if (filters.actionBy) params.append('action_by', filters.actionBy);
        if (filters.selectedCategories.length > 0) {
            params.append('categories', filters.selectedCategories.join(','));
        }
        if (filters.reportType !== 'all') params.append('report_type', filters.reportType);

        // Create a temporary link to download the file
        const downloadUrl = `/reports/crf/export?${params.toString()}`;
        
        // Open in new window to trigger download
        window.location.href = downloadUrl;
        
        setTimeout(() => {
            setIsGenerating(false);
            setIsOpen(false);
        }, 1000);
    };

    const isFormValid = filters.startDate && filters.endDate;

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
                className="bg-green-600 hover:bg-green-700 text-white border-green-600"
            >
                <FileDown className="h-4 w-4 mr-2" />
                Generate Report
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Generate CRF Report</DialogTitle>
                        <DialogDescription>
                            Select filters to generate a customized Excel report of CRFs
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Date Range */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900">Date Range *</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={filters.startDate}
                                        onChange={(e) => setFilters(prev => ({ 
                                            ...prev, 
                                            startDate: e.target.value 
                                        }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => setFilters(prev => ({ 
                                            ...prev, 
                                            endDate: e.target.value 
                                        }))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Report Type */}
                        <div className="space-y-2">
                            <Label htmlFor="reportType">Report Type</Label>
                            <Select
                                value={filters.reportType}
                                onValueChange={(value) => setFilters(prev => ({ 
                                    ...prev, 
                                    reportType: value 
                                }))}
                            >
                                <SelectTrigger id="reportType">
                                    <SelectValue placeholder="Select report type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All CRFs</SelectItem>
                                    <SelectItem value="pending">Pending Only</SelectItem>
                                    <SelectItem value="in_progress">In Progress Only</SelectItem>
                                    <SelectItem value="completed">Completed Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Action By (Vendor) */}
                        <div className="space-y-2">
                            <Label htmlFor="actionBy">Action By (Vendor)</Label>
                            <Select
                                value={filters.actionBy}
                                onValueChange={(value) => setFilters(prev => ({ 
                                    ...prev, 
                                    actionBy: value 
                                }))}
                            >
                                <SelectTrigger id="actionBy">
                                    <SelectValue placeholder="Select vendor (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Vendors</SelectItem>
                                    {vendors.map((vendor) => (
                                        <SelectItem key={vendor.id} value={vendor.id.toString()}>
                                            {vendor.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Categories */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Categories</Label>
                                <Button
                                    type="button"
                                    variant="link"
                                    size="sm"
                                    onClick={handleSelectAllCategories}
                                    className="h-auto p-0 text-xs"
                                >
                                    {filters.selectedCategories.length === categories.length 
                                        ? 'Deselect All' 
                                        : 'Select All'}
                                </Button>
                            </div>
                            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-3">
                                {categories.map((category) => (
                                    <div key={category.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`category-${category.id}`}
                                            checked={filters.selectedCategories.includes(category.id)}
                                            onCheckedChange={() => handleCategoryToggle(category.id)}
                                        />
                                        <label
                                            htmlFor={`category-${category.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {category.cname}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500">
                                {filters.selectedCategories.length} of {categories.length} categories selected
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isGenerating}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleGenerateReport}
                            disabled={!isFormValid || isGenerating}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <FileDown className="mr-2 h-4 w-4" />
                                    Generate Excel
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}