
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ControlsSearchProps {
  onSearch: (value: string) => void;
}

export function ControlsSearch({ onSearch }: ControlsSearchProps) {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search controls..."
          className="pl-8"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <Button variant="outline">Filter</Button>
    </div>
  );
}
