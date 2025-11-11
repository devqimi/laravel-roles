// resources/js/components/NotificationBell.tsx
import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type Notification = {
    id: string;
    data: {
        title: string;
        message: string;
        action_url: string;
        type: string;
        crf_id: number;
    };
    read_at: string | null;
    created_at: string;
};

type NotificationsData = {
    unread_count: number;
    recent: Notification[];
};

export default function NotificationBell() {
    const { notifications } = usePage().props as unknown as { notifications: NotificationsData | null};
    const [unreadCount, setUnreadCount] = useState(notifications?.unread_count || 0);
    const [notificationList, setNotificationList] = useState<Notification[]>(
        notifications?.recent || []
    );
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setUnreadCount(notifications?.unread_count || 0);
        setNotificationList(notifications?.recent || []);
    }, [notifications]);

    const markAsRead = async (notification: Notification) => {
        try {
            // Use Inertia router for CSRF handling
            router.post(`/notifications/${notification.id}/read`, {}, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                    setNotificationList(prev => 
                        prev.map(n => 
                            n.id === notification.id 
                                ? { ...n, read_at: new Date().toISOString() }
                                : n
                        )
                    );
                    
                    // Navigate to the CRF page
                    router.visit(notification.data.action_url);
                },
                onError: (error) => {
                    console.error('Failed to mark notification as read:', error);
                    toast.error('Failed to mark notification as read');
                }
            });
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            toast.error('Failed to mark notification as read');
        }
    };

    const markAllAsRead = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isLoading) return;
        
        setIsLoading(true);

        try {
            // Use Inertia router for CSRF handling
            router.post('/notifications/read-all', {}, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setUnreadCount(0);
                    setNotificationList(prev => 
                        prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
                    );
                    
                    toast.success('All notifications marked as read');
                    
                    // Reload notifications
                    setTimeout(() => {
                        router.reload({ only: ['notifications'] });
                        setIsLoading(false);
                    }, 500);
                },
                onError: (error) => {
                    console.error('Failed to mark all notifications as read:', error);
                    setIsLoading(false);
                    toast.error('Failed to mark all notifications as read');
                }
            });
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
            setIsLoading(false);
            toast.error('Failed to mark all notifications as read');
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        
        return date.toLocaleDateString('en-MY', { 
            month: 'short', 
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge 
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                            variant="destructive"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-4 py-2 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            disabled={isLoading}
                            className="text-xs h-7"
                        >
                            {isLoading ? 'Marking...' : 'Mark all as read'}
                        </Button>
                    )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {notificationList.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                            <Bell className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500">No notifications yet</p>
                        </div>
                    ) : (
                        notificationList.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`px-4 py-3 cursor-pointer border-b last:border-b-0 ${
                                    !notification.read_at ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                                }`}
                                onClick={() => markAsRead(notification)}
                            >
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="font-medium text-sm">
                                            {notification.data.title}
                                        </p>
                                        {!notification.read_at && (
                                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        {notification.data.message}
                                    </p>
                                    <div className="mt-2">
                                        <span className="text-xs text-blue-600 font-medium">
                                            Click to view →
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                        {formatTimeAgo(notification.created_at)}
                                    </span>
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}