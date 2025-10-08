<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RequestForm;
use App\Models\Department;
use App\Models\Category;

class RequestFormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $requestForms = RequestForm::with('department')->get();
        $departments = Department::all();
        $categories = Category::all();
        return view('request_forms.index', compact('requestForms', 'departments', 'categories'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departments = Department::all();
        $categories = Category::all();
        return view('request_forms.create', compact('departments', 'categories'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'nric' => 'required',
            'department_id' => 'required|exists:departments,id',
            'designation' => 'required',
            'ext_hp_no' => 'required',
            'category_id' => 'required|exists:categories,id',
            'change_required' => 'required',
            'reason' => 'nullable',
        ]);

        RequestForm::create($request->all());

        return redirect()->route('request_forms.index')
            ->with('success', 'Request form submitted successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $requestForm = RequestForm::find($id);
        return view('request_forms.show', compact('requestForm'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $requestForm = RequestForm::find($id);
        $departments = Department::all();
        $categories = Category::all();
        return view('request_forms.edit', compact('requestForm', 'departments', 'categories'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required',
            'nric' => 'required',
            'department_id' => 'required|exists:departments,id',
            'designation' => 'required',
            'ext_hp_no' => 'required',
            'category_id' => 'required|exists:categories,id',
            'change_required' => 'required',
            'reason' => 'nullable',
        ]);

        $requestForm = RequestForm::find($id);
        $requestForm->update($request->all());

        return redirect()->route('request_forms.index')
            ->with('success', 'Request form updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $requestForm = RequestForm::find($id);
        $requestForm->delete();

        return redirect()->route('request_forms.index')
            ->with('success', 'Request form deleted successfully.');
    }
}
