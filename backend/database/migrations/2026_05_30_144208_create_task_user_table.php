<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        
        Schema::create('task_user', function (Blueprint $table) {
            $table->id();
            
            // Menggunakan foreignId yang otomatis sinkron dengan tipe BigInt unsigned milik tabel induk
            // cascadeOnDelete() memastikan jika task/user dihapus, data di tabel pivot ini ikut bersih
            $table->foreignId('task_id')->constrained('tasks')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('assigned_at')->useCurrent(); 
            $table->timestamp('read_at')->nullable(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_user');
    }
};
