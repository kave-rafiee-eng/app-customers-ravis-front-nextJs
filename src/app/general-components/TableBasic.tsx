import Button from "@mui/material/Button";
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import { ReactNode } from "react";
import { Box } from "@mui/material";

type ColumnType<RowType = any> = {
  id: keyof RowType;
  label: string | (() => ReactNode);
  minWidth?: number;
  Width?: number | string;
  align?: "left" | "right" | "center";
  render?: (row: RowType) => ReactNode;
  format?: (value: any) => string;
};

export type TableBasicProps<RowType> = {
  height?: number | string;
  columns: ColumnType<RowType>[];
  tableData: RowType[];
};

export function TableBasic<RowType extends { id: number | string }>({
  height,
  columns,
  tableData,
}: TableBasicProps<RowType>) {
  const rows = [...tableData];

  React.useEffect(() => {
    console.log("TableBasic---------------");
  }, []);

  return (
    <TableContainer
      component={Paper}
      sx={{ width: "100%", p: 0, m: 0, height: height }}
    >
      <Table
        stickyHeader
        aria-label="simple table"
        sx={{ width: "100%", p: 0, m: 0 }}
      >
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id as string}
                align={column.align}
                style={{ minWidth: column.minWidth }}
                sx={{
                  textAlign: "center",
                  backgroundColor: "gray",
                  color: "white",
                }}
              >
                <h3>
                  {column.label instanceof Function
                    ? column.label()
                    : column.label}
                </h3>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody sx={{}}>
          {rows.map((row) => (
            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
              {columns.map((column) => {
                const value = row[column.id as keyof RowType];
                return (
                  <TableCell
                    key={column.id as string}
                    align={column.align}
                    sx={{
                      textAlign: "center",
                      width: column.Width,
                    }}
                  >
                    {column.render
                      ? column.render(row)
                      : column.format
                        ? column.format(value)
                        : (value as React.ReactNode)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
