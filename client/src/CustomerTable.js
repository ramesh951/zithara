import React, { useEffect, useState } from 'react';
import { useTable, usePagination, useSortBy, useGlobalFilter } from 'react-table';
import axios from 'axios';

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;

  return (
    <span>
      {' '}
      <input
        value={globalFilter || ''}
        onChange={e => {
          setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`Search Within ${count} records...`}
        style={{ width: '100%', padding: '12px 20px', margin: '8px 0', boxSizing: 'border-box', border: '2px solid #ccc', borderRadius: '50px'  }}
      />
    </span>
  );
}

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 20 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // Rendering the UI
  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '50px', padding: '10px', borderRadius: '5px', border: '2px solid #ccc' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
          style={{ padding: '10px', borderRadius: '5px', border: '2px solid #ccc'}}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>

          ))}
        </select>
      </div>
    </>
  );
}

function CustomerTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('/customers');
      setData(result.data.results);

    };

    fetchData();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'S.No',
        accessor: 'sno',
      },
      {
        Header: 'Customer Name',
        accessor: 'name',
      },
      {
        Header: 'Age',
        accessor: 'age',
      },
      {
        Header: 'Phone',
        accessor: 'phone',
      },
      {
        Header: 'Location',
        accessor: 'location',
      },
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Time',
        accessor: 'time',
      },
    ],
    []
  );
  

  return <Table columns={columns} data={data} />;
}

export default CustomerTable;