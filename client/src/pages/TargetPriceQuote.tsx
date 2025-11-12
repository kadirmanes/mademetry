import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { insertQuoteSchema, type InsertQuote, type QuoteWithFiles } from "@shared/schema";
import { Target, ChevronDown, Settings } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { FileUploader } from "@/components/FileUploader";
import { Header } from "@/components/Header";
import logoUrl from "@assets/Logo (2)_1762350189592.png";
import { z } from "zod";

interface UploadedFile {
  name: string;
  uploadURL: string;
  size: number;
}

const targetPriceQuoteSchema = insertQuoteSchema.extend({
  targetPrice: z.coerce.number().min(0.01, "Please enter a target price"),
});

type TargetPriceQuote = z.infer<typeof targetPriceQuoteSchema>;

export default function TargetPriceQuote() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [technicalDrawing, setTechnicalDrawing] = useState<UploadedFile | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const form = useForm<TargetPriceQuote>({
    resolver: zodResolver(targetPriceQuoteSchema),
    defaultValues: {
      partName: "",
      service: undefined,
      material: undefined,
      quantity: 1,
      finishTypes: [],
      qualityStandard: undefined,
      notes: "",
      targetPrice: 0,
      measurementReports: [],
      materialCertificates: [],
      printingProcesses: [],
      coatings: [],
      metalPlating: [],
      heatTreatment: [],
    },
  });

  const submitQuoteMutation = useMutation({
    mutationFn: async (data: TargetPriceQuote & { files: Array<{uploadURL: string, name: string, size: number}> }) => {
      return await apiRequest<QuoteWithFiles>("POST", "/api/quotes", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Hedef Fiyatlı Teklif Gönderildi",
        description: "Hedef fiyatlı teklifiniz başarıyla gönderildi. En kısa sürede size dönüş yapılacaktır.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Kimlik Doğrulama Gerekli",
          description: "Teklif göndermek için lütfen giriş yapın.",
          variant: "destructive",
        });
        setTimeout(() => {
          setLocation("/login");
        }, 500);
        return;
      }
      toast({
        title: "Hata",
        description: error.message || "Teklif gönderilirken hata oluştu",
        variant: "destructive",
      });
    },
  });

  const handleFilesUploaded = (newFiles: UploadedFile[]) => {
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: TargetPriceQuote) => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "Dosya Yüklenmedi",
        description: "Lütfen en az bir CAD dosyası yükleyin",
        variant: "destructive",
      });
      return;
    }

    const files = uploadedFiles.map((f) => ({
      uploadURL: f.uploadURL,
      name: f.name,
      size: f.size
    }));
    const technicalDrawingURL = technicalDrawing?.uploadURL || null;
    await submitQuoteMutation.mutateAsync({ 
      ...data, 
      files,
      technicalDrawingPath: technicalDrawingURL 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Hedef Fiyatlı Teklif</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            CAD dosyalarınızı yükleyin, parça özelliklerini belirtin ve hedef fiyatınızı girin. Ekibimiz hedef fiyatınıza uygun en iyi çözümü sunmak için çalışacaktır.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>CAD Dosyaları Yükle</CardTitle>
                <CardDescription>
                  Desteklenen formatlar: STEP, STL, DXF, DWG (Dosya başına maksimum 100MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader
                  onFilesUploaded={handleFilesUploaded}
                  uploadedFiles={uploadedFiles}
                  onRemoveFile={handleRemoveFile}
                  maxFiles={5}
                  maxFileSize={104857600}
                  allowedFileTypes={['.step', '.stp', '.stl', '.dxf', '.dwg']}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Toleranslı Teknik Resim (Opsiyonel)</CardTitle>
                <CardDescription>
                  Tolerans özelliklerine sahip teknik resim yükleyin (PDF, PNG, JPG)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader
                  onFilesUploaded={(files) => setTechnicalDrawing(files[0] || null)}
                  uploadedFiles={technicalDrawing ? [technicalDrawing] : []}
                  onRemoveFile={() => setTechnicalDrawing(null)}
                  maxFiles={1}
                  maxFileSize={10485760}
                  allowedFileTypes={['.pdf', '.png', '.jpg', '.jpeg']}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Parça Özellikleri</CardTitle>
                <CardDescription>Üretim gereksinimleriniz hakkında detayları girin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="partName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parça Adı</FormLabel>
                      <FormControl>
                        <Input placeholder="Parça adını girin" {...field} data-testid="input-part-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Üretim Servisi</FormLabel>
                      <Select 
                        key={`service-${field.value || 'empty'}`}
                        onValueChange={field.onChange} 
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-service">
                            <SelectValue placeholder="Servis seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" sideOffset={4}>
                          <SelectItem value="cnc_machining">CNC İşleme</SelectItem>
                          <SelectItem value="laser_cutting">Lazer Kesim</SelectItem>
                          <SelectItem value="3d_printing">3D Baskı</SelectItem>
                          <SelectItem value="sheet_metal_forming">Sac Metal Şekillendirme</SelectItem>
                          <SelectItem value="injection_molding">Enjeksiyon Kalıplama</SelectItem>
                          <SelectItem value="welded_fabrication">Kaynaklı Üretim</SelectItem>
                          <SelectItem value="tig_welding">TIG Kaynağı</SelectItem>
                          <SelectItem value="mig_mag_welding">MIG-MAG Kaynağı</SelectItem>
                          <SelectItem value="laser_welding">Lazer Kaynağı</SelectItem>
                          <SelectItem value="spot_welding">Nokta Kaynağı</SelectItem>
                          <SelectItem value="arc_welding">Ark Kaynağı</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="material"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Malzeme (Opsiyonel)</FormLabel>
                        <Select 
                          key={`material-${field.value || 'empty'}`}
                          onValueChange={field.onChange} 
                          value={field.value || undefined}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-material">
                              <SelectValue placeholder="Malzeme seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent position="popper" sideOffset={4}>
                            <SelectItem value="aluminum_6061">Alüminyum 6061</SelectItem>
                            <SelectItem value="aluminum_7075">Alüminyum 7075</SelectItem>
                            <SelectItem value="steel_1040">Çelik 1040</SelectItem>
                            <SelectItem value="steel_1045">Çelik 1045</SelectItem>
                            <SelectItem value="stainless_steel_304">Paslanmaz Çelik 304</SelectItem>
                            <SelectItem value="stainless_steel_316">Paslanmaz Çelik 316</SelectItem>
                            <SelectItem value="brass">Pirinç</SelectItem>
                            <SelectItem value="copper">Bakır</SelectItem>
                            <SelectItem value="titanium">Titanyum</SelectItem>
                            <SelectItem value="abs">ABS</SelectItem>
                            <SelectItem value="pla">PLA</SelectItem>
                            <SelectItem value="petg">PETG</SelectItem>
                            <SelectItem value="nylon">Naylon</SelectItem>
                            <SelectItem value="polycarbonate">Polikarbonat</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Miktar</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              field.onChange(isNaN(val) ? 1 : val);
                            }}
                            data-testid="input-quantity"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="qualityStandard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kalite Standardı (ISO 2768)</FormLabel>
                      <Select 
                        key={`quality-${field.value || 'empty'}`}
                        onValueChange={field.onChange} 
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-quality">
                            <SelectValue placeholder="Tolerans sınıfı seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" sideOffset={4}>
                          <SelectItem value="fine">Fine (f)</SelectItem>
                          <SelectItem value="medium">Medium (m)</SelectItem>
                          <SelectItem value="coarse">Coarse (c)</SelectItem>
                          <SelectItem value="very_coarse">Very Coarse (v)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="finishTypes"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Kaplama Türleri (Opsiyonel)</FormLabel>
                        <FormDescription>Bir veya daha fazla kaplama türü seçin</FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {([
                          { value: "as_machined" as const, label: "İşlenmiş Hali" },
                          { value: "anodized" as const, label: "Eloksal" },
                          { value: "powder_coated" as const, label: "Toz Boya" },
                          { value: "electroplated" as const, label: "Elektro Kaplama" },
                          { value: "brushed" as const, label: "Fırçalanmış" },
                          { value: "polished" as const, label: "Cilalı" },
                          { value: "sandblasted" as const, label: "Kumlama" },
                          { value: "painted" as const, label: "Boyalı" },
                        ] as const).map((finish) => (
                          <FormField
                            key={finish.value}
                            control={form.control}
                            name="finishTypes"
                            render={({ field }) => (
                              <FormItem className="flex items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(finish.value)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        field.onChange([...current, finish.value]);
                                      } else {
                                        field.onChange(current.filter((v) => v !== finish.value));
                                      }
                                    }}
                                    data-testid={`checkbox-finish-${finish.value}`}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{finish.label}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        Hedef Fiyat (TL)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="Hedef fiyatınızı girin"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            field.onChange(isNaN(val) ? 0 : val);
                          }}
                          data-testid="input-target-price"
                          className="text-lg font-semibold"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-muted-foreground">
                        Ekibimiz bu hedef fiyata uygun en iyi üretim çözümünü sunmak için çalışacaktır.
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ek Notlar (Opsiyonel)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Projeniz hakkında özel gereksinimler veya notlar"
                          className="resize-none min-h-32"
                          {...field}
                          data-testid="textarea-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Collapsible open={showAdvancedOptions} onOpenChange={setShowAdvancedOptions}>
              <div className="flex justify-center my-6">
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="gap-2"
                    data-testid="button-advanced-options"
                  >
                    <Settings className="w-4 h-4" />
                    {showAdvancedOptions ? "Gelişmiş Seçenekleri Gizle" : "Gelişmiş Seçenekler (Sertifikalar, Raporlar, İşlemler)"}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Ölçüm Raporları (Opsiyonel)</CardTitle>
                    <CardDescription>
                      Parçanızın kalite kontrolü için gerekli ölçüm raporlarını seçin
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                <FormField
                  control={form.control}
                  name="measurementReports"
                  render={() => (
                    <FormItem>
                      <div className="space-y-3">
                        {([
                          { value: "standard_measurement", label: "Standart Ölçüm Raporu" },
                          { value: "cmm_measurement", label: "CMM Ölçüm Raporu" },
                          { value: "fair", label: "İlk Ürün Muayene Raporu (FAIR)" },
                        ] as const).map((report) => (
                          <FormField
                            key={report.value}
                            control={form.control}
                            name="measurementReports"
                            render={({ field }) => (
                              <FormItem className="flex items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(report.value)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        field.onChange([...current, report.value]);
                                      } else {
                                        field.onChange(current.filter((v) => v !== report.value));
                                      }
                                    }}
                                    data-testid={`checkbox-measurement-${report.value}`}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{report.label}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Malzeme Sertifikaları (Opsiyonel)</CardTitle>
                <CardDescription>
                  Malzeme kalitesi için gerekli sertifikaları seçin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="materialCertificates"
                  render={() => (
                    <FormItem>
                      <div className="space-y-3">
                        {([
                          { value: "en10204_type2_1", label: "Sıparış Tür 2'ye Uygunluk Sertifikası (EN 10204)" },
                          { value: "en10204_type3_1", label: "Sıparış Tür 3.1'ye Uygunluk Sertifikası (EN 10204)" },
                          { value: "raw_material_metal", label: "Ham Malzeme Sertifikası (Metaller)" },
                          { value: "raw_material_plastic", label: "Ham Malzeme Sertifikası (Plastikler)" },
                          { value: "heat_treatment", label: "Isıl İşlem Sertifikası" },
                          { value: "rohs", label: "RoHS Sertifikası" },
                          { value: "reach", label: "REACH Sertifikası" },
                        ] as const).map((cert) => (
                          <FormField
                            key={cert.value}
                            control={form.control}
                            name="materialCertificates"
                            render={({ field }) => (
                              <FormItem className="flex items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(cert.value)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        field.onChange([...current, cert.value]);
                                      } else {
                                        field.onChange(current.filter((v) => v !== cert.value));
                                      }
                                    }}
                                    data-testid={`checkbox-certificate-${cert.value}`}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{cert.label}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yazıcı İşlemleri (Opsiyonel)</CardTitle>
                <CardDescription>
                  Parçanıza uygulanacak işaretleme ve baskı yöntemlerini seçin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="printingProcesses"
                  render={() => (
                    <FormItem>
                      <div className="space-y-3">
                        {([
                          { value: "laser_marking", label: "Lazermarking" },
                          { value: "screen_printing", label: "Serigrafi" },
                          { value: "pad_printing", label: "Baskı" },
                        ] as const).map((process) => (
                          <FormField
                            key={process.value}
                            control={form.control}
                            name="printingProcesses"
                            render={({ field }) => (
                              <FormItem className="flex items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(process.value)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        field.onChange([...current, process.value]);
                                      } else {
                                        field.onChange(current.filter((v) => v !== process.value));
                                      }
                                    }}
                                    data-testid={`checkbox-printing-${process.value}`}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{process.label}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kaplamalar (Opsiyonel)</CardTitle>
                <CardDescription>
                  Yüzey kaplama işlemlerini seçin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="coatings"
                  render={() => (
                    <FormItem>
                      <div className="space-y-3">
                        {([
                          { value: "electrostatic", label: "Elektrostatik Toz Boya" },
                          { value: "passivation", label: "Pasifleştirme" },
                          { value: "anodization", label: "Anodizasyon" },
                        ] as const).map((coating) => (
                          <FormField
                            key={coating.value}
                            control={form.control}
                            name="coatings"
                            render={({ field }) => (
                              <FormItem className="flex items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(coating.value)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        field.onChange([...current, coating.value]);
                                      } else {
                                        field.onChange(current.filter((v) => v !== coating.value));
                                      }
                                    }}
                                    data-testid={`checkbox-coating-${coating.value}`}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{coating.label}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metal Kaplamalar (Opsiyonel)</CardTitle>
                <CardDescription>
                  Metal kaplama yöntemlerini seçin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="metalPlating"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-2 gap-3">
                        {([
                          { value: "nickel_plating", label: "Nikelaj Kaplama" },
                          { value: "gold_plating", label: "Altın Kaplama" },
                          { value: "chrome_plating", label: "Krom Kaplama" },
                          { value: "zinc_plating", label: "Çinko Kaplama" },
                          { value: "tin_plating", label: "Kalay Kaplama" },
                          { value: "silver_plating", label: "Gümüş Kaplama" },
                        ] as const).map((plating) => (
                          <FormField
                            key={plating.value}
                            control={form.control}
                            name="metalPlating"
                            render={({ field }) => (
                              <FormItem className="flex items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(plating.value)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        field.onChange([...current, plating.value]);
                                      } else {
                                        field.onChange(current.filter((v) => v !== plating.value));
                                      }
                                    }}
                                    data-testid={`checkbox-plating-${plating.value}`}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{plating.label}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Isıl İşlemler (Opsiyonel)</CardTitle>
                <CardDescription>
                  Parçanıza uygulanacak ısıl işlem yöntemlerini seçin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="heatTreatment"
                  render={() => (
                    <FormItem>
                      <div className="space-y-3">
                        {([
                          { value: "tempering", label: "Temperleme" },
                          { value: "normalizing", label: "Normalleştirme" },
                          { value: "quenching", label: "Su Verme" },
                        ] as const).map((treatment) => (
                          <FormField
                            key={treatment.value}
                            control={form.control}
                            name="heatTreatment"
                            render={({ field }) => (
                              <FormItem className="flex items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(treatment.value)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        field.onChange([...current, treatment.value]);
                                      } else {
                                        field.onChange(current.filter((v) => v !== treatment.value));
                                      }
                                    }}
                                    data-testid={`checkbox-heat-${treatment.value}`}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{treatment.label}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
              </CollapsibleContent>
            </Collapsible>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setLocation("/")}>
                İptal
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={submitQuoteMutation.isPending}
                data-testid="button-submit-quote"
              >
                {submitQuoteMutation.isPending ? "Gönderiliyor..." : "Hedef Fiyatlı Teklif Gönder"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
