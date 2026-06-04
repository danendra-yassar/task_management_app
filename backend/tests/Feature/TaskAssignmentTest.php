<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TaskAssignmentTest extends TestCase
{
    use RefreshDatabase; // Bersihkan database otomatis setiap kali test berjalan

    /**
     * Menguji keamanan API: User biasa (Role 3) TIDAK BOLEH membuat tugas baru.
     */
    public function test_user_biasa_tidak_bisa_membuat_tugas_baru(): void
    {
        // 1. ARRANGE: Buat user dengan Privilege biasa (Role 3)
        $userBiasa = User::factory()->create(['role' => '3']);

        $payload = [
            'title' => 'Mencoba Bypass Sistem',
            'description' => 'Mencoba membuat tugas via postman',
            'priority' => 'high',
            'status' => 'pending',
            'assigned_user_ids' => [1]
        ];

        // 2. ACT: Tembak API store dengan bertindak sebagai User Biasa
        $response = $this->actingAs($userBiasa, 'sanctum')
                         ->postJson('/api/tasks', $payload);

        // 3. ASSERT: Harus ditolak dengan status HTTP 403 (Forbidden)
        $response->assertStatus(403);

        // Pastikan data fiktif di atas TIDAK masuk ke database tabel tasks
        $this->assertDatabaseMissing('tasks', [
            'title' => 'Mencoba Bypass Sistem'
        ]);
    }
}