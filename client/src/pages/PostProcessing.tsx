import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Palette, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import logoUrl from "@assets/Logo (2)_1762350189592.png";

interface ProcessOption {
  name: string;
  description: string;
  result?: string;
  notes?: string;
  colors?: string[];
  types?: string[];
}

interface ProcessSectionProps {
  title: string;
  icon: typeof Sparkles;
  description?: string;
  processes: ProcessOption[];
}

function ProcessSection({ title, icon: Icon, description, processes }: ProcessSectionProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <Icon className="w-7 h-7 text-primary" />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {description && (
        <p className="text-muted-foreground mb-6">{description}</p>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processes.map((process, idx) => (
          <Card key={idx} className="hover-elevate">
            <CardHeader>
              <CardTitle className="text-lg">{process.name}</CardTitle>
              <CardDescription className="text-sm leading-relaxed">{process.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {process.result && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Sonuç:</p>
                  <p className="text-sm">{process.result}</p>
                </div>
              )}
              {process.notes && (
                <div className="bg-muted/50 p-2 rounded-md">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Notlar:</p>
                  <p className="text-xs text-muted-foreground">{process.notes}</p>
                </div>
              )}
              {process.colors && process.colors.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Renk Seçenekleri:</p>
                  <div className="flex flex-wrap gap-2">
                    {process.colors.map((color, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs">{color}</span>
                    ))}
                  </div>
                </div>
              )}
              {process.types && process.types.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Tipler:</p>
                  <div className="flex flex-wrap gap-2">
                    {process.types.map((type, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs">{type}</span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default function PostProcessing() {
  const [, setLocation] = useLocation();

  const surfaceFinishes = [
    {
      name: "Kumlama",
      description: "Bir nozülden parça yüzeyine basınçlı bir şekilde küçük tanecikler, plastik veya boncukların püskürtülmesini içerir. Bu basınç, çapakları ve kusurları temizleyerek daha pürüzsüz bir yüzey oluşturur.",
      result: "Dokunulduğunda hafif pütürlü, düzgün, mat veya saten benzeri bir doku"
    },
    {
      name: "Elektropolisaj",
      description: "Korozyonu azaltmak ve metale daha parlak bir görünüm kazandırabilmek için çelik parçaları temizleyen elektrokimyasal bir ardıl işlemdir.",
      result: "Azaltılmış korozyon, daha parlak görünüm"
    },
    {
      name: "SPI",
      description: "SPI yüzey standartları, gelişmiş özellikler için farklı parlaklıkta dokulara sahip bir dizi standart kalıp yüzeyi sunar.",
      result: "Seçime bağlı olarak yoğun parlak, yarı parlak, ince ve kaba mat olabilir",
      notes: "Bir ürünün görsel ve dokusal özelliklerini tanımlayan, tasarım tutarlılığını ve üretim doğruluğunu sağlayan bir CMF (Renk/Malzeme/Bitirme) sağlamanızı öneririz.",
      types: ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3", "D1", "D2", "D3"]
    },
    {
      name: "VDI",
      description: "VDI, mat yüzeylerin kalıp dokuları için uluslararası bir standarttır. Kalıp üretimi sırasında genellikle EDM teknolojisi ile işlenir.",
      result: "Seçime bağlı olarak inceden kabaya doku seçenekleri",
      types: ["VDI12", "VDI15", "VDI18", "VDI21", "VDI24", "VDI27", "VDI30", "VDI33", "VDI36", "VDI39", "VDI42", "VDI45"]
    }
  ];

  const coatings = [
    {
      name: "Pasivasyon",
      description: "Yüzeydeki serbest demiri nötürleme işlemi ile uzaklaştıran, çökeltme ile sertleştirilmiş 200 ve 300 serisi paslanmaz çeliklerde ve bazı metallerde korozyon direncini artıran renksiz bir kaplama seçeneği."
    },
    {
      name: "Parlak Yüzey",
      description: "Şeffaf parlatma, parçanın yüzeyini homojenleştirerek ışığın çok az bozulmayla geçmesini sağlar.",
      result: "Geliştirilmiş şeffaflık"
    },
    {
      name: "Alodin Kaplama",
      description: "Chem-film olarak da bilinen alodin (kromat) kaplamaları, korozyon direncini ve iletkenlik özelliklerini geliştirir ve boya için bir temel olarak kullanılabilir.",
      notes: "Tip I alodin kaplamanın tipik olarak altın veya kahverengi renkte görünmesine neden olmuştur",
      colors: ["Altın", "Kahverengi"]
    },
    {
      name: "Siyah Oksit Kaplama",
      description: "Siyah oksit, çelik ve paslanmaz çelik gibi demir içeren malzemeler için malzemenin üst tabakasını karartan bir tür dönüşüm kaplamasıdır. Yansıma ve parlamayı azaltmanın yanı sıra parça boyutlarını etkilemeden ek korozyon direnci sağlamak için kullanılabilir.",
      colors: ["Siyah"]
    },
    {
      name: "Sprey Boyama",
      description: "Püskürtme yoluyla uygulanan sürekli, koruyucu bir renk kaplaması sağlayan boyama işlemidir.",
      notes: "Boya kaplaması sadece yüzey seviyesindedir, çizilirse veya aşınma ve yıpranmaya maruz kalırsa, doğal yüzey görülebilir.",
      colors: ["RAL Renkleri", "Özel Renkler"]
    },
    {
      name: "Toz Boya",
      description: "Eşit şekilde uygulanan, ısıyla kürlenen boya kullanılarak parçalar yüzeyinde sürekli, koruyucu bir renk kaplaması sağlar. Yüzey, geleneksel boyamaya kıyasla daha sert ve düzgündür.",
      colors: ["RAL Renkleri", "Özel Renkler"]
    }
  ];

  const anodizing = [
    {
      name: "Eloksal Kaplama (Tip II)",
      description: "Tip II eloksal, daha yüksek korozyon direncine sahiptir ve boyama ve farklı kaplama işlemleri için temel olarak kullanılabilir.",
      notes: "Parçanın yüzey rengini etkilemek için boyaların kullanılmasını da içerir. Eloksal renkler belirli Pantone veya RAL renkleriyle uyumlu değildir. Tip II kaplamalar aşınmaya karşı hassastır ve uzun süreli doğrudan güneş ışığı altında ağarabilir veya solabilir",
      colors: ["Doğal", "Siyah", "Kırmızı", "Mavi", "Altın"]
    },
    {
      name: "Sert Eloksal Kaplama (Tip III)",
      description: "Tip III eloksal kaplama, standart eloksaldan daha kalın bir tabaka ile yüzeyi daha dayanıklı ve aşınmaya dirençli hale getirir. Boya ve diğer ardıl işlemler için yaygın olarak kullanılabilir.",
      notes: "Kalınlık nedeniyle renkler olduğundan daha koyu görünebilir. Eloksal renkler belirli Pantone veya RAL renkleriyle uyumlu değildir.",
      colors: ["Doğal", "Siyah"]
    }
  ];

  const metalPlating = [
    {
      name: "Akımsız Nikel Kaplama",
      description: "Akımsız nikel kaplama, homojen olmayan yüzeylerde korozyon, oksitlenme ve aşınmaya karşı koruma sağlayan düzgün bir kaplama seçeneği sunar.",
      result: "Korozyonu önler ve yüzey sertliğini artırır, daha parlak bir görünüm"
    },
    {
      name: "Altın Kaplama",
      description: "Altın Kaplama iyi bir korozyon direnci sağlar ve kararmayı önler. Altın mükemmel elektriksel ve termal iletkenliğe ve aynı zamanda yüksek lehimlenebilirliğe sahiptir.",
      result: "Altın benzeri görünüm, korozyon ve kararmaya karşı daha yüksek direnç"
    },
    {
      name: "Gümüş Kaplama",
      description: "Gümüş kaplama işlemi, iyi bir korozyon direnci sağlar ancak kolayca kararabilir. Gümüş yüksek lehimlenebilirlik ve elektrik iletkenliği sağlar.",
      result: "Gümüş yüzey, artırılmış korozyon direnci, kolayca kararma"
    },
    {
      name: "Çinko Kaplama / Galvanizleme",
      description: "Çinko kaplama, alt tabaka olarak bilinen başka bir metal nesnenin yüzeyine ince bir çinko kaplamanın elektroliz yoluyla kaplanmasını içerir. Çinko kaplama, pasın alttaki metal yüzeye ulaşmasını önleyen fiziksel bir bariyer oluşturur.",
      result: "Artan korozyon direnci"
    }
  ];

  const heatTreatment = [
    {
      name: "Tavlama",
      description: "Tavlama işlemi, bir metalin gerilimlerde değişiklik olmaksızın yeniden kristalleşmenin başladığı sıcaklığa kadar veya yakın bir sıcaklığa kadar ısıtılmasını içerir. Isıtma işleminden sonra metal, bir fırında oda sıcaklığında soğutulur veya kum içerisine konur.",
      result: "Metalin soğuk işlenebilirliği artar"
    },
    {
      name: "Yüzey Sertleştirme (Karbürleme)",
      description: "Alttaki metalin yumuşak kalmasına izin verirken metal parçaların sürtünme ve aşınmaya uğrayan yüzeylerini iyileştirerek sertleştirmeyi içeren bir ısıl işlemdir. Adından da anlaşılacağı üzere karbürleme (sementasyon), düşük karbonlu alaşımlara yüksek sıcaklıklarda karbon veya nitrojen eklenerek parçaların ekstrem koşullarda bile korumasını sağlar."
    },
    {
      name: "Temperleme",
      description: "Esas olarak metallerin sertliğinin azaltılarak tokluğun elde edildiği bir ısıl işlem yöntemidir. Metalin kritik bir noktanın altındaki sıcaklığa kadar ısıtılmasını içerir.",
      result: "Azaltılmış sertlik, artan esneklik ve süneklik, azaltılmış akma ve çekme dayanımı"
    },
    {
      name: "Su Verme",
      description: "Su verme olarak da bilinen sertleştirme, bir malzemeyi yüksek bir sıcaklığa kadar ısıtarak ve ardından genellikle yağ, su veya hava gibi bir su verme ortamına daldırarak hızla soğutarak sertliğini ve mukavemetini artırmak için kullanılan bir ısıl işlemdir.",
      result: "Parçaların yüzey sertliğini artırmak için kullanılır"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-4xl mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Ardıl İşlem Hizmetleri</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Xometry ile üretilen parçalarınıza ardıl işlem uygulanmasını istiyorsanız, bunu teklif aşamasında Anlık Fiyat Motoru'nda belirtebilir veya sadece birkaç tıklamayla 40'tan fazla ardıl işlem seçeneği arasından seçim yapabilirsiniz.
          </p>
          <p className="text-muted-foreground">
            Xometry, gerekli yüzey kalitesini ve işlevselliği sağlamak için tasarımdan üretime, parçalarınızın son işlemine kadar sizinle işbirliği içerisinde çalışır.
          </p>
        </div>

        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Parçalarınızı 40+ Ardıl İşlem Seçeneğiyle Fiyatlandırın</h2>
          <p className="text-muted-foreground mb-6">Parça yüzeyini, estetik ve işlevsel özellikleri iyileştirmek için</p>
          <Button size="lg" onClick={() => setLocation("/quote-request")}>
            Online Teklif Oluştur
          </Button>
        </div>

        <ProcessSection 
          title="Yüzey İşlemleri" 
          icon={Sparkles}
          processes={surfaceFinishes}
        />

        <ProcessSection 
          title="Kaplamalar" 
          icon={Palette}
          processes={coatings}
        />

        <ProcessSection 
          title="Eloksal" 
          icon={Zap}
          processes={anodizing}
        />

        <ProcessSection 
          title="Metal Kaplamaları" 
          icon={Palette}
          processes={metalPlating}
        />

        <ProcessSection 
          title="Isıl İşlemler" 
          icon={Zap}
          processes={heatTreatment}
        />
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
