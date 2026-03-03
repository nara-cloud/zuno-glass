import { useState, useEffect, useRef } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus, Pencil, Trash2, Search, ChevronDown, ChevronUp, Upload,
  X, ImageIcon, Tag, Boxes, DollarSign, Globe, Package, Eye, EyeOff,
  Star, StarOff,
} from 'lucide-react';

interface Variant {
  id?: number;
  sku: string;
  colorName: string;
  colorHex: string;
  imageUrl: string;
  stock: number;
  price?: number | null;
  compareAtPrice?: number | null;
  supplierCode: string;
  barcode: string;
  weight?: number | null;
  isActive: boolean;
}

interface Product {
  id?: number;
  name: string;
  slug?: string;
  category: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  imageUrl: string;
  images: string[];
  metaTitle: string;
  metaDescription: string;
  weight?: number | null;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  variants: Variant[];
}

const EMPTY_VARIANT: Variant = {
  sku: '', colorName: '', colorHex: '#000000', imageUrl: '', stock: 0,
  price: null, compareAtPrice: null, supplierCode: '', barcode: '', weight: null, isActive: true,
};

const EMPTY_PRODUCT: Product = {
  name: '', category: 'esportivo', description: '', shortDescription: '',
  price: 0, compareAtPrice: null, costPrice: null,
  imageUrl: '', images: [], metaTitle: '', metaDescription: '',
  weight: null, tags: [], isFeatured: false, isActive: true,
  variants: [{ ...EMPTY_VARIANT }],
};

const CATEGORY_LABELS: Record<string, string> = {
  esportivo: 'Esportivo',
  casual_masculino: 'Casual Masculino',
  casual_feminino: 'Casual Feminino',
  edicao_limitada: 'Edição Limitada',
};

const CATEGORY_COLORS: Record<string, string> = {
  esportivo: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  casual_masculino: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  casual_feminino: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  edicao_limitada: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

async function uploadImage(file: File, authHeaders: HeadersInit = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await fetch('/api/admin/catalog/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders },
          credentials: 'include',
          body: JSON.stringify({ imageData: base64, mimeType: file.type }),
        });
        const data = await res.json();
        if (data.url) resolve(data.url);
        else reject(new Error(data.error || 'Upload falhou'));
      } catch (e: any) { reject(e); }
    };
    reader.readAsDataURL(file);
  });
}

export default function AdminCatalog() {
  const { getAuthHeaders } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVariantIdx, setUploadingVariantIdx] = useState<number | null>(null);
  const [tagInput, setTagInput] = useState('');
  const mainImageRef = useRef<HTMLInputElement>(null);
  const galleryImageRef = useRef<HTMLInputElement>(null);
  const variantImageRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/catalog/products', { headers: getAuthHeaders(), credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || data);
      }
    } catch {
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setEditingProduct({ ...EMPTY_PRODUCT, variants: [{ ...EMPTY_VARIANT }] });
    setTagInput('');
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct({
      ...product,
      images: product.images || [],
      tags: product.tags || [],
      shortDescription: (product as any).short_description || (product as any).shortDescription || '',
      metaTitle: (product as any).meta_title || (product as any).metaTitle || '',
      metaDescription: (product as any).meta_description || (product as any).metaDescription || '',
      variants: product.variants.length > 0 ? product.variants : [{ ...EMPTY_VARIANT }],
    });
    setTagInput('');
    setDialogOpen(true);
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;
    setUploadingImage(true);
    try {
      const url = await uploadImage(file, getAuthHeaders());
      setEditingProduct(p => p ? { ...p, imageUrl: url, images: [url, ...(p.images || []).filter(u => u !== url)] } : p);
      toast.success('Imagem principal carregada');
    } catch (err: any) {
      toast.error('Erro no upload: ' + err.message);
    } finally {
      setUploadingImage(false);
      if (mainImageRef.current) mainImageRef.current.value = '';
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !editingProduct) return;
    setUploadingImage(true);
    try {
      const urls = await Promise.all(files.map(f => uploadImage(f, getAuthHeaders())));
      setEditingProduct(p => p ? { ...p, images: [...(p.images || []), ...urls] } : p);
      toast.success(`${urls.length} imagem(ns) adicionada(s)`);
    } catch (err: any) {
      toast.error('Erro no upload: ' + err.message);
    } finally {
      setUploadingImage(false);
      if (galleryImageRef.current) galleryImageRef.current.value = '';
    }
  };

  const handleVariantImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;
    setUploadingVariantIdx(idx);
    try {
      const url = await uploadImage(file, getAuthHeaders());
      updateVariant(idx, 'imageUrl', url);
      toast.success('Imagem da variante carregada');
    } catch (err: any) {
      toast.error('Erro no upload: ' + err.message);
    } finally {
      setUploadingVariantIdx(null);
      const ref = variantImageRefs.current[idx];
      if (ref) ref.value = '';
    }
  };

  const removeGalleryImage = (url: string) => {
    if (!editingProduct) return;
    setEditingProduct(p => p ? { ...p, images: (p.images || []).filter(u => u !== url) } : p);
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    if (!editingProduct.name.trim()) { toast.error('Nome do produto é obrigatório'); return; }
    if (!editingProduct.price || editingProduct.price <= 0) { toast.error('Preço de venda é obrigatório'); return; }
    for (const v of editingProduct.variants) {
      if (!v.colorName.trim()) { toast.error('Nome da cor é obrigatório em todas as variantes'); return; }
    }
    const variants = editingProduct.variants.map((v, i) => ({
      ...v,
      sku: v.sku.trim() || `${editingProduct.name.substring(0, 8).toUpperCase().replace(/\s+/g, '-')}-${i + 1}-${Date.now().toString(36).toUpperCase()}`,
    }));
    setSaving(true);
    try {
      const isEdit = !!editingProduct.id;
      const url = isEdit ? `/api/admin/catalog/products/${editingProduct.id}` : '/api/admin/catalog/products';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify({ ...editingProduct, variants }),
      });
      if (res.ok) {
        toast.success(isEdit ? 'Produto actualizado!' : 'Produto criado!', { description: editingProduct.name });
        setDialogOpen(false);
        fetchProducts();
      } else {
        const err = await res.json();
        toast.error('Erro ao salvar: ' + err.error);
      }
    } catch (e: any) {
      toast.error('Erro ao salvar: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/admin/catalog/products/${deletingId}`, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
      if (res.ok) {
        toast.success('Produto removido');
        setDeleteDialogOpen(false);
        fetchProducts();
      }
    } catch (e: any) { toast.error('Erro ao remover: ' + e.message); }
  };

  const toggleActive = async (product: Product) => {
    try {
      await fetch(`/api/admin/catalog/products/${product.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, credentials: 'include',
        body: JSON.stringify({ ...product, isActive: !product.isActive }),
      });
      toast.success(product.isActive ? 'Produto desactivado' : 'Produto activado');
      fetchProducts();
    } catch { toast.error('Erro ao actualizar'); }
  };

  const toggleFeatured = async (product: Product) => {
    try {
      await fetch(`/api/admin/catalog/products/${product.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, credentials: 'include',
        body: JSON.stringify({ ...product, isFeatured: !product.isFeatured }),
      });
      toast.success(product.isFeatured ? 'Removido dos destaques' : 'Adicionado aos destaques');
      fetchProducts();
    } catch { toast.error('Erro ao actualizar'); }
  };

  const updateStockInline = async (variantId: number, newStock: number) => {
    try {
      await fetch(`/api/admin/catalog/variants/${variantId}/stock`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, credentials: 'include',
        body: JSON.stringify({ stock: newStock }),
      });
      fetchProducts();
    } catch { toast.error('Erro ao actualizar estoque'); }
  };

  const addVariant = () => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, variants: [...editingProduct.variants, { ...EMPTY_VARIANT }] });
  };

  const removeVariant = (idx: number) => {
    if (!editingProduct) return;
    const variants = editingProduct.variants.filter((_, i) => i !== idx);
    setEditingProduct({ ...editingProduct, variants: variants.length > 0 ? variants : [{ ...EMPTY_VARIANT }] });
  };

  const updateVariant = (idx: number, field: keyof Variant, value: any) => {
    if (!editingProduct) return;
    const variants = editingProduct.variants.map((v, i) => i === idx ? { ...v, [field]: value } : v);
    setEditingProduct({ ...editingProduct, variants });
  };

  const addTag = () => {
    if (!editingProduct || !tagInput.trim()) return;
    const tag = tagInput.trim().toLowerCase();
    if (!editingProduct.tags.includes(tag)) {
      setEditingProduct({ ...editingProduct, tags: [...editingProduct.tags, tag] });
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, tags: editingProduct.tags.filter(t => t !== tag) });
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.variants?.some(v => v.sku?.toLowerCase().includes(search.toLowerCase()) || v.colorName?.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const totalStock = (product: Product) => product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
  const margin = (p: Product) => p.costPrice && Number(p.costPrice) > 0
    ? ((p.price - Number(p.costPrice)) / p.price * 100).toFixed(1) + '%'
    : '—';

  return (
    <AdminLayout title="Catálogo de Produtos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Catálogo de Produtos</h1>
            <p className="text-gray-400 text-sm mt-1">
              {products.length} produtos · {products.reduce((s, p) => s + totalStock(p), 0)} unidades em estoque
            </p>
          </div>
          <Button onClick={openCreate} className="bg-primary text-black hover:bg-primary/90 font-bold">
            <Plus className="w-4 h-4 mr-2" /> Novo Produto
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: products.length, icon: Package, color: 'text-blue-400' },
            { label: 'Ativos', value: products.filter(p => p.isActive).length, icon: Eye, color: 'text-green-400' },
            { label: 'Destaques', value: products.filter(p => p.isFeatured).length, icon: Star, color: 'text-yellow-400' },
            { label: 'Sem estoque', value: products.filter(p => totalStock(p) === 0).length, icon: Boxes, color: 'text-red-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, SKU ou cor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-zinc-900 border-zinc-700 text-white"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-52 bg-zinc-900 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700">
              <SelectItem value="all">Todas as categorias</SelectItem>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg h-20 animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Nenhum produto encontrado</p>
            <p className="text-sm mt-1">Crie o primeiro produto ou ajuste os filtros</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProducts.map((product) => {
              const isExpanded = expandedProduct === product.id;
              const stock = totalStock(product);
              return (
                <div key={product.id} className={`bg-zinc-900 border rounded-lg overflow-hidden transition-all ${product.isActive ? 'border-zinc-800' : 'border-zinc-800/50 opacity-60'}`}>
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-14 h-14 rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-zinc-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white truncate">{product.name}</span>
                        {product.isFeatured && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0" />}
                        <Badge className={`text-[10px] px-1.5 py-0 border ${CATEGORY_COLORS[product.category] || 'bg-zinc-700 text-zinc-300 border-zinc-600'}`}>
                          {CATEGORY_LABELS[product.category] || product.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                        <span className="font-semibold text-white">R$ {Number(product.price).toFixed(2)}</span>
                        {product.costPrice && <span className="text-xs">Margem: {margin(product)}</span>}
                        <span className={`text-xs font-medium ${stock === 0 ? 'text-red-400' : stock <= 5 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {stock} un.
                        </span>
                        <span className="text-xs">{product.variants?.length || 0} variante(s)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => toggleFeatured(product)}
                        title={product.isFeatured ? 'Remover destaque' : 'Destacar'}
                        className="w-8 h-8 text-gray-400 hover:text-yellow-400">
                        {product.isFeatured ? <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> : <StarOff className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toggleActive(product)}
                        title={product.isActive ? 'Desactivar' : 'Activar'}
                        className="w-8 h-8 text-gray-400 hover:text-white">
                        {product.isActive ? <Eye className="w-4 h-4 text-green-400" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(product)} className="w-8 h-8 text-gray-400 hover:text-primary">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon"
                        onClick={() => { setDeletingId(product.id!); setDeleteDialogOpen(true); }}
                        className="w-8 h-8 text-gray-400 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon"
                        onClick={() => setExpandedProduct(isExpanded ? null : product.id!)}
                        className="w-8 h-8 text-gray-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {isExpanded && product.variants?.length > 0 && (
                    <div className="border-t border-zinc-800 bg-zinc-950/50">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-zinc-800">
                            <TableHead className="text-gray-400 text-xs">SKU</TableHead>
                            <TableHead className="text-gray-400 text-xs">Cor</TableHead>
                            <TableHead className="text-gray-400 text-xs">Foto</TableHead>
                            <TableHead className="text-gray-400 text-xs">Preço</TableHead>
                            <TableHead className="text-gray-400 text-xs">Cód. Fornecedor</TableHead>
                            <TableHead className="text-gray-400 text-xs text-right">Estoque</TableHead>
                            <TableHead className="text-gray-400 text-xs text-center">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {product.variants.map((v) => (
                            <TableRow key={v.id} className="border-zinc-800">
                              <TableCell className="text-gray-300 text-xs font-mono">{v.sku}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full border border-zinc-600" style={{ backgroundColor: v.colorHex || '#888' }} />
                                  <span className="text-gray-300 text-xs">{v.colorName}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {v.imageUrl ? (
                                  <img src={v.imageUrl} alt={v.colorName} className="w-8 h-8 rounded object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center">
                                    <ImageIcon className="w-3 h-3 text-zinc-600" />
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-gray-300 text-xs">
                                {v.price ? `R$ ${Number(v.price).toFixed(2)}` : `R$ ${Number(product.price).toFixed(2)}`}
                              </TableCell>
                              <TableCell className="text-gray-400 text-xs">{v.supplierCode || '—'}</TableCell>
                              <TableCell className="text-right">
                                <input
                                  type="number" min={0} defaultValue={v.stock}
                                  onBlur={e => {
                                    const newVal = parseInt(e.target.value);
                                    if (!isNaN(newVal) && newVal !== v.stock && v.id) updateStockInline(v.id, newVal);
                                  }}
                                  className={`w-16 text-right bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm font-bold focus:outline-none focus:border-primary ${v.stock === 0 ? 'text-red-400' : v.stock <= 3 ? 'text-yellow-400' : 'text-green-400'}`}
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge className={`text-[10px] ${v.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                  {v.isActive ? 'Ativo' : 'Inativo'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-4xl max-h-[92vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
            <DialogTitle className="font-display text-xl">
              {editingProduct?.id ? `Editar: ${editingProduct.name}` : 'Novo Produto'}
            </DialogTitle>
          </DialogHeader>

          {editingProduct && (
            <Tabs defaultValue="info" className="flex-1">
              <TabsList className="mx-6 mt-4 bg-zinc-800 border border-zinc-700 flex-wrap h-auto gap-1">
                <TabsTrigger value="info" className="data-[state=active]:bg-primary data-[state=active]:text-black text-xs font-bold">
                  <Package className="w-3.5 h-3.5 mr-1.5" /> Informações
                </TabsTrigger>
                <TabsTrigger value="images" className="data-[state=active]:bg-primary data-[state=active]:text-black text-xs font-bold">
                  <ImageIcon className="w-3.5 h-3.5 mr-1.5" /> Imagens
                </TabsTrigger>
                <TabsTrigger value="variants" className="data-[state=active]:bg-primary data-[state=active]:text-black text-xs font-bold">
                  <Tag className="w-3.5 h-3.5 mr-1.5" /> Variantes ({editingProduct.variants.length})
                </TabsTrigger>
                <TabsTrigger value="pricing" className="data-[state=active]:bg-primary data-[state=active]:text-black text-xs font-bold">
                  <DollarSign className="w-3.5 h-3.5 mr-1.5" /> Preços
                </TabsTrigger>
                <TabsTrigger value="seo" className="data-[state=active]:bg-primary data-[state=active]:text-black text-xs font-bold">
                  <Globe className="w-3.5 h-3.5 mr-1.5" /> SEO
                </TabsTrigger>
              </TabsList>

              {/* TAB: Informações */}
              <TabsContent value="info" className="px-6 pb-6 space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-gray-300 text-sm">Nome do Produto *</Label>
                    <Input value={editingProduct.name}
                      onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      placeholder="Ex: ZUNO STRIX Performance"
                      className="bg-zinc-800 border-zinc-700 text-white mt-1" />
                  </div>
                  <div>
                    <Label className="text-gray-300 text-sm">Categoria *</Label>
                    <Select value={editingProduct.category} onValueChange={v => setEditingProduct({ ...editingProduct, category: v })}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        {Object.entries(CATEGORY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300 text-sm">Peso (kg)</Label>
                    <Input type="number" step="0.001" value={editingProduct.weight ?? ''}
                      onChange={e => setEditingProduct({ ...editingProduct, weight: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="0.045" className="bg-zinc-800 border-zinc-700 text-white mt-1" />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-300 text-sm">Descrição Curta</Label>
                    <Input value={editingProduct.shortDescription}
                      onChange={e => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                      placeholder="Resumo em 1-2 frases para listagens"
                      className="bg-zinc-800 border-zinc-700 text-white mt-1" />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-300 text-sm">Descrição Completa</Label>
                    <Textarea value={editingProduct.description}
                      onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      placeholder="Descrição detalhada: materiais, tecnologia, benefícios..."
                      className="bg-zinc-800 border-zinc-700 text-white mt-1 resize-none" rows={5} />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-300 text-sm">Tags</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={tagInput} onChange={e => setTagInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                        placeholder="Ex: esportivo, uv400, corrida"
                        className="bg-zinc-800 border-zinc-700 text-white" />
                      <Button type="button" variant="outline" onClick={addTag} className="border-zinc-700 text-white bg-transparent">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {editingProduct.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {editingProduct.tags.map(tag => (
                          <span key={tag} className="flex items-center gap-1 bg-zinc-800 text-gray-300 text-xs px-2 py-1 rounded-full">
                            {tag}
                            <button onClick={() => removeTag(tag)} className="hover:text-red-400 ml-1"><X className="w-3 h-3" /></button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={editingProduct.isActive} onCheckedChange={v => setEditingProduct({ ...editingProduct, isActive: v })} />
                    <Label className="text-gray-300 text-sm cursor-pointer">Produto activo (visível na loja)</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={editingProduct.isFeatured} onCheckedChange={v => setEditingProduct({ ...editingProduct, isFeatured: v })} />
                    <Label className="text-gray-300 text-sm cursor-pointer">Produto em destaque</Label>
                  </div>
                </div>
              </TabsContent>

              {/* TAB: Imagens */}
              <TabsContent value="images" className="px-6 pb-6 space-y-5 mt-4">
                <div>
                  <Label className="text-gray-300 text-sm font-semibold">Imagem Principal</Label>
                  <div className="mt-2 flex gap-4 items-start">
                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-zinc-800 border-2 border-dashed border-zinc-700 flex items-center justify-center flex-shrink-0">
                      {editingProduct.imageUrl
                        ? <img src={editingProduct.imageUrl} alt="Principal" className="w-full h-full object-cover" />
                        : <ImageIcon className="w-8 h-8 text-zinc-600" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input ref={mainImageRef} type="file" accept="image/*" className="hidden" onChange={handleMainImageUpload} />
                      <Button type="button" variant="outline" onClick={() => mainImageRef.current?.click()}
                        disabled={uploadingImage} className="border-zinc-700 text-white bg-transparent w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingImage ? 'Enviando...' : 'Upload da imagem principal'}
                      </Button>
                      <p className="text-xs text-gray-500">Ou cole a URL:</p>
                      <Input value={editingProduct.imageUrl}
                        onChange={e => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                        placeholder="https://cdn.exemplo.com/produto.jpg"
                        className="bg-zinc-800 border-zinc-700 text-white text-xs" />
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300 text-sm font-semibold">Galeria de Imagens</Label>
                  <p className="text-xs text-gray-500 mt-1">Adicione múltiplas fotos (ângulos, detalhes, uso)</p>
                  <input ref={galleryImageRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryImageUpload} />
                  <Button type="button" variant="outline" onClick={() => galleryImageRef.current?.click()}
                    disabled={uploadingImage} className="border-zinc-700 text-white bg-transparent mt-2 w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingImage ? 'Enviando...' : 'Adicionar imagens à galeria'}
                  </Button>
                  {editingProduct.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mt-3">
                      {editingProduct.images.map((url, i) => (
                        <div key={i} className="relative group">
                          <img src={url} alt={`Galeria ${i + 1}`} className="w-full aspect-square object-cover rounded-lg" />
                          <button onClick={() => removeGalleryImage(url)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                          </button>
                          {url === editingProduct.imageUrl && (
                            <span className="absolute bottom-1 left-1 bg-primary text-black text-[9px] font-bold px-1 rounded">PRINCIPAL</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* TAB: Variantes */}
              <TabsContent value="variants" className="px-6 pb-6 mt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-300 font-semibold">Variantes de Cor</p>
                      <p className="text-xs text-gray-500">Cada variante = uma cor/versão com estoque independente</p>
                    </div>
                    <Button type="button" size="sm" onClick={addVariant} className="bg-primary text-black hover:bg-primary/90 font-bold">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar
                    </Button>
                  </div>
                  {editingProduct.variants.map((v, idx) => (
                    <div key={idx} className="bg-zinc-800 rounded-lg p-4 space-y-4 border border-zinc-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Variante {idx + 1}</span>
                        {editingProduct.variants.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(idx)} className="w-7 h-7 text-red-400 hover:text-red-300">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                          <Label className="text-gray-400 text-xs">Nome da Cor *</Label>
                          <Input value={v.colorName} onChange={e => updateVariant(idx, 'colorName', e.target.value)}
                            placeholder="Ex: Azul Neon" className="bg-zinc-900 border-zinc-700 text-white mt-1 text-sm" />
                        </div>
                        <div>
                          <Label className="text-gray-400 text-xs">Cor (hex)</Label>
                          <div className="flex gap-2 mt-1">
                            <input type="color" value={v.colorHex || '#000000'} onChange={e => updateVariant(idx, 'colorHex', e.target.value)}
                              className="w-10 h-9 rounded border border-zinc-700 bg-zinc-900 cursor-pointer p-0.5" />
                            <Input value={v.colorHex || ''} onChange={e => updateVariant(idx, 'colorHex', e.target.value)}
                              placeholder="#000000" className="bg-zinc-900 border-zinc-700 text-white text-sm" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-400 text-xs">SKU</Label>
                          <Input value={v.sku} onChange={e => updateVariant(idx, 'sku', e.target.value)}
                            placeholder="Auto-gerado se vazio" className="bg-zinc-900 border-zinc-700 text-white mt-1 text-sm font-mono" />
                        </div>
                        <div>
                          <Label className="text-gray-400 text-xs">Estoque *</Label>
                          <Input type="number" min={0} value={v.stock} onChange={e => updateVariant(idx, 'stock', parseInt(e.target.value) || 0)}
                            className="bg-zinc-900 border-zinc-700 text-white mt-1 text-sm" />
                        </div>
                        <div>
                          <Label className="text-gray-400 text-xs">Preço específico (R$)</Label>
                          <Input type="number" step="0.01" value={v.price ?? ''}
                            onChange={e => updateVariant(idx, 'price', e.target.value ? parseFloat(e.target.value) : null)}
                            placeholder="Usa preço do produto" className="bg-zinc-900 border-zinc-700 text-white mt-1 text-sm" />
                        </div>
                        <div>
                          <Label className="text-gray-400 text-xs">Cód. Fornecedor</Label>
                          <Input value={v.supplierCode} onChange={e => updateVariant(idx, 'supplierCode', e.target.value)}
                            placeholder="Ref. fornecedor" className="bg-zinc-900 border-zinc-700 text-white mt-1 text-sm" />
                        </div>
                        <div>
                          <Label className="text-gray-400 text-xs">Código de Barras</Label>
                          <Input value={v.barcode} onChange={e => updateVariant(idx, 'barcode', e.target.value)}
                            placeholder="EAN/UPC" className="bg-zinc-900 border-zinc-700 text-white mt-1 text-sm" />
                        </div>
                        <div>
                          <Label className="text-gray-400 text-xs">Peso específico (kg)</Label>
                          <Input type="number" step="0.001" value={v.weight ?? ''}
                            onChange={e => updateVariant(idx, 'weight', e.target.value ? parseFloat(e.target.value) : null)}
                            placeholder="Usa peso do produto" className="bg-zinc-900 border-zinc-700 text-white mt-1 text-sm" />
                        </div>
                        <div className="flex items-end pb-1">
                          <div className="flex items-center gap-2">
                            <Switch checked={v.isActive} onCheckedChange={val => updateVariant(idx, 'isActive', val)} />
                            <Label className="text-gray-400 text-xs">Activa</Label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400 text-xs">Imagem da Variante</Label>
                        <div className="flex gap-3 mt-1 items-center">
                          <div className="w-12 h-12 rounded bg-zinc-900 border border-zinc-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                            {v.imageUrl
                              ? <img src={v.imageUrl} alt={v.colorName} className="w-full h-full object-cover" />
                              : <ImageIcon className="w-4 h-4 text-zinc-600" />}
                          </div>
                          <input ref={el => { variantImageRefs.current[idx] = el; }} type="file" accept="image/*" className="hidden"
                            onChange={e => handleVariantImageUpload(e, idx)} />
                          <Button type="button" variant="outline" size="sm"
                            onClick={() => variantImageRefs.current[idx]?.click()}
                            disabled={uploadingVariantIdx === idx}
                            className="border-zinc-700 text-white bg-transparent text-xs">
                            <Upload className="w-3 h-3 mr-1" />
                            {uploadingVariantIdx === idx ? 'Enviando...' : 'Upload'}
                          </Button>
                          <Input value={v.imageUrl} onChange={e => updateVariant(idx, 'imageUrl', e.target.value)}
                            placeholder="Ou cole a URL da imagem"
                            className="bg-zinc-900 border-zinc-700 text-white text-xs flex-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* TAB: Preços */}
              <TabsContent value="pricing" className="px-6 pb-6 space-y-5 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300 text-sm">Preço de Venda (R$) *</Label>
                    <Input type="number" step="0.01" value={editingProduct.price}
                      onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                      className="bg-zinc-800 border-zinc-700 text-white mt-1 text-lg font-bold" />
                  </div>
                  <div>
                    <Label className="text-gray-300 text-sm">Preço "De" / Comparação (R$)</Label>
                    <Input type="number" step="0.01" value={editingProduct.compareAtPrice ?? ''}
                      onChange={e => setEditingProduct({ ...editingProduct, compareAtPrice: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="Exibe como preço riscado"
                      className="bg-zinc-800 border-zinc-700 text-white mt-1" />
                  </div>
                  <div>
                    <Label className="text-gray-300 text-sm">Custo / Preço de Compra (R$)</Label>
                    <Input type="number" step="0.01" value={editingProduct.costPrice ?? ''}
                      onChange={e => setEditingProduct({ ...editingProduct, costPrice: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="Não exibido na loja"
                      className="bg-zinc-800 border-zinc-700 text-white mt-1" />
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-4 flex flex-col justify-center">
                    <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Margem de Lucro</p>
                    {editingProduct.costPrice && Number(editingProduct.costPrice) > 0 ? (
                      <>
                        <p className="text-3xl font-bold text-green-400">
                          {((editingProduct.price - Number(editingProduct.costPrice)) / editingProduct.price * 100).toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Lucro: R$ {(editingProduct.price - Number(editingProduct.costPrice)).toFixed(2)} por unidade
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-500 text-sm">Informe o custo para calcular</p>
                    )}
                  </div>
                  {editingProduct.compareAtPrice && Number(editingProduct.compareAtPrice) > editingProduct.price && (
                    <div className="col-span-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                      <p className="text-yellow-400 text-sm font-semibold">
                        Desconto: {((1 - editingProduct.price / Number(editingProduct.compareAtPrice)) * 100).toFixed(0)}% OFF
                      </p>
                      <p className="text-yellow-300/70 text-xs mt-1">
                        De R$ {Number(editingProduct.compareAtPrice).toFixed(2)} por R$ {Number(editingProduct.price).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* TAB: SEO */}
              <TabsContent value="seo" className="px-6 pb-6 space-y-5 mt-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300 text-sm">Título SEO</Label>
                    <Input value={editingProduct.metaTitle}
                      onChange={e => setEditingProduct({ ...editingProduct, metaTitle: e.target.value })}
                      placeholder={editingProduct.name || 'Título para mecanismos de busca'}
                      className="bg-zinc-800 border-zinc-700 text-white mt-1" maxLength={70} />
                    <p className="text-xs text-gray-500 mt-1">{editingProduct.metaTitle.length}/70 caracteres</p>
                  </div>
                  <div>
                    <Label className="text-gray-300 text-sm">Descrição SEO</Label>
                    <Textarea value={editingProduct.metaDescription}
                      onChange={e => setEditingProduct({ ...editingProduct, metaDescription: e.target.value })}
                      placeholder="Descrição para mecanismos de busca (aparece nos resultados do Google)"
                      className="bg-zinc-800 border-zinc-700 text-white mt-1 resize-none" rows={3} maxLength={160} />
                    <p className="text-xs text-gray-500 mt-1">{editingProduct.metaDescription.length}/160 caracteres</p>
                  </div>
                  {(editingProduct.metaTitle || editingProduct.name) && (
                    <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                      <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">Pré-visualização Google</p>
                      <p className="text-blue-400 text-base hover:underline cursor-pointer">
                        {editingProduct.metaTitle || editingProduct.name}
                      </p>
                      <p className="text-green-600 text-xs mt-0.5">zunoglass.com/produtos/{editingProduct.slug || 'produto'}</p>
                      <p className="text-gray-300 text-sm mt-1 leading-relaxed">
                        {editingProduct.metaDescription || editingProduct.shortDescription || editingProduct.description?.substring(0, 160) || 'Sem descrição SEO definida.'}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="px-6 py-4 border-t border-zinc-800 sticky bottom-0 bg-zinc-900">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-gray-400 hover:text-white">Cancelar</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-primary text-black hover:bg-primary/90 font-bold min-w-[120px]">
              {saving ? 'Salvando...' : editingProduct?.id ? 'Salvar Alterações' : 'Criar Produto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover produto?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Esta acção é irreversível. O produto e todas as suas variantes serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
