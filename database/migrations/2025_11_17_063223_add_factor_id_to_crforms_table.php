<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('crforms', function (Blueprint $table) {
            // Add factor_id column after category_id (adjust position as needed)
            $table->foreignId('factor_id')
                  ->nullable()
                  ->after('category_id')
                  ->constrained('factors')
                  ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::table('crforms', function (Blueprint $table) {
            $table->dropForeign(['factor_id']);
            $table->dropColumn('factor_id');
        });
    }
};