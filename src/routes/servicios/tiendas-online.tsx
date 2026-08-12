import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetail } from "../../components/ServiceDetail";
import { getServiceBySlug } from "../../lib/services-data";
import { SITE_URL } from "../../lib/site";

const SLUG = "tiendas-online";
const service = getServiceBySlug(SLUG);

export const Route = createFileRoute("/servicios/tiendas-online")({
  head: () => ({
    meta: [
      { title: `${service.title} · Quimora Tech` },
      { name: "description", content: service.body },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: `${service.title} · Quimora Tech` },
      { property: "og:description", content: service.body },
      { property: "og:url", content: `${SITE_URL}/servicios/${SLUG}` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/servicios/${SLUG}` }],
  }),
  component: () => <ServiceDetail slug={SLUG} />,
});
