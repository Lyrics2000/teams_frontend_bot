import type { ReactNode } from 'react';

export interface Column<T> { key: string; title: string; render: (row: T) => ReactNode; className?: string; }

type DataTableProps<T> =
  | { columns: Column<T>[]; data: T[]; empty?: string; rows?: never }
  | { columns: string[]; rows: ReactNode[][]; empty?: string; data?: never };

export function DataTable<T>(props: DataTableProps<T>) {
  const empty = props.empty ?? 'No records found';

  if ('rows' in props) {
    const columns = props.columns as string[];
    const rows = props.rows ?? [];
    return (
      <div className="table-card">
        <div className="table-scroll">
          <table>
            <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
            <tbody>
              {rows.length === 0 ? <tr><td colSpan={columns.length} className="empty-cell">{empty}</td></tr> : rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const columns = props.columns as Column<T>[];
  const data = props.data ?? [];
  return (
    <div className="table-card">
      <div className="table-scroll">
        <table>
          <thead><tr>{columns.map((column) => <th key={column.key} className={column.className}>{column.title}</th>)}</tr></thead>
          <tbody>
            {data.length === 0 ? <tr><td colSpan={columns.length} className="empty-cell">{empty}</td></tr> : data.map((row, index) => <tr key={index}>{columns.map((column) => <td key={column.key} className={column.className}>{column.render(row)}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
