import CollectionList from '@/components/CollectionList'
import WelcomeMsg from '@/components/WelcomeMsg'
import WelcomeMsgFallback from '@/components/WelcomeMsgFallback'
import { Suspense } from 'react'

export default async function Home() {
  return (
    <>
      <Suspense fallback={<WelcomeMsgFallback />}>
        <WelcomeMsg />
      </Suspense>
      <Suspense fallback={<div>Loading collections</div>}>
        <CollectionList />
      </Suspense>
    </>
  )
}
