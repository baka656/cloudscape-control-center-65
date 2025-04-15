
import { ValidationControl } from "@/types/validation-control";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { FileText, Check, X, Lightbulb, FileSearch } from "lucide-react";

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
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-semibold">Control ID</h4>
                <p className="text-sm text-muted-foreground">{control.id}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-semibold">Control Title</h4>
                <p className="text-sm text-muted-foreground">{control.title}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-semibold">Control Description</h4>
                <p className="text-sm text-muted-foreground">{control.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-start gap-2 mb-4">
            <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div>
              <h4 className="text-sm font-semibold">Evidence Expected</h4>
              <p className="text-sm text-muted-foreground">{control.evidenceExpected}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 mb-4">
            <Check className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div>
              <h4 className="text-sm font-semibold">Acceptable Examples</h4>
              <p className="text-sm text-muted-foreground">{control.acceptableExamples}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 mb-4">
            <X className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div>
              <h4 className="text-sm font-semibold">Bad Examples</h4>
              <p className="text-sm text-muted-foreground">{control.badExamples}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 mb-4">
            <Lightbulb className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div>
              <h4 className="text-sm font-semibold">Implementation Suggestions</h4>
              <p className="text-sm text-muted-foreground">
                {control.implementationSuggestions}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FileSearch className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div>
              <h4 className="text-sm font-semibold">Evidence Types</h4>
              <div className="flex gap-2 mt-1">
                {control.evidenceTypes.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Control ID</label>
              <Input {...form.register("id")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Control Title</label>
              <Input {...form.register("title")} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Control Description</label>
            <Textarea {...form.register("description")} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Evidence Expected</label>
            <Textarea {...form.register("evidenceExpected")} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Acceptable Examples</label>
            <Textarea {...form.register("acceptableExamples")} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Bad Examples</label>
            <Textarea {...form.register("badExamples")} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Implementation Suggestions</label>
            <Textarea {...form.register("implementationSuggestions")} />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="submit" variant="default">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
