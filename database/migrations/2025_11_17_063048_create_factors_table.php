<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('factors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        // Insert default factors
        DB::table('factors')->insert([
            ['name' => 'User factor', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Setup Request', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Access Request', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Network Equipment', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'ICT Equipment', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Relocation Request', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Data Extraction', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Others', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('factors');
    }
};