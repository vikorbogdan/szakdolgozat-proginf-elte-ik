"use client";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import { EditorOutput } from "@/types/EditorJS";
import type EditorJS from "@editorjs/editorjs";
import { useCallback, useEffect, useRef, useState } from "react";

type EditorProps = {
  className?: string;
  editorRef: React.MutableRefObject<EditorJS | undefined>;
  initialData?: EditorOutput;
};

const Editor = ({ className, editorRef, initialData }: EditorProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { edgestore } = useEdgeStore();

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
        data: initialData ? initialData : { blocks: [] },
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
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);
  useEffect(() => {
    const loadEditor = async () => {
      await initializeEditor();
    };
    if (isMounted) {
      loadEditor();
      return () => {
        editorRef.current?.destroy();
        editorRef.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);
  return <div id="editor" className={cn(className)}></div>;
};

export default Editor;
