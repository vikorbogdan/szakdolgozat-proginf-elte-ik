import EditorJSParser from "@/components/EditorJSParser";
import { EditorOutput } from "@/types/EditorJS";

type BlockContentRendererProps = {
  blockContentData: EditorOutput;
};
const BlockContentRenderer = ({
  blockContentData,
}: BlockContentRendererProps) => {
  if (!blockContentData) return <div>Block has no content</div>;
  return blockContentData.blocks.map((block, idx) => (
    <EditorJSParser key={idx} block={block} />
  ));
};

export default BlockContentRenderer;
