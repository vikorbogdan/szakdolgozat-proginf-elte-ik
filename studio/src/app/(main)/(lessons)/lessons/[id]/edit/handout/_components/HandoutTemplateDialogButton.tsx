import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";

interface HandoutTemplateDialogButtonProps {
  isDisabled: boolean;
  handleUnlockTemplateChange: () => void;
}

const HandoutChangeTemplateDialogButton = ({
  isDisabled,
  handleUnlockTemplateChange,
}: HandoutTemplateDialogButtonProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="">
        <Button disabled={isDisabled}>Reset Handout</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Reset Handout</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to change the template? This will delete all
          your existing files in the handout.
        </AlertDialogDescription>
        <div className="flex gap-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleUnlockTemplateChange}
          >
            Reset Handout
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default HandoutChangeTemplateDialogButton;
