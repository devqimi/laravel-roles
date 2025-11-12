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
        Schema::table('crforms', function (Blueprint $table) {
            $table->foreign(['application_status_id'], 'FK_crforms_application_statuses')->references(['id'])->on('application_statuses')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['category_id'], 'FK_crforms_categories')->references(['id'])->on('categories')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['department_id'], 'FK_crforms_departments')->references(['id'])->on('departments')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['user_id'], 'FK_crforms_users')->references(['id'])->on('users')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('crforms', function (Blueprint $table) {
            $table->dropForeign('FK_crforms_application_statuses');
            $table->dropForeign('FK_crforms_categories');
            $table->dropForeign('FK_crforms_departments');
            $table->dropForeign('FK_crforms_users');
        });
    }
};
