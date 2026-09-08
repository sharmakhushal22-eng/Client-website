import { DataTable } from '@/components/admin/DataTable'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Demo bookings' }

export default function BookingsPage() {
  return (
    <DataTable
      table="demo_bookings"
      title="Demo bookings"
      order="slot_start"
      description="Slots booked from /book-a-demo. Outcome drives the no-show rate in §1.3."
      emptyHint="Two things are needed: NEXT_PUBLIC_CALENDAR_URL to embed the calendar on /book-a-demo, and a webhook in cal.com or Calendly pointing at /api/webhooks/booking with BOOKING_WEBHOOK_SECRET set. The calendar alone only shows a booking form — the booking then lives in the provider and never reaches this table."
      columns={[
        { key: 'company_name', label: 'Company' },
        { key: 'full_name', label: 'Name' },
        { key: 'work_email', label: 'Email', kind: 'email' },
        { key: 'employee_band', label: 'Headcount' },
        { key: 'slot_start', label: 'Slot', kind: 'when' },
        { key: 'assigned_to', label: 'Assigned' },
        { key: 'outcome', label: 'Outcome' },
        { key: 'reminder_24h_sent_at', label: '24h reminder', kind: 'when' },
      ]}
    />
  )
}
