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
} from "@react-email/components";

import { siteConfig } from "@/config/site";

export function ResetPasswordEmail({ href }: { href: string }) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Section className="mt-[32px]">
              <Text className="text-center font-bold text-3xl">
                {siteConfig.name}
              </Text>
            </Section>

            <Section className="mt-[32px] mb-[32px] text-center">
              <Text className="mb-8 font-medium text-[14px] text-black leading-[24px]">
                Click the following link to reset your password
              </Text>

              <Text className="font-medium text-[14px] text-black leading-[24px]">
                <Link
                  className="text-[#2754C5] underline"
                  href={href}
                  target="_blank"
                >
                  Reset Password
                </Link>
              </Text>
            </Section>

            <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />

            <Text className="flex items-center justify-center text-[#666666] text-[12px] leading-[24px]">
              2025 {siteConfig.name}. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
