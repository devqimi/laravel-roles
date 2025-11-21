<?php

namespace App\Http\Controllers;

use App\Exports\CrfExport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function exportCrf(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'action_by' => 'nullable|integer',
            'categories' => 'nullable|string',
            'report_type' => 'nullable|in:all,pending,in_progress,completed',
        ]);

        $startDate = Carbon::parse($request->start_date)->startOfDay();
        $endDate = Carbon::parse($request->end_date)->endOfDay();
        $actionBy = $request->action_by;
        $categories = $request->categories ? explode(',', $request->categories) : [];
        $reportType = $request->report_type ?? 'all';

        $filename = 'CRF_Report_' . $startDate->format('Y-m-d') . '_to_' . $endDate->format('Y-m-d') . '.xlsx';

        return Excel::download(
            new CrfExport($startDate, $endDate, $actionBy, $categories, $reportType),
            $filename
        );
    }
}