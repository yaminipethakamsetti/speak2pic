import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const PromptEditor = ({ value, onChange }: PromptEditorProps) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="prompt" className="text-sm font-medium">
        Refine Your Prompt
      </Label>
      <Textarea
        id="prompt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your transcribed text will appear here. Edit it to refine your image prompt..."
        className="min-h-[150px] resize-none"
      />
    </div>
  );
};
