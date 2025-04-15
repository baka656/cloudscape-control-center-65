
import { ValidationControl } from "@/types/validation-control";

interface ControlDetailsProps {
  control: ValidationControl;
}

export function ControlDetails({ control }: ControlDetailsProps) {
  return (
    <div className="space-y-4 pt-4">
      <div>
        <h4 className="text-sm font-semibold">Description</h4>
        <p className="text-sm text-muted-foreground">{control.description}</p>
      </div>
      <div>
        <h4 className="text-sm font-semibold">Evidence Expected</h4>
        <p className="text-sm text-muted-foreground">{control.evidenceExpected}</p>
      </div>
      <div>
        <h4 className="text-sm font-semibold">Acceptable Examples</h4>
        <p className="text-sm text-muted-foreground">{control.acceptableExamples}</p>
      </div>
      <div>
        <h4 className="text-sm font-semibold">Bad Examples</h4>
        <p className="text-sm text-muted-foreground">{control.badExamples}</p>
      </div>
      <div>
        <h4 className="text-sm font-semibold">Implementation Suggestions</h4>
        <p className="text-sm text-muted-foreground">{control.implementationSuggestions}</p>
      </div>
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
  );
}
