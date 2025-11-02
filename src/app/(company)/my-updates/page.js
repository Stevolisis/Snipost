"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import api from "@/utils/axiosConfig";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatPublishedDate } from "@/utils/formatPublishedDate";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const MyUpdates = () => {
  const dispatch = useAppDispatch();
  const { userData, jwtToken } = useAppSelector((state) => state.auth);
  const companyId = userData?._id; // Assuming user has company data
  const [updates, setUpdates] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateToDelete, setUpdateToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUpdates = async () => {
    if (!companyId) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/get-company-updates/${companyId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      setUpdates(response.data.updates || []);
    } catch (err) {
      console.error('Failed to fetch updates:', err);
      toast.error('Failed to load updates');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteClick = (id) => {
    setUpdateToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!updateToDelete) return;
    
    const loadingId = toast.loading("Deleting update...");
    try {
      const { data } = await api.delete(`/delete-update/${updateToDelete}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      await fetchUpdates();
      toast.success(data?.message || 'Update deleted successfully', { id: loadingId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete update', { id: loadingId });
    } finally {
      setDeleteDialogOpen(false);
      setUpdateToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUpdateToDelete(null);
  };

  const handleToggleSuspension = async (updateId, currentStatus) => {
    const loadingId = toast.loading(`${currentStatus ? "Unsuspending" : "Suspending"} update...`);
    try {
      const { data } = await api.patch(`/toggle-update-suspension/${updateId}`, {
        isSuspended: !currentStatus
      }, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      await fetchUpdates();
      toast.success(data?.message || `Update ${currentStatus ? "unsuspended" : "suspended"} successfully`, { id: loadingId });
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${currentStatus ? "unsuspend" : "suspend"} update`, { id: loadingId });
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, [companyId]);

  if (!companyId) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No company associated with your account.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your update
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ===== COMPANY UPDATES ===== */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            Company Updates
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading updates...</p>
            </div>
          ) : updates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No updates found.</p>
              <Link href="/create-update">
                <Button className="mt-4 bg-primary hover:bg-primary/90">
                  Create Your First Update
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Title</TableHead>
                  {/* <TableHead>Status</TableHead> */}
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right min-w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {updates.map((update, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium truncate max-w-[220px]" title={update.title}>
                      {update.title}
                    </TableCell>
                    {/* <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={update.isSuspended ? "destructive" : "default"}>
                          {update.isSuspended ? "Suspended" : "Active"}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleSuspension(update._id, update.isSuspended)}
                          className="h-6 text-xs"
                        >
                          {update.isSuspended ? "Unsuspend" : "Suspend"}
                        </Button>
                      </div>
                    </TableCell> */}
                    <TableCell>{formatPublishedDate(update.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/edit-update/${update.slug}`}>
                          <Button variant="outline" size="sm">Edit</Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteClick(update._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyUpdates;