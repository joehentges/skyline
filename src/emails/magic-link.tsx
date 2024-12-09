import * as React from "react"
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

import { env } from "@/env"
import { siteConfig } from "@/config/site"

const HOST_NAME = env.HOST_NAME

export function MagicLinkEmail({
  token,
  from,
}: {
  token: string
  from?: string
}) {
  const magicLinkHref = `${HOST_NAME}/api/auth/magic?token=${token}${from ? `&from=${from}` : ""}`
  return (
    <Html>
      <Head />
      <Preview>Magic link to Sign In to {siteConfig.name}</Preview>
      <Tailwind>
        <React.Fragment>
          <Body className="mx-auto my-auto bg-white font-sans">
            <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
              <Section className="mt-[32px]">
                <Img
                  src={`${HOST_NAME}/group.jpeg`}
                  width="160"
                  height="48"
                  alt="StarterKit"
                  className="mx-auto my-0"
                />
              </Section>

              <Section className="mb-[32px] mt-[32px] text-center">
                <Text className="mb-8 text-[14px] font-medium leading-[24px] text-black">
                  You&apos;re magic link login is below, click to sign in.
                  group.
                </Text>

                <Text className="text-[14px] font-medium leading-[24px] text-black">
                  <Link
                    href={magicLinkHref}
                    target="_blank"
                    className="text-[#2754C5] underline"
                  >
                    Login using Magic Link
                  </Link>
                </Text>
              </Section>

              <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

              <Text className="flex items-center justify-center text-[12px] leading-[24px] text-[#666666]">
                © {new Date().getFullYear()} {siteConfig.name}. All rights
                reserved.
              </Text>
            </Container>
          </Body>
        </React.Fragment>
      </Tailwind>
    </Html>
  )
}
