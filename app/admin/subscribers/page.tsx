import { DataTable } from '@/components/admin/DataTable'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Subscribers' }

export default function SubscribersPage() {
  return (
    <DataTable
      table="newsletter_subscribers"
      title="Compliance-update subscribers"
      description="Double opt-in. Only rows with a confirmed date are mailable."
      emptyHint="Signups come from the footer form."
      columns={[
        { key: 'email', label: 'Email', kind: 'email' },
        { key: 'confirmed_at', label: 'Confirmed', kind: 'when' },
        { key: 'unsubscribed_at', label: 'Unsubscribed', kind: 'when' },
        { key: 'source', label: 'Source' },
        { key: 'utm_source', label: 'Campaign' },
        { key: 'created_at', label: 'Signed up', kind: 'when' },
      ]}
    />
  )
}
