import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hq/stores')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/hq/stores"!</div>
}
