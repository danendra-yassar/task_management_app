<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. create admin user
        \App\Models\User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin@example.com',
            'password' => bcrypt('admin1234'),
        ]);

        // 2. create 4 additional dummy users 
        \App\Models\User::factory(4)->create();

        // 3. create 15 dummy tasks
        \App\Models\Task::factory(15)->create();

        // 4. create 10 dummy task comments
        \App\Models\TaskComment::factory(10)->create();
        }
}
