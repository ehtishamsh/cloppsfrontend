import { EventForm } from "@/components/dashboard/event-form"

export default function CreateEventPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
        <p className="text-muted-foreground">
          Set up a new auction event for your marketplace.
        </p>
      </div>
      <EventForm mode="create" />
    </div>
  )
}
