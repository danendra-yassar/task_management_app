<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;


class Task extends Model
{
    use HasFactory;

    protected $guarded = []; // Allow mass assignment for all fields

    public function attachments()
    {
        // Parameter kedua adalah foreign key di tabel task_attachments
        return $this->hasMany(TaskAttachment::class, 'task_id', 'id');
    }

    public function assignedUsers()
    {
        // Mengubungkan Task ke User melalui tabel pivot task_user
        return $this->belongsToMany(User::class, 'task_user', 'task_id', 'user_id')
                    ->withPivot('status', 'finish_at', 'read_at');
    }
}
