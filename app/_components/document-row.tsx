import { TableCell, TableRow } from "@/components/ui/table";
import { Doc } from "@/types";
import { SiGoogledocs } from "react-icons/si";
import { format } from "date-fns";
import { DocumentMenu } from "@/app/_components/document-menu";
import { useRouter } from "next/navigation";

interface DocumentRowProps {
  document: Doc<"documents">;
}

export const DocumentRow = ({ document }: DocumentRowProps) => {
  const router = useRouter();
  const onNewTabClick = (id: string) => {
    window.open(`/documents/${id}`, "_blank");
  };
  return (
    <TableRow
      className="cursor-pointer"
      onClick={() => router.push(`/documents/${document._id}`)}
    >
      <TableCell className="w-[50px]">
        <SiGoogledocs className="size-6 fill-blue-500" />
      </TableCell>
      <TableCell className="font-medium md:w-[45%]">{document.title}</TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground">
        Private
      </TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground">
        {document.createdAt ? format(new Date(document.createdAt), "MMM dd, yyyy") : "N/A"}
      </TableCell>
      <TableCell className="flex justify-end">
        <DocumentMenu
          documentId={document._id}
          title={document.title}
          onNewTab={onNewTabClick}
        />
      </TableCell>
    </TableRow>
  );
};
