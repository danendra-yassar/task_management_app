<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class UserTaskProgressTest extends TestCase
{
    /**
     * Menguji logika penentu label status pengerjaan user.
     */
    public function test_logika_penentu_label_status_pivot(): void
    {
        // 1. ARRANGE (Given) simulation
        $statusNull = null;
        $statusProgress = 'in_progress';
        $statusComplete = 'completed';

        // 2. ACT (When) running the simulation logic to get labels
        $labelA = $this->getTaskLabel($statusNull);
        $labelB = $this->getTaskLabel($statusProgress);
        $labelC = $this->getTaskLabel($statusComplete);

        // 3. ASSERT (Then) verifying the expected labels match the actual labels
        $this->assertEquals('⏰ Belum Dibuka', $labelA);
        $this->assertEquals('⚡ In Progress', $labelB);
        $this->assertEquals('✓ Selesai', $labelC);
    }

    /**
     * Ini adalah contoh fungsi logika internal yang diuji (terisolasi)
     */
    private function getTaskLabel(?string $status): string
    {
        if ($status === 'completed') return '✓ Selesai';
        if ($status === 'in_progress') return '⚡ In Progress';
        return '⏰ Belum Dibuka';
    }
}
