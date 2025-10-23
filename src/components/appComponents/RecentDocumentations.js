"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { formatPublishedDate } from "@/utils/formatPublishedDate";

export default function Recents({snippets, comments, docs, deleteDocs}) {


  return (
    <div className="py-8 space-y-8">
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
                      <Link href={`/docs/edit/${i}`}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={()=>deleteDocs(doc?._id)}>Delete</Button>
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
                      {/* <Link href={`/examples/edit/${i}`}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </Link> */}
                      <Link href={`/snippet/${item._id}`}>
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
                      {/* <Link href={`/comments/reply/${i}`}>
                        <Button variant="outline" size="sm">Reply</Button>
                      </Link> */}
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
