import { useEffect, useState, type ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { campaign, getMode, getDeadline, euro, discountPct, type CampaignMode } from "@/config/campaign";
import hero from "@/assets/hero-mockup.jpg";
import pCalme from "@/assets/profil-calme.jpg";
import pCadeaux from "@/assets/profil-cadeaux.jpg";
import pRevenu from "@/assets/profil-revenu.jpg";
import gNoel from "@/assets/galerie-noel.jpg";
import gCartes from "@/assets/galerie-cartes.jpg";
import gFlorals from "@/assets/galerie-florals.jpg";
import gOrnements from "@/assets/galerie-ornements.jpg";
import avantApres from "@/assets/avant-apres.jpg";

const price = euro(campaign.price);

function useMode(): CampaignMode {
  const [mode, setMode] = useState<CampaignMode>("evergreen");
  useEffect(() => setMode(getMode()), []);
  return mode;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Cta({ children, variant = "primary" }: { children: ReactNode; variant?: "primary" | "gold" }) {
  const cls =
    variant === "gold"
      ? "bg-gold-gradient text-accent-foreground"
      : "bg-primary text-primary-foreground shadow-cta";
  return (
    <a
      href={campaign.checkoutUrl}
      className={`cta-pulse inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold tracking-wide transition hover:brightness-110 md:text-lg ${cls}`}
    >
      {children}
    </a>
  );
}

function Eyebrow({ children, light }: { children: ReactNode; light?: boolean }) {
  return <p className={`eyebrow mb-4 ${light ? "text-gold" : "text-primary"}`}>{children}</p>;
}

function Snow() {
  const flakes = Array.from({ length: 18 }, (_, i) => i);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {flakes.map((i) => (
        <span
          key={i}
          className="snowflake text-xs"
          style={{ left: `${(i * 53) % 100}%`, animationDuration: `${9 + (i % 6) * 2}s`, animationDelay: `${-i * 1.3}s` }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}

function Countdown({ mode }: { mode: CampaignMode }) {
  const deadline = getDeadline(mode);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!deadline || now === null) return null;
  const diff = Math.max(0, deadline.getTime() - now);
  const parts = [
    [Math.floor(diff / 864e5), "jours"],
    [Math.floor(diff / 36e5) % 24, "h"],
    [Math.floor(diff / 6e4) % 60, "min"],
    [Math.floor(diff / 1e3) % 60, "s"],
  ] as const;
  const date = deadline.toLocaleDateString("fr-FR", { day: "numeric", month: "long", timeZone: "Europe/Paris" });
  return (
    <div className="text-center">
      <p className="mb-2 text-sm opacity-80">
        {mode === "blackfriday" ? "Offre Black Friday valable jusqu'au" : "Offre de Noël valable jusqu'au"} {date}
      </p>
      <div className="flex justify-center gap-2">
        {parts.map(([v, l]) => (
          <div key={l} className="min-w-14 rounded-lg bg-forest-deep px-3 py-2 text-secondary-foreground">
            <div className="font-display text-2xl font-bold">{String(v).padStart(2, "0")}</div>
            <div className="text-[10px] uppercase tracking-widest opacity-70">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const eyebrowByMode: Record<CampaignMode, string> = {
  blackfriday: "🎄 BLACK FRIDAY DE NOËL · OFFRE SPÉCIALE",
  noel: "🎁 NOËL FAIT MAIN · ÉDITION 2026",
  evergreen: "🧵 200 MODÈLES À IMPRIMER · ACCÈS IMMÉDIAT",
};

function Hero({ mode }: { mode: CampaignMode }) {
  return (
    <section className="relative overflow-hidden bg-forest-gradient text-secondary-foreground">
      {mode !== "evergreen" && <Snow />}
      <div className="relative mx-auto max-w-5xl px-5 pb-16 pt-10 text-center md:pt-16">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-1.5 text-xs font-semibold tracking-widest text-gold">
          {eyebrowByMode[mode]}
        </div>
        <p className="eyebrow mb-6 text-gold/80">Imprimez · Brodez · Offrez · Recommencez</p>
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
          {mode === "evergreen" ? (
            <>La broderie, le plus doux chemin vers un esprit apaisé.</>
          ) : (
            <>
              Et si votre plus beau cadeau de Noël était <em className="text-gold">un moment de douceur</em> ?
            </>
          )}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg opacity-90">
          Découvrez <strong>200 modèles de broderie sur papier à imprimer</strong> et créez de magnifiques décorations,
          cartes et cadeaux faits main, même si vous débutez.
        </p>
        <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-gold/30 shadow-soft">
          <img src={hero} alt="Modèles imprimés et cartes de Noël brodées sur papier" width={1536} height={640} className="w-full" />
        </div>
        <p className="mx-auto mt-8 max-w-xl font-display text-xl italic opacity-90">
          Cette année, prenez le temps de créer quelque chose de beau avec vos propres mains.
        </p>
        <div className="mt-8">
          <Cta variant="gold">{mode === "evergreen" ? "Je découvre BordaPapel →" : "Je profite de l'offre de Noël →"}</Cta>
        </div>
        <p className="mt-4 text-sm opacity-75">Accès immédiat · Paiement unique · Téléchargement numérique</p>
      </div>
    </section>
  );
}

const problems = [
  ["Des heures sur le téléphone", "Vous vouliez vous reposer. Vous vous sentez finalement plus vide qu'avant."],
  ["Des loisirs jamais terminés", "Une écharpe inachevée, un livre en attente, la boîte d'aquarelle encore sous plastique."],
  ["Des soirées qui se ressemblent", "Dîner, télé, téléphone, lit. On recommence. Six mois passent en un clin d'œil."],
  ["Une déco sans âme", "Des objets achetés en magasin, qui pourraient être chez n'importe qui. Y compris chez vous."],
];

function Problems() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 text-center">
      <Eyebrow>Pourquoi commencer la broderie maintenant ?</Eyebrow>
      <h2 className="reveal text-4xl font-semibold md:text-5xl">Ce cycle vous semble familier ?</h2>
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {problems.map(([t, d]) => (
          <div key={t} className="reveal rounded-2xl border bg-card p-7 text-left">
            <h3 className="text-2xl font-semibold text-secondary">{t}</h3>
            <p className="mt-3 text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
      <p className="reveal mt-12 font-display text-2xl italic text-primary">
        Il existe une façon plus douce de vivre vos soirées.
      </p>
    </section>
  );
}

const benefits = [
  ["Peu coûteux pour commencer", "Une aiguille, trois couleurs de fil et une feuille imprimée. Le reste, vous l'avez sûrement déjà à la maison."],
  ["Un calme qui s'installe", "Après quelques minutes, les mains trouvent leur rythme. Beaucoup y trouvent un vrai moment de pause, loin des écrans."],
  ["Des gestes que l'écran ne vous apprend pas", "Concentration, patience, précision du geste, sens des couleurs."],
  ["Un loisir qui peut aussi se vendre", "Marque-pages, petits tableaux, cartes personnalisées : si un jour vous souhaitez vendre vos créations, c'est possible."],
];

function Why() {
  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-5xl px-5">
        <div className="text-center">
          <Eyebrow>Pourquoi choisir la broderie sur papier ?</Eyebrow>
          <h2 className="reveal text-4xl font-semibold md:text-5xl">Un art presque oublié, quatre bienfaits à la fois.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            La broderie sur papier est accessible, peu coûteuse et apaisante : une activité créative idéale pour ralentir pendant les fêtes.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {benefits.map(([t, d], i) => (
            <div key={t} className="reveal flex gap-5 rounded-2xl bg-card p-7 shadow-soft">
              <span className="font-display text-5xl font-bold text-gold">{i + 1}.</span>
              <div>
                <h3 className="text-2xl font-semibold">{t}</h3>
                <p className="mt-2 text-muted-foreground">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const profiles = [
  {
    tab: "Pour se détendre",
    kicker: "Pour celles qui ont besoin de ralentir",
    title: "Une fatigue que le sommeil ne suffit pas à effacer.",
    text: "Vous cherchez une activité douce pour occuper vos mains, qui ne soit pas une corvée de plus. Quelques minutes par soir, sans écran ni application.",
    points: ["Un rituel du soir pour souffler.", "De jolies pièces dont vous serez fière pour décorer votre intérieur."],
    img: pCalme,
    alt: "Mains brodant des fleurs sur papier près d'une bougie",
  },
  {
    tab: "Pour offrir",
    kicker: "Pour celles qui aiment offrir",
    title: "Des cadeaux de Noël qui ont du sens.",
    text: "Des cartes de vœux qu'on garde, des étiquettes cadeaux uniques, des décorations que toute la famille remarque sous le sapin.",
    points: ["200 modèles pour toutes les occasions.", "Des idées rapides pour les cadeaux de dernière minute.", "Une touche personnelle qu'aucune carte du commerce n'offre."],
    img: pCadeaux,
    alt: "Paquet cadeau avec carte brodée d'une couronne de Noël",
  },
  {
    tab: "Pour un revenu",
    kicker: "Pour celles qui veulent un complément",
    title: "Transformer une passion en petite activité.",
    text: "Créer de belles pièces à votre rythme, depuis chez vous. En cadeau, un guide pratique pour présenter, fixer vos prix et proposer vos créations.",
    points: ["Un guide de tarification pour estimer un prix juste.", "Des modèles de publications pour présenter vos créations.", "Un mini-guide photo pour mettre vos pièces en valeur."],
    img: pRevenu,
    alt: "Marque-pages brodés emballés sur une table de marché",
  },
];

function Profiles() {
  const [active, setActive] = useState(0);
  const p = profiles[active]!;
  return (
    <section className="mx-auto max-w-5xl px-5 py-20">
      <div className="text-center">
        <Eyebrow>Qui se lance dans la broderie sur papier ?</Eyebrow>
        <h2 className="reveal text-4xl font-semibold md:text-5xl">Trois profils de débutantes s'y retrouvent.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
          Pas besoin de savoir enfiler une aiguille ni de vous sentir « manuelle ». Trouvez simplement le profil qui vous ressemble.
        </p>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-2" role="tablist">
        {profiles.map((pr, i) => (
          <button
            key={pr.tab}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${i === active ? "bg-secondary text-secondary-foreground" : "bg-muted text-foreground hover:bg-border"}`}
          >
            {pr.tab}
          </button>
        ))}
      </div>
      <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
        <div>
          <Eyebrow>{p.kicker}</Eyebrow>
          <h3 className="text-3xl font-semibold md:text-4xl">{p.title}</h3>
          <p className="mt-4 text-muted-foreground">{p.text}</p>
          <ul className="mt-6 space-y-3">
            {p.points.map((pt) => (
              <li key={pt} className="flex gap-3"><span className="text-gold">✦</span>{pt}</li>
            ))}
          </ul>
        </div>
        <img src={p.img} alt={p.alt} width={896} height={1088} loading="lazy" className="w-full rounded-2xl shadow-soft" />
      </div>
    </section>
  );
}

const steps = [
  ["Imprimez", "Téléchargez les 200 modèles, choisissez-en un et imprimez-le sur papier classique ou cartonné, avec n'importe quelle imprimante."],
  ["Brodez", "Suivez les explications pas à pas. Le matériel est simple, peu coûteux et se trouve dans toute mercerie ou boutique en ligne."],
  ["Gardez, offrez ou vendez", "Encadrez-la. Glissez-la sous le sapin. Ou présentez-la grâce au guide offert. Vous décidez, à votre rythme."],
];

function Steps() {
  return (
    <section className="bg-forest-gradient py-20 text-secondary-foreground">
      <div className="mx-auto max-w-5xl px-5 text-center">
        <Eyebrow light>Comment ça marche</Eyebrow>
        <h2 className="text-4xl font-semibold md:text-5xl">Trois étapes, une création.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map(([t, d], i) => (
            <div key={t} className="reveal stitch-border rounded-2xl p-7 text-left">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient font-display text-2xl font-bold text-accent-foreground">{i + 1}</span>
              <h3 className="mt-5 text-2xl font-semibold">{t}</h3>
              <p className="mt-3 opacity-85">{d}</p>
            </div>
          ))}
        </div>
        <figure className="reveal mx-auto mt-14 max-w-3xl">
          <img src={avantApres} alt="Avant / après : modèle imprimé et broderie terminée" width={1280} height={720} loading="lazy" className="w-full rounded-2xl" />
          <figcaption className="mt-3 flex justify-between text-sm opacity-80"><span>Avant : le modèle imprimé</span><span>Après : la broderie terminée</span></figcaption>
        </figure>
        <div className="mt-10"><Cta variant="gold">Accéder maintenant →</Cta></div>
      </div>
    </section>
  );
}

const gallery = [
  { cat: "Noël", title: "Cartes et étiquettes de Noël", img: gNoel },
  { cat: "Noël", title: "Décorations de Noël en papier", img: gOrnements },
  { cat: "Cartes", title: "Cartes et marque-pages", img: gCartes },
  { cat: "Tableaux", title: "Petits tableaux floraux", img: gFlorals },
];
const cats = ["Tout", "Noël", "Cartes", "Tableaux"];

function Gallery() {
  const [cat, setCat] = useState("Tout");
  const items = gallery.filter((g) => cat === "Tout" || g.cat === cat);
  return (
    <section className="mx-auto max-w-5xl px-5 py-20">
      <div className="text-center">
        <Eyebrow>Ce que vous pourrez créer</Eyebrow>
        <h2 className="reveal text-4xl font-semibold md:text-5xl">Du marque-page au souvenir de famille.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
          Le coffret réunit 200 modèles classés par catégorie : cartes de Noël brodées, étiquettes cadeaux, cartes de vœux, marque-pages, décorations, petits tableaux floraux et cadeaux personnalisés. Photos d'inspiration.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${c === cat ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-border"}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {items.map((g) => (
          <figure key={g.title} className="overflow-hidden rounded-2xl bg-card shadow-soft">
            <img src={g.img} alt={g.title} width={832} height={832} loading="lazy" className="aspect-square w-full object-cover transition duration-500 hover:scale-105" />
            <figcaption className="p-5">
              <span className="eyebrow text-primary">{g.cat}</span>
              <h3 className="mt-1 text-2xl font-semibold">{g.title}</h3>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

const bonuses = [
  { n: "Cadeau Nº 1", kicker: "Du papier à la vente", title: "Guide de vos premières ventes", text: "Un guide pratique pour présenter, tarifer et proposer vos créations faites main : plan d'action, check-lists et exemples de publications." },
  { n: "Cadeau Nº 2", kicker: "Fixez vos prix sereinement", title: "Kit de calcul des prix", text: "Une calculatrice simple pour estimer le coût du matériel, le temps de réalisation et la marge souhaitée. Avec le Carnet de l'artisane." },
  { n: "Cadeau Nº 3", kicker: "Photographiez. Présentez. Partagez.", title: "Kit Vitrine de l'Atelier", text: "Conseils photo en lumière naturelle, modèles de présentation produit et exemples de messages pour parler de vos créations." },
];

function Bonuses() {
  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-5xl px-5">
        <div className="text-center">
          <Eyebrow>🎁 Trois cadeaux à déballer avec votre coffret</Eyebrow>
          <h2 className="reveal text-4xl font-semibold md:text-5xl">Trois bonus inclus, sans supplément.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {bonuses.map((b, i) => (
            <article key={b.title} className="reveal relative overflow-hidden rounded-2xl bg-card shadow-soft">
              <div className="relative flex h-44 items-center justify-center bg-forest-gradient">
                <div aria-hidden className="absolute inset-y-0 left-1/2 w-5 -translate-x-1/2 bg-primary" />
                <div aria-hidden className="absolute inset-x-0 top-1/2 h-5 -translate-y-1/2 bg-primary" />
                <span className="relative rounded-full bg-gold-gradient px-4 py-1.5 text-sm font-bold text-accent-foreground">{b.n}</span>
              </div>
              <div className="p-6">
                <p className="eyebrow text-primary">{b.kicker}</p>
                <h3 className="mt-2 text-2xl font-semibold">{b.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{b.text}</p>
                <p className="mt-4 text-sm font-semibold text-secondary">✓ Inclus · valeur indicative {euro(campaign.bonusValues[i] ?? 0)}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">Aucun revenu ni aucune vente n'est garanti : les résultats dépendent de chacune.</p>
      </div>
    </section>
  );
}

const included = [
  "📚 200 modèles de broderie sur papier à imprimer (PDF)",
  "🎄 Une sélection de modèles de Noël : cartes, étiquettes, décorations",
  "📖 Guide illustré pas à pas pour débutantes",
  "🎨 Liste du matériel nécessaire",
  "🎁 Les 3 cadeaux : guide de ventes, kit de prix, kit vitrine",
];

function Offer({ mode }: { mode: CampaignMode }) {
  return (
    <section id="offre" className="relative overflow-hidden bg-forest-gradient py-20 text-secondary-foreground">
      {mode !== "evergreen" && <Snow />}
      <div className="relative mx-auto max-w-xl px-5">
        <div className="text-center">
          <Eyebrow light>{mode === "blackfriday" ? "Black Friday de Noël" : mode === "noel" ? "Offre de Noël" : "Offre"}</Eyebrow>
          <h2 className="text-4xl font-semibold md:text-5xl">BordaPapel — Coffret Créatif de Noël</h2>
          <p className="mt-3 opacity-80">Paiement unique. Produit 100 % numérique.</p>
        </div>
        <div className="mt-10 rounded-3xl bg-card p-8 text-card-foreground shadow-soft">
          <div className="mb-6"><Countdown mode={mode} /></div>
          <ul className="space-y-3">
            {included.map((x) => <li key={x} className="border-b border-border pb-3 last:border-0">{x}</li>)}
          </ul>
          <div className="mt-8 text-center">
            {campaign.showReferencePrice && mode !== "evergreen" && (
              <p className="text-muted-foreground">
                <s>{euro(campaign.referencePrice)}</s>{" "}
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">−{discountPct()} %</span>
              </p>
            )}
            <p className="mt-2 font-display text-6xl font-bold text-primary">{price}</p>
            <p className="text-sm text-muted-foreground">Paiement unique · sans abonnement</p>
            <div className="mt-6"><Cta>Oui, je veux mes 200 modèles pour {price}</Cta></div>
            <p className="mt-4 text-xs text-muted-foreground">
              Accès immédiat par e-mail après l'achat · Téléchargement numérique · Aucun envoi physique
            </p>
            {campaign.showReferencePrice && mode !== "evergreen" && (
              <p className="mt-2 text-[11px] text-muted-foreground">{campaign.referencePriceNote}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  if (campaign.testimonials.length === 0) return null;
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 text-center">
      <Eyebrow>💬 Elles ont essayé</Eyebrow>
      <h2 className="text-4xl font-semibold md:text-5xl">Ce qu'en disent nos clientes.</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {campaign.testimonials.map((t) => (
          <blockquote key={t.name} className="rounded-2xl bg-card p-6 text-left shadow-soft">
            <p className="italic">« {t.text} »</p>
            <footer className="mt-4 text-sm font-semibold">{t.name} · {t.city}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function Guarantee() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-20 text-center">
      <div className="stitch-border rounded-3xl bg-card p-10">
        <Eyebrow>🛡️ Une garantie simple</Eyebrow>
        <h2 className="text-4xl font-semibold md:text-5xl">{campaign.guaranteeDays} jours satisfaite ou remboursée.</h2>
        <p className="mt-5 text-muted-foreground">
          Essayez le coffret complet : imprimez les modèles, réalisez vos premières broderies. Si la broderie sur papier ne vous plaît pas, envoyez-nous simplement un e-mail dans les {campaign.guaranteeDays} jours suivant l'achat et nous vous rembourserons intégralement, selon nos conditions de remboursement.
        </p>
      </div>
    </section>
  );
}

const faqs: [string, string][] = [
  ["Je n'ai jamais brodé. Vais-je y arriver ?", "Oui. Le guide reprend tout depuis le début : enfiler l'aiguille, faire les nœuds et les quelques points de base utilisés dans tous les modèles. Les trous à percer servent de repère, ce qui rend la broderie sur papier très accessible."],
  ["Que dois-je acheter pour commencer ?", "Une aiguille, quelques fils à broder, du papier (classique ou cartonné) et un outil pour percer, comme un poinçon ou une punaise. Tout se trouve facilement en mercerie ou en ligne, et la liste complète est fournie."],
  ["Quelle différence avec la broderie sur tissu ?", "Sur papier, les trous sont déjà indiqués sur le modèle imprimé : pas de tambour, pas de tissu à tendre, pas de motif à transférer. C'est plus simple pour débuter, et tout aussi joli."],
  ["Est-ce que je reçois quelque chose par la poste ?", "Non, BordaPapel est un produit 100 % numérique. Vous recevez l'accès par e-mail juste après l'achat et vous imprimez les modèles chez vous, autant de fois que vous le souhaitez pour un usage personnel."],
  ["Puis-je vendre mes créations ?", "Vous pouvez vendre les pièces que vous brodez vous-même. Les guides offerts vous aident à les présenter et à fixer vos prix, sans garantie de résultat."],
  ["Combien de temps ai-je accès ?", "Vous payez une seule fois, sans abonnement, et conservez vos fichiers téléchargés."],
  ["Et si ce n'est pas pour moi ?", `Écrivez-nous dans les ${campaign.guaranteeDays} jours suivant l'achat et nous vous rembourserons intégralement, selon nos conditions de remboursement.`],
];

function Faq() {
  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-3xl px-5">
        <div className="text-center">
          <Eyebrow>Questions fréquentes</Eyebrow>
          <h2 className="text-4xl font-semibold md:text-5xl">Vos questions, nos réponses.</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10 rounded-2xl bg-card px-6">
          {faqs.map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger className="text-left text-base font-semibold">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function Closing({ mode }: { mode: CampaignMode }) {
  return (
    <section className="relative overflow-hidden bg-forest-gradient py-24 text-center text-secondary-foreground">
      {mode !== "evergreen" && <Snow />}
      <div className="relative mx-auto max-w-3xl px-5">
        <Eyebrow light>Une dernière chose</Eyebrow>
        <h2 className="text-4xl font-semibold leading-tight md:text-5xl">
          {mode === "evergreen" ? "Ce soir, au lieu de faire défiler votre écran, brodez." : "Ce Noël, offrez plus qu'un cadeau. Offrez quelque chose créé avec le cœur."}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl opacity-90">
          Imaginez la joie d'offrir une carte, une décoration ou un petit souvenir que vous avez réalisé vous-même. Avec 200 modèles prêts à imprimer, votre prochaine création commence aujourd'hui.
        </p>
        <p className="mt-4 font-display text-xl italic text-gold">Et gardez-en un peu pour vous : le plaisir de créer est aussi un cadeau.</p>
        <div className="mt-10"><Cta variant="gold">Je commence mes créations de Noël →</Cta></div>
      </div>
    </section>
  );
}

function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 border-t border-gold/30 bg-forest-deep px-4 py-3 text-secondary-foreground md:hidden">
      <div>
        <p className="text-xs opacity-75">Coffret 200 modèles</p>
        <p className="font-display text-2xl font-bold text-gold">{price}</p>
      </div>
      <a href={campaign.checkoutUrl} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">J'en profite →</a>
    </div>
  );
}

export function Landing() {
  const mode = useMode();
  useReveal();
  return (
    <main className="pb-20 md:pb-0">
      <Hero mode={mode} />
      <Problems />
      <Why />
      <Profiles />
      <Steps />
      <Gallery />
      <Bonuses />
      <Offer mode={mode} />
      <Testimonials />
      <Guarantee />
      <Faq />
      <Closing mode={mode} />
      <footer className="bg-forest-deep py-8 text-center text-xs text-secondary-foreground/70">
        © 2026 BordaPapel · Produit numérique · Photos d'inspiration non contractuelles
      </footer>
      <StickyCta />
    </main>
  );
}
