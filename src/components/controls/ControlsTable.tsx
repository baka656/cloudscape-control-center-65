
import * as React from "react";
import { ValidationControl } from "@/types/validation-control";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileEdit, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ControlDetails } from "./ControlDetails";

interface ControlsTableProps {
  controls: ValidationControl[];
}

export function ControlsTable({ controls }: ControlsTableProps) {
  const [selectedControl, setSelectedControl] = React.useState<ValidationControl | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [mode, setMode] = React.useState<"view" | "edit">("view");

  const handleAction = (control: ValidationControl, actionMode: "view" | "edit") => {
    setSelectedControl(control);
    setMode(actionMode);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {controls.map((control) => (
              <TableRow key={control.id}>
                <TableCell className="font-medium">{control.id}</TableCell>
                <TableCell>{control.title}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                    {control.category}
                  </span>
                </TableCell>
                <TableCell className="max-w-md">
                  <p className="truncate text-sm text-muted-foreground">
                    {control.description}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAction(control, "view")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAction(control, "edit")}
                    >
                      <FileEdit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {mode === "view" ? "View Control Details" : "Edit Control"}
            </DialogTitle>
          </DialogHeader>
          {selectedControl && (
            <ControlDetails control={selectedControl} mode={mode} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
