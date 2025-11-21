import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/requestor/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/requestor/"!</div>
}
