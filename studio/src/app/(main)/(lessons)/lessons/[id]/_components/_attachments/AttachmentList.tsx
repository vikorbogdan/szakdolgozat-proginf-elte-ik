import AttachmentListItem from "./AttachmentListItem";
import { LessonGetLessonByIdFileOutput } from "@/trpc/(routers)/lessonRouter";

interface AttachmentListProps {
  attachments: LessonGetLessonByIdFileOutput[];
}

const AttachmentList = ({ attachments }: AttachmentListProps) => {
  if (!attachments || attachments.length === 0)
    return (
      <div className="text-center">
        You have no files attached to this lesson yet.
      </div>
    );
  // TODO: If there are no attachments, return a CTA too to add attachments too
  return (
    <main className="flex flex-col gap-4 items-center w-full">
      {attachments.map((attachment, idx) => {
        return (
          <AttachmentListItem
            attachment={attachment}
            key={attachment.id + idx}
          />
        );
      })}
    </main>
  );
};

export default AttachmentList;
