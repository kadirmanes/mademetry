import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, Users, Shield, Zap, Globe, Award } from "lucide-react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import logoUrl from "@assets/Logo (2)_1762350189592.png";

export default function MassProduction() {
  const [, setLocation] = useLocation();

  const benefits = [
    {
      icon: Factory,
      title: "Ölçek Ekonomileri",
      description: "Daha yüksek adetlerde parça başına daha ucuz fiyat alabilirsiniz. Belirli miktar ve fiyatlara özel anlaşmalarımız mevcuttur."
    },
    {
      icon: Users,
      title: "Akıllı Hesap Yönetimi",
      description: "Hesap yönetim ekiplerimiz, özel kullanıcı deneyimi ve kurum içi teknik mühendis ekibimiz teklifleri yönetir. Üretim süreci, malzeme, tasarım ve maliyetleri optimize etmek için çalışır."
    },
    {
      icon: Shield,
      title: "Numune Üretimi",
      description: "Numune üretimi ve teslimatı, seri üretim siparişinizin önemli bir bölümünü temsil eder."
    },
    {
      icon: Zap,
      title: "Eşzamanlı Üretimler",
      description: "Hızlı şekilde tamamlanması gereken yüksek hacimli projeleriniz varsa, Xometry'nin üretim ağı zorlu teslim süreleri için pek çok tesisinde eş zamanlı üretim imkânı sunar."
    },
    {
      icon: Globe,
      title: "Sınırsız Seçenek",
      description: "Malzeme sertifikaları, denetimler ve ölçüm raporları sunmamıza ek olarak, 60 farklı malzemeyle yüzlerce farklı yüzey opsiyonu, tolerans aralığı ve özel taleplerinizin kombinasyonu sunuyoruz."
    },
    {
      icon: Award,
      title: "Kurum içi Kalite Kontrol",
      description: "Parçalarınızın eksiksiz bir şekilde üretilmesini sağlamak için şirket içi sıkı kalite kontrol standartları uygulanır ve bu süreçlerimiz ISO 9001:2015 sertifikalıdır."
    }
  ];

  const processes = [
    {
      name: "CNC İşleme",
      description: "Dik işlem, torna ve EDM. 10-20 iş günü arasında teslimat",
      capacity: "1-100,000 parça"
    },
    {
      name: "Sac Metal Şekillendirme",
      description: "Lazer kesim, abkant büküm ve kaynak. 10-20 iş günü arasında teslimat",
      capacity: "1-100,000 parça"
    },
    {
      name: "Enjeksiyon Kalıplama",
      description: "Prototip & Seri Üretim Kalıbı. 10-20 iş günü arasında teslimat",
      capacity: "500-1,000,000+ parça"
    },
    {
      name: "3D Baskı",
      description: "SLS, HP MJF, FDM, SLA ve DMLS. 3-8 iş günü arasında teslimat",
      capacity: "1-10,000 parça"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-7xl mx-auto px-6 py-12">
        <section className="mb-16">
          <div className="max-w-4xl mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Seri Üretim Hizmetleri</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Xometry, 2.000'den fazlası Türkiye ve Avrupa'da, toplamda ise 10.000'den fazla üretim tesisinden oluşan küresel ağ kapasitesine sahip bir üretim merkezidir. CNC işleme, sac metal şekillendirme, enjeksiyon kalıplama ve 3D baskı için ister tek parça isterseniz de milyonlarca parçaya kadar her boyuttaki işleri yapmaya hazırız.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-3xl">Hızlı Reaksiyon</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Akıllı Üretim Çözümleri</p>
              </CardContent>
            </Card>
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-3xl">ISO 9001:2015</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Sertifikalı Kalite Güvencesi</p>
              </CardContent>
            </Card>
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-3xl">70,000+</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Dünya Çapında Müşteri</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Seri Üretim için Neden ManHUB'ı Tercih Etmelisiniz?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <Card key={idx} className="hover-elevate">
                <CardHeader>
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Yüksek Hacimli Üretim Süreci Çeşitliliği</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Birden çok üretim teknolojisi kullanılarak, çeşitli geometrilerde düşük, orta veya yüksek hacimli parçalar üretilebilir. Mühendislerimiz, nihai üründe hangi süreçlerin ve malzemelerin en iyi performansı göstereceği konusunda müşterilerimize tavsiyelerde bulunabilir.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processes.map((process, idx) => (
              <Card key={idx} className="hover-elevate">
                <CardHeader>
                  <CardTitle className="text-lg">{process.name}</CardTitle>
                  <CardDescription>{process.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Mevcut Kapasite</p>
                    <p className="font-semibold text-primary">{process.capacity}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="p-12 bg-gradient-to-br from-primary/10 via-background to-background rounded-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Projenizi Değerlendirmeye Hazır Mısınız?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">70,000+</div>
              <div className="text-muted-foreground">Müşteriler</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1 Milyon+</div>
              <div className="text-muted-foreground">Üretilen Parça</div>
            </div>
          </div>
          <Button 
            size="lg" 
            onClick={() => window.location.href = 'mailto:info@manutechlab.com'}
            data-testid="button-schedule-meeting"
          >
            Bir Görüşme Ayarlayın
          </Button>
        </section>
      </div>

      <footer className="border-t py-12 bg-muted/30 mt-16">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="ManHUB" className="h-8 w-auto" />
              <span className="text-lg font-bold">ManHUB</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 ManHUB. Professional manufacturing services.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
