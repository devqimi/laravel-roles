<?php
// app/Notifications/CrfVerified.php

namespace App\Notifications;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CrfVerified extends Notification
{
    use Queueable;

    private $crf;

    public function __construct(Crf $crf)
    {
        $this->crf = $crf;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'crf_id' => $this->crf->id,
            'title' => 'CRF Verified by HOU',
            'message' => 'CRF #' . $this->crf->id . ' has been verified by HOU and requires acknowledgment',
            'action_url' => '/crfs/' . $this->crf->id,
            'type' => 'crf_verified',
        ];
    }
}