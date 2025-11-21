<?php

namespace App\Exports;

use App\Models\Crf;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill; // Add this line

class CrfExport implements FromQuery, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $startDate;
    protected $endDate;
    protected $actionBy;
    protected $categories;
    protected $reportType;

    public function __construct($startDate, $endDate, $actionBy = null, $categories = [], $reportType = 'all')
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->actionBy = $actionBy;
        $this->categories = $categories;
        $this->reportType = $reportType;
    }

    public function query()
    {
        $query = Crf::with([
            'department', 
            'category', 
            'factor',
            'application_status', 
            'approver',
            'assigned_user'
        ])
        ->whereBetween('created_at', [$this->startDate, $this->endDate]);

        // Filter by action_by (vendor)
        if ($this->actionBy) {
            $query->where('assigned_to', $this->actionBy);
        }

        // Filter by categories
        if (!empty($this->categories)) {
            $query->whereIn('category_id', $this->categories);
        }

        // Filter by report type
        if ($this->reportType !== 'all') {
            switch ($this->reportType) {
                case 'pending':
                    $query->where('application_status_id', 1);
                    break;
                case 'in_progress':
                    $query->whereIn('application_status_id', [4, 5, 6, 7, 8]);
                    break;
                case 'completed':
                    $query->where('application_status_id', 9);
                    break;
            }
        }

        return $query->orderBy('created_at', 'desc');
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'NRIC',
            'Department',
            'Designation',
            'Ext & HP No',
            'Category',
            'Factor',
            'Issue',
            'Reason',
            'Status',
            'Assigned To',
            'Approved By',
            'Created At',
            'Updated At',
        ];
    }

    public function map($crf): array
    {
        return [
            $crf->id,
            $crf->fname,
            $crf->nric,
            $crf->department->dname ?? 'N/A',
            $crf->designation,
            $crf->extno,
            $crf->category->cname ?? 'N/A',
            $crf->factor->name ?? 'N/A',
            $crf->issue,
            $crf->reason ?? '-',
            $crf->application_status->status ?? 'N/A',
            $crf->assigned_user->name ?? '-',
            $crf->approver->name ?? '-',
            $crf->created_at->format('Y-m-d H:i:s'),
            $crf->updated_at->format('Y-m-d H:i:s'),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4A5568']
                ],
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF']
                ]
            ],
        ];
    }
}