
import { ValidationControl } from "@/types/validation-control";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

interface ControlDetailsProps {
  control: ValidationControl;
  mode: "view" | "edit";
}

export function ControlDetails({ control, mode }: ControlDetailsProps) {
  const form = useForm<ValidationControl>({
    defaultValues: control
  });

  if (mode === "view") {
    return (
      <div className="space-y-4">
        <div className="grid gap-4">
          <div>
            <h4 className="text-sm font-semibold mb-1">Control ID</h4>
            <p className="text-sm text-muted-foreground">{control.id}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-1">Title</h4>
            <p className="text-sm text-muted-foreground">{control.title}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-1">Description</h4>
            <p className="text-sm text-muted-foreground">{control.description}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-1">Expected Evidence</h4>
            <p className="text-sm text-muted-foreground">{control.evidenceExpected}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-1">Category</h4>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              {control.category}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Control ID</label>
            <Input {...form.register("id")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Title</label>
            <Input {...form.register("title")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Description</label>
            <Textarea {...form.register("description")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Expected Evidence</label>
            <Textarea {...form.register("evidenceExpected")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Category</label>
            <Input {...form.register("category")} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
