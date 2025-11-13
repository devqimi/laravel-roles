<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCrfAttachmentsTable extends Migration
{
    public function up()
    {
        Schema::create('crf_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('crf_id')->constrained()->onDelete('cascade');
            $table->string('filename'); // original filename
            $table->string('path'); // storage path relative to disk root
            $table->string('mime')->nullable();
            $table->bigInteger('size')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('crf_attachments');
    }
}