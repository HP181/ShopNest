import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { AdminSidebar } from './AdminSidebar'

export const metadata = {
  title: 'Admin — ShopNest',
  description: 'Admin panel for managing users, categories and products.',
}

export default function AdminLayout({ children }) {
  return (
    <TooltipProvider>
      <SidebarProvider className="flex-1 min-h-0!">
        <AdminSidebar />
        <SidebarInset className="flex flex-col">
          <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
            <span className="text-xs font-medium text-muted-foreground tracking-wide">Admin</span>
          </div>
          <div className="flex-1 min-w-0 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
