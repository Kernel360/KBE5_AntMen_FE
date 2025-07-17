import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import { InvitePageClient } from '@/app/(user)/(navigation)/invite/InvitePageClient'

export default function InvitePage() {
  return (
    <>
      <CommonHeader
        title="친구초대"
        showBackButton={true}
      />
      <InvitePageClient />
    </>
  )
} 