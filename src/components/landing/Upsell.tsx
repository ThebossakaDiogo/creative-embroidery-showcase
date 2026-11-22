import * as Dialog from "@radix-ui/react-dialog";
import {
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Flower2,
  Gift,
  Snowflake,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { campaign, euro, getMode } from "@/config/campaign";
import { CampaignCountdown } from "@/components/landing/CampaignCountdown";
import {
  bonusGuideVentes as businessGuide,
  bonusVitrineAtelier as creativeCalendar,
  gFlorals as premiumFlowers,
  gOrnements as christmasCollection,
  pCadeaux as personalizedGifts,
} from "@/config/media";

const UpsellContext = createContext<() => void>(() => {});

export function useUpsell() {
  return useContext(UpsellContext);
}

const premiumBonuses: {
  title: string;
  detail: string;
  icon: LucideIcon;
  image: string;
  alt: string;
}[] = [
  {
    title: "Collection Noël Exclusive",
    detail: "100 modèles de Noël en plus",
    icon: Snowflake,
    image: christmasCollection,
    alt: "Décorations de Noël de la collection exclusive",
  },
  {
    title: "Atelier Cadeaux Personnalisés",
    detail: "Créez des cadeaux uniques",
    icon: Gift,
    image: personalizedGifts,
    alt: "Cadeau personnalisé avec une carte brodée",
  },
  {
    title: "Collection Fleurs Premium",
    detail: "50 modèles floraux en plus",
    icon: Flower2,
    image: premiumFlowers,
    alt: "Modèles floraux de la collection Premium",
  },
  {
    title: "Guide Business Créatif",
    detail: "Présentez et vendez vos créations",
    icon: BriefcaseBusiness,
    image: businessGuide,
    alt: "Guide pour présenter et vendre ses créations",
  },
  {
    title: "Calendrier Créatif 30 Jours",
    detail: "30 jours de projets créatifs",
    icon: CalendarDays,
    image: creativeCalendar,
    alt: "Présentation du calendrier créatif de 30 jours",
  },
];

function UpsellDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const additionalPrice = euro(campaign.premiumPrice - campaign.price).replace(",00", "");
  const premiumAvailable = campaign.premiumBonusesReady && Boolean(campaign.premiumCheckoutUrl);
  const checkoutPending = !campaign.checkoutUrl || !campaign.premiumCheckoutUrl;
  const mode = getMode();

  useEffect(() => {
    if (!open || !overlayRef.current || !contentRef.current) return;
    const panel = contentRef.current.querySelector(".upsell-panel");
    if (!panel) return;
    let cancelled = false;
    let revert: (() => void) | undefined;

    void import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      const ctx = gsap.context(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        timeline
          .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22 })
          .fromTo(
            panel,
            { opacity: 0, y: 28, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.38 },
            "<",
          )
          .fromTo(
            ".upsell-gift",
            { opacity: 0, scale: 0.55, rotation: -12 },
            { opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2.2)" },
            "-=0.18",
          )
          .fromTo(
            ".upsell-sparkle",
            { opacity: 0, scale: 0, rotation: -30 },
            { opacity: 1, scale: 1, rotation: 0, duration: 0.3, stagger: 0.08 },
            "-=0.25",
          )
          .fromTo(
            ".upsell-miniature-copy",
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.28, stagger: 0.055 },
            "-=0.25",
          );
        gsap.to(".upsell-glow", {
          opacity: 0.55,
          scale: 1.16,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          stagger: 0.3,
        });
        gsap.to(".upsell-urgency", {
          scale: 1.035,
          duration: 1.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }, contentRef);
      revert = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [open]);

  function acceptPremium() {
    if (!premiumAvailable) return;
    window.__lovableEvents?.track?.("project.upgrade_accepted", {
      plan: "premium",
      price: campaign.premiumPrice,
    });
    onOpenChange(false);
    window.location.assign(campaign.premiumCheckoutUrl);
  }

  function keepEssential() {
    window.__lovableEvents?.track?.("project.upgrade_declined", {
      plan: "essential",
      price: campaign.price,
    });
    onOpenChange(false);
    if (campaign.checkoutUrl) window.location.assign(campaign.checkoutUrl);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          ref={overlayRef}
          className="fixed inset-0 z-[100] bg-wine-deep/90 backdrop-blur-sm"
        />
        <Dialog.Content
          ref={contentRef}
          className="fixed inset-0 z-[101] overflow-y-auto p-3 focus:outline-none md:p-4"
        >
          <div className="flex min-h-full justify-center py-3">
            <div className="upsell-panel relative my-auto w-full max-w-4xl overflow-hidden rounded-3xl border-2 border-gold bg-rose shadow-cta">
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Fermer la fenêtre"
                  className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-wine-deep/70 text-secondary-foreground transition hover:bg-wine-deep"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </Dialog.Close>

              <div className="relative overflow-hidden bg-wine-gradient px-5 pb-6 pt-16 text-center text-secondary-foreground md:px-10 md:pt-7">
                <div
                  className="upsell-glow absolute -left-10 top-0 h-44 w-44 rounded-full bg-gold/20 blur-3xl"
                  aria-hidden
                />
                <div
                  className="upsell-glow absolute -right-10 bottom-0 h-44 w-44 rounded-full bg-rose/25 blur-3xl"
                  aria-hidden
                />
                <div className="relative">
                  <div className="upsell-urgency mb-5 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-accent-foreground shadow-cta">
                    <Sparkles className="h-4 w-4" aria-hidden />
                    {mode === "blackfriday"
                      ? "Black Friday Week · Offre à durée limitée"
                      : mode === "noel"
                        ? "Offre de Noël · Jusqu'au 25 décembre"
                        : "Édition Premium · En option"}
                  </div>
                  <div
                    className="mb-3 flex items-center justify-center gap-4 text-gold"
                    aria-hidden
                  >
                    <Sparkles className="upsell-sparkle h-6 w-6" />
                    <Gift className="upsell-gift h-14 w-14" strokeWidth={1.5} />
                    <Sparkles className="upsell-sparkle h-6 w-6" />
                  </div>
                  <Dialog.Title className="mx-auto max-w-2xl font-display text-3xl font-extrabold leading-tight md:text-4xl">
                    Avant de choisir, découvrez l'édition Premium.
                  </Dialog.Title>
                  <Dialog.Description className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-secondary-foreground/90">
                    Pour {additionalPrice} de plus, ajoutez 150 gabarits et trois ressources
                    complémentaires à votre coffret.
                  </Dialog.Description>
                  {mode !== "evergreen" && (
                    <div className="mx-auto mt-5 max-w-md rounded-2xl border border-gold/40 bg-wine-deep/45 p-4">
                      <CampaignCountdown mode={mode} tone="wine" />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gold px-5 py-3 text-center text-sm font-extrabold uppercase tracking-wide text-accent-foreground">
                150 gabarits + 3 ressources supplémentaires · {additionalPrice} de plus
              </div>

              <div className="p-4 md:p-7">
                <div className="mb-5 flex items-start gap-3 rounded-2xl bg-muted p-4 text-sm leading-relaxed text-muted-foreground">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden />
                  <p>
                    <strong className="text-foreground">
                      Tout le contenu Essentiel est inclus :
                    </strong>{" "}
                    200 gabarits, guide de démarrage, trois bonus originaux et fichiers à
                    télécharger.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {premiumBonuses.map(({ title, detail, icon: Icon, image, alt }) => (
                    <div
                      key={title}
                      className="upsell-miniature overflow-hidden rounded-2xl border border-gold/25 bg-card shadow-soft"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        <img
                          src={image}
                          alt={alt}
                          width={320}
                          height={240}
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 flex h-9 w-9 items-center justify-center rounded-xl bg-wine-gradient text-gold shadow-soft">
                          <Icon className="h-4 w-4" aria-hidden />
                        </div>
                      </div>
                      <div className="upsell-miniature-copy p-3 text-center">
                        <h3 className="font-sans text-xs font-extrabold leading-snug">{title}</h3>
                        <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                          {detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-3xl border-2 border-gold/60 bg-gold-gradient p-5 text-center text-accent-foreground">
                  <p className="text-sm font-extrabold uppercase tracking-widest">
                    {mode === "evergreen" ? "Offre Premium" : "Offre Premium de Noël"}
                  </p>
                  <p className="mt-1 font-display text-5xl font-black tracking-tight text-primary">
                    {euro(campaign.premiumPrice)}
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    L'offre Essentielle reste disponible à {euro(campaign.price)}
                  </p>
                  <div className="mt-4 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={acceptPremium}
                      disabled={!premiumAvailable}
                      className={`rounded-full bg-primary px-6 py-4 text-base font-extrabold text-primary-foreground shadow-cta transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55 ${premiumAvailable ? "cta-pulse" : ""}`}
                    >
                      Oui, je veux l'offre Premium — {euro(campaign.premiumPrice)}
                    </button>
                    <button
                      type="button"
                      onClick={keepEssential}
                      className="rounded-full border border-primary/30 bg-card px-6 py-3 text-sm font-bold text-foreground transition hover:bg-muted"
                    >
                      Non merci, je garde mon offre à {euro(campaign.price)}
                    </button>
                  </div>
                </div>

                {checkoutPending && (
                  <p
                    role="status"
                    className="mt-4 text-center text-xs font-semibold text-muted-foreground"
                  >
                    Paiement en cours de configuration. Aucun débit ne sera effectué.
                  </p>
                )}
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Le choix Premium est facultatif. Vous pouvez conserver l'offre Essentielle à{" "}
                  {euro(campaign.price)}.
                </p>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function UpsellProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openUpsell = useCallback(() => {
    window.__lovableEvents?.track?.("project.upgrade_popup_viewed");
    setOpen(true);
  }, []);

  return (
    <UpsellContext.Provider value={openUpsell}>
      {children}
      <UpsellDialog open={open} onOpenChange={setOpen} />
    </UpsellContext.Provider>
  );
}
