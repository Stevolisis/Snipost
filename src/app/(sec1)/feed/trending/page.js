"use client"
import api from '@/utils/axiosConfig';
import React, { useEffect } from 'react'
import {
  snippetsFailure,
  loadSnippetsStart,
  loadSnippetsSuccess
} from '@/lib/redux/slices/snippets';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import SnipCard from '@/components/appComponents/SnipCard';
import { Skeleton } from '@/components/ui/skeleton';

const page = () => {
  const dispatch = useAppDispatch();
  const { snippets = [], isLoading, error } = useAppSelector((state) => state.snippets);
  const { userData, jwtToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchTrendingSnippets = async () => {
      try {
        dispatch(loadSnippetsStart());
        const response = await api.get('/get-recommended-snippets?timeRange=month&limit=10',{
            headers:{
                Authorization: `Bearer ${jwtToken}`
            }
        });
        const snippets = response.data.snippets || [];
        dispatch(loadSnippetsSuccess(snippets));
      } catch (err) {
        if (err.response?.status === 401) {
          // Handle unauthorized error
          dispatch(disconnectWallet());
          disconnect();
          toast("Uh oh! Something went wrong.", {
            description: "Connect your wallet"
          });
          return
        }
        dispatch(snippetsFailure(err.message || 'Failed to load snippets'));
      }
    };

    fetchTrendingSnippets();
  }, [dispatch, userData?._id]);



  if (isLoading && snippets.length === 0) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 w-full px-4 py-4'>
          <Skeleton className="h-[460px] w-full hover:shadow-md hover:border-gray-600 transition-colors duration-200" />
          <Skeleton className="h-[460px] w-full hover:shadow-md hover:border-gray-600 transition-colors duration-200" />

          <Skeleton className="h-[460px] w-full hover:shadow-md hover:border-gray-600 transition-colors duration-200" />
          <Skeleton className="h-[460px] w-full hover:shadow-md hover:border-gray-600 transition-colors duration-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 py-4">
        <p>Error loading snippets: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {snippets.map((snippet) => {

          return (<SnipCard snippet={snippet} key={snippet._id} />);
        })}
      </div>
    </div>
  )
}

export default page;