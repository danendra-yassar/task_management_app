<?php

namespace Database\Factories;

use App\Models\TaskComment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TaskComment>
 */
class TaskCommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'task_id' => \App\Models\Task::pluck('id')->random(),
            'user_id' => \App\Models\User::pluck('id')->random(),
            'comment' => $this->faker->sentence(),
        ];
    }
}
