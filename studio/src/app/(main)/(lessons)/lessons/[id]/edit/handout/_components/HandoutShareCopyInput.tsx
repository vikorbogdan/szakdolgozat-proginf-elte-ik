import CopyButton from "@/components/CopyButton";
import { Input } from "@/components/ui/input";

interface HandoutShareCopyInputProps {
  url: string;
}

const HandoutShareCopyInput = ({ url }: HandoutShareCopyInputProps) => {
  return (
    <div className="flex items-center">
      <Input className="max-w-xl" value={url}></Input>
      <CopyButton text={url} />
    </div>
  );
};

export default HandoutShareCopyInput;
