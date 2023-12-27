import { AddUserToGroupByEmailRequest } from "@/lib/validators/addUserToGroupByEmailValidator";
import { useState } from "react";
import GroupDetailsAddMemberDialogForm from "./GroupDetailsAddMemberDialogForm";
import GroupDetailsAddMemberDialogUserDetails from "./GroupDetailsAddMemberDialogUserDetails";

interface GroupDetailsAddMemberDialogContentProps {
  closeDialog: () => void;
}

const GroupDetailsAddMemberDialogContent = ({
  closeDialog,
}: GroupDetailsAddMemberDialogContentProps) => {
  const [email, setEmail] = useState<string>("");

  const onSubmit = (data: AddUserToGroupByEmailRequest) => {
    setEmail(data.email);
  };

  if (email)
    return (
      <div className="flex flex-col items-center justify-center w-full h-44">
        <GroupDetailsAddMemberDialogUserDetails
          closeDialog={closeDialog}
          email={email}
        />
      </div>
    );
  return <GroupDetailsAddMemberDialogForm onSubmit={onSubmit} />;
};

export default GroupDetailsAddMemberDialogContent;
