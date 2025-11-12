import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, Award, ClipboardCheck } from "lucide-react";
import { Header } from "@/components/Header";
import logoUrl from "@assets/Logo (2)_1762350189592.png";

interface CertificationItemProps {
  icon: typeof FileCheck;
  title: string;
  description: string;
  price: string;
  deliveryTime: string;
  issuedBy?: string;
  notes?: string[];
}

function CertificationItem({ icon: Icon, title, description, price, deliveryTime, issuedBy, notes }: CertificationItemProps) {
  return (
    <Card className="hover-elevate">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{title}</CardTitle>
            <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {notes && notes.length > 0 && (
          <div className="bg-muted/50 p-3 rounded-md space-y-1">
            {notes.map((note, idx) => (
              <p key={idx} className="text-sm text-muted-foreground">
                <span className="font-medium">Not:</span> {note}
              </p>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-4 pt-2">
          <div>
            <p className="text-xs text-muted-foreground">Standart Fiyat</p>
            <p className="text-lg font-semibold text-primary">{price}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Teslim Süresi</p>
            <p className="text-lg font-semibold">{deliveryTime}</p>
          </div>
        </div>
        {issuedBy && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">Sertifikayı Düzenleyen</p>
            <p className="text-sm font-medium">{issuedBy}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Certifications() {

  const measurementReports = [
    {
      title: "Standart Ölçüm Raporu",
      description: "Bu muayene raporu, CMM, kumpas ve/veya el aletleri kullanılarak, kritik boyutların incelendiğini ve izin verilen boyutsal doğruluk ve toleranslara uygun olup olmadığının kaydedildiğini teyit eder. Kalite Kontrol ekibi, sıfır defolu ürün ile ISO 2859-1'i temel alan İstatistiksel Numune Alma Planımıza bağlı kalarak titiz muayeneler gerçekleştirir.",
      price: "₺1.250,00",
      deliveryTime: "+1 iş günü",
      notes: [
        "Raporda en fazla 20 adet ölçüm numunesi belgelendirilmektedir.",
        "'Balon' teknik çizimler gereklidir; bu mümkün değilse, ana boyutları kendi takdirimize göre ölçülür."
      ]
    },
    {
      title: "CMM Ölçüm Raporu",
      description: "CMM (Koordinat Ölçüm Cihazı) Boyutsal Ölçüm Raporu, tüm sipariş içinden küçük bir partinin kritik boyutlarının incelendiği ve izin verilen toleranslara uygun olup olmadığının kaydedildiği ayrıntılı bir kalite belgesidir. Son derece yüksek hassasiyette bir CMM kullanılarak oluşturulan bu rapor, boyutsal doğruluk, biçim (form), yönelim ve önemli detayların konumu hakkında kapsamlı bilgiler sunar.",
      price: "₺1.500,00",
      deliveryTime: "+3 iş günü",
      notes: ["Raporda en fazla 20 adet muayene numunesi belgelendirilmektedir"]
    },
    {
      title: "İlk Ürün Muayene Raporu (FAIR)",
      description: "İlk Ürün Muayeneleri (FAI'ler), seri üretimden önce parçaların teknik özelliklere (spesifikasyonlara) uygun olmasını sağlar. Yeni bir ürünün ilk üretim işlemi için gerekli olan FAI'de, ilk partiden alınan temsili bir numune kapsamlı bir şekilde incelenir ve ölçülür. Bu süreç, ürünün tasarım spesifikasyonlarını, teknik çizimleri ve sözleşmedeki yükümlülükleri karşıladığını doğrular.",
      price: "₺1.750,00",
      deliveryTime: "+5 iş günü",
      notes: [
        "Müşteriye FAI raporuyla birlikte 2 numune parça gönderilir.",
        "'Balon' teknik çizimler gereklidir.",
        "Varsayılan kapsamın dışında herhangi bir ek FAIR belgesine ihtiyacınız varsa lütfen belirtin."
      ]
    }
  ];

  const materialCertificates = [
    {
      title: "Sipariş Tipi 2.1'e Uygunluk Sertifikası (EN 10204)",
      description: "Bu sertifika, teslim edilen malzemelerin sipariş spesifikasyonlarına uyduğuna dair üreticinin beyanıdır; herhangi bir test sonucu içermez. Üreticinin adı, ürün ayrıntıları ve uyumluluk onayı gibi temel bilgileri içerir. Genellikle genel inşaat uygulamaları gibi ayrıntılı test verilerinin gerekli olmadığı malzemeler için kullanılır.",
      price: "₺350",
      deliveryTime: "Ekstra gün gerekmez",
      issuedBy: "Xometry Türkiye"
    },
    {
      title: "Sipariş Tipi 2.2'ye ile Uygunluk Sertifikası (EN 10204)",
      description: "Bu sertifika, teslim edilen malzemelerin siparişte belirtilen spesifikasyonlara uyduğuna ve ilgili tüm dahili testlerden başarıyla geçtiğine dair bir üretici beyanıdır. Genellikle, EN 10204'e uygun olarak gerçekleştirilen dahili testlere dayanarak, ürünlerin (malzeme bileşimi veya mekanik özellikler gibi) belirtilen gereklilikleri karşıladığını doğrulamak gerektiğinde kullanılır.",
      price: "₺350",
      deliveryTime: "+5 iş günü",
      issuedBy: "Xometry Türkiye"
    },
    {
      title: "Ham Malzeme Sertifikası (Metaller)",
      description: "Ham Malzeme Sertifikası (Metaller), ham malzemenin tedarikçisi tarafından verilir ve malzemelerin belirtilen standartları karşıladığını teyit eder. Çekme mukavemeti, akma mukavemeti, sertlik ve kimyasal analiz gibi mekanik özellikler ve kimyasal bileşim hakkında ayrıntılı bilgiler içerir. EN 10204'e göre Malzeme Muayene Sertifikası 3.1 veya Ülkeye Özgü Eşdeğeri.",
      price: "₺1.500,00",
      deliveryTime: "Ekstra gün gerekmez",
      issuedBy: "Malzeme üreticisi"
    },
    {
      title: "Ham Malzeme Sertifikası (Plastikler)",
      description: "Plastikler için düzenlenen bir ham malzeme sertifikasında, ham malzeme tedarikçisinden plastik malzemelerin belirtilen sipariş gerekliliklerini karşıladığını doğrulayan ayrıntılı belgeler yer alır. Ayrıca kimyasal bileşim, yoğunluk, çekme mukavemeti, uzama ve ısıl özellikler gibi malzeme özellikleri hakkında temel bilgileri içerir.",
      price: "₺1.500,00",
      deliveryTime: "Ekstra gün gerekmez",
      issuedBy: "Malzeme üreticisi"
    },
    {
      title: "Isıl İşlem Sertifikaları",
      description: "Bu sertifika, üretim sırasında malzemelere uygulanan ısıl işlem proseslerini belgelendirir ve gerekli spesifikasyonları ve endüstri standartlarını karşılamalarını sağlar. Sertifika, kullanılan ısıl işlem yöntemleri (örneğin tavlama, su verme, temperleme), sıcaklık aralıkları ve soğutma hızları hakkında bilgileri ve çekme mukavemeti, sertlik ve mikro yapı gibi malzeme özelliklerinde oluşan değişiklikleri içerir.",
      price: "₺1.500,00",
      deliveryTime: "Ekstra gün gerekmez",
      issuedBy: "Üretim ortağı"
    },
    {
      title: "RoHS Sertifikası",
      description: "Tehlikeli Maddelerin Kısıtlanması (RoHS) sertifikası, siparişinizde Kadmiyum, Kurşun, Cıva, Altı Değerlikli (Hexavalent) Krom ve bazı alev geciktiriciler ve ftalatlar gibi tehlikeli maddelerin bulunmadığını ve RoHS mevzuatına uygun olduğunu teyit eder.",
      price: "₺2.500,00",
      deliveryTime: "Ekstra gün gerekmez",
      issuedBy: "Xometry Türkiye, parçaların malzeme sertifikalarına dayanarak"
    },
    {
      title: "REACH Sertifikası",
      description: "Kimyasalların Kaydı, Değerlendirilmesi, Yetkilendirilmesi ve Kısıtlanması (REACH) sertifikası, siparişinizde kullanılan malzemelerin ve ambalajların Avrupa REACH yönetmeliklerine uygun olduğunu belirtir. Malzemelerin hiçbirinde %0,1'den fazla tehlikeli madde bulunmadığını teyit ederek işletmeniz ve son kullanıcılar için daha güvenli, standartlara uyumlu ürünler sağlar.",
      price: "Ücretsiz",
      deliveryTime: "Ekstra gün gerekmez",
      issuedBy: "Xometry Türkiye"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-4xl mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Sertifikalar ve Ölçüm Raporları</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Kendi özel proje gerekliliklerinizi karşılamanıza yardım etmek için, her siparişte isteğe bağlı olarak talep edilebilen ayrıntılı ölçüm raporları ve endüstri standardı sertifikalar dahil olmak üzere çok çeşitli kalite belgeleri sunuyoruz. Bu belgeler, parçalarınızın verdiğiniz spesifikasyonlara göre üretildiğini, uluslararası kalite standartlarını karşıladığını ve yasal mevzuata uygun olduğunu doğruluyor.
          </p>
        </div>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <ClipboardCheck className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">Ölçüm Raporları</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Xometry, parçalarınızın hassas boyut ve kalite standartlarını karşıladığından emin olmak için çeşitli ölçüm raporları sunar. ISO 2859-1 numune alma prosedürlerini temel alan raporlarımız, temel spesifikasyonların kapsamlı bir şekilde doğrulanmasını ve belgelenmesini sağlar.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {measurementReports.map((report, idx) => (
              <CertificationItem key={idx} icon={FileCheck} {...report} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <Award className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">Malzeme Sertifikaları</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Malzeme sertifikalarımız, parçalarınızda kullanılan malzemelerin özellikleri ve standartlara uyumluluğu hakkında ayrıntılı belgeler sunar. EN 10204 standartlarına göre düzenlenen bu sertifikalar, projenizin gerekliliklerine bağlı olarak değişen düzeylerde muayene ve testler sunar.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {materialCertificates.map((cert, idx) => (
              <CertificationItem key={idx} icon={Award} {...cert} />
            ))}
          </div>
        </section>

        <section className="mt-16 p-8 bg-primary/5 rounded-lg">
          <h3 className="text-2xl font-bold mb-6">Sık Sorulan Sorular</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">"Balonlanmış" teknik çizim nedir ve neden gereklidir?</h4>
              <p className="text-muted-foreground">
                Balonlanmış teknik çizimler, kritik boyutların ve toleransların açıkça işaretlendiği, numaralandırılmış referans noktalarına sahip teknik çizimlerdir. Bu, ölçüm raporlarında hangi özelliklerin incelenmesi gerektiğini tam olarak belirtmemize yardımcı olur.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Standart Ölçüm Raporu ile CMM Ölçüm Raporu arasındaki fark nedir?</h4>
              <p className="text-muted-foreground">
                Standart Ölçüm Raporu, kumpas ve el aletleri gibi geleneksel ölçüm araçlarını kullanırken, CMM Ölçüm Raporu son derece hassas Koordinat Ölçüm Cihazı kullanır ve daha detaylı boyutsal analiz sağlar.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Ek sertifika veya ölçüm raporlarını nasıl talep edebilirim?</h4>
              <p className="text-muted-foreground">
                Teklif talebinizi gönderirken veya sipariş notlarınızda hangi sertifika ve raporlara ihtiyacınız olduğunu belirtebilirsiniz. Ekibimiz size yardımcı olmaktan mutluluk duyacaktır.
              </p>
            </div>
          </div>
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
