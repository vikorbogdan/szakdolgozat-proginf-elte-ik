"use client";
import SandpackEditor from "@/app/(main)/_components/SandpackEditor";
import { trpc } from "@/app/_trpc/client";
import LoadingPage from "@/components/LoadingPage";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SandpackFiles,
  SandpackPredefinedTemplate,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { FileTerminal, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";
import HandoutChangeTemplateDialogButton from "./_components/HandoutTemplateDialogButton";
import HandoutShareCopyInput from "./_components/HandoutShareCopyInput";
import HandoutTemplateSelect from "./_components/HandoutTemplateSelect";

const EditHandoutPage = () => {
  const { id: lessonId } = useParams<{ id: string }>();
  const [template, setTemplate] =
    useState<SandpackPredefinedTemplate>("react-ts");
  const { data: lessonData, isLoading: isLessonDataLoading } =
    trpc.lessons.getLessonById.useQuery(lessonId);
  const { mutate: createHandout, isLoading: isCreateHandoutLoading } =
    trpc.handouts.create.useMutation({
      onSuccess: () => {
        trpcUtils.lessons.getLessonById.invalidate(lessonId);
      },
    });
  const { mutate: updateHandout, isLoading: isUpdateHandoutLoading } =
    trpc.handouts.update.useMutation({
      onSuccess: () => {
        trpcUtils.lessons.getLessonById.invalidate(lessonId);
      },
    });
  const { mutate: deleteHandout, isLoading: isDeleteHandoutLoading } =
    trpc.handouts.delete.useMutation({
      onSuccess: () => {
        trpcUtils.lessons.getLessonById.invalidate(lessonId);
      },
    });
  const isHandoutLoading = isCreateHandoutLoading || isUpdateHandoutLoading;
  const sandboxData = lessonData?.sandbox;
  const trpcUtils = trpc.useUtils();
  const handleHandoutSave = (files: SandpackFiles) => {
    const data = {
      files: JSON.stringify(files),
      template,
      lessonId,
    };
    if (!sandboxData) createHandout(data);
    else updateHandout(data);
  };

  const handleTemplateChange = (template: SandpackPredefinedTemplate) => {
    if (sandboxData) {
      return null;
    }
    setTemplate(template);
  };

  const HandoutCodeEditor = useCallback(() => {
    return (
      <SandpackProvider
        files={sandboxData?.files ? JSON.parse(sandboxData.files) : null}
        template={sandboxData?.template as SandpackPredefinedTemplate}
      >
        <SandpackEditor handleHandoutSave={handleHandoutSave} />
      </SandpackProvider>
    );
  }, [sandboxData]);
  const handleUnlockTemplateChange = () => {
    deleteHandout({ lessonId });
  };
  if (isLessonDataLoading) {
    return <LoadingPage />;
  }
  return (
    <div className="flex p-4 md:p-16 gap-16 bg-primary-foreground min-h-screen h-full w-full flex-col">
      <div className="flex items-center w-full gap-2 md:gap-4">
        <FileTerminal className="h-6 w-6 md:h-14 md:w-14" />
        <h1 className="md:text-5xl text-xl font-semibold">
          Create a handout for {lessonData?.title}
        </h1>
        {isHandoutLoading && (
          <div className="flex gap-2 items-center ml-auto">
            <Loader2 className="w-5 h-5 animate-spin"></Loader2>
            <span>Saving...</span>
          </div>
        )}
      </div>
      <main className="gap-4 flex flex-col">
        <h2 className="text-2xl font-semibold">Instructions</h2>
        <p>
          This is the handout for {lessonData?.title}. It contains an
          interactive live code editor for the lesson. You can edit the starting
          code for your students by clicking the button below.
        </p>
        <h2 className="text-2xl font-semibold">Template</h2>
        {!sandboxData ? (
          <p>First choose a template for the live code editor.</p>
        ) : (
          <p>
            To change the template of your code editor, you need to reset the
            handout first.
          </p>
        )}
        <div className="flex gap-4">
          <HandoutTemplateSelect
            templateOptionsList={[
              { name: "react-ts", label: "React" },
              { name: "vue-ts", label: "Vue" },
              { name: "angular", label: "Angular" },
              { name: "svelte", label: "Svelte" },
              { name: "static", label: "Static" },
              { name: "vanilla", label: "Vanilla JS" },
            ]}
            disabled={!!sandboxData}
            value={sandboxData ? sandboxData.template : template}
            onValueChange={handleTemplateChange}
          />
          {!!sandboxData ? (
            <HandoutChangeTemplateDialogButton
              handleUnlockTemplateChange={handleUnlockTemplateChange}
              isDisabled={!sandboxData}
            />
          ) : (
            <Button onClick={() => handleHandoutSave({})}>
              Create Handout
            </Button>
          )}
        </div>

        {!!sandboxData && (
          <>
            <h2 className="text-2xl font-semibold">Code Editor</h2>
            <p>
              This is the code editor for the lesson. You can edit the code by
              clicking the button below. After you are done editing, click the
              save button.
            </p>
            <HandoutCodeEditor />

            <h2 className="text-2xl font-semibold">Share</h2>

            <p>Share your handout with your students by sharing this link:</p>
            <HandoutShareCopyInput
              url={`${window.location.origin}/handouts/${sandboxData?.id}`}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default EditHandoutPage;
