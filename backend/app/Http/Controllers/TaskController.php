<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // 1. GET /api/tasks (using pagination, filtering, dan sorting)
    public function index(Request $request)
    {
        // initialize query from model task
        $user = $request->user();
        $query = Task::query()->with(['attachments', 'assignedUsers']);

        // only show tasks that are assigned to the user (for role 3) or created by the user (for role 2)
        if ($user->role === '3') {
            $query->whereHas('assignedUsers', function($q) use ($user) {
                $q->where('users.id', $user->id);
            });
        } 
        
        if ($request->has('status')) {
        $statusFilter = $request->status;

        if ($user->role === '3') {
            // role user using pivot data
            $query->whereHas('assignedUsers', function($q) use ($user, $statusFilter) {
                $q->where('users.id', $user->id);
                if ($statusFilter === 'pending') {
                    // status awal bernilai null yang berarti 'pending'
                    $q->whereNull('task_user.status');
                } else {
                    $q->where('task_user.status', $statusFilter);
                }
            });
        } else {
            $query->where('status', $statusFilter);
        }
    }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        // feature based on keyword searching
        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // feature sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // feature pagination
        $tasks = $query->with(['attachments', 'assignedUsers'])->paginate($request->get('per_page', 6));

        return response()->json($tasks, 200);
    }

    // 2. POST /api/tasks (Create Task)
    public function store(Request $request)
    {

        if (!in_array($request->user()->role, ['1', '2'])) {
            return response()->json(['message' => 'Forbidden. Hanya Admin atau Instructor yang dapat membuat tugas.'], 403);
        }
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string',
            'priority' => 'required|string',
            'due_date' => 'nullable|date',
            'assigned_user_ids' => 'required|array',
            'assigned_user_ids.*' => 'exists:users,id'
        ]);

        // automatically set the created_by field to the authenticated user's ID
        $validated['created_by'] = $request->user()->id;

        // create task in database
        //$task = Task::create($validated);
        $task = Task::create(\Illuminate\Support\Arr::except($validated, ['assigned_user_ids']));

        $task->assignedUsers()->sync($validated['assigned_user_ids']);

        // dispatch queue job to send notification to assigned user
        \App\Jobs\SendTaskNotification::dispatch($task);

        return response()->json([
            'message' => 'Task created successfully.',
            'task' => $task->load('assignedUsers')
        ], 201);
    }
    
    // 3. PUT /api/tasks/{id} (Update Task)
    public function update(Request $request, $id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task Not Found.'], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|string',
            'priority' => 'sometimes|required|string',
            'assigned_user_ids' => 'sometimes|array',
            'assigned_user_ids.*' => 'exists:users,id',
            'due_date' => 'nullable|date',
        ]);

        $task->update($validated);

        $task->load(['attachments', 'assignedUsers']);

        return response()->json([
            'message' => 'Task updated successfully.',
            'task' => $task 
        ], 200);
    }

    public function show(Request $request, $id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Tugas tidak ditemukan.'], 404);
        }

        $task->load(['assignedUsers', 'attachments']);

        return response()->json([
            'task' => $task
        ], 200);
    }

    // 5. POST /api/tasks/{id}/toggle-progress
    public function toggleProgress(Request $request, $id)
    {
        $user = $request->user();
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task tidak ditemukan.'], 404);
        }

        // Ambil data status saat ini di tabel pivot
        $pivotData = \DB::table('task_user')
            ->where('task_id', $task->id)
            ->where('user_id', $user->id)
            ->first();

        if (!$pivotData) {
            return response()->json(['message' => 'Anda tidak ditugaskan pada pekerjaan ini.'], 403);
        }

        $newStatus = $request->status;
        $updatePayload = ['status' => $newStatus];

        if ($newStatus === 'completed') {
            $updatePayload['finish_at'] = now();
        } 
        // Jika status awalnya null dan dibuka pertama kali, ubah jadi in_progress
        elseif ($newStatus === 'in_progress' && is_null($pivotData->status)) {
            $updatePayload['read_at'] = now();
        } else {
            // Jika sudah in_progress dibuka lagi, abaikan agar tidak reset status
            if ($newStatus === 'in_progress' && $pivotData->status === 'completed') {
                unset($updatePayload['status']);
            }
        }

        // Eksekusi update data ke tabel pivot task_user
        if (!empty($updatePayload)) {
            $task->assignedUsers()->updateExistingPivot($user->id, $updatePayload);
        }

        return response()->json([
            'message' => 'Progress berhasil diperbarui.',
            'task' => $task->load(['attachments', 'assignedUsers'])
        ], 200);
    }

    // 4. DELETE /api/tasks/{id} (Delete Task)
    public function destroy($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found.'], 404);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully.'], 200);
    }
}