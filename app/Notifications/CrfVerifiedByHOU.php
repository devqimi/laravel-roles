<?php

namespace App\Notifications;

use App\Models\Crf;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CrfVerifiedByHOU extends Notification
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
            'title' => 'CRF Verified by HOU - Awaiting Your Approval',
            'message' => 'Hardware Relocation CRF #' . $this->crf->id . ' has been verified by HOU and requires your approval',
            'action_url' => '/crfs/' . $this->crf->id,
            'type' => 'crf_verified_by_hou',
        ];
    }
}