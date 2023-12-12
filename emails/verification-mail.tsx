import React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Tailwind,
  Section,
} from "@react-email/components";

interface WelcomeEmailProps {
  url: string;
}

export const VerificationEmail = ({ url }: WelcomeEmailProps) => {
  const previewText = `Welcome to , Splitvanced!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="my-10 mx-auto p-5 w-[465px]">
            <Heading className="text-2xl font-normal text-center p-0 my-8 mx-0">
              Welcome to Splitvanced!
            </Heading>
            <Text className="text-sm">Hello,</Text>
            <Text className="text-sm">
              Thank you for creating an account with Splitvanced! Please click
              the button below to verify your email address.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="px-5 py-3 bg-[#00A3FF] rounded text-white text-xs font-semibold no-underline text-center"
                href={url}
              >
                Get Started
              </Button>
              <Text className="text-sm mt-[16px]">
                If you did not sign up for Splitvanced, please ignore this
                email.
              </Text>
            </Section>
            <Text className="text-sm">
              Cheers,
              <br />
              The SplitVanced Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
