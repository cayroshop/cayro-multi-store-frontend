import { createFileRoute, useRouterState } from '@tanstack/react-router'
import StoreRolesPage from '@/components/storeComponents/store-roles/store-roles-page'
import StoreRoleView from '@/components/storeComponents/store-roles/StoreRoleView'
import StoreRoleEdit from '@/components/storeComponents/store-roles/StoreRoleEdit'

type RolesSearch = {
  view?: string
  edit?: string
  create?: string
}

export const Route = createFileRoute('/store/settings/roles')({
  validateSearch: (search: Record<string, unknown>): RolesSearch => {
    return {
      view: typeof search.view === 'string' ? search.view : undefined,
      edit: typeof search.edit === 'string' ? search.edit : undefined,
      create: typeof search.create === 'string' ? search.create : undefined,
    }
  },
  component: RolesRouteComponent,
})

function RolesRouteComponent() {
  // 🔥 IMPORTANT FIX: useRouterState instead of useSearch
  const search = useRouterState({
    select: (state) => state.location.search,
  }) as RolesSearch

  // 👁 VIEW
  if (search.view) {
    return <StoreRoleView id={search.view} />
  }

  // ✏️ EDIT
  if (search.edit) {
    return <StoreRoleEdit id={search.edit} />
  }

  // ➕ CREATE
  if (search.create) {
    return <StoreRoleEdit />
  }

  // 📋 LIST
  return <StoreRolesPage />
}
