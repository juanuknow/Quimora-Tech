import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetail } from "../../components/ServiceDetail";
import { getServiceBySlug } from "../../lib/services-data";
import { SITE_URL } from "../../lib/site";

const SLUG = "sistemas-de-inventario";
const service = getServiceBySlug(SLUG);

export const Route = createFileRoute("/servicios/sistemas-de-inventario")({
  head: () => ({
    meta: [
      { title: "Sistemas de Inventario para Empresas en Cali · Quimora Tech" },
      { name: "description", content: service.metaDescription ?? service.body },
      { name: "robots", content: "index, follow" },
      {
        property: "og:title",
        content: "Sistemas de Inventario para Empresas en Cali · Quimora Tech",
      },
      { property: "og:description", content: service.metaDescription ?? service.body },
      { property: "og:url", content: `${SITE_URL}/servicios/${SLUG}` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/servicios/${SLUG}` }],
  }),
  component: () => <ServiceDetail slug={SLUG} />,
});
