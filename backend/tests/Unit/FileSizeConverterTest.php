<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class FileSizeConverterTest extends TestCase
{
    public function test_apakah_fungsi_konversi_bytes_menghasilkan_teks_yang_benar(): void
    {
        // 1. ARRANGE (Given): Siapkan input data biner kasar (bytes)
        $fileSizeA = 512000;   // 500 KB dalam bytes
        $fileSizeB = 10485760; // 10 MB dalam bytes

        // 2. ACT (When): Jalankan fungsi helper aplikasi Anda
        // (Simulasi rumus matematika di dalam fungsi helper)
        $resultA = formatBytesHelper($fileSizeA); // fungsi fiktif helper Anda
        $resultB = formatBytesHelper($fileSizeB);

        // 3. ASSERT (Then): Tegaskan kebenaran konversinya
        $this->assertEquals('500 KB', $resultA, "Harusnya 512000 bytes dikonversi menjadi '500 KB'");
        $this->assertEquals('10 MB', $resultB, "Harusnya 10485760 bytes dikonversi menjadi '10 MB'");
    }
}

// Fungsi dummy pelengkap agar test di atas tidak error saat dicoba jika helper asli Anda belum dibuat
function formatBytesHelper($bytes) {
    if ($bytes >= 1048576) return round($bytes / 1048576, 2) . ' MB';
    if ($bytes >= 1024) return round($bytes / 1024, 2) . ' KB';
    return $bytes . ' bytes';
}