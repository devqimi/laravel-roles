<?php

namespace app\Notifications;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;

class CrfCreated extends Notification
{
    use Queueable;

    public function __construct(
        public Crf $crf
    ) {}

    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable): array
    {
        return [
            'crf_id' => $this->crf->id,
            'title' => 'New CRF Created',
            'message' => "{$this->crf->fname} created a new CRF #{$this->crf->id}",
            'action_url' => route('crfs.show', $this->crf->id),
            'created_by' => $this->crf->fname,
            'type' => 'crf_created',
        ];
    }

    public function toBroadcast($notifiable): array
    {
        return [
            'crf_id' => $this->crf->id,
            'title' => 'New CRF Created',
            'message' => "{$this->crf->fname} created a new CRF #{$this->crf->id}",
            'action_url' => route('crfs.show', $this->crf->id),
            'created_by' => $this->crf->fname,
            'type' => 'crf_created',
        ];
    }
}