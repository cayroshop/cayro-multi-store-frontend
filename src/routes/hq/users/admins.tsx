import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hq/users/admins')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/hq/users/admins"!</div>
}
