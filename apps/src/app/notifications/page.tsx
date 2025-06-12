import { fetchAlerts } from '@/shared/api/alert.server';
import { NotificationList } from '@/features/notification/NotificationList';
import { CommonHeader } from '@/shared/ui/Header/CommonHeader';

export default async function NotificationsPage() {
  const notifications = await fetchAlerts();
  return (
    <>
      <CommonHeader title="알림" showBackButton />
      <NotificationList notifications={notifications} />
    </>
  );
} 