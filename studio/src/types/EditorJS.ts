export interface EditorOutput {
  time: number;
  blocks: EditorBlock[];
  version: string;
}

export interface EditorHeaderData {
  text: string;
  level: number;
}
export interface EditorParagraphData {
  text: string;
}
export interface EditorListData {
  style: "ordered" | "unordered";
  items: string[];
}
export interface EditorCodeData {
  code: string;
}
export interface EditorEmbedData {
  service: string;
  source: string;
  embed: string;
  width: number;
  height: number;
  caption: string;
}
export interface EditorImageData {
  file: {
    url: string;
  };
  caption: string;
  withBorder: boolean;
  stretched: boolean;
  withBackground: boolean;
}
export interface EditorTableData {
  withHeadings: boolean;
  content: string[][];
}
export interface EditorLinkToolData {
  link: string;
  meta: {
    title: string;
    site_name: string;
    description: string;
    image: {
      url: string;
    };
  };
}

export type EditorBlock =
  | {
      id: string;
      type: "header";
      data: EditorHeaderData;
    }
  | {
      id: string;
      type: "paragraph";
      data: EditorParagraphData;
    }
  | {
      id: string;
      type: "list";
      data: EditorListData;
    }
  | {
      id: string;
      type: "code";
      data: EditorCodeData;
    }
  | {
      id: string;
      type: "embed";
      data: EditorEmbedData;
    }
  | {
      id: string;
      type: "image";
      data: EditorImageData;
    }
  | {
      id: string;
      type: "table";
      data: EditorTableData;
    }
  | {
      id: string;
      type: "linkTool";
      data: EditorLinkToolData;
    };
