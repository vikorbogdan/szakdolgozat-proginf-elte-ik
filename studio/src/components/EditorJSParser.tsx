import { EditorBlock } from "@/types/EditorJS";
import { Highlight, themes } from "prism-react-renderer";
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
import { useTheme } from "next-themes";
import CopyButton from "./CopyButton";
type EditorJSParserProps = {
  block: EditorBlock;
};

const EditorJSParser = ({ block }: EditorJSParserProps) => {
  const { theme } = useTheme();
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
      switch (block.data.style) {
        case "ordered":
          return (
            <ol className="list-decimal list-inside">
              {block.data.items.map((item, idx) => (
                <li key={idx}>{parseText(item)}</li>
              ))}
            </ol>
          );
        case "unordered":
          return (
            <ul className="list-disc list-inside">
              {block.data.items.map((item, idx) => (
                <li key={idx}>{parseText(item)}</li>
              ))}
            </ul>
          );
        default:
          return (
            <div className="text-red-500">
              Error: Unsupported list style({block.data.style})
            </div>
          );
      }
    case "code":
      return (
        <div className="my-2 bg-card p-5 border-2 relative border-muted rounded-xl">
          <CopyButton
            text={block.data.code}
            className="absolute right-7 top-7"
          />
          <Highlight
            theme={
              theme === "light" ? themes.jettwaveLight : themes.jettwaveDark
            }
            code={block.data.code}
            language={"javascript"}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className="overflow-x-auto text-sm rounded-" style={style}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    <span className="text-gray-500 mr-4 select-none">
                      {i + 1}
                    </span>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
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
      return <img className="max-w-full mx-auto" src={block.data.file.url} />;
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
