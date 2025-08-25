import * as React from "react"
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

import { siteConfig } from "@/config/site"

export function ResetPasswordEmail({ href }: { href: string }) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Tailwind>
        <React.Fragment>
          <Body className="mx-auto my-auto bg-white font-sans">
            <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
              <Section className="mt-[32px]">
                <Text className="text-center text-3xl font-bold">
                  {siteConfig.name}
                </Text>
              </Section>

              <Section className="mt-[32px] mb-[32px] text-center">
                <Text className="mb-8 text-[14px] leading-[24px] font-medium text-black">
                  Click the following link to reset your password
                </Text>

                <Text className="text-[14px] leading-[24px] font-medium text-black">
                  <Link
                    href={href}
                    target="_blank"
                    className="text-[#2754C5] underline"
                  >
                    Reset Password
                  </Link>
                </Text>
              </Section>

              <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

              <Text className="flex items-center justify-center text-[12px] leading-[24px] text-[#666666]">
                2025 {siteConfig.name}. All rights reserved.
              </Text>
            </Container>
          </Body>
        </React.Fragment>
      </Tailwind>
    </Html>
  )
}
