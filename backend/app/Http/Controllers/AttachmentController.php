<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\TaskAttachment;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    // 1. POST /api/tasks/{id}/attachments (Upload File)
    public function upload(Request $request, $taskId)
    {
        $task = Task::find($taskId);
        if (!$task) {
            return response()->json(['message' => 'Tugas tidak ditemukan.'], 404);
        }

        // validation: max size of file 20MB
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf,docx,xlsx,mp4,webm|max:20480',
        ]);

        if ($request->file('file')) {
            $file = $request->file('file');
            $originalName = $file->getClientOriginalName();
            $mimeType = $file->getClientMimeType();
            $fileSize = $file->getSize(); // dalam bytes

            // save file to link storage/app/public/attachments
            $filePath = $file->store('attachments', 'public');

            // save metadata to database tabel task_attachments
            $attachment = TaskAttachment::create([
                'task_id' => $task->id,
                'user_id' => $request->user()->id,
                'file_name' => $originalName,
                'file_path' => $filePath,
                'file_size' => $fileSize,
                'mime_type' => $mimeType,
            ]);

            return response()->json([
                'message' => 'Berkas berhasil diunggah.',
                'attachment' => $attachment
            ], 201);
        }

        return response()->json(['message' => 'Gagal mengunggah berkas.'], 400);
    }

    // 2. GET /api/attachments/{id}/download (Download File)
    public function download($id)
    {
        $attachment = TaskAttachment::find($id);
        if (!$attachment) {
            return response()->json(['message' => 'Berkas tidak ditemukan.'], 404);
        }

        $absolutePath = storage_path('app/public/' . $attachment->file_path);

        if (!file_exists($absolutePath)) {
            return response()->json(['message' => 'Fisik berkas tidak ditemukan di server.'], 404);
        }

        return response()->download($absolutePath, $attachment->file_name);
    }

    // 3. DELETE /api/attachments/{id} (Delete Attachment)
    public function destroy($id)
    {
        $attachment = TaskAttachment::find($id);
        if (!$attachment) {
            return response()->json(['message' => 'Berkas tidak ditemukan.'], 404);
        }

        // delete physical file from storage
        if (Storage::disk('public')->exists($attachment->file_path)) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        // delete data from database
        $attachment->delete();

        return response()->json(['message' => 'Berkas berhasil dihapus.'], 200);
    }
}
