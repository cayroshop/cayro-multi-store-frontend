import { createFileRoute, useRouterState } from '@tanstack/react-router'
import HqStaffPage from '@/components/hqComponents/hq-staff/hq-staff-page'
import HqStaffView from '@/components/hqComponents/hq-staff/HqStaffView'
import HqStaffEdit from '@/components/hqComponents/hq-staff/HqStaffEdit'

type StaffSearch = {
  view?: string
  edit?: string
  create?: string
}

export const Route = createFileRoute('/hq/users/staff')({
  validateSearch: (search: Record<string, unknown>): StaffSearch => {
    return {
      view: typeof search.view === 'string' ? search.view : undefined,
      edit: typeof search.edit === 'string' ? search.edit : undefined,
      create: typeof search.create === 'string' ? search.create : undefined,
    }
  },
  component: StaffRouteComponent,
})

function StaffRouteComponent() {
  const search = useRouterState({
    select: (state) => state.location.search,
  }) as StaffSearch

  // 👁 VIEW
  if (search.view) {
    return <HqStaffView id={search.view} />
  }

  // ✏️ EDIT
  if (search.edit) {
    return <HqStaffEdit id={search.edit} />
  }

  // ➕ CREATE
  if (search.create) {
    return <HqStaffEdit />
  }

  // 📋 LIST
  return <HqStaffPage />
}
