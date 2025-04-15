
import * as React from "react";
import { ValidationControl } from "@/types/validation-control";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileEdit, Eye, Trash2 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ControlDetails } from "./ControlDetails";

interface ControlsTableProps {
  controls: ValidationControl[];
}

export function ControlsTable({ controls }: ControlsTableProps) {
  const [expandedControl, setExpandedControl] = React.useState<string | null>(null);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {controls.map((control) => (
            <TableRow key={control.id}>
              <TableCell className="font-medium">{control.id}</TableCell>
              <TableCell>
                <Collapsible
                  open={expandedControl === control.id}
                  onOpenChange={() => setExpandedControl(expandedControl === control.id ? null : control.id)}
                >
                  <CollapsibleTrigger className="font-medium hover:underline">
                    {control.title}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ControlDetails control={control} />
                  </CollapsibleContent>
                </Collapsible>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  {control.category}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <FileEdit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
