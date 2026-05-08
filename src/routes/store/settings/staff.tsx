import { createFileRoute, useRouterState } from '@tanstack/react-router'
import StoreStaffPage from '@/components/storeComponents/store-staff/store-staff-page'
import StoreStaffView from '@/components/storeComponents/store-staff/StoreStaffView'
import StoreStaffEdit from '@/components/storeComponents/store-staff/StoreStaffEdit'

type StaffSearch = {
  view?: string
  edit?: string
  create?: string
}

export const Route = createFileRoute('/store/settings/staff')({
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
    return <StoreStaffView id={search.view} />
  }

  // ✏️ EDIT
  if (search.edit) {
    return <StoreStaffEdit id={search.edit} />
  }

  // ➕ CREATE
  if (search.create) {
    return <StoreStaffEdit />
  }

  // 📋 LIST
  return <StoreStaffPage />
}
