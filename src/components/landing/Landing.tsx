import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { campaign, getMode, euro, discountPct, type CampaignMode } from "@/config/campaign";
import {
  avantApres,
  bonusCalculPrix,
  bonusGuideVentes,
  bonusVitrineAtelier,
  demonstrationPoster,
  gCartes,
  gFlorals,
  gNoel,
  gOrnements,
  guaranteeSeal,
  hero,
  pCadeaux,
  pCalme,
  pRevenu,
  portraitClaire,
  portraitNadia,
  portraitSophie,
} from "@/config/media";
import demonstrationVideo from "@/assets/bordapapel-demonstration.mp4.asset.json";
import { UpsellProvider, useUpsell } from "@/components/landing/Upsell";
import { CampaignCountdown } from "@/components/landing/CampaignCountdown";

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

function useImageDownloadDeterrent() {
  useEffect(() => {
    const deterImageAction = (event: Event) => {
      if (event.target instanceof HTMLImageElement) event.preventDefault();
    };
    document.addEventListener("contextmenu", deterImageAction);
    document.addEventListener("dragstart", deterImageAction);
    return () => {
      document.removeEventListener("contextmenu", deterImageAction);
      document.removeEventListener("dragstart", deterImageAction);
    };
  }, []);
}

function Cta({
  children,
  variant = "primary",
}: {
  children: ReactNode;
  variant?: "primary" | "gold";
}) {
  const openUpsell = useUpsell();
  const cls =
    variant === "gold"
      ? "bg-gold-gradient text-accent-foreground"
      : "bg-primary text-primary-foreground shadow-cta";
  return (
    <button
      type="button"
      data-purchase-cta
      onClick={openUpsell}
      className={`cta-pulse inline-flex items-center justify-center rounded-full px-8 py-4 text-center text-base font-bold leading-snug tracking-wide transition hover:brightness-110 md:text-lg ${cls}`}
    >
      {children}
    </button>
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
          style={{
            left: `${(i * 53) % 100}%`,
            animationDuration: `${9 + (i % 6) * 2}s`,
            animationDelay: `${-i * 1.3}s`,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}

function DemonstrationVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);
    const element = containerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setActive(true);
        observer.disconnect();
      },
      { rootMargin: "250px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden rounded-2xl border border-gold/30 bg-forest-deep shadow-soft"
    >
      <video
        src={active ? demonstrationVideo.url : undefined}
        poster={demonstrationPoster}
        autoPlay={active && !reduceMotion}
        loop={!reduceMotion}
        muted
        controls={reduceMotion}
        playsInline
        preload={active ? "metadata" : "none"}
        controlsList="nodownload"
        aria-label="Démonstration de broderie sur papier"
        width={1080}
        height={1350}
        className="block aspect-[4/5] h-auto w-full object-cover"
      />
    </div>
  );
}

const eyebrowByMode: Record<CampaignMode, string> = {
  blackfriday: "🎁 BLACK FRIDAY WEEK · OFFRE DE NOËL",
  noel: "🎁 NOËL FAIT MAIN · ÉDITION 2026",
  evergreen: "🧵 200 MODÈLES À IMPRIMER · ACCÈS IMMÉDIAT",
};

function Hero({ mode }: { mode: CampaignMode }) {
  return (
    <section className="relative overflow-hidden bg-forest-gradient text-secondary-foreground">
      {mode !== "evergreen" && <Snow />}
      <div className="relative mx-auto max-w-5xl px-5 pb-16 pt-10 text-center md:pt-14">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-forest-deep/40 px-4 py-2 text-xs font-bold tracking-widest text-gold">
          {eyebrowByMode[mode]}
        </div>
        <p className="eyebrow mb-5 text-gold/80">Votre atelier créatif, imprimé chez vous</p>
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
          {mode === "evergreen" ? (
            <>
              Transformez une simple feuille en broderie,{" "}
              <span className="text-gold">même à vos débuts.</span>
            </>
          ) : (
            <>
              Pour Noël, brodez des présents que l'on gardera,{" "}
              <span className="text-gold">même à vos débuts.</span>
            </>
          )}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-secondary-foreground/90 md:text-xl">
          Choisissez parmi <strong>200 gabarits</strong>, imprimez votre favori et laissez le guide
          vous accompagner jusqu'au dernier point.
        </p>

        <div className="mt-8">
          <Cta variant="gold">
            {mode === "blackfriday"
              ? "Je profite de la Black Friday Week"
              : mode === "noel"
                ? "Je profite de l'offre de Noël"
                : "Je découvre BordaPapel"}
          </Cta>
        </div>
        <p className="mt-4 text-sm font-medium text-secondary-foreground/80">
          Accès numérique immédiat · 3 bonus inclus · Aucun abonnement
        </p>

        <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-gold/30 shadow-soft">
          <img
            src={hero}
            alt="Gabarits imprimés, fils colorés et cartes de Noël brodées sur papier"
            width={1536}
            height={640}
            decoding="async"
            fetchPriority="high"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}

const problems = [
  [
    "Le défilement sans fin",
    "Vous déposez le téléphone une heure plus tard, sans avoir vraiment soufflé.",
  ],
  [
    "Les projets trop ambitieux",
    "Le matériel s'accumule, mais le temps ou les explications manquent pour passer à l'action.",
  ],
  [
    "Le manque de repères",
    "Vous aimeriez essayer un ouvrage manuel sans devoir apprendre seule chaque technique.",
  ],
  [
    "Les cadeaux impersonnels",
    "Trouver une attention originale devient compliqué quand tout se ressemble en magasin.",
  ],
];

function Problems() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 text-center">
      <Eyebrow>Une envie de faire autrement</Eyebrow>
      <h2 className="reveal text-4xl font-bold md:text-5xl">
        Vos envies créatives restent trop souvent en attente.
      </h2>
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {problems.map(([t, d]) => (
          <div key={t} className="reveal rounded-2xl border bg-card p-7 text-left">
            <h3 className="text-2xl font-bold text-secondary">{t}</h3>
            <p className="mt-3 text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
      <p className="reveal mt-12 font-display text-2xl text-primary">
        Une aiguille, du fil et quelques minutes peuvent changer le rythme de votre soirée.
      </p>
    </section>
  );
}

const benefits = [
  [
    "Un matériel minimal",
    "Une feuille, une aiguille et quelques fils suffisent pour préparer votre premier ouvrage.",
  ],
  [
    "Une pause qui se savoure",
    "Les gestes se répètent doucement et vous offrent une occupation manuelle loin des notifications.",
  ],
  [
    "Des progrès visibles",
    "Les perforations indiquent le chemin : vous avancez point par point, avec un résultat qui se dessine rapidement.",
  ],
  [
    "Des pièces à votre nom",
    "Cartes, marque-pages ou petits tableaux deviennent des attentions uniques, que vous pouvez aussi proposer à la vente.",
  ],
];

function Why() {
  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-5xl px-5">
        <div className="text-center">
          <Eyebrow>Le plaisir du fait main, sans atelier compliqué</Eyebrow>
          <h2 className="reveal text-4xl font-bold md:text-5xl">
            Un loisir simple à installer et agréable à pratiquer.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            Pas de tambour ni de tissu à tendre : le papier imprimé sert de support et de guide pour
            vous laisser apprécier le geste.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {benefits.map(([t, d], i) => (
            <div key={t} className="reveal flex gap-5 rounded-2xl bg-card p-7 shadow-soft">
              <span className="font-display text-5xl font-bold text-gold">{i + 1}.</span>
              <div>
                <h3 className="text-2xl font-bold">{t}</h3>
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
    kicker: "Un rituel pour ralentir",
    title: "Occupez vos mains, laissez la journée s'éloigner.",
    text: "Installez-vous avec une tasse de thé et avancez sans chrono. Le gabarit vous aide à rester concentrée sur le plaisir de faire.",
    points: [
      "Une occupation douce, sans écran ni application.",
      "Un ouvrage personnel à encadrer ou à offrir.",
    ],
    img: pCalme,
    alt: "Mains brodant des fleurs sur papier près d'une bougie",
  },
  {
    tab: "Pour offrir",
    kicker: "Une attention qui ne ressemble à aucune autre",
    title: "Glissez un morceau de vous dans chaque paquet.",
    text: "Associez les couleurs, choisissez un motif et fabriquez une carte ou une étiquette qui raconte quelque chose de votre lien.",
    points: [
      "Des thèmes variés pour les fêtes et le quotidien.",
      "Des petits formats adaptés aux envies de dernière minute.",
      "Une finition personnelle impossible à confondre avec une carte du commerce.",
    ],
    img: pCadeaux,
    alt: "Paquet cadeau avec carte brodée d'une couronne de Noël",
  },
  {
    tab: "Pour un revenu",
    kicker: "Des outils pour présenter vos ouvrages",
    title: "Préparez vos premières pièces à proposer.",
    text: "Travaillez à votre rythme, puis utilisez les ressources incluses pour organiser vos prix et soigner votre présentation.",
    points: [
      "Une méthode pour additionner matériel et temps de travail.",
      "Des trames de publications pour expliquer votre démarche.",
      "Des conseils photo simples, réalisables avec un smartphone.",
    ],
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
        <Eyebrow>Une activité, plusieurs façons de l'apprivoiser</Eyebrow>
        <h2 className="reveal text-4xl font-bold md:text-5xl">
          Choisissez l'expérience qui vous ressemble.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
          Aucun niveau n'est requis : commencez par l'envie de vous détendre, d'offrir ou de
          présenter vos propres ouvrages.
        </p>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-2" role="tablist">
        {profiles.map((pr, i) => (
          <button
            key={pr.tab}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${i === active ? "bg-secondary text-secondary-foreground" : "bg-muted text-foreground hover:bg-border"}`}
          >
            {pr.tab}
          </button>
        ))}
      </div>
      <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
        <div>
          <Eyebrow>{p.kicker}</Eyebrow>
          <h3 className="text-3xl font-bold md:text-4xl">{p.title}</h3>
          <p className="mt-4 text-muted-foreground">{p.text}</p>
          <ul className="mt-6 space-y-3">
            {p.points.map((pt) => (
              <li key={pt} className="flex gap-3">
                <span className="text-gold">✦</span>
                {pt}
              </li>
            ))}
          </ul>
        </div>
        <img
          src={p.img}
          alt={p.alt}
          width={896}
          height={1088}
          loading="lazy"
          decoding="async"
          className="w-full rounded-2xl shadow-soft"
        />
      </div>
    </section>
  );
}

const steps = [
  [
    "Préparez la feuille",
    "Sélectionnez un gabarit et imprimez-le sur du papier classique ou cartonné.",
  ],
  [
    "Suivez les repères",
    "Percez les points indiqués, puis enfilez le fil en suivant les explications illustrées.",
  ],
  [
    "Finalisez votre ouvrage",
    "Découpez, encadrez ou attachez votre pièce : le guide reste disponible pour les suivantes.",
  ],
];

function Steps() {
  return (
    <section className="bg-forest-gradient py-16 text-secondary-foreground md:py-20">
      <div className="mx-auto max-w-6xl px-5 text-center">
        <Eyebrow light>Du premier trou au dernier point</Eyebrow>
        <h2 className="text-4xl font-bold md:text-5xl">Imprimez, percez, brodez.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-secondary-foreground/85">
          Chaque étape est expliquée pour vous permettre d'apprendre en réalisant.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map(([t, d], i) => (
            <div
              key={t}
              className="reveal stitch-border rounded-2xl bg-forest-deep/25 p-6 text-left"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient font-display text-2xl font-extrabold text-accent-foreground">
                {i + 1}
              </span>
              <h3 className="mt-5 text-2xl font-bold">{t}</h3>
              <p className="mt-3 leading-relaxed text-secondary-foreground/85">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr]">
          <div className="mx-auto w-full max-w-sm">
            <DemonstrationVideo />
            <p className="mt-3 text-sm font-bold text-gold">
              Observez le mouvement avant de prendre l'aiguille.
            </p>
          </div>
          <div className="text-center md:text-left">
            <Eyebrow light>Des indications concrètes</Eyebrow>
            <h3 className="text-3xl font-bold md:text-4xl">
              Vous savez toujours où placer le prochain point.
            </h3>
            <p className="mt-4 text-secondary-foreground/85">
              Le support indique les perforations et le passage du fil. Le motif apparaît
              progressivement, sans transfert complexe.
            </p>
            <figure className="mt-6">
              <img
                src={avantApres}
                alt="Avant / après : modèle imprimé et broderie terminée"
                width={1280}
                height={720}
                loading="lazy"
                decoding="async"
                className="w-full rounded-2xl border border-gold/20"
              />
              <figcaption className="reveal mt-3 flex justify-between gap-4 text-sm text-secondary-foreground/80">
                <span>Avant : le modèle</span>
                <span>Après : votre broderie</span>
              </figcaption>
            </figure>
          </div>
        </div>
        <div className="mt-10">
          <Cta variant="gold">Je crée ma première broderie →</Cta>
        </div>
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
        <Eyebrow>Un coffret pour varier les projets</Eyebrow>
        <h2 className="reveal text-4xl font-bold md:text-5xl">
          Passez d'une carte délicate à un tableau floral.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
          Explorez les catégories selon votre envie : vœux, étiquettes, marque-pages ou ornements.
          Les photographies donnent un aperçu des possibilités.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${c === cat ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-border"}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {items.map((g) => (
          <figure key={g.title} className="overflow-hidden rounded-2xl bg-card shadow-soft">
            <img
              src={g.img}
              alt={g.title}
              width={832}
              height={832}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full object-cover transition duration-500 hover:scale-105"
            />
            <figcaption className="p-5">
              <span className="eyebrow text-primary">{g.cat}</span>
              <h3 className="mt-1 text-2xl font-bold">{g.title}</h3>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

const bonuses = [
  {
    n: "Cadeau Nº 1",
    kicker: "Organisez votre démarche",
    title: "Guide de vos premières ventes",
    text: "Un plan d'action, des check-lists et des exemples de publications pour présenter vos ouvrages avec méthode.",
    img: bonusGuideVentes,
    alt: "Guide de vente et cartes de broderie sur papier",
  },
  {
    n: "Cadeau Nº 2",
    kicker: "Additionnez les bons éléments",
    title: "Kit de calcul des prix",
    text: "Estimez le matériel, le temps passé et la marge souhaitée avec une calculatrice et le Carnet de l'artisane.",
    img: bonusCalculPrix,
    alt: "Tablette, calculatrice et matériel pour calculer le prix des créations",
  },
  {
    n: "Cadeau Nº 3",
    kicker: "Soignez votre présentation",
    title: "Kit Vitrine de l'Atelier",
    text: "Profitez de conseils photo, de trames de fiches produit et de messages pour montrer le détail de votre travail.",
    img: bonusVitrineAtelier,
    alt: "Smartphone photographiant des cartes brodées pour le kit vitrine",
  },
];

function Bonuses() {
  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-5xl px-5">
        <div className="text-center">
          <Eyebrow>🎁 Des ressources pour aller plus loin</Eyebrow>
          <h2 className="reveal text-4xl font-bold md:text-5xl">
            Vos trois bonus sont déjà inclus.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {bonuses.map((b, i) => (
            <article
              key={b.title}
              className="group relative overflow-hidden rounded-2xl bg-card shadow-soft"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-forest-gradient">
                <img
                  src={b.img}
                  alt={b.alt}
                  width={1448}
                  height={1086}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-gold-gradient px-4 py-1.5 text-sm font-bold text-accent-foreground shadow-soft">
                  {b.n}
                </span>
              </div>
              <div className="reveal p-6">
                <p className="eyebrow text-primary">{b.kicker}</p>
                <h3 className="mt-2 text-2xl font-bold">{b.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{b.text}</p>
                <p className="mt-4 text-sm font-bold text-secondary">
                  ✓ Inclus · valeur indicative {euro(campaign.bonusValues[i] ?? 0)}
                </p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Aucun revenu ni aucune vente n'est garanti : les résultats dépendent de chacune.
        </p>
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
    <section
      id="offre"
      className="relative overflow-hidden bg-forest-gradient py-16 text-secondary-foreground md:py-20"
    >
      {mode !== "evergreen" && <Snow />}
      <div className="relative mx-auto max-w-2xl px-5">
        <div className="text-center">
          <Eyebrow light>
            {mode === "blackfriday"
              ? "Black Friday Week · Offre Essentielle"
              : mode === "noel"
                ? "Offre de Noël"
                : "Offre Essentielle"}
          </Eyebrow>
          <h2 className="text-4xl font-bold md:text-5xl">
            Votre coffret numérique, prêt à imprimer.
          </h2>
          <p className="mt-3 text-lg text-secondary-foreground/85">
            Les 200 gabarits, les explications et les trois ressources offertes, réunis dans un seul
            paiement.
          </p>
        </div>
        <div className="mt-9 rounded-3xl border border-gold/30 bg-card p-5 text-card-foreground shadow-soft md:p-8">
          {mode !== "evergreen" && (
            <div className="mb-7 rounded-2xl bg-forest-gradient p-5 text-secondary-foreground">
              <CampaignCountdown mode={mode} />
            </div>
          )}
          <ul className="space-y-3 text-left font-medium">
            {included.map((x) => (
              <li key={x} className="border-b border-border pb-3 leading-relaxed last:border-0">
                {x}
              </li>
            ))}
          </ul>

          <div className="mt-7 rounded-3xl border-2 border-gold/70 bg-gold-gradient p-6 text-center text-accent-foreground md:p-8">
            {campaign.showReferencePrice && mode !== "evergreen" ? (
              <>
                <span className="inline-flex rounded-full bg-primary px-4 py-1.5 text-sm font-extrabold uppercase tracking-wide text-primary-foreground">
                  {mode === "blackfriday" ? "Black Friday Week" : "Offre de Noël"} · −
                  {discountPct()} %
                </span>
                <p className="mt-4 text-base font-bold">
                  Au lieu de <s>{euro(campaign.referencePrice)}</s>
                </p>
              </>
            ) : (
              <span className="inline-flex rounded-full bg-secondary px-4 py-1.5 text-sm font-bold text-secondary-foreground">
                Offre Essentielle
              </span>
            )}
            <p className="mt-2 font-display text-7xl font-black leading-none tracking-tight text-primary md:text-8xl">
              {price}
            </p>
            <p className="mt-3 font-bold">Paiement unique · sans abonnement</p>
            <div className="mt-6">
              <Cta>Oui, je veux mes 200 modèles pour {price}</Cta>
            </div>
            <p className="mt-4 text-xs font-medium opacity-80">
              Accès immédiat par e-mail · Produit 100 % numérique · Aucun envoi physique
            </p>
          </div>
          {campaign.showReferencePrice && mode !== "evergreen" && (
            <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
              {campaign.referencePriceNote}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

const creativeExamples = [
  {
    title: "Un motif botanique",
    img: portraitClaire,
    alt: "Mains brodant un motif botanique sur papier",
  },
  {
    title: "Une étiquette à offrir",
    img: portraitNadia,
    alt: "Mains préparant une étiquette cadeau brodée",
  },
  {
    title: "Une collection de cartes",
    img: portraitSophie,
    alt: "Mains disposant des cartes brodées sur une table",
  },
];

function CreativeExamples() {
  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-6xl px-5 text-center">
        <Eyebrow>Quelques idées</Eyebrow>
        <h2 className="text-4xl font-bold md:text-5xl">Imaginez votre prochain ouvrage.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
          Trois exemples de supports à personnaliser avec les gabarits BordaPapel, vos couleurs et
          votre rythme.
        </p>
        <div className="mt-10 grid gap-6 text-left md:grid-cols-3">
          {creativeExamples.map((example) => (
            <article
              key={example.title}
              className="overflow-hidden rounded-3xl bg-card shadow-soft"
            >
              <div className="aspect-[3/4] overflow-hidden bg-secondary">
                <img
                  src={example.img}
                  alt={example.alt}
                  width={640}
                  height={960}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold">{example.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewStars({ rating }: { rating: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div className="mb-4 flex gap-1 text-xl" aria-label={`Note : ${rating} sur 5 étoiles`}>
      <span aria-hidden className="contents">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className={index < rating ? "text-gold" : "text-border"}>
            ★
          </span>
        ))}
      </span>
    </div>
  );
}

function Testimonials() {
  if (campaign.testimonials.length === 0) return null;
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 text-center">
      <Eyebrow>💬 Elles ont essayé</Eyebrow>
      <h2 className="text-4xl font-bold md:text-5xl">Ce qu'en disent nos clientes.</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {campaign.testimonials.map((t) => (
          <blockquote key={t.name} className="rounded-2xl bg-card p-6 text-left shadow-soft">
            <ReviewStars rating={t.rating} />
            <p className="italic">« {t.text} »</p>
            <footer className="mt-4 text-sm font-bold">
              {t.name} · {t.city}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function Guarantee() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20">
      <div className="stitch-border grid items-center gap-8 rounded-3xl bg-card p-6 text-center md:grid-cols-[280px_1fr] md:p-10 md:text-left">
        <div className="relative mx-auto w-full max-w-64">
          <div className="absolute inset-8 rounded-full bg-gold/20 blur-2xl" aria-hidden />
          <img
            src={guaranteeSeal}
            alt="Sceau brodé : garantie de 30 jours"
            width={640}
            height={640}
            loading="lazy"
            decoding="async"
            className="relative h-auto w-full"
          />
        </div>
        <div className="reveal">
          <Eyebrow>Prenez le temps d'essayer</Eyebrow>
          <h2 className="text-4xl font-bold md:text-5xl">
            {campaign.guaranteeDays} jours pour faire votre choix.
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Ouvrez les fichiers, imprimez un gabarit et essayez la méthode. Si elle ne vous convient
            pas, écrivez-nous dans les {campaign.guaranteeDays} jours suivant l'achat : vous serez
            intégralement remboursée selon nos conditions.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm font-bold text-secondary md:justify-start">
            <span className="rounded-full bg-muted px-4 py-2">
              ✓ {campaign.guaranteeDays} jours pour essayer
            </span>
            <span className="rounded-full bg-muted px-4 py-2">✓ Une simple demande par e-mail</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const faqs: [string, string][] = [
  [
    "Faut-il déjà savoir broder ?",
    "Non. Le guide explique la préparation de l'aiguille, les nœuds et les points utilisés. Les perforations du gabarit vous donnent un chemin précis à suivre.",
  ],
  [
    "Quel matériel faut-il prévoir ?",
    "Prévoyez une aiguille, du fil, du papier classique ou cartonné et un poinçon ou une punaise. La liste détaillée accompagne les fichiers.",
  ],
  [
    "Pourquoi utiliser du papier plutôt que du tissu ?",
    "Le support imprimé remplace le transfert du motif et ne demande ni tambour ni tissu tendu. Vous percez aux endroits indiqués avant de passer le fil.",
  ],
  [
    "Vais-je recevoir un colis ?",
    "Non. BordaPapel est entièrement numérique : l'accès arrive par e-mail après l'achat et vous imprimez les gabarits chez vous pour votre usage personnel.",
  ],
  [
    "Puis-je commercialiser les pièces réalisées ?",
    "Vous pouvez vendre les ouvrages fabriqués par vos soins. Les bonus vous aident à les présenter et à calculer vos prix, sans promesse de résultat.",
  ],
  [
    "L'achat entraîne-t-il un abonnement ?",
    "Non. Vous réglez une seule fois et conservez les fichiers que vous avez téléchargés.",
  ],
  [
    "Comment fonctionne le remboursement ?",
    `Contactez-nous dans les ${campaign.guaranteeDays} jours suivant l'achat. Le remboursement intégral s'applique selon nos conditions.`,
  ],
];

function Faq() {
  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-3xl px-5">
        <div className="text-center">
          <Eyebrow>Questions fréquentes</Eyebrow>
          <h2 className="text-4xl font-bold md:text-5xl">Vos questions, nos réponses.</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10 rounded-2xl bg-card px-6">
          {faqs.map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger className="text-left text-base font-bold">{q}</AccordionTrigger>
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
        <h2 className="text-4xl font-bold leading-tight md:text-5xl">
          {mode === "evergreen" ? (
            "Votre prochaine soirée créative peut commencer avec une simple feuille."
          ) : (
            <>
              Cette année, glissez un peu de vous{" "}
              <span className="whitespace-nowrap">dans chaque paquet.</span>
            </>
          )}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl opacity-90">
          Choisissez un motif, préparez vos fils et profitez de la satisfaction de fabriquer quelque
          chose d'unique. Le coffret vous accompagne de la première impression à la finition.
        </p>
        <p className="mt-4 font-display text-xl text-gold">
          Un temps pour vous, une attention pour celles et ceux que vous aimez.
        </p>
        <div className="mt-10">
          <Cta variant="gold">Je commence mes créations de Noël →</Cta>
        </div>
      </div>
    </section>
  );
}

function StickyCta() {
  const openUpsell = useUpsell();
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 border-t border-gold/30 bg-forest-deep px-4 py-3 text-secondary-foreground md:hidden">
      <div>
        <p className="text-xs opacity-75">Coffret 200 modèles</p>
        <p className="font-display text-2xl font-bold text-gold">{price}</p>
      </div>
      <button
        type="button"
        data-purchase-cta
        onClick={openUpsell}
        className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
      >
        J'en profite →
      </button>
    </div>
  );
}

export function Landing() {
  const mode = useMode();
  useReveal();
  useImageDownloadDeterrent();
  return (
    <UpsellProvider>
      <main className="pb-20 md:pb-0">
        <Hero mode={mode} />
        <Problems />
        <Steps />
        <Gallery />
        <Why />
        <Profiles />
        <Bonuses />
        <Offer mode={mode} />
        <CreativeExamples />
        <Testimonials />
        <Guarantee />
        <Faq />
        <Closing mode={mode} />
        <footer className="bg-forest-deep py-8 text-center text-xs text-secondary-foreground/70">
          © 2026 BordaPapel · Produit numérique · Photos d'inspiration non contractuelles
        </footer>
        <StickyCta />
      </main>
    </UpsellProvider>
  );
}
