"use client"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Check, Trash2, Bell, ExternalLink, User } from "lucide-react"
import api from "@/utils/axiosConfig"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { loadNotificationsFailure, loadNotificationsStart, markAllAsRead } from "@/lib/redux/slices/notifications"
import Link from "next/link"
import { toast } from "sonner"

export default function NotificationPage() {
    const { notifications, unreadCount, loading, error } = useAppSelector((state) => state.notifications)
    const { jwtToken } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    
    const fetchNotifications = async () => {
        try {
            dispatch(loadNotificationsStart())
            const res = await api.get("/get-notifications",{
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
        try {
            await api.patch("/read-all",{},{
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            dispatch(markAllAsRead());
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to mark all as read");
        }
    }

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
      ) : notifications.length === 0 ? (
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
          {notifications.map(n => (
            <Card 
              key={n._id} 
              className={cn(
                "group transition-colors hover:bg-muted/30",
                !n.isRead && "bg-muted/20 border-l-4 border-l-primary"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {/* Notification indicator */}
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-primary" />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={n?.recipient.entity.avatar.url} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      {/* Main notification text */}
                      <div className="space-y-1">
                        <p className={cn(
                          "text-sm leading-relaxed",
                          !n.isRead && "font-medium"
                        )}>
                          {n.message}
                        </p>
                        
                        <p className="text-xs text-muted-foreground">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                      
                      {/* Link preview card */}
                      {n.link && (
                        <Card className="bg-muted/40 border-muted">
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
                                <Link href={n.link}>
                                  <ExternalLink className="h-3 w-3" />
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}