import { useEffect, useRef, useState, type ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

function Cta({ children, variant = "primary" }: { children: ReactNode; variant?: "primary" | "gold" }) {
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
          style={{ left: `${(i * 53) % 100}%`, animationDuration: `${9 + (i % 6) * 2}s`, animationDelay: `${-i * 1.3}s` }}
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
    <div ref={containerRef} className="overflow-hidden rounded-2xl border border-gold/30 bg-forest-deep shadow-soft">
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
        <p className="eyebrow mb-5 text-gold/80">Imprimez · Brodez · Offrez</p>
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
          {mode === "evergreen" ? (
            <>Créez de magnifiques broderies sur papier, <span className="text-gold">même en débutant.</span></>
          ) : (
            <>Créez de magnifiques cadeaux de Noël, <span className="text-gold">même si vous débutez.</span></>
          )}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-secondary-foreground/90 md:text-xl">
          Imprimez l'un des <strong>200 modèles</strong>, suivez le guide et réalisez votre première carte ou décoration dès aujourd'hui.
        </p>

        <div className="mt-8">
          <Cta variant="gold">
            {mode === "blackfriday" ? "Je profite de la Black Friday Week" : mode === "noel" ? "Je profite de l'offre de Noël" : "Je découvre BordaPapel"}
          </Cta>
        </div>
        <p className="mt-4 text-sm font-medium text-secondary-foreground/80">Accès immédiat · 200 modèles + 3 cadeaux · Sans abonnement</p>

        <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-gold/30 shadow-soft">
          <img src={hero} alt="Modèles imprimés et cartes de Noël brodées sur papier" width={1536} height={640} decoding="async" className="w-full" />
        </div>
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
      <h2 className="reveal text-4xl font-bold md:text-5xl">Ce cycle vous semble familier ?</h2>
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {problems.map(([t, d]) => (
          <div key={t} className="reveal rounded-2xl border bg-card p-7 text-left">
            <h3 className="text-2xl font-bold text-secondary">{t}</h3>
            <p className="mt-3 text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
      <p className="reveal mt-12 font-display text-2xl text-primary">
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
          <h2 className="reveal text-4xl font-bold md:text-5xl">Un art presque oublié, quatre bienfaits à la fois.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            La broderie sur papier est accessible, peu coûteuse et apaisante : une activité créative idéale pour ralentir pendant les fêtes.
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
        <h2 className="reveal text-4xl font-bold md:text-5xl">Trois profils de débutantes s'y retrouvent.</h2>
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
              <li key={pt} className="flex gap-3"><span className="text-gold">✦</span>{pt}</li>
            ))}
          </ul>
        </div>
        <img src={p.img} alt={p.alt} width={896} height={1088} loading="lazy" decoding="async" className="w-full rounded-2xl shadow-soft" />
      </div>
    </section>
  );
}

const steps = [
  ["Imprimez", "Choisissez un modèle et imprimez-le sur du papier classique ou cartonné."],
  ["Brodez", "Suivez le guide pas à pas. Une aiguille, du fil et un poinçon suffisent."],
  ["Créez, offrez ou vendez", "Encadrez votre création, offrez-la ou vendez-la. Vous avancez à votre rythme."],
];

function Steps() {
  return (
    <section className="bg-forest-gradient py-16 text-secondary-foreground md:py-20">
      <div className="mx-auto max-w-6xl px-5 text-center">
        <Eyebrow light>Plus simple qu'il n'y paraît</Eyebrow>
        <h2 className="text-4xl font-bold md:text-5xl">Trois étapes. Votre première création.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-secondary-foreground/85">Pas besoin d'expérience : le modèle vous guide à chaque geste.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map(([t, d], i) => (
            <div key={t} className="reveal stitch-border rounded-2xl bg-forest-deep/25 p-6 text-left">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient font-display text-2xl font-extrabold text-accent-foreground">{i + 1}</span>
              <h3 className="mt-5 text-2xl font-bold">{t}</h3>
              <p className="mt-3 leading-relaxed text-secondary-foreground/85">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr]">
          <div className="mx-auto w-full max-w-sm">
            <DemonstrationVideo />
            <p className="mt-3 text-sm font-bold text-gold">Regardez le geste, puis essayez à votre rythme.</p>
          </div>
          <div className="text-center md:text-left">
            <Eyebrow light>Du papier à une pièce unique</Eyebrow>
            <h3 className="text-3xl font-bold md:text-4xl">Un modèle imprimé. Une création dont vous serez fière.</h3>
            <p className="mt-4 text-secondary-foreground/85">Les repères vous indiquent où percer et où passer le fil. Vous voyez votre ouvrage prendre forme, point après point.</p>
            <figure className="mt-6">
              <img src={avantApres} alt="Avant / après : modèle imprimé et broderie terminée" width={1280} height={720} loading="lazy" decoding="async" className="w-full rounded-2xl border border-gold/20" />
              <figcaption className="reveal mt-3 flex justify-between gap-4 text-sm text-secondary-foreground/80"><span>Avant : le modèle</span><span>Après : votre broderie</span></figcaption>
            </figure>
          </div>
        </div>
        <div className="mt-10"><Cta variant="gold">Je crée ma première broderie →</Cta></div>
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
        <h2 className="reveal text-4xl font-bold md:text-5xl">Du marque-page au souvenir de famille.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
          Le coffret réunit 200 modèles classés par catégorie : cartes de Noël brodées, étiquettes cadeaux, cartes de vœux, marque-pages, décorations, petits tableaux floraux et cadeaux personnalisés. Photos d'inspiration.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`rounded-full px-5 py-2 text-sm font-bold transition ${c === cat ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-border"}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {items.map((g) => (
          <figure key={g.title} className="overflow-hidden rounded-2xl bg-card shadow-soft">
            <img src={g.img} alt={g.title} width={832} height={832} loading="lazy" decoding="async" className="aspect-square w-full object-cover transition duration-500 hover:scale-105" />
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
  { n: "Cadeau Nº 1", kicker: "Du papier à la vente", title: "Guide de vos premières ventes", text: "Un guide pratique pour présenter, tarifer et proposer vos créations faites main : plan d'action, check-lists et exemples de publications.", img: bonusGuideVentes, alt: "Guide de vente et cartes de broderie sur papier" },
  { n: "Cadeau Nº 2", kicker: "Fixez vos prix sereinement", title: "Kit de calcul des prix", text: "Une calculatrice simple pour estimer le coût du matériel, le temps de réalisation et la marge souhaitée. Avec le Carnet de l'artisane.", img: bonusCalculPrix, alt: "Tablette, calculatrice et matériel pour calculer le prix des créations" },
  { n: "Cadeau Nº 3", kicker: "Photographiez. Présentez. Partagez.", title: "Kit Vitrine de l'Atelier", text: "Conseils photo en lumière naturelle, modèles de présentation produit et exemples de messages pour parler de vos créations.", img: bonusVitrineAtelier, alt: "Smartphone photographiant des cartes brodées pour le kit vitrine" },
];

function Bonuses() {
  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-5xl px-5">
        <div className="text-center">
          <Eyebrow>🎁 Trois cadeaux à déballer avec votre coffret</Eyebrow>
          <h2 className="reveal text-4xl font-bold md:text-5xl">Trois bonus inclus, sans supplément.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {bonuses.map((b, i) => (
            <article key={b.title} className="group relative overflow-hidden rounded-2xl bg-card shadow-soft">
              <div className="relative aspect-[4/3] overflow-hidden bg-forest-gradient">
                <img src={b.img} alt={b.alt} width={1448} height={1086} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full bg-gold-gradient px-4 py-1.5 text-sm font-bold text-accent-foreground shadow-soft">{b.n}</span>
              </div>
              <div className="reveal p-6">
                <p className="eyebrow text-primary">{b.kicker}</p>
                <h3 className="mt-2 text-2xl font-bold">{b.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{b.text}</p>
                <p className="mt-4 text-sm font-bold text-secondary">✓ Inclus · valeur indicative {euro(campaign.bonusValues[i] ?? 0)}</p>
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
    <section id="offre" className="relative overflow-hidden bg-forest-gradient py-16 text-secondary-foreground md:py-20">
      {mode !== "evergreen" && <Snow />}
      <div className="relative mx-auto max-w-2xl px-5">
        <div className="text-center">
          <Eyebrow light>{mode === "blackfriday" ? "Black Friday Week · Offre Essentielle" : mode === "noel" ? "Offre de Noël" : "Offre Essentielle"}</Eyebrow>
          <h2 className="text-4xl font-bold md:text-5xl">Tout pour créer dès aujourd'hui.</h2>
          <p className="mt-3 text-lg text-secondary-foreground/85">200 modèles, le guide et 3 cadeaux. Un seul paiement.</p>
        </div>
        <div className="mt-9 rounded-3xl border border-gold/30 bg-card p-5 text-card-foreground shadow-soft md:p-8">
          {mode !== "evergreen" && (
            <div className="mb-7 rounded-2xl bg-forest-gradient p-5 text-secondary-foreground">
              <CampaignCountdown mode={mode} />
            </div>
          )}
          <ul className="space-y-3 text-left font-medium">
            {included.map((x) => <li key={x} className="border-b border-border pb-3 leading-relaxed last:border-0">{x}</li>)}
          </ul>

          <div className="mt-7 rounded-3xl border-2 border-gold/70 bg-gold-gradient p-6 text-center text-accent-foreground md:p-8">
            {campaign.showReferencePrice && mode !== "evergreen" ? (
              <>
                <span className="inline-flex rounded-full bg-primary px-4 py-1.5 text-sm font-extrabold uppercase tracking-wide text-primary-foreground">
                  {mode === "blackfriday" ? "Black Friday Week" : "Offre de Noël"} · −{discountPct()} %
                </span>
                <p className="mt-4 text-base font-bold">Au lieu de <s>{euro(campaign.referencePrice)}</s></p>
              </>
            ) : (
              <span className="inline-flex rounded-full bg-secondary px-4 py-1.5 text-sm font-bold text-secondary-foreground">Offre Essentielle</span>
            )}
            <p className="mt-2 font-display text-7xl font-black leading-none tracking-tight text-primary md:text-8xl">{price}</p>
            <p className="mt-3 font-bold">Paiement unique · sans abonnement</p>
            <div className="mt-6"><Cta>Oui, je veux mes 200 modèles pour {price}</Cta></div>
            <p className="mt-4 text-xs font-medium opacity-80">Accès immédiat par e-mail · Produit 100 % numérique · Aucun envoi physique</p>
          </div>
          {campaign.showReferencePrice && mode !== "evergreen" && (
            <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">{campaign.referencePriceNote}</p>
          )}
        </div>
      </div>
    </section>
  );
}

const creativeStories = [
  {
    name: "Claire",
    theme: "Le rituel du soir",
    text: "Elle réserve dix minutes après le dîner pour choisir ses fils, suivre les repères et regarder un motif botanique prendre forme, loin des écrans.",
    img: portraitClaire,
    alt: "Mise en scène illustrée de Claire brodant un motif botanique sur papier",
  },
  {
    name: "Nadia",
    theme: "Des cadeaux personnels",
    text: "Elle imagine des étiquettes assorties à chaque paquet et la surprise de ses proches devant un cadeau préparé avec une attention vraiment personnelle.",
    img: portraitNadia,
    alt: "Mise en scène illustrée de Nadia préparant des étiquettes cadeaux brodées",
  },
  {
    name: "Sophie",
    theme: "Sa petite vitrine créative",
    text: "Elle dispose ses cartes près de la fenêtre, règle son smartphone et compose une présentation soignée pour montrer ses créations.",
    img: portraitSophie,
    alt: "Mise en scène illustrée de Sophie photographiant ses cartes brodées",
  },
];

function CreativeStories() {
  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-6xl px-5 text-center">
        <Eyebrow>Inspirez-vous</Eyebrow>
        <h2 className="reveal text-4xl font-bold md:text-5xl">Et si votre prochain moment créatif commençait ici ?</h2>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">Trois scénarios pour vous aider à imaginer comment BordaPapel peut trouver sa place dans votre quotidien.</p>
        <p className="mx-auto mt-5 inline-flex rounded-full border border-primary/20 bg-card px-4 py-2 text-xs font-bold text-primary">Portraits et scénarios illustratifs · ne sont pas des avis de clientes.</p>
        <div className="mt-10 grid gap-6 text-left md:grid-cols-3">
          {creativeStories.map((story) => (
            <article key={story.name} className="overflow-hidden rounded-3xl bg-card shadow-soft">
              <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                <img src={story.img} alt={story.alt} width={768} height={1152} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-primary shadow-soft">Scénario illustratif</span>
              </div>
              <div className="reveal p-6">
                <p className="eyebrow text-primary">{story.theme}</p>
                <h3 className="mt-2 text-3xl font-bold">{story.name}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{story.text}</p>
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
          <span key={index} className={index < rating ? "text-gold" : "text-border"}>★</span>
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
            <footer className="mt-4 text-sm font-bold">{t.name} · {t.city}</footer>
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
          <img src={guaranteeSeal} alt="Sceau brodé : garantie de 30 jours" width={640} height={640} loading="lazy" decoding="async" className="relative h-auto w-full" />
        </div>
        <div className="reveal">
          <Eyebrow>Une garantie simple</Eyebrow>
          <h2 className="text-4xl font-bold md:text-5xl">{campaign.guaranteeDays} jours satisfaite ou remboursée.</h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Essayez le coffret complet : imprimez les modèles et réalisez vos premières broderies. Si la broderie sur papier ne vous plaît pas, envoyez-nous simplement un e-mail dans les {campaign.guaranteeDays} jours suivant l'achat et nous vous rembourserons intégralement, selon nos conditions de remboursement.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm font-bold text-secondary md:justify-start">
            <span className="rounded-full bg-muted px-4 py-2">✓ {campaign.guaranteeDays} jours pour essayer</span>
            <span className="rounded-full bg-muted px-4 py-2">✓ Une simple demande par e-mail</span>
          </div>
        </div>
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
            "Ce soir, au lieu de faire défiler votre écran, brodez."
          ) : (
            <>
              Ce Noël, offrez plus qu'un cadeau. Offrez quelque chose créé{" "}
              <span className="whitespace-nowrap">avec le cœur.</span>
            </>
          )}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl opacity-90">
          Imaginez la joie d'offrir une carte, une décoration ou un petit souvenir que vous avez réalisé vous-même. Avec 200 modèles prêts à imprimer, votre prochaine création commence aujourd'hui.
        </p>
        <p className="mt-4 font-display text-xl text-gold">Et gardez-en un peu pour vous : le plaisir de créer est aussi un cadeau.</p>
        <div className="mt-10"><Cta variant="gold">Je commence mes créations de Noël →</Cta></div>
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
      <button type="button" data-purchase-cta onClick={openUpsell} className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">J'en profite →</button>
    </div>
  );
}

export function Landing() {
  const mode = useMode();
  useReveal();
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
        <CreativeStories />
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
