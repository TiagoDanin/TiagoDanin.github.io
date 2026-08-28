import Link from 'next/link';
import { Trans } from '@lingui/react/macro';
import type { FaqMatrixRow } from '@/lib/faq';

interface FaqMatrixProps {
  rows: FaqMatrixRow[];
}

export function FaqMatrix({ rows }: FaqMatrixProps) {
  if (rows.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left border-collapse">
        <thead className="bg-muted/50">
          <tr>
            <th scope="col" className="px-4 py-3 text-sm font-semibold whitespace-nowrap">
              <Trans>Technology</Trans>
            </th>
            <th scope="col" className="px-4 py-3 text-sm font-semibold whitespace-nowrap">
              <Trans>Where it was used</Trans>
            </th>
            <th scope="col" className="px-4 py-3 text-sm font-semibold">
              <Trans>Evidence</Trans>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.item}-${index}`} className="border-t border-border align-top">
              <th scope="row" className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                {row.item}
              </th>
              <td className="px-4 py-3 text-muted-foreground">{row.where}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {row.href ? (
                  <Link href={row.href} className="hover:underline underline-offset-4">
                    {row.proof}
                  </Link>
                ) : (
                  row.proof
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
