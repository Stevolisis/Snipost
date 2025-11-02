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
import { loadSnippetsStart, loadSnippetsSuccess, snippetsFailure } from "@/lib/redux/slices/snippets";

const MyCodeExamples = () => {
  const dispatch = useAppDispatch();
  const { userData, jwtToken } = useAppSelector((state) => state.auth);
  const isOwner = userData?._id;
  const { snippets } = useAppSelector((state) => state.snippets);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exampleToDelete, setExampleToDelete] = useState(null);


  const fetchSnippets = async () => {
    try {
      dispatch(loadSnippetsStart())
      const response = await api.get(`/get-user-snippets/${isOwner}?limit=5000`)
      const snippets = response.data.snippets || []
      dispatch(loadSnippetsSuccess(snippets))
    } catch (err) {
      dispatch(snippetsFailure(err.message || 'Failed to load snippets'))
    }
  }
  
  const handleDeleteClick = (id) => {
    setExampleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!exampleToDelete) return;
    
    const loadingId = toast.loading("Deleting code example...");
    try {
      const { data } = await api.delete(`/delete-snippet/${exampleToDelete}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      await fetchSnippets();
      toast.success(data?.message || 'code example deleted successfully', { id: loadingId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete code example', { id: loadingId });
    } finally {
      setDeleteDialogOpen(false);
      setExampleToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setExampleToDelete(null);
  };

  useEffect(() => {
    fetchSnippets();
  }, [isOwner]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your code example
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

      {/* ===== RECENT code example ===== */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            Company Code Examples
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Title</TableHead>
                <TableHead>Forks</TableHead>
                <TableHead>Upvotes</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead className="text-right min-w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {snippets.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium truncate max-w-[220px]" title={item.title}>
                    {item.title}
                  </TableCell>
                  <TableCell>{item.forkCount}</TableCell>
                  <TableCell>{item.upvoteCount}</TableCell>
                  <TableCell>{item.visits.length}</TableCell>
                  <TableCell>{item.commentNo}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/edit-example/${item._id}`}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </Link>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteClick(item?._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyCodeExamples;