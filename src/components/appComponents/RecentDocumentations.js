"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
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
import { useState } from "react"
import { toast } from "sonner";
import api from "@/utils/axiosConfig"

export default function Recents({fetchSnippets, snippets, comments, docs, fetchDocs, jwtToken}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(''); // 'doc' or 'example'

  const handleDeleteClick = (id, type) => {
    setItemToDelete(id);
    setDeleteType(type);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete || !deleteType) return;
    
    const loadingId = toast.loading(`Deleting ${deleteType === 'doc' ? 'documentation' : 'code example'}...`);
    try {
      if (deleteType === 'doc') {
        const { data } = await api.delete(`/delete-documentation/${itemToDelete}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`
          }
        });
        await fetchDocs();
        toast.success(data?.message || 'Documentation deleted successfully', { id: loadingId });
      } else {
        const { data } = await api.delete(`/delete-snippet/${itemToDelete}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`
          }
        });
        await fetchSnippets();
        toast.success(data?.message || 'Code example deleted successfully', { id: loadingId });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to delete ${deleteType === 'doc' ? 'documentation' : 'code example'}`, { id: loadingId });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setDeleteType('');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    setDeleteType('');
  };

  const getDeleteMessage = () => {
    if (deleteType === 'doc') {
      return "This action cannot be undone. This will permanently delete your documentation and remove it from our servers.";
    } else {
      return "This action cannot be undone. This will permanently delete your code example and remove it from our servers.";
    }
  };

  return (
    <div className="py-8 space-y-8">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {getDeleteMessage()}
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
            📄 Recent Documentation
          </CardTitle>
          <Link href="/docs">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
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
                      <Link href={`/docs/edit/${doc?._id}`}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </Link>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteClick(doc?._id, 'doc')}
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

      {/* ===== TOP CODE EXAMPLES ===== */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            💻 Top Code Examples
          </CardTitle>
          <Link href="/examples">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
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
                        onClick={() => handleDeleteClick(item?._id, 'example')}
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

      {/* ===== RECENT COMMENTS ===== */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            💬 Recent Comments
          </CardTitle>
          <Link href="/comments">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right min-w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium truncate max-w-[180px]">{item?.author?.entity?.name}</TableCell>
                  <TableCell className="truncate max-w-[180px]" title={item?.contentRef?.entity?.title}>
                    {item?.contentRef?.entity?.title}
                  </TableCell>
                  <TableCell className="truncate max-w-[220px]" title={item?.text}>
                    {item?.text}
                  </TableCell>
                  <TableCell>{formatPublishedDate(item?.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/snippet/${item?.contentRef?.entity?._id}#${item?._id}`}>
                        <Button variant="default" size="sm">View</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}