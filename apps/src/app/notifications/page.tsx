import { fetchAlerts } from '@/shared/api';
import { NotificationList } from '@/features/notification/NotificationList';

export default async function NotificationsPage() {
  const notifications = await fetchAlerts();
  return <NotificationList notifications={notifications} />;
} 