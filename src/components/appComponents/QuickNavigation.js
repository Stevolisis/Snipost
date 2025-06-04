import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { loadNotificationsFailure, loadNotificationsStart, loadNotificationsSuccess } from '@/lib/redux/slices/notifications';
import { Award, Bell, Home, Presentation, Users2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const QuickNavigation = () => {
    const { userData, jwtToken } = useAppSelector((state) => state.auth);
    const { unreadCount } = useAppSelector((state) => state.notifications);
    const dispatch = useAppDispatch()

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
    // Fetch unread notifications count
    useEffect(() => {
        if (userData?._id) {
            fetchNotifications();
        }
    }, [userData?._id]);

    const navigationItems = [
        { name: "Snip Devs", url: "/snipdevs", icon: Users2 },
        { name: "Snap Editor", url: "/snap-editor", icon: Presentation },
        { name: "My Feed", url: "/feed/snippets", icon: Home },
        { name: "Achievements", url: `/profile/${userData?._id}/achievements`, icon: Award },
        { 
            name: "Notification", 
            url: "/notifications", 
            icon: Bell,
            unread: unreadCount > 0 ? unreadCount : null
        }
    ];

    return (
        <div className='w-full flex justify-center items-center gap-x-3 -mt-3 mb-2'>
            {navigationItems.map((item, index) => (
                <div key={index} className="flex justify-center items-center flex-col relative">
                    <Link href={item.url} className="flex flex-col items-center gap-2 p-2">
                        <div className='aspect-square size-12 flex items-center justify-center rounded-full hover:text-primary bg-zinc-800 hover:bg-zinc-700 transition-colors duration-150'>
                            <item.icon className="h-4 w-4" />
                            {/* Notification Badge */}
                            {item.unread && (
                                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
                                    {item.unread > 9 ? '9+' : item.unread}
                                </span>
                            )}
                        </div>
                    </Link>    
                    <span className="text-[11px] text-muted-foreground">{item.name}</span>
                </div>
            ))}
        </div>
    );
}

export default QuickNavigation;