import React, { useMemo } from "react";
import { useTable, useFlexLayout, useGlobalFilter, useAsyncDebounce } from "react-table";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { Box, Flex, Text, Input } from "@chakra-ui/react";

// Define a default UI for filtering
function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter, filteredCount }) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Flex mb="8">
      <Input
        flex={1}
        maxWidth="500px"
        variant="flushed"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Rechercher parmi les ${count} résultats`}
      />
      {filteredCount !== count && (
        <Text flex={1} px={8} alignSelf="center">
          {filteredCount} résultat(s) trouvé(s)
        </Text>
      )}
    </Flex>
  );
}

const Table = ({ data, onRowClick }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tableData = useMemo(() => data, []);

  const columns = Object.keys(data[0]).map((key) => {
    return {
      Header: key,
      accessor: key,
      width: key === "updates" ? 300 : 150,
    };
  });

  const tableColumns = useMemo(
    () => [
      {
        Header: "index",
        accessor: (row, i) => i,
        width: 50,
      },
      ...columns,
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      width: 150, // width is used for both the flex-basis and flex-grow
    }),
    []
  );

  const tableInstance = useTable(
    { columns: tableColumns, data: tableData, defaultColumn },
    useFlexLayout,
    useGlobalFilter
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = tableInstance;

  const Row = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <Box
          as="tr"
          {...row.getRowProps()}
          display="flex"
          key={row.id}
          data-rowindex={row.index}
          onClick={() => onRowClick?.(row.index)}
          cursor={onRowClick ? "pointer" : undefined}
          _hover={{ bg: "grey.700" }}
          lineHeight="50px"
          borderBottom="1px solid"
          borderColor="grey.600"
          style={style}
        >
          {row.cells.map((cell, i) => {
            return (
              <Box
                as="td"
                {...cell.getCellProps()}
                display={[i === 0 || i > 2 ? "none" : "flex", "flex"]}
                px={2}
                overflow="hidden"
              >
                {cell.render("Cell")}
              </Box>
            );
          })}
        </Box>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prepareRow, rows]
  );

  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
        filteredCount={rows.length}
      />
      <Box as="table" {...getTableProps()} w="100%" flex={1} fontSize="delta">
        <Box as="thead">
          {headerGroups.map((headerGroup) => (
            <Flex as="tr" flex={1} {...headerGroup.getHeaderGroupProps({})} pb={4}>
              {headerGroup.headers.map((column, i) => (
                <Text
                  as="th"
                  {...column.getHeaderProps()}
                  display={[i === 0 || i > 2 ? "none" : "flex", "flex"]}
                  textTransform="uppercase"
                  fontWeight="normal"
                  overflow="hidden"
                  px={2}
                >
                  {column.render("Header")}
                </Text>
              ))}
            </Flex>
          ))}
        </Box>
        <Box as="tbody" {...getTableBodyProps()}>
          <AutoSizer disableHeight>
            {({ width }) => (
              <FixedSizeList height={850} itemCount={rows.length} itemSize={50} width={width} overscanCount={50}>
                {Row}
              </FixedSizeList>
            )}
          </AutoSizer>
        </Box>
      </Box>
    </>
  );
};

export { Table };
