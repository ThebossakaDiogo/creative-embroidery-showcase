import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/landing/Landing";
import { hero } from "@/config/media";

const title = "Broderie sur Papier : 200 Modèles à Imprimer | BordaPapel";
const description =
  "Découvrez 200 modèles de broderie sur papier à imprimer. Créez de jolies cartes, décorations et cadeaux faits main pour Noël, même en débutant.";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      { rel: "preload", as: "image", href: hero, fetchpriority: "high" },
    ],
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});
