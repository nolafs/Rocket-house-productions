import { txColumns, type TransactionRow } from './transactions-columns';
import { DataTable } from '@rocket-house-productions/ui';

export default function TransactionsTable({ rows }: { rows: TransactionRow[] }) {
  return (
    <DataTable<TransactionRow, unknown>
      columns={txColumns}
      data={rows}
      searchColumnId="id" // or 'purchaseId' if you prefer
      searchPlaceholder="Search transactions…"
      pageSize={10}
    />
  );
}
