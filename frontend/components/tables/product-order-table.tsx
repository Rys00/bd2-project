"use client";

import { type UniqueIdentifier } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { IconCircleFilled } from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ProductView } from "@/lib/backend-requests/products";
import { Prisma } from "@prisma/client";
import { Separator } from "../ui/separator";
import { ButtonChangeCartQuantity } from "./product-table-row-buttons";

const columns: ColumnDef<ProductView>[] = [
  {
    accessorKey: "nazwa",
    header: "Nazwa produktu",
    cell: ({ row }) => {
      return (
        <Button
          variant="link"
          className={`text-foreground ${
            row.original.active ? "" : "opacity-50"
          } w-fit px-0 text-left `}
        >
          {row.original.name}
        </Button>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "stan",
    header: "Stan magazynowy",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.stock_amount >= 50 ? (
          <IconCircleFilled className="fill-green-500 dark:fill-green-400" />
        ) : row.original.stock_amount >= 10 ? (
          <IconCircleFilled className="fill-yellow-500 dark:fill-yellow-400" />
        ) : (
          <IconCircleFilled className="fill-red-500 dark:fill-red-400" />
        )}
        {row.original.stock_amount}
      </Badge>
    ),
  },
  {
    accessorKey: "cena",
    header: () => <div className="w-full">Cena</div>,
    cell: ({ row }) => (
      <span>{new Prisma.Decimal(row.original.price).toString()} zł</span>
    ),
  },
  {
    accessorKey: "alergeny",
    header: () => <div className="w-full">Alergeny</div>,
    cell: ({ row }) => (
      <div className="flex gap-1 flex-wrap max-w-50">
        {row.original.allergens.map((a) => (
          <Badge
            key={a.allergen_id}
            variant="outline"
            className="text-muted-foreground px-1.5"
          >
            {a.name}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="w-full text-right">Dodaj do zamówienia</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <ButtonChangeCartQuantity product={row.original} />
      </div>
    ),
  },
];

export function ProductOrderTable({
  title,
  data: initialData,
  noItemLabel = "Brak wyników.",
}: {
  title: string;
  data: ProductView[];
  noItemLabel?: string;
}) {
  const [data, setData] = React.useState(initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ product_id }) => product_id) || [],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    getRowId: (row) => row.product_id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6 mt-6 pb-6"
    >
      <div className="flex items-center justify-center px-4 lg:px-6">
        <Separator className="absolute" />
        <span className="bg-background z-10 px-10 text-xl text-primary">
          {title}
        </span>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {noItemLabel}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  );
}
