import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const LanguageSelector = ({ value, onChange }: LanguageSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Language</Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex gap-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="auto" id="auto" />
          <Label htmlFor="auto" className="cursor-pointer font-normal">
            Auto-Detect
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="en" id="en" />
          <Label htmlFor="en" className="cursor-pointer font-normal">
            English
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="hi" id="hi" />
          <Label htmlFor="hi" className="cursor-pointer font-normal">
            Hindi
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
