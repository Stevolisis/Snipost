"use client"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Check, Trash2, Bell, ExternalLink, User, Megaphone } from "lucide-react"
import api from "@/utils/axiosConfig"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { deleteNotificationSuccess, loadNotificationsFailure, loadNotificationsStart, loadNotificationsSuccess, markAllAsRead } from "@/lib/redux/slices/notifications"
import Link from "next/link"
import { toast } from "sonner"

export default function NotificationPage() {
    const { notifications, unreadCount, loading } = useAppSelector((state) => state.notifications)
    const { jwtToken, userData } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    
    const fetchNotifications = async () => {
        try {
            dispatch(loadNotificationsStart())
            const response = await api.get("/get-notifications",{
                headers:{
                    Authorization: `Bearer ${jwtToken}`
                }
            })
            dispatch(loadNotificationsSuccess(response.data));
        } catch (err) {
            dispatch(loadNotificationsFailure(err?.response?.data?.message || "Failed to load notifications"));
        } 
    }

    const markAllRead = async () => {
        toast.promise(
            api.patch("/read-all", {}, {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
            }),
            {
            loading: "Marking all as read...",
            success: () => {
                dispatch(markAllAsRead());
                return "All notifications marked as read";
            },
            error: (err) => {
                return err?.response?.data?.message || "Failed to mark all as read";
            }
            }
        );
    };

    const deleteNotification = async (id) => {
        toast.promise(
            api.delete(`/delete-notification/${id}`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
            }),
            {
            loading: "Deleting notification...",
            success: () => {
                dispatch(deleteNotificationSuccess(id));
                return "Notification deleted successfully";
            },
            error: (err) => {
                console.error("Delete failed", err);
                return err?.response?.data?.message || "Failed to delete notification";
            }
            }
        );
    };

  useEffect(() => {
    fetchNotifications()
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="block items-center justify-between sm:flex">
        <div>
          <h1 className="text-2xl sm:text-xl font-semibold">Notifications</h1>
        </div>
        
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <Badge variant={unreadCount > 0 ? "default" : "secondary"} className=''>
            {unreadCount} unread
          </Badge>
          
          <Button 
            onClick={markAllRead} 
            disabled={unreadCount === 0}
            variant="outline"
            size="sm"
            className=''
          >
            <Check className="w-4 h-4 mr-1" />
            <span className="">Mark all as read</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notifications?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              When you have new notifications, they'll appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications?.map(n => (
            <Card 
              key={n?._id} 
              className={cn(
                "group transition-colors hover:bg-muted/30 bg-transparent",
                !n?.isRead && "bg-muted/20 border-l-4 border-l-primary"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {/* Notification indicator */}
                    <div className="flex items-center space-x-2">
                        <div className=" rounded-full bg-primary/10 p-2 mr-3">
                            {
                                n?.type === "system_announcement" 
                                ? <Megaphone className="h-4 w-4 text-primary" />
                                : <Bell className="h-4 w-4 text-primary" />
                            }
                        </div>

                    </div>
                    
                    <div className="flex-1 space-y-2 -ml-3">                
                      <div className="flex gap-x-4">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={n?.meta?.avatar} />
                                    <AvatarFallback>
                                    <User className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>

                            {/* Main notification text */}
                            <div className="space-y-1">
                                <p className={cn(
                                    "text-base leading-relaxed",
                                    !n?.isRead && "font-medium"
                                    )}>
                                    {n?.message?.title}
                                </p>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {n?.message?.description?.replace(/[%*`]/g, '') || ''}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(n?.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        
                        {/* Link preview card */}
                        {n.link && (
                            <Link href={n.link}>
                                <Card className="bg-muted/40 border-muted mt-6">
                                    <CardContent className="p-3">
                                        <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium truncate">
                                            Related Content
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                            Click to view details
                                            </p>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0"
                                            asChild
                                        >
                                        <ExternalLink className="h-5! w-5!" />
                                        </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        )}
                        
                        </div>
                    </div>
                    {/* Delete button */}
                    {n?.recipient?.entity._id === userData._id && <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteNotification(n._id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-100 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}