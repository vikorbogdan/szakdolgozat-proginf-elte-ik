import { trpc } from "@/app/_trpc/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { set } from "zod";

interface GroupDetailsAddMemberDialogUserDetailsProps {
  email: string;
  closeDialog: () => void;
}

const GroupDetailsAddMemberDialogUserDetails = ({
  email,
  closeDialog,
}: GroupDetailsAddMemberDialogUserDetailsProps) => {
  const groupId = useParams<{ id: string }>().id;
  const trpcUtils = trpc.useUtils();
  const [error, setError] = useState<string | null>(null);
  const {
    data: userPublicData,
    isLoading: isUserPublicDataLoading,
    isError: isUserPublicDataError,
    error: userPublicDataError,
  } = trpc.getPublicDataByUserEmail.useQuery(email);
  const { mutate: addUserToGroupMutation, isLoading: isAddUserToGroupLoading } =
    trpc.groups.addMemberToGroupByEmail.useMutation({
      onSuccess: () => {
        console.log("Successfully added user to group");
        trpcUtils.groups.getGroupById.invalidate(groupId);
        closeDialog();
      },
      onError: (err) => {
        console.log("Failed adding user to group: ", err);
        setError(err.message);
      },
    });
  const handleAddUser = () => {
    addUserToGroupMutation({
      userEmail: email,
      groupId,
    });
  };
  if (isUserPublicDataError)
    return (
      <div className="flex flex-col gap-4">
        <p className="text-red-500 text-center">
          {userPublicDataError.message}
        </p>
        <Button
          onClick={closeDialog}
          className="mx-auto w-32"
          variant={"ghost"}
        >
          Close
        </Button>
      </div>
    );
  if (isUserPublicDataLoading)
    return <Loader2 className="w-10 h-10 animate-spin" />;
  if (error)
    return (
      <div className="flex flex-col gap-4">
        <p className="text-red-500">{error}</p>
        <Button
          onClick={closeDialog}
          className="mx-auto w-32"
          variant={"ghost"}
        >
          Close
        </Button>
      </div>
    );
  if (email && userPublicData)
    return (
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14" aria-hidden>
            <AvatarImage src={userPublicData.image ?? ""} />
            <AvatarFallback>
              {userPublicData.name?.split(" ").map((name) => name[0])}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-foreground font-semibold text-xl">
            {userPublicData.name}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={closeDialog} variant={"secondary"}>
            Cancel
          </Button>
          <Button onClick={handleAddUser} className="ml-2">
            {isAddUserToGroupLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Add"
            )}
          </Button>
        </div>
      </div>
    );
};

export default GroupDetailsAddMemberDialogUserDetails;
