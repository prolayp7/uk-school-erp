import type { Metadata } from "next";
import { LoginScreen, type LoginNotice } from "@/components/auth/login-screen";

export const metadata: Metadata = {
  title: "Sign In",
};

const NOTICE_REASONS = new Set<LoginNotice>(["session_expired", "signed_out"]);

function toNotice(reason: string | string[] | undefined): LoginNotice | undefined {
  const value = Array.isArray(reason) ? reason[0] : reason;
  return NOTICE_REASONS.has(value as LoginNotice) ? (value as LoginNotice) : undefined;
}

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const notice = toNotice(searchParams.reason);

  return <LoginScreen notice={notice} />;
}
