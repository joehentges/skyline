import { SignUpForm } from "@/containers/sign-up-form"

export default async function SignUpPage() {
  return (
    <div className="flex h-full flex-col justify-between space-y-8 px-4 py-8">
      <div className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            Get Started
          </h2>
          <p className="text-center text-base">
            Welcome to <span className="font-bold">PENDULEM</span> - Let&apos;s
            create your account
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}
