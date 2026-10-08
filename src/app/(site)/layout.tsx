import { Header } from "@/components/header";
import { JsonLd, siteGraph } from "@/lib/json-ld";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <JsonLd data={siteGraph} />
      <Header />
      {children}
    </>
  );
}
