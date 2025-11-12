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
        Schema::create('crf_remarks', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->integer('crf_id')->index('idx_crf_id');
            $table->integer('user_id')->index('user_id');
            $table->text('remark');
            $table->string('status');
            $table->timestamp('created_at')->nullable()->index('idx_created_at');
            $table->timestamp('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crf_remarks');
    }
};
