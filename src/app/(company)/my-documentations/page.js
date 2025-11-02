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

const MyDocumentaions = () => {
  const dispatch = useAppDispatch();
  const { userData, jwtToken } = useAppSelector((state) => state.auth);
  const isOwner = userData?._id;
  const [docs, setDocs] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  const fetchDocs = async () => {
    if (!isOwner) return
    
    try {
      const response = await api.get(`get-my-documentations`,{
        headers:{
          Authorization: `Bearer ${jwtToken}`
        }
      })
      setDocs(response.data.documentations || []);
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
      toast.error('Failed to load transaction history')
    }
  }

  const handleDeleteClick = (id) => {
    setDocToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!docToDelete) return;
    
    const loadingId = toast.loading("Deleting documentation...");
    try {
      const { data } = await api.delete(`/delete-documentation/${docToDelete}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      await fetchDocs();
      toast.success(data?.message || 'Documentation deleted successfully', { id: loadingId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete documentation', { id: loadingId });
    } finally {
      setDeleteDialogOpen(false);
      setDocToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDocToDelete(null);
  };

  useEffect(() => {
    fetchDocs();
  }, [isOwner]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your documentation
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

      {/* ===== RECENT DOCUMENTATION ===== */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            Company Documentations
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right min-w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((doc, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium truncate max-w-[220px]" title={doc?.title}>
                    {doc?.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant={doc?.status === "Published" ? "default" : "secondary"}>
                      {doc?.status || "Published"}
                    </Badge>
                  </TableCell>
                  <TableCell>{doc?.views}</TableCell>
                  <TableCell>{formatPublishedDate(doc?.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/edit-documentation/${doc.slug}`}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </Link>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteClick(doc?._id)}
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

export default MyDocumentaions;