import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/landing/Landing";
import { hero } from "@/config/media";

const title = "BordaPapel | 200 modèles de broderie sur papier à imprimer";
const description =
  "Imprimez 200 gabarits et apprenez la broderie sur papier à votre rythme. Cartes, étiquettes et décorations à réaliser avec un matériel simple.";

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "BordaPapel — 200 modèles de broderie sur papier",
  description,
  category: "Loisirs créatifs et broderie sur papier",
  brand: { "@type": "Brand", name: "BordaPapel" },
  additionalProperty: [
    { "@type": "PropertyValue", name: "Nombre de modèles", value: "200" },
    { "@type": "PropertyValue", name: "Format", value: "Fichiers numériques à imprimer" },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: hero, fetchpriority: "high" },
    ],
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(productSchema) }],
  }),
  component: Landing,
});
