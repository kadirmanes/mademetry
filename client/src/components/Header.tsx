import { Button } from "@/components/ui/button";
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

export function Header() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  return (
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
                  <NavigationMenuTrigger data-testid="nav-services">{t("nav.services")}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <button
                          onClick={() => {
                            setLocation("/");
                            setTimeout(() => {
                              document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                            }, 100);
                          }}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left"
                          data-testid="nav-all-services"
                        >
                          <div className="text-sm font-medium leading-none">{t("nav.services")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("nav.viewAllServices")}
                          </p>
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button
                          onClick={() => setLocation("/certifications")}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left"
                          data-testid="nav-certifications"
                        >
                          <div className="text-sm font-medium leading-none">{t("nav.certifications")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("nav.certificationsDesc")}
                          </p>
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button
                          onClick={() => setLocation("/post-processing")}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left"
                          data-testid="nav-post-processing"
                        >
                          <div className="text-sm font-medium leading-none">{t("nav.postProcessing")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("nav.postProcessingDesc")}
                          </p>
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button
                          onClick={() => setLocation("/mass-production")}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left"
                          data-testid="nav-mass-production"
                        >
                          <div className="text-sm font-medium leading-none">{t("nav.massProduction")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("nav.massProductionDesc")}
                          </p>
                        </button>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger data-testid="nav-quote">{t("nav.quote")}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <button
                          onClick={() => setLocation("/quote-request")}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left"
                          data-testid="nav-standard-quote"
                        >
                          <div className="text-sm font-medium leading-none">{t("nav.standardQuote")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("nav.standardQuoteDesc")}
                          </p>
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <button
                          onClick={() => setLocation("/target-price-quote")}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left"
                          data-testid="nav-target-price-quote"
                        >
                          <div className="text-sm font-medium leading-none">{t("nav.targetPriceQuote")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("nav.targetPriceQuoteDesc")}
                          </p>
                        </button>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Button variant="ghost" onClick={() => setLocation("/login")} data-testid="button-login">
            {t("common.login")}
          </Button>
          <Button onClick={() => setLocation("/quote-request")} data-testid="button-get-quote">
            {t("landing.getQuote")}
          </Button>
        </div>
      </div>
    </header>
  );
}
