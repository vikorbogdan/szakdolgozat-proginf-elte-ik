import { trpc } from "@/app/_trpc/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { User } from "@prisma/client";
import { Loader2, X } from "lucide-react";
import { useParams } from "next/navigation";

interface GroupDetailsMemberListRemoveAvatarButtonProps {
  user: User;
  isOwner: boolean;
}

const GroupDetailsMemberListRemoveAvatarButton = ({
  user,
  isOwner,
}: GroupDetailsMemberListRemoveAvatarButtonProps) => {
  const trpcUtils = trpc.useUtils();
  const groupId = useParams<{ id: string }>().id;
  const { data: groupData } = trpc.groups.getGroupById.useQuery(groupId);
  const { data: ownUserIdData, isLoading: isOwnUserIdLoading } =
    trpc.getOwnUserId.useQuery();
  const userId = ownUserIdData?.id;
  const {
    mutate: removeUserFromGroup,
    isLoading: isRemoveUserFromGroupLoading,
  } = trpc.groups.removeMemberFromGroup.useMutation({
    onSuccess: () => {
      console.log("Successfully removed user from group");
      trpcUtils.groups.getGroupById.invalidate(groupId);
    },
    onError: (err) => {
      console.log("Failed removing user from group: ", err);
    },
  });
  const handleRemoveUser = () => {
    removeUserFromGroup({
      groupId,
      userId: user.id,
    });
  };

  return (
    <Avatar className="group">
      {!isOwner && groupData?.ownerId === userId && (
        <AlertDialog>
          <AlertDialogTrigger className="cursor-pointer group-hover:opacity-100 opacity-0 transition-opacity bg-background/50 w-full items-center flex justify-center h-full absolute">
            <X className="w-5 h-5" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <h1>
                Are you sure you want to remove{" "}
                <span className="font-semibold">{user.name}</span> from the
                group?
              </h1>
            </AlertDialogHeader>
            <AlertDialogDescription>
              They will no longer be able to access the group informations, and
              any lessons associated with the group.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRemoveUser}
                className={buttonVariants({ variant: "destructive" })}
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {isRemoveUserFromGroupLoading && (
        <div className="absolute w-full h-full bg-background/50 flex items-center justify-center">
          <Loader2 className="animate-spin w-4 h-4" />
        </div>
      )}
      <AvatarImage src={user.image ?? ""} />
      <AvatarFallback>
        {user.name &&
          user.name
            .split(" ")
            .slice(0, 2)
            .map((name) => name[0])
            .join("")}
      </AvatarFallback>
    </Avatar>
  );
};

export default GroupDetailsMemberListRemoveAvatarButton;
