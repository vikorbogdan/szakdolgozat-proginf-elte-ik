import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackFiles,
  SandpackLayout,
  SandpackPredefinedTemplate,
  SandpackPreview,
  SandpackProvider,
  SandpackStack,
  SandpackThemeProvider,
} from "@codesandbox/sandpack-react";
import { use, useCallback } from "react";

interface SandpackRendererProps {
  files: SandpackFiles;
  template?: SandpackPredefinedTemplate;
}

const SandpackRenderer = ({ files, template }: SandpackRendererProps) => {
  const SandpackComponent = useCallback(() => {
    return (
      <SandpackProvider template={template} files={files}>
        <SandpackThemeProvider theme={"auto"}>
          <SandpackLayout className="flex h-screen flex-col">
            <SandpackStack className="flex">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel>
                  <SandpackFileExplorer className="h-full w-full" />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                  <SandpackCodeEditor className="h-full w-full overflow-auto" />
                </ResizablePanel>
              </ResizablePanelGroup>
            </SandpackStack>
            <SandpackStack>
              <SandpackPreview className="h-full" />
            </SandpackStack>
          </SandpackLayout>
        </SandpackThemeProvider>
      </SandpackProvider>
    );
  }, [files]);

  return (
    <div className="flex flex-col h-screen">
      <SandpackComponent />
    </div>
  );
};

export default SandpackRenderer;
