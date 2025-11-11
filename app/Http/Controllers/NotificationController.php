<?php
// app/Http/Controllers/NotificationController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $notifications = $user->notifications
            ->take(50);

        return response()->json($notifications);
    }

    public function markAsRead($id)
    {
        $user = Auth::user();
        
        if (!$user) {
            abort(403, 'Unauthenticated');
        }

        try {
            $notification = $user->notifications->where('id', $id)->first();
            
            if (!$notification) {
                abort(404, 'Notification not found');
            }

            $notification->markAsRead();

            // Return back instead of JSON for Inertia
            return redirect()->back();

        } catch (\Exception $e) {
            Log::error('Failed to mark notification as read: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to mark notification as read');
        }
    }

    public function markAllAsRead(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            abort(403, 'Unauthenticated');
        }

        try {

            DB::beginTransaction();
            
            // Get unread notifications
            $unreadNotifications = $user->unreadNotifications;
            $unreadCount = $unreadNotifications->count();
            
            // Mark all as read
            foreach ($unreadNotifications as $notification) {
                $notification->markAsRead();
            }

            DB::commit();

            Log::info("Marked {$unreadCount} notifications as read for user {$user->id}");

            // Return back instead of JSON for Inertia
            return redirect()->back()->with('success', 'All notifications marked as read');
            
        } catch (\Exception $e) {

            Log::error('Failed to mark all notifications as read: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to mark all notifications as read');
        }
    }

    public function unreadCount()
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $count = $user->unreadNotifications->count();

        return response()->json(['count' => $count]);
    }
}