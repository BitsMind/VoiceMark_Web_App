"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Download, MoreHorizontal, Pause, Play } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MyFormData } from "@/types/table";

interface ColumnActions {
  onEdit?: (data: MyFormData) => void;
  onDelete?: (id: string) => void;
}

export const createColumns = (
  togglePlay: (file: MyFormData) => void,
  playingId: string | null,
  handleDownload: (id: string) => void
): ColumnDef<MyFormData>[] => {
  const columns: ColumnDef<MyFormData>[] = [
    {
      accessorKey: "fileName",
      header: "File Name",
    },
    {
      accessorKey: "format",
      header: "Format",
    },
    {
      accessorKey: "fileSize",
      header: "Size",
      cell: ({ row }) =>
        `${(row.original.fileSize / 1024 / 1024).toFixed(2)} MB`,
    },
    {
      id: "play/download",
      header: "Play/Download",
      cell: ({ row }) => {
        const file = row.original;
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => togglePlay(file)}
            >
              {playingId === file.filePath ? (
                <>
                  <Pause className="w-4 h-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Play
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleDownload(file.id)}
            >
              <Download className="w-4 h-4" /> Download
            </Button>
          </div>
        );
      },
    },
  ];

  columns.push({
    id: "actions",
    cell: ({ row, table }) => {
      const record = row.original;
      const { onEdit, onDelete } = table.options.meta as {
        onEdit?: (data: MyFormData) => void;
        onDelete?: (id: string) => void;
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(record)}>
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={() => onDelete(record.id)}>
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  });

  return columns;
};
