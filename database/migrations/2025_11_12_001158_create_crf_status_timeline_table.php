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
        Schema::create('crf_status_timeline', function (Blueprint $table) {
            $table->bigInteger('id', true);
            $table->integer('crf_id');
            $table->integer('user_id')->nullable()->index('user_id');
            $table->string('status');
            $table->text('remark')->nullable();
            $table->string('action_type', 50)->index('idx_action_type')->comment('status_change, remark_added, remark_updated');
            $table->timestamps();

            $table->index(['crf_id', 'created_at'], 'idx_crf_timeline');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crf_status_timeline');
    }
};
