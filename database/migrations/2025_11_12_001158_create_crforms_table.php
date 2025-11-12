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
        Schema::create('crforms', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('user_id')->nullable()->index('fk_crforms_users');
            $table->string('fname', 250);
            $table->string('nric', 15);
            $table->integer('department_id')->index('fk_crforms_departments');
            $table->string('designation', 250);
            $table->string('extno', 10)->nullable();
            $table->integer('category_id')->index('fk_crforms_categories');
            $table->string('issue', 250);
            $table->string('reason', 250)->nullable();
            $table->integer('application_status_id')->index('fk_crforms_application_statuses');
            $table->string('supporting_file', 50)->nullable();
            $table->integer('approved_by')->nullable();
            $table->integer('assigned_to')->nullable();
            $table->string('it_remark', 250)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crforms');
    }
};
