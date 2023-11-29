import { EditorBlock } from "@/types/EditorJS";
import { parseText } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
type EditorJSParserProps = {
  block: EditorBlock;
};

const EditorJSParser = ({ block }: EditorJSParserProps) => {
  switch (block.type) {
    case "header":
      switch (block.data.level) {
        case 1:
          return (
            <h1 className="my-2 font-semibold text-4xl">{block.data.text}</h1>
          );
        case 2:
          return (
            <h2 className="my-2 font-semibold text-3xl">{block.data.text}</h2>
          );
        case 3:
          return (
            <h3 className="my-2 font-semibold text-2xl">{block.data.text}</h3>
          );
        case 4:
          return (
            <h4 className="my-2 font-semibold text-xl">{block.data.text}</h4>
          );
        case 5:
          return (
            <h5 className="my-2 font-semibold text-lg">{block.data.text}</h5>
          );
        case 6:
          return <h6 className="my-2 font-bold text-xl">{block.data.text}</h6>;
        default:
          return (
            <div className="text-red-500">
              Error: Unsupported header level({block.data.text})
            </div>
          );
      }
    case "paragraph":
      return <p className="my-2">{parseText(block.data.text)}</p>;
    case "list":
      return (
        <ul>
          {block.data.items.map((item, idx) => (
            <li key={idx}>{parseText(item)}</li>
          ))}
        </ul>
      );
    case "code":
      return (
        <pre className="bg-card p-5 border-2 border-muted rounded-xl">
          <code>{block.data.code}</code>
        </pre>
      );
    case "table":
      if (block.data.withHeadings) {
        return (
          <Table className="mx-auto max-w-3xl border-2 border-accent my-2">
            <TableHeader>
              <TableRow>
                {block.data.content[0].map((item, idx) => (
                  <th key={idx}>{parseText(item)}</th>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {block.data.content.slice(1).map((row, idx) => (
                <TableRow key={idx}>
                  {row.map((item, idx) => (
                    <TableCell key={idx}>{parseText(item)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      } else {
        return (
          <Table className="mx-auto max-w-3xl border-2 border-accent my-2">
            <TableBody>
              {block.data.content.map((row, idx) => (
                <TableRow key={idx}>
                  {row.map((item, idx) => (
                    <TableCell key={idx}>{parseText(item)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      }
    case "image":
      return <img className="max-w-3xl mx-auto" src={block.data.file.url} />;
    case "linkTool":
      return (
        <a href={block.data.link} target="_blank" rel="noopener noreferrer">
          {block.data.meta.title}
        </a>
      );
    case "embed":
      <iframe src={block.data.embed} width="100%" height="600px"></iframe>;
    default:
      return <div>Unsupported block type</div>;
  }
};

export default EditorJSParser;
