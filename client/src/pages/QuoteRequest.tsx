import { useState, useEffect } from "react";
import { useLocation as useWouterLocation } from "wouter";
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
import { ArrowLeft, ChevronDown, Settings } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { FileUploader } from "@/components/FileUploader";
import logoUrl from "@assets/Logo (2)_1762350189592.png";

interface UploadedFile {
  name: string;
  uploadURL: string;
  size: number;
}

export default function QuoteRequest() {
  const [, setLocation] = useWouterLocation();
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [technicalDrawing, setTechnicalDrawing] = useState<UploadedFile | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = (urlParams.get('service') || "cnc_machining") as InsertQuote["service"];

  const form = useForm<InsertQuote>({
    resolver: zodResolver(insertQuoteSchema),
    defaultValues: {
      partName: "",
      service: serviceParam || undefined,
      material: undefined,
      quantity: 1,
      finishTypes: [],
      qualityStandard: undefined,
      notes: "",
      measurementReports: [],
      materialCertificates: [],
      printingProcesses: [],
      coatings: [],
      metalPlating: [],
      heatTreatment: [],
    },
  });

  useEffect(() => {
    if (serviceParam && serviceParam !== form.getValues("service")) {
      form.setValue("service", serviceParam);
    }
  }, [serviceParam, form]);

  const submitQuoteMutation = useMutation({
    mutationFn: async (data: InsertQuote & { files: Array<{uploadURL: string, name: string, size: number}> }) => {
      return await apiRequest<QuoteWithFiles>("POST", "/api/quotes", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Quote Request Submitted",
        description: "Your quote has been submitted successfully. You'll receive a quote soon.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit a quote request.",
          variant: "destructive",
        });
        setTimeout(() => {
          setLocation("/login");
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to submit quote request",
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

  const onSubmit = async (data: InsertQuote) => {
    console.log("Form submitted with data:", data);
    console.log("Form errors:", form.formState.errors);
    
    if (uploadedFiles.length === 0) {
      toast({
        title: "No Files Uploaded",
        description: "Please upload at least one CAD file",
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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/")} data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="ManHUB" className="h-10 w-auto" />
              <span className="text-2xl font-bold tracking-tight">ManHUB</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Request a Quote</h1>
          <p className="text-lg text-muted-foreground">
            Upload your CAD files and provide specifications to get a detailed quote
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Upload CAD Files</CardTitle>
                <CardDescription>
                  Supported formats: STEP, STL, DXF, DWG (Max 100MB per file)
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
                <CardTitle>Technical Drawing with Tolerances (Optional)</CardTitle>
                <CardDescription>
                  Upload technical drawing with tolerance specifications (PDF, PNG, JPG)
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
                <CardTitle>Part Specifications</CardTitle>
                <CardDescription>Provide details about your manufacturing requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="partName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Part Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter part name" {...field} data-testid="input-part-name" />
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
                      <FormLabel>Manufacturing Service</FormLabel>
                      <Select 
                        key={`service-${field.value || 'empty'}`}
                        onValueChange={field.onChange} 
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-service">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" sideOffset={4}>
                          <SelectItem value="cnc_machining">CNC Machining</SelectItem>
                          <SelectItem value="laser_cutting">Laser Cutting</SelectItem>
                          <SelectItem value="3d_printing">3D Printing</SelectItem>
                          <SelectItem value="sheet_metal_forming">Sheet Metal Forming</SelectItem>
                          <SelectItem value="injection_molding">Injection Molding</SelectItem>
                          <SelectItem value="welded_fabrication">Welded Fabrication (General)</SelectItem>
                          <SelectItem value="tig_welding">TIG Welding</SelectItem>
                          <SelectItem value="mig_mag_welding">MIG-MAG Welding</SelectItem>
                          <SelectItem value="laser_welding">Laser Welding</SelectItem>
                          <SelectItem value="spot_welding">Spot Welding</SelectItem>
                          <SelectItem value="arc_welding">Arc Welding</SelectItem>
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
                        <FormLabel>Material (Optional)</FormLabel>
                        <Select 
                          key={`material-${field.value || 'empty'}`}
                          onValueChange={field.onChange} 
                          value={field.value || undefined}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-material">
                              <SelectValue placeholder="Select material" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent position="popper" sideOffset={4}>
                            <SelectItem value="aluminum_6061">Aluminum 6061</SelectItem>
                            <SelectItem value="aluminum_7075">Aluminum 7075</SelectItem>
                            <SelectItem value="steel_1040">Steel 1040</SelectItem>
                            <SelectItem value="steel_1045">Steel 1045</SelectItem>
                            <SelectItem value="stainless_steel_304">Stainless Steel 304</SelectItem>
                            <SelectItem value="stainless_steel_316">Stainless Steel 316</SelectItem>
                            <SelectItem value="brass">Brass</SelectItem>
                            <SelectItem value="copper">Copper</SelectItem>
                            <SelectItem value="titanium">Titanium</SelectItem>
                            <SelectItem value="abs">ABS</SelectItem>
                            <SelectItem value="pla">PLA</SelectItem>
                            <SelectItem value="petg">PETG</SelectItem>
                            <SelectItem value="nylon">Nylon</SelectItem>
                            <SelectItem value="polycarbonate">Polycarbonate</SelectItem>
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
                        <FormLabel>Quantity</FormLabel>
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
                      <FormLabel>Quality Standard (ISO 2768)</FormLabel>
                      <Select 
                        key={`quality-${field.value || 'empty'}`}
                        onValueChange={field.onChange} 
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-quality">
                            <SelectValue placeholder="Select tolerance class" />
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
                        <FormLabel>Finish Types (Optional)</FormLabel>
                        <FormDescription>Select one or more finish types</FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {([
                          { value: "as_machined" as const, label: "As Machined" },
                          { value: "anodized" as const, label: "Anodized" },
                          { value: "powder_coated" as const, label: "Powder Coated" },
                          { value: "electroplated" as const, label: "Electroplated" },
                          { value: "brushed" as const, label: "Brushed" },
                          { value: "polished" as const, label: "Polished" },
                          { value: "sandblasted" as const, label: "Sandblasted" },
                          { value: "painted" as const, label: "Painted" },
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
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special requirements or notes about your project"
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
              <Button type="button" variant="outline" onClick={() => setLocation("/")} data-testid="button-cancel">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitQuoteMutation.isPending || uploadedFiles.length === 0} 
                data-testid="button-submit-quote"
                onClick={() => {
                  setTimeout(() => {
                    const errors = form.formState.errors;
                    if (Object.keys(errors).length > 0) {
                      console.log("Form validation errors:", errors);
                      toast({
                        title: "Form Validation Error",
                        description: `Please check: ${Object.keys(errors).join(", ")}`,
                        variant: "destructive",
                      });
                    }
                  }, 100);
                }}
              >
                {submitQuoteMutation.isPending ? "Submitting..." : "Submit Quote Request"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
