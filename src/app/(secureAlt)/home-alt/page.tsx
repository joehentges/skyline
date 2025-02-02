import { getCurrentUser } from "@/lib/session"

export default async function HomeAltPage() {
  const user = await getCurrentUser()

  return (
    <>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
        <p className="inline-block h-10 bg-gradient-to-r from-primary to-green-500 bg-clip-text text-3xl font-bold text-transparent">
          Hello, {user?.displayName.split(" ")[0]}
        </p>
      </div>
      <p>Main body</p>
    </>
  )
}
