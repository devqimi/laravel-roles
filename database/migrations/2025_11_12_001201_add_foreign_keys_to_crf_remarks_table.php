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
        Schema::table('crf_remarks', function (Blueprint $table) {
            $table->foreign(['crf_id'], 'crf_remarks_ibfk_1')->references(['id'])->on('crforms')->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['user_id'], 'crf_remarks_ibfk_2')->references(['id'])->on('users')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('crf_remarks', function (Blueprint $table) {
            $table->dropForeign('crf_remarks_ibfk_1');
            $table->dropForeign('crf_remarks_ibfk_2');
        });
    }
};
