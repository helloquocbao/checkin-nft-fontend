import { FooterComponent, HeaderComponent } from "@/components";
import { locales } from "@/i18n";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ClientProviders } from "./ClientProviders";
import "@mysten/dapp-kit/dist/index.css";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  const messages = await getMessages({ locale: locale });

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ClientProviders>
        <HeaderComponent />
        <div className="container">{children}</div>
        <FooterComponent />
      </ClientProviders>
    </NextIntlClientProvider>
  );
}
