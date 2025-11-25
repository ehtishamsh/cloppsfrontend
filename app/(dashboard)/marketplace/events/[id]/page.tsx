import { EventDetailsView } from "@/components/dashboard/event-details-view"

export default async function EventDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  return <EventDetailsView eventId={id} />
}
