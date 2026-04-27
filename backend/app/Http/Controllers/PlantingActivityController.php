<?php

namespace App\Http\Controllers;

use App\Models\PlantingActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PlantingActivityController extends Controller
{
    public function index()
    {
        $activities = PlantingActivity::with(['organization', 'couple', 'admin'])->get();
        return response()->json($activities);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'organization_id' => 'nullable|string|exists:organizations,id',
            'couple_id' => 'nullable|string|exists:couples,id',
            'location' => 'required|string|max:255',
            'expected_tree_count' => 'required|integer|min:1',
            'tree_species' => 'required|string|max:255',
            'scheduled_date' => 'required|date',
        ]);

        $activity = PlantingActivity::create([
            'id' => (string) Str::uuid(),
            'organization_id' => $validated['organization_id'] ?? null,
            'couple_id' => $validated['couple_id'] ?? null,
            'admin_id' => auth()->id(),
            'location' => $validated['location'],
            'expected_tree_count' => $validated['expected_tree_count'],
            'tree_species' => $validated['tree_species'],
            'scheduled_date' => $validated['scheduled_date'],
        ]);

        return response()->json($activity->load(['organization', 'couple', 'admin']), 201);
    }

    public function show($id)
    {
        $activity = PlantingActivity::with(['organization', 'couple', 'admin', 'trees'])->findOrFail($id);
        return response()->json($activity);
    }

    public function update(Request $request, $id)
    {
        $activity = PlantingActivity::findOrFail($id);

        $validated = $request->validate([
            'organization_id' => 'nullable|string|exists:organizations,id',
            'couple_id' => 'nullable|string|exists:couples,id',
            'location' => 'nullable|string|max:255',
            'expected_tree_count' => 'nullable|integer|min:1',
            'tree_species' => 'nullable|string|max:255',
            'scheduled_date' => 'nullable|date',
        ]);

        $activity->update($validated);

        return response()->json($activity->load(['organization', 'couple', 'admin']));
    }

    public function destroy($id)
    {
        $activity = PlantingActivity::findOrFail($id);
        $activity->delete();

        return response()->json(['message' => 'Planting activity deleted successfully']);
    }
}
