import { getAdminContent } from '@/lib/admin'
import AdminDashboard from './AdminDashboard'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const content = await getAdminContent()
  return <AdminDashboard {...content} />
}
