<?php

namespace App\Http\Controllers;

use App\Models\MonitoringStaff;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class MonitoringStaffController extends Controller
{
    /**
     * Display a listing of monitoring staff.
     */
    public function index(Request $request)
    {
        $query = MonitoringStaff::query();

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('staff_id', 'like', "%{$search}%")
                  ->orWhere('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('contact_number', 'like', "%{$search}%");
            });
        }

        // Filter by gender
        if ($request->has('gender') && $request->gender) {
            $query->where('gender', $request->gender);
        }

        // Filter by task completion status
        if ($request->has('task_status') && $request->task_status) {
            switch ($request->task_status) {
                case 'no_tasks':
                    $query->where('total_tasks', 0);
                    break;
                case 'all_done':
                    $query->whereRaw('total_tasks > 0 AND done_tasks = total_tasks');
                    break;
                case 'in_progress':
                    $query->where('in_progress_tasks', '>', 0);
                    break;
                case 'has_pending':
                    $query->whereRaw('(total_tasks - done_tasks - in_progress_tasks) > 0');
                    break;
            }
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 10);
        $staff = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $staff,
        ]);
    }

    /**
     * Store a newly created monitoring staff.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'required|in:Male,Female',
            'contact_number' => 'required|string|max:20',
            'email' => 'nullable|email|unique:monitoring_staff,email',
            'password' => 'required|string|min:6',
        ]);

        // Auto-generate staff_id in format STF-XXX
        $lastStaff = MonitoringStaff::orderBy('id', 'desc')->first();
        $nextNumber = $lastStaff ? intval(substr($lastStaff->staff_id, 4)) + 1 : 1;
        $validated['staff_id'] = 'STF-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        $validated['total_tasks'] = 0;
        $validated['done_tasks'] = 0;
        $validated['in_progress_tasks'] = 0;
        $validated['password'] = Hash::make($validated['password']);

        $staff = MonitoringStaff::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Monitoring staff created successfully',
            'data' => $staff,
        ], 201);
    }

    /**
     * Display the specified monitoring staff.
     */
    public function show(string $id)
    {
        $staff = MonitoringStaff::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $staff,
        ]);
    }

    /**
     * Update the specified monitoring staff.
     */
    public function update(Request $request, string $id)
    {
        $staff = MonitoringStaff::findOrFail($id);

        $validated = $request->validate([
            'staff_id' => 'sometimes|string|unique:monitoring_staff,staff_id,' . $id,
            'first_name' => 'sometimes|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'gender' => 'sometimes|in:Male,Female',
            'contact_number' => 'sometimes|string|max:20',
            'email' => 'nullable|email|unique:monitoring_staff,email,' . $id,
        ]);

        $staff->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Monitoring staff updated successfully',
            'data' => $staff,
        ]);
    }

    /**
     * Remove the specified monitoring staff.
     */
    public function destroy(string $id)
    {
        $staff = MonitoringStaff::findOrFail($id);
        $staff->delete();

        return response()->json([
            'success' => true,
            'message' => 'Monitoring staff deleted successfully',
        ]);
    }

    /**
     * Get staff statistics
     */
    public function statistics()
    {
        $totalStaff = MonitoringStaff::count();
        $totalTasks = MonitoringStaff::sum('total_tasks');
        $doneTasks = MonitoringStaff::sum('done_tasks');
        $inProgressTasks = MonitoringStaff::sum('in_progress_tasks');

        return response()->json([
            'success' => true,
            'data' => [
                'total_staff' => $totalStaff,
                'total_tasks' => $totalTasks,
                'done_tasks' => $doneTasks,
                'in_progress_tasks' => $inProgressTasks,
            ],
        ]);
    }
}
