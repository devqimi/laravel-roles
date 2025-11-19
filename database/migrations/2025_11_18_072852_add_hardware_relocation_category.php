<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Get the current 'Hardware' category ID
        $hardwareCategory = DB::table('categories')
            ->where('cname', 'Hardware')
            ->first();

        if ($hardwareCategory) {
            // Insert the new category after Hardware
            DB::table('categories')->insert([
                'id' => 5,
                'cname' => 'Hardware Relocation',
            ]);
        } else {
            // If Hardware doesn't exist, just insert it
            DB::table('categories')->insert([
                'id' => 5,
                'cname' => 'Hardware Relocation',
            ]);
        }
    }

    public function down(): void
    {
        DB::table('categories')
            ->where('cname', 'Hardware Relocation')
            ->delete();
    }
};