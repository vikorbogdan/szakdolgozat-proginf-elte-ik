import { Button } from "@/components/ui/button";
import {
  SandpackCodeEditor,
  SandpackFiles,
  SandpackLayout,
  SandpackPreview,
  SandpackStack,
  SandpackThemeProp,
  SandpackThemeProvider,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { useTheme } from "next-themes";
// @ts-ignore
import { SandpackFileExplorer } from "sandpack-file-explorer";

type SandpackEditorProps = {
  handleHandoutSave: (files: SandpackFiles) => void;
};

const SandpackEditor = ({ handleHandoutSave }: SandpackEditorProps) => {
  const { theme } = useTheme();
  const {
    sandpack: { files, editorState },
  } = useSandpack();
  if (!theme) return null;
  return (
    <>
      <SandpackThemeProvider
        theme={
          theme === "system" ? "auto" : (theme as SandpackThemeProp) ?? "auto"
        }
      >
        <SandpackStack>
          <SandpackLayout>
            <div
              style={{
                color: "hsl(var(--foreground))",
                display: "flex",
                width: "100%",
                minHeight: "300px",
                maxHeight: "300px",
              }}
            >
              <div
                style={{
                  minWidth: 150,
                  maxWidth: "300px",
                  overflow: "hidden",
                }}
              >
                <SandpackFileExplorer />
              </div>
              <div style={{ flex: "min-content" }}>
                <SandpackCodeEditor
                  wrapContent
                  style={{
                    minHeight: "100%",
                    maxHeight: "100%",
                    overflow: "auto",
                  }}
                  showTabs
                  closableTabs
                  showInlineErrors
                  showLineNumbers
                />
              </div>
            </div>
            <SandpackPreview />
          </SandpackLayout>
        </SandpackStack>
      </SandpackThemeProvider>

      <Button
        disabled={editorState === "pristine"}
        onClick={() => handleHandoutSave(files)}
        className="w-32 mt-4"
      >
        {editorState === "pristine" ? "No Changes" : "Save Handout"}
      </Button>
    </>
  );
};

export default SandpackEditor;
