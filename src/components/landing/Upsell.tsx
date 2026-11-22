import * as Dialog from "@radix-ui/react-dialog";
import { gsap } from "gsap";
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
import { campaign, euro } from "@/config/campaign";

const UpsellContext = createContext<() => void>(() => {});

export function useUpsell() {
  return useContext(UpsellContext);
}

const premiumBonuses: { title: string; detail: string; icon: LucideIcon }[] = [
  { title: "Collection Noël Exclusive", detail: "100 modèles de Noël supplémentaires", icon: Snowflake },
  { title: "Atelier Cadeaux Personnalisés", detail: "Le guide pour créer des cadeaux uniques", icon: Gift },
  { title: "Collection Fleurs Premium", detail: "50 modèles floraux exclusifs", icon: Flower2 },
  { title: "Guide Business Créatif", detail: "Pour présenter et vendre vos créations", icon: BriefcaseBusiness },
  { title: "Calendrier Créatif 30 Jours", detail: "30 jours de projets et défis créatifs", icon: CalendarDays },
];

function UpsellDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const additionalPrice = euro(campaign.premiumPrice - campaign.price).replace(",00", "");
  const premiumAvailable = campaign.premiumBonusesReady && Boolean(campaign.premiumCheckoutUrl);
  const checkoutPending = !campaign.checkoutUrl || !campaign.premiumCheckoutUrl;

  useEffect(() => {
    if (!open || !overlayRef.current || !contentRef.current) return;

    const panel = contentRef.current.querySelector(".upsell-panel");
    if (!panel) return;

    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22 })
        .fromTo(panel, { opacity: 0, y: 28, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.38 }, "<")
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
          ".upsell-miniature",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.28, stagger: 0.055 },
          "-=0.25",
        );
    }, contentRef);

    return () => ctx.revert();
  }, [open]);

  function acceptPremium() {
    window.__lovableEvents?.track?.("project.upgrade_accepted", { plan: "premium", price: campaign.premiumPrice });
    if (!premiumAvailable) return;
    onOpenChange(false);
    window.location.assign(campaign.premiumCheckoutUrl);
  }

  function keepEssential() {
    window.__lovableEvents?.track?.("project.upgrade_declined", { plan: "essential", price: campaign.price });
    onOpenChange(false);
    if (campaign.checkoutUrl) window.location.assign(campaign.checkoutUrl);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay ref={overlayRef} className="fixed inset-0 z-[100] bg-forest-deep/85 backdrop-blur-sm" />
        <Dialog.Content ref={contentRef} className="fixed inset-0 z-[101] overflow-y-auto p-4 focus:outline-none">
          <div className="flex min-h-full items-center justify-center py-4">
            <div className="upsell-panel relative w-full max-w-3xl overflow-hidden rounded-3xl border border-gold/40 bg-background shadow-soft">
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Fermer la fenêtre"
                  className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-forest-deep/60 text-secondary-foreground transition hover:bg-forest-deep"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </Dialog.Close>

              <div className="relative overflow-hidden bg-forest-gradient px-6 pb-7 pt-8 text-center text-secondary-foreground md:px-10">
                <div className="mb-4 flex items-center justify-center gap-4 text-gold" aria-hidden>
                  <Sparkles className="upsell-sparkle h-6 w-6" />
                  <Gift className="upsell-gift h-14 w-14" strokeWidth={1.5} />
                  <Sparkles className="upsell-sparkle h-6 w-6" />
                </div>
                <p className="eyebrow mb-3 text-gold">Black Friday de Noël · Offre facultative</p>
                <Dialog.Title className="mx-auto max-w-xl font-display text-3xl font-semibold leading-tight md:text-4xl">
                  🎁 Attendez ! Et si vous profitiez de l'expérience complète ?
                </Dialog.Title>
                <Dialog.Description className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-secondary-foreground/85 md:text-base">
                  Pour seulement {additionalPrice} de plus, débloquez 5 bonus exclusifs et encore plus de créations pour Noël.
                </Dialog.Description>
              </div>

              <div className="p-5 md:p-8">
                <div className="mb-5 flex items-start gap-3 rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden />
                  <p>
                    <strong className="text-foreground">Tout le contenu Essentiel est inclus :</strong> 200 modèles, cours vidéo pour débutantes, guide de matériel et instructions, 3 bonus originaux et accès à vie.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {premiumBonuses.map(({ title, detail, icon: Icon }) => (
                    <div key={title} className="upsell-miniature rounded-2xl border bg-card p-3 text-center lg:p-2">
                      <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-forest-gradient text-gold">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <h3 className="font-sans text-xs font-semibold leading-snug">{title}</h3>
                      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{detail}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <span className="inline-flex rounded-full bg-gold-gradient px-4 py-1.5 text-sm font-bold text-accent-foreground">
                    Seulement {additionalPrice} de plus
                  </span>
                  <p className="mt-3 font-display text-2xl font-semibold text-secondary">
                    Offre Premium de Noël · {euro(campaign.premiumPrice)}
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={acceptPremium}
                    disabled={!premiumAvailable}
                    className="rounded-full bg-gold-gradient px-6 py-4 text-base font-bold text-accent-foreground shadow-soft transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    Oui, je veux l'offre Premium — {euro(campaign.premiumPrice)}
                  </button>
                  <button
                    type="button"
                    onClick={keepEssential}
                    className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                  >
                    Non merci, je garde mon offre à {euro(campaign.price)}
                  </button>
                </div>

                {checkoutPending && (
                  <p role="status" className="mt-4 text-center text-xs text-muted-foreground">
                    Paiement en cours de configuration. Aucun débit ne sera effectué.
                  </p>
                )}
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Le choix Premium est facultatif. Vous pouvez conserver l'offre Essentielle à {euro(campaign.price)}.
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
