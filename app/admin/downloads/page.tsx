import { DataTable } from '@/components/admin/DataTable'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Downloads' }

export default function DownloadsPage() {
  return (
    <DataTable
      table="asset_downloads"
      title="Gated downloads"
      description="Brochure and pricing-sheet captures. Repeat downloads are kept — they are a buying signal."
      emptyHint="Rows appear once a gated asset is published."
      columns={[
        { key: 'asset_slug', label: 'Asset' },
        { key: 'email', label: 'Email', kind: 'email' },
        { key: 'company_name', label: 'Company' },
        { key: 'phone', label: 'Phone' },
        { key: 'utm_source', label: 'Source' },
        { key: 'created_at', label: 'Downloaded', kind: 'when' },
      ]}
    />
  )
}
