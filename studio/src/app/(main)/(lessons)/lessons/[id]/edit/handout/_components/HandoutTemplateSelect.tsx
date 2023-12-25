import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SandpackPredefinedTemplate } from "@codesandbox/sandpack-react";

interface HandoutTemplateSelectProps {
  templateOptionsList: { name: string; label: string }[];
  disabled: boolean;
  value: string;
  onValueChange: (template: SandpackPredefinedTemplate) => any;
}

const HandoutTemplateSelect = ({
  templateOptionsList,
  disabled,
  value,
  onValueChange,
}: HandoutTemplateSelectProps) => {
  return (
    <Select disabled={disabled} value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Template" />
      </SelectTrigger>
      <SelectContent>
        {templateOptionsList.map((templateOption, idx) => (
          <SelectItem
            key={templateOption.name + idx}
            value={templateOption.name}
          >
            {templateOption.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default HandoutTemplateSelect;
