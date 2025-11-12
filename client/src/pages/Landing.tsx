import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ServiceCard";
import { Settings, Zap, Layers, Wrench, Boxes, Workflow, ChevronDown } from "lucide-react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import logoUrl from "@assets/Logo (2)_1762350189592.png";
import heroBackgroundUrl from "@assets/cnc-machining-business-for-sale_1762351444103.jpg";

export default function Landing() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  const services = [
    {
      icon: Settings,
      title: t("services.cncMachining.title"),
      description: t("services.cncMachining.description"),
      features: t("services.cncMachining.features", { returnObjects: true }) as string[]
    },
    {
      icon: Zap,
      title: t("services.laserCutting.title"),
      description: t("services.laserCutting.description"),
      features: t("services.laserCutting.features", { returnObjects: true }) as string[]
    },
    {
      icon: Layers,
      title: t("services.printing3d.title"),
      description: t("services.printing3d.description"),
      features: t("services.printing3d.features", { returnObjects: true }) as string[]
    },
    {
      icon: Wrench,
      title: t("services.sheetMetal.title"),
      description: t("services.sheetMetal.description"),
      features: t("services.sheetMetal.features", { returnObjects: true }) as string[]
    },
    {
      icon: Boxes,
      title: t("services.injectionMolding.title"),
      description: t("services.injectionMolding.description"),
      features: t("services.injectionMolding.features", { returnObjects: true }) as string[]
    },
    {
      icon: Workflow,
      title: t("services.weldedFab.title"),
      description: t("services.weldedFab.description"),
      features: t("services.weldedFab.features", { returnObjects: true }) as string[],
      subMethods: [
        { name: "TIG", serviceType: "tig_welding" },
        { name: "MIG-MAG", serviceType: "mig_mag_welding" },
        { name: "LASER", serviceType: "laser_welding" },
        { name: "SPOT WELDING", serviceType: "spot_welding" },
        { name: "ARC WELDING", serviceType: "arc_welding" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <button onClick={() => setLocation("/")} className="flex items-center" data-testid="button-logo">
              <img src={logoUrl} alt="ManHUB" className="h-12 w-auto" data-testid="img-logo" />
            </button>
            <nav className="hidden md:flex items-center gap-6">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm font-medium">
                      {t("nav.services")}
                    </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4">
                      <div className="grid gap-2">
                        <a 
                          href="#services" 
                          className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none mb-1">{t("landing.services")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("nav.viewAllServices")}
                          </p>
                        </a>
                        <a 
                          href="/certifications" 
                          className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          onClick={(e) => { e.preventDefault(); setLocation("/certifications"); }}
                        >
                          <div className="text-sm font-medium leading-none mb-1">{t("nav.certifications")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("nav.certificationsDesc")}
                          </p>
                        </a>
                        <a 
                          href="/post-processing" 
                          className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          onClick={(e) => { e.preventDefault(); setLocation("/post-processing"); }}
                        >
                          <div className="text-sm font-medium leading-none mb-1">{t("nav.postProcessing")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("nav.postProcessingDesc")}
                          </p>
                        </a>
                        <a 
                          href="/mass-production" 
                          className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          onClick={(e) => { e.preventDefault(); setLocation("/mass-production"); }}
                        >
                          <div className="text-sm font-medium leading-none mb-1">{t("nav.massProduction")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("nav.massProductionDesc")}
                          </p>
                        </a>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    {t("nav.quote")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4">
                      <div className="grid gap-2">
                        <a 
                          href="/quote-request" 
                          className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          onClick={(e) => { e.preventDefault(); setLocation("/quote-request"); }}
                        >
                          <div className="text-sm font-medium leading-none mb-1">{t("nav.standardQuote")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("nav.standardQuoteDesc")}
                          </p>
                        </a>
                        <a 
                          href="/target-price-quote" 
                          className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          onClick={(e) => { e.preventDefault(); setLocation("/target-price-quote"); }}
                        >
                          <div className="text-sm font-medium leading-none mb-1">{t("nav.targetPriceQuote")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("nav.targetPriceQuoteDesc")}
                          </p>
                        </a>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              {t("landing.howItWorks")}
            </a>
          </nav>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Button variant="outline" onClick={() => setLocation("/login")} data-testid="button-login">
              {t("common.login")}
            </Button>
            <Button onClick={() => setLocation("/quote-request")} data-testid="button-get-quote">
              {t("landing.getQuote")}
            </Button>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <LanguageSelector />
            <Button variant="outline" onClick={() => setLocation("/login")} data-testid="button-login-mobile">
              {t("common.login")}
            </Button>
          </div>
        </div>
      </header>

      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${heroBackgroundUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.6
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/20" />
        <div className="container max-w-7xl mx-auto px-6 py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-6xl font-bold tracking-tight leading-tight">
                {t("landing.title")}
                <br />
                <span className="text-primary">{t("landing.titleHighlight")}</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                {t("landing.subtitle")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => setLocation("/quote-request")} className="text-base px-8" data-testid="button-upload-cad">
                  {t("landing.uploadCAD")}
                </Button>
                <Button size="lg" variant="outline" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="text-base px-8">
                  {t("landing.viewServices")}
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-8 pt-8 border-t">
                <div>
                  <div className="text-3xl font-bold text-primary">5+</div>
                  <div className="text-sm text-muted-foreground mt-1">{t("landing.stats.services")}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground mt-1">{t("landing.stats.tracking")}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">Fast</div>
                  <div className="text-sm text-muted-foreground mt-1">{t("landing.stats.response")}</div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-xl -rotate-3" />
                <div className="relative bg-card border rounded-xl p-8 shadow-xl">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Settings className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{t("landing.process.upload.title")}</h3>
                        <p className="text-sm text-muted-foreground">{t("landing.process.upload.description")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{t("landing.process.configure.title")}</h3>
                        <p className="text-sm text-muted-foreground">{t("landing.process.configure.description")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Workflow className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{t("landing.process.track.title")}</h3>
                        <p className="text-sm text-muted-foreground">{t("landing.process.track.description")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-24 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">{t("landing.servicesTitle")}</h2>
            <p className="text-lg text-muted-foreground">
              {t("landing.servicesSubtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">{t("landing.howItWorksTitle")}</h2>
            <p className="text-lg text-muted-foreground">
              {t("landing.howItWorksSubtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: t("landing.steps.upload.title"),
                description: t("landing.steps.upload.description")
              },
              {
                step: "2",
                title: t("landing.steps.quote.title"),
                description: t("landing.steps.quote.description")
              },
              {
                step: "3",
                title: t("landing.steps.confirm.title"),
                description: t("landing.steps.confirm.description")
              },
              {
                step: "4",
                title: t("landing.steps.track.title"),
                description: t("landing.steps.track.description")
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">{t("landing.readyTitle")}</h2>
          <p className="text-xl mb-8 opacity-90">
            {t("landing.readySubtitle")}
          </p>
          <Button size="lg" variant="secondary" onClick={() => setLocation("/quote-request")} className="text-base px-8" data-testid="button-start-quote">
            {t("landing.startQuote")}
          </Button>
        </div>
      </section>

      <footer className="border-t py-12 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <button onClick={() => setLocation("/")} className="flex items-center mb-4" data-testid="button-footer-logo">
                <img src={logoUrl} alt="ManHUB" className="h-24 w-auto" />
              </button>
              <p className="text-sm text-muted-foreground">
                Professional B2B manufacturing services
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Hizmetler</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" onClick={() => setLocation("/certifications")} data-testid="link-certifications">
                    Sertifikalar & Ölçüm
                  </button>
                </li>
                <li>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" onClick={() => setLocation("/post-processing")} data-testid="link-post-processing">
                    Ardıl İşlemler
                  </button>
                </li>
                <li>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" onClick={() => setLocation("/mass-production")} data-testid="link-mass-production">
                    Seri Üretim
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Teklif</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" onClick={() => setLocation("/quote-request")} data-testid="link-quote-request">
                    Standart Teklif
                  </button>
                </li>
                <li>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" onClick={() => setLocation("/target-price-quote")} data-testid="link-target-price">
                    Hedef Fiyatlı Teklif
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Hesap</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" onClick={() => setLocation("/login")} data-testid="link-login">
                    Giriş Yap
                  </button>
                </li>
                <li>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" onClick={() => setLocation("/register")} data-testid="link-register">
                    Kayıt Ol
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 ManHUB. Professional manufacturing services.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
