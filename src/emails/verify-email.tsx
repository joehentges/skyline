import * as React from "react"
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

import { siteConfig } from "@/config/site"

export function VerifyEmail({ token }: { token: string }) {
  if (token.length !== 6) {
    throw new Error("Invalid token")
  }

  const tokenPart1 = token.slice(0, 3)
  const tokenPart2 = token.slice(3)

  const formattedToken = tokenPart1 + "-" + tokenPart2

  return (
    <Html>
      <Head />
      <Preview>Verify your Email</Preview>
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
                  Enter the following code to verify your email address
                </Text>

                <Text className="mb-8 text-[20px] leading-[24px] font-medium text-black">
                  {formattedToken}
                </Text>

                <Text className="text-muted-foreground text-[12px] leading-[24px] font-medium">
                  If you did not request this email, please ignore it
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
