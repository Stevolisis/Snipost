"use client"
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { updateUserData } from '@/lib/redux/slices/auth';
import api from '@/utils/axiosConfig';
import React, { useEffect } from 'react'
import { toast } from 'sonner';


const Dashboard = () => {
    const dispatch = useAppDispatch();
    const { userData, jwtToken } = useAppSelector((state) => state.auth)


    useEffect(()=>{
        if(jwtToken){
            const fetchUser = async()=>{
                const loadingId = toast.loading("Loading company data...");
                try{
                    const {data} = await api.get("/company/me",{
                        headers:{
                            Authorization:`Bearer ${jwtToken}`
                        }
                    });
                    dispatch(updateUserData(data.user));
                }catch(err){
                    console.log(err);
                    const msg = err.response?.data?.message || "Something went wrong. Please try again.";
                    toast.error(msg,{id:loadingId});
                }finally{
                    toast.dismiss(loadingId);
                }
            };

            fetchUser();
        }
    },[]);

    return (
        <div>
            {userData?.name}
        </div>
    )
}

export default Dashboard