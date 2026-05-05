// src/components/layout/full-page-loader.tsx
export function FullPageLoader() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="bg-primary text-primary-foreground flex size-16 animate-pulse items-center justify-center rounded-2xl font-bold text-3xl shadow-md">
          C
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">Cayro ERP</p>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    </div>
  )
}
