import { currentUser } from '@clerk/nextjs';

const WelcomeMsg = async () => {
  const user = await currentUser();

  if(!user) {
    return <div>error</div>
  }

  return (
    <div className='flex w-full mb-12'>
      <h1 className='text-4xl font-bold'>
        Welcome, <br /> {user.firstName} {user.lastName}
      </h1>
    </div>
  )
}

export default WelcomeMsg