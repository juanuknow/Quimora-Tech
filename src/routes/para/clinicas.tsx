import { createFileRoute } from "@tanstack/react-router";
import { VerticalDetail } from "../../components/VerticalDetail";
import { getVerticalBySlug } from "../../lib/verticals-data";
import { SITE_URL } from "../../lib/site";

const SLUG = "clinicas";
const vertical = getVerticalBySlug(SLUG);

export const Route = createFileRoute("/para/clinicas")({
  head: () => ({
    meta: [
      { title: `${vertical.title} · Quimora Tech` },
      { name: "description", content: vertical.metaDescription },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: `${vertical.title} · Quimora Tech` },
      { property: "og:description", content: vertical.metaDescription },
      { property: "og:url", content: `${SITE_URL}/para/${SLUG}` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/para/${SLUG}` }],
  }),
  component: () => <VerticalDetail slug={SLUG} />,
});
