import { useEdgeStore } from "@/lib/edgestore";
import { useCallback, useEffect, useRef, useState } from "react";
import type EditorJS from "@editorjs/editorjs";
import { cn } from "@/lib/utils";

type EditorProps = {
  className?: string;
};

const Editor = ({ className }: EditorProps) => {
  const { edgestore } = useEdgeStore();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);
  const editorRef = useRef<EditorJS>();
  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const List = (await import("@editorjs/list")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const Code = (await import("@editorjs/code")).default;
    const ImageTool = (await import("@editorjs/image")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const Table = (await import("@editorjs/table")).default;
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady: () => {
          editorRef.current = editor;
        },
        placeholder: "Start writing your block here...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          list: List,
          embed: Embed,
          inlineCode: InlineCode,
          code: Code,
          table: Table,
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  if (file) {
                    const res = await edgestore.publicImages.upload({
                      file,
                    });

                    return {
                      success: 1,
                      file: {
                        url: res.url,
                      },
                    };
                  }
                },
              },
            },
          },
          link: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
        },
      });
    }
  }, []);
  useEffect(() => {
    const loadEditor = async () => {
      await initializeEditor();
    };
    if (isMounted) {
      loadEditor();
      return () => {};
    }
  }, [isMounted, initializeEditor]);
  return <div id="editor" className={cn(className)} />;
};

export default Editor;
