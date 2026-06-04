"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileSpreadsheet, 
  Edit, 
  Trash2, 
  PlusCircle, 
  Search, 
  Inbox, 
  Download, 
  Sparkles, 
  Plus, 
  X, 
  Loader2,
  Upload,
  FileCode,
  Image as ImageIcon,
  CheckCircle2,
  Trash
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TemplateImageSlider } from "@/components/template-image-slider";

interface TemplateItem {
  id: string;
  title: string;
  format: string;
  size: string;
  downloads: string;
  description: string;
  file_url?: string;
  file_name?: string;
  images?: string[];
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export function TemplatesTab() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateItem | null>(null);

  // Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<TemplateItem | null>(null);

  // Image Preview Lightbox State
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [format, setFormat] = useState("xlsx (Excel)");
  const [size, setSize] = useState("100 KB");
  const [description, setDescription] = useState("");
  
  // Upload states
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const excelInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("excel_templates")
        .select("*");
      if (!error && data) {
        setTemplates(data);
      }
    } catch (e) {
      console.error("Gagal mengambil data template:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch = 
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [templates, searchQuery]);

  // Open modal for Create
  const handleCreateOpen = () => {
    setEditingTemplate(null);
    setTitle("");
    setFormat("xlsx (Excel)");
    setSize("100 KB");
    setDescription("");
    setFileUrl("");
    setFileName("");
    setImages([]);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleEditOpen = (template: TemplateItem) => {
    setEditingTemplate(template);
    setTitle(template.title);
    setFormat(template.format || "xlsx (Excel)");
    setSize(template.size);
    setDescription(template.description);
    setFileUrl(template.file_url || "");
    setFileName(template.file_name || "");
    setImages(template.images || []);
    setIsModalOpen(true);
  };

  // Handle Excel upload click/drag
  const handleExcelChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Hanya berkas Excel (.xlsx, .xls) yang diperbolehkan!");
      return;
    }

    try {
      // Auto-set formatted size
      const formattedSize = file.size > 1024 * 1024
        ? (file.size / (1024 * 1024)).toFixed(1) + " MB"
        : (file.size / 1024).toFixed(0) + " KB";
      setSize(formattedSize);
      setFileName(file.name);

      // Auto-fill template title from file name
      const nameWithoutExt = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());
      setTitle(nameWithoutExt);

      const base64 = await fileToBase64(file);
      setFileUrl(base64);
    } catch (err) {
      console.error(err);
      alert("Gagal membaca file Excel.");
    }
  };

  // Handle Multiple Images change
  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > 4) {
      alert("Maksimal 4 tangkapan layar/gambar diperbolehkan.");
      return;
    }

    const processedImages = [...images];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert(`File "${file.name}" bukan gambar!`);
        continue;
      }
      try {
        const base64 = await fileToBase64(file);
        processedImages.push(base64);
      } catch (err) {
        console.error(err);
      }
    }
    setImages(processedImages);
  };

  // Remove Excel File
  const removeExcelFile = () => {
    setFileName("");
    setFileUrl("");
    if (excelInputRef.current) excelInputRef.current.value = "";
  };

  // Remove individual image
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    if (imagesInputRef.current) imagesInputRef.current.value = "";
  };

  // Handle Save (Create / Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Judul dan Deskripsi wajib diisi!");
      return;
    }

    const templateData = {
      title: title.trim(),
      format: format.trim(),
      size: size.trim(),
      description: description.trim(),
      file_url: fileUrl,
      file_name: fileName,
      images: images,
    };

    try {
      if (editingTemplate) {
        const { error } = await supabase
          .from("excel_templates")
          .update(templateData)
          .eq("id", editingTemplate.id);
        if (error) throw error;
      } else {
        const newId = "tmpl-" + Date.now();
        const { error } = await supabase
          .from("excel_templates")
          .insert({
            id: newId,
            downloads: "0 unduhan",
            ...templateData
          });
        if (error) throw error;
      }
      setIsModalOpen(false);
      await loadTemplates();
    } catch (e) {
      console.error("Error saving template:", e);
      alert("Gagal menyimpan data template ke database.");
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return;
    try {
      const { error } = await supabase
        .from("excel_templates")
        .delete()
        .eq("id", templateToDelete.id);
      if (error) throw error;
      setIsDeleteModalOpen(false);
      setTemplateToDelete(null);
      await loadTemplates();
    } catch (e) {
      console.error("Error deleting template:", e);
      alert("Gagal menghapus template dari database.");
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-border/40 gap-4 select-none">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <FileSpreadsheet className="h-6 w-6 text-emerald-500" />
              Kelola Template Excel
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {templates.length} Tersedia
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Tambah, edit, dan hapus template spreadsheet Excel yang disediakan untuk diunduh gratis oleh peserta didik.
          </p>
        </div>
      </div>

      {/* Control Bar: Search & Create Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-muted/15 border border-border/50 p-3 rounded-2xl select-none">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
          <Input
            type="text"
            placeholder="Cari template berdasarkan judul, kategori, atau deskripsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-xs bg-background/50 border-border/60 focus-visible:ring-emerald-500/50"
          />
        </div>

        {/* Create Button */}
        <Button
          onClick={handleCreateOpen}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 h-10 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-xs transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Tambah Template Baru</span>
        </Button>
      </div>

      {/* Grid Templates View */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p className="text-xs font-semibold">Memuat berkas template...</p>
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div 
              key={template.id} 
              className="group relative overflow-hidden bg-card/65 backdrop-blur-sm border border-border/60 hover:border-emerald-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5"
            >
              <div className="space-y-4">
                
                {/* Visual Thumbnail Screenshots Carousel */}
                {template.images && template.images.length > 0 && (
                  <TemplateImageSlider 
                    images={template.images} 
                    onImageClick={setPreviewImageUrl} 
                    title={template.title} 
                  />
                )}

                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-foreground group-hover:text-emerald-400 transition-colors pt-1">
                      {template.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap bg-muted px-2 py-1 rounded">
                    {template.format}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {template.description}
                </p>

                {/* Uploaded File Indicator */}
                {template.file_name && (
                  <div className="flex items-center gap-2 p-2 bg-emerald-500/5 border border-emerald-500/15 rounded-xl text-[11px] font-mono text-emerald-400">
                    <FileCode className="h-4 w-4 shrink-0" />
                    <span className="truncate">{template.file_name}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-border/20 flex items-center justify-between text-[11px] text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span>Ukuran: <strong className="font-mono text-foreground font-semibold">{template.size}</strong></span>
                  <span>|</span>
                  <span className="font-mono text-foreground/80">{template.downloads || "0 unduhan"}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditOpen(template)}
                    className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Edit Template"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setTemplateToDelete(template);
                      setIsDeleteModalOpen(true);
                    }}
                    className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Hapus Template"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="border border-dashed border-border/80 bg-card/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-2xs select-none">
          <div className="h-12 w-12 rounded-2xl bg-muted/40 border border-border/60 text-muted-foreground/60 flex items-center justify-center">
            <Inbox className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Template Tidak Ditemukan</h3>
            <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
              Belum ada template Excel yang didaftarkan atau pencarian Anda tidak memiliki hasil kecocokan.
            </p>
          </div>
          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="text-[10px] font-bold h-8 border-border/60 hover:bg-muted rounded-lg cursor-pointer px-4"
            >
              Atur Ulang Pencarian
            </Button>
          )}
        </Card>
      )}

      {/* Modal Dialog for Create/Edit Template */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && setIsModalOpen(false)}>
        <DialogContent className="sm:max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto border border-border/80 bg-background/95 backdrop-blur-md p-6 rounded-2xl shadow-xl">
          <DialogHeader className="pb-3 border-b border-border/25">
            <DialogTitle className="text-base font-extrabold flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
              {editingTemplate ? "Ubah Template Excel" : "Tambah Template Baru"}
            </DialogTitle>
            <p className="text-[10px] text-muted-foreground">
              Masukkan rincian informasi dan unggah berkas spreadsheet pendukung.
            </p>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-5 pt-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Form Details & Excel File Upload */}
              <div className="space-y-4">
                
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Judul Template</label>
                  <Input
                    type="text"
                    placeholder="Masukkan judul template (cth: Rekap Absensi Bulanan)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-muted/10 border-border/60 focus-visible:ring-emerald-500/50"
                    required
                  />
                </div>

                {/* Format & Size */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Format File</label>
                    <Input
                      type="text"
                      placeholder="xlsx (Excel)"
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="bg-muted/10 border-border/60 focus-visible:ring-emerald-500/50"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Ukuran File</label>
                    <Input
                      type="text"
                      placeholder="85 KB"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="bg-muted/10 border-border/60 focus-visible:ring-emerald-500/50 font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Deskripsi Singkat</label>
                  <textarea
                    placeholder="Jelaskan kegunaan template dan formula pendukung yang digunakan..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full pl-3 pr-3 py-2 text-xs rounded-lg border border-border/60 bg-muted/10 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all font-sans"
                    required
                  />
                </div>

                {/* Drag-and-Drop / Clickable Zone for Excel */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Unggah Berkas Excel (.xlsx, .xls)</label>
                  
                  {fileName ? (
                    /* Show Selected File Details */
                    <div className="flex items-center justify-between p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                          <FileCode className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground text-xs truncate leading-snug">{fileName}</p>
                          <p className="text-[10px] text-muted-foreground font-mono leading-none pt-0.5">{size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={removeExcelFile}
                          className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Dropzone Button */
                    <div 
                      onClick={() => excelInputRef.current?.click()}
                      className="border-2 border-dashed border-border/75 hover:border-emerald-500/60 bg-muted/5 hover:bg-emerald-500/[0.02] rounded-xl p-6 text-center cursor-pointer transition-all duration-200 group"
                    >
                      <input 
                        type="file"
                        ref={excelInputRef}
                        accept=".xlsx, .xls"
                        onChange={handleExcelChange}
                        className="hidden"
                      />
                      <Upload className="h-8 w-8 text-muted-foreground/60 group-hover:text-emerald-500 mx-auto transition-colors duration-150" />
                      <p className="font-bold text-foreground text-xs pt-2">Klik untuk memilih berkas Excel</p>
                      <p className="text-[10px] text-muted-foreground pt-0.5">Mendukung format .xlsx & .xls</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Multiple Images Upload */}
              <div className="space-y-4">
                
                {/* Multiple Images Upload Zone */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Unggah Tangkapan Layar / Gambar</label>
                    <span className="text-[10px] text-muted-foreground font-mono">{images.length}/4 Gambar</span>
                  </div>

                  {/* Images Dropzone */}
                  {images.length < 4 && (
                    <div 
                      onClick={() => imagesInputRef.current?.click()}
                      className="border-2 border-dashed border-border/75 hover:border-emerald-500/60 bg-muted/5 hover:bg-emerald-500/[0.02] rounded-xl p-5 text-center cursor-pointer transition-all duration-200 group"
                    >
                      <input 
                        type="file"
                        ref={imagesInputRef}
                        multiple
                        accept="image/*"
                        onChange={handleImagesChange}
                        className="hidden"
                      />
                      <ImageIcon className="h-8 w-8 text-muted-foreground/60 group-hover:text-emerald-500 mx-auto transition-colors duration-150" />
                      <p className="font-bold text-foreground text-xs pt-1.5">Klik untuk mengunggah tangkapan layar</p>
                      <p className="text-[10px] text-muted-foreground">Bisa memilih lebih dari 1 gambar sekaligus (Maks 1MB per gambar)</p>
                    </div>
                  )}

                  {/* Thumbnail Image Grid Previews */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                      {images.map((img, idx) => (
                        <div 
                          key={`img-preview-${idx}`}
                          className="group/thumb relative h-20 w-full rounded-xl border border-border/60 overflow-hidden bg-background"
                        >
                          <img 
                            src={img} 
                            alt={`Preview ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                          {/* Hover Delete Button Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-150 flex items-center justify-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeImage(idx)}
                              className="h-7 w-7 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                              title="Hapus Gambar"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4.5 border-t border-border/25">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-border/60 hover:bg-muted text-xs h-9 cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 px-5 rounded-lg cursor-pointer"
              >
                Simpan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Image Preview Lightbox Modal */}
      <Dialog open={!!previewImageUrl} onOpenChange={(open) => !open && setPreviewImageUrl(null)}>
        <DialogContent className="sm:max-w-5xl w-[95vw] border-none bg-black/95 backdrop-blur-md p-0 overflow-hidden shadow-2xl rounded-2xl flex flex-col items-center justify-center">
          {previewImageUrl && (
            <div className="relative w-full h-[80vh] flex items-center justify-center p-4">
              <button 
                type="button"
                onClick={() => setPreviewImageUrl(null)}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/60 border border-white/10 text-white hover:bg-black/80 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer z-50"
                title="Tutup Preview"
              >
                <X className="h-5 w-5" />
              </button>
              <img 
                src={previewImageUrl} 
                alt="Pratinjau Resolusi Penuh" 
                className="max-w-full max-h-full object-contain rounded-lg border border-white/5 select-none"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={(open) => !open && setIsDeleteModalOpen(false)}>
        <DialogContent className="sm:max-w-md w-[90vw] border border-border/80 bg-background/95 backdrop-blur-md p-6 rounded-2xl shadow-xl">
          <DialogHeader className="flex flex-col items-center text-center space-y-3 pb-2 select-none">
            <div className="h-12 w-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
              <Trash2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-base font-extrabold text-foreground">Hapus Template Excel</DialogTitle>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Apakah Anda yakin ingin menghapus template <strong className="text-foreground">{templateToDelete?.title}</strong>? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
              </p>
            </div>
          </DialogHeader>

          <div className="flex items-center justify-center gap-3 pt-3 border-t border-border/25">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setTemplateToDelete(null);
              }}
              className="border-border/60 hover:bg-muted text-xs h-9 cursor-pointer w-24"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleDeleteConfirm}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs h-9 px-5 rounded-lg cursor-pointer w-24"
            >
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
