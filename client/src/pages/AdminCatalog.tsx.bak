import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Package, Search, ChevronDown, ChevronUp, Tag } from 'lucide-react';

interface Variant {
  id?: number;
  sku: string;
  colorName: string;
  colorHex: string;
  imageUrl: string;
  stock: number;
  supplierCode: string;
  isActive: boolean;
}

interface Product {
  id?: number;
  name: string;
  category: string;
  description: string;
  price: number;
  costPrice: number;
  imageUrl: string;
  isFeatured: boolean;
  isActive: boolean;
  variants: Variant[];
}

const EMPTY_VARIANT: Variant = {
  sku: '', colorName: '', colorHex: '', imageUrl: '', stock: 0, supplierCode: '', isActive: true,
};

const EMPTY_PRODUCT: Product = {
  name: '', category: 'esportivo', description: '', price: 0, costPrice: 0,
  imageUrl: '', isFeatured: false, isActive: true, variants: [{ ...EMPTY_VARIANT }],
};

const CATEGORY_LABELS: Record<string, string> = {
  esportivo: 'Esportivo',
  casual_masculino: 'Casual Masculino',
  casual_feminino: 'Casual Feminino',
  edicao_limitada: 'Edição Limitada',
};

const CATEGORY_COLORS: Record<string, string> = {
  esportivo: 'bg-yellow-500/20 text-yellow-400',
  casual_masculino: 'bg-blue-500/20 text-blue-400',
  casual_feminino: 'bg-pink-500/20 text-pink-400',
  edicao_limitada: 'bg-purple-500/20 text-purple-400',
};

export default function AdminCatalog() {
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
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/catalog/products', {
        credentials: 'include' as RequestCredentials,
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setEditingProduct({ ...EMPTY_PRODUCT, variants: [{ ...EMPTY_VARIANT }] });
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct({ ...product, variants: product.variants.length > 0 ? product.variants : [{ ...EMPTY_VARIANT }] });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    if (!editingProduct.name.trim()) {
      toast.error('Nome do produto é obrigatório');
      return;
    }
    if (!editingProduct.price || editingProduct.price <= 0) {
      toast.error('Preço de venda é obrigatório');
      return;
    }
    // Validate variants
    for (const v of editingProduct.variants) {
      if (!v.sku.trim() || !v.colorName.trim()) {
        toast.error('SKU e nome da cor são obrigatórios em todas as variantes');
        return;
      }
    }

    setSaving(true);
    try {
      const isEdit = !!editingProduct.id;
      const url = isEdit ? `/api/admin/catalog/products/${editingProduct.id}` : '/api/admin/catalog/products';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' }, credentials: 'include' as RequestCredentials,
        body: JSON.stringify(editingProduct),
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
      const res = await fetch(`/api/admin/catalog/products/${deletingId}`, {
        method: 'DELETE',
        credentials: 'include' as RequestCredentials,
      });
      if (res.ok) {
        toast.success('Produto removido');
        setDeleteDialogOpen(false);
        fetchProducts();
      }
    } catch (e: any) {
      toast.error('Erro ao remover: ' + e.message);
    }
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

  const filteredProducts = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.variants.some(v => v.sku.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const totalStock = (product: Product) => product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  const margin = (p: Product) => p.costPrice > 0 ? ((p.price - p.costPrice) / p.costPrice * 100).toFixed(1) : '—';

  return (
    <AdminLayout title="Catálogo de Produtos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Catálogo de Produtos</h1>
            <p className="text-gray-400 text-sm mt-1">{products.length} produtos cadastrados</p>
          </div>
          <Button onClick={openCreate} className="bg-primary text-black hover:bg-primary/90 font-bold">
            <Plus className="w-4 h-4 mr-2" /> Novo Produto
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-zinc-900 border-zinc-700 text-white"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48 bg-zinc-900 border-zinc-700 text-white">
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

        {/* Products Table */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Carregando produtos...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Nenhum produto encontrado</p>
            <p className="text-gray-600 text-sm mt-1">Clique em "Novo Produto" para começar</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                {/* Product Row */}
                <div className="flex items-center gap-4 p-4">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 bg-zinc-800 rounded-md flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white">{product.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[product.category] || 'bg-gray-500/20 text-gray-400'}`}>
                        {CATEGORY_LABELS[product.category] || product.category}
                      </span>
                      {product.isFeatured && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-medium">Destaque</span>
                      )}
                      {!product.isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-medium">Inativo</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                      <span>Venda: <span className="text-white font-medium">R$ {Number(product.price).toFixed(2)}</span></span>
                      {product.costPrice && Number(product.costPrice) > 0 && (
                        <>
                          <span>Custo: R$ {Number(product.costPrice).toFixed(2)}</span>
                          <span className="text-green-400">Margem: {margin(product)}%</span>
                        </>
                      )}
                      <span>Estoque: <span className={totalStock(product) === 0 ? 'text-red-400' : 'text-green-400'}>{totalStock(product)} un.</span></span>
                      <span>{product.variants.length} variante{product.variants.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id!)}
                      className="text-gray-400 hover:text-white"
                    >
                      {expandedProduct === product.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(product)} className="text-gray-400 hover:text-primary">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setDeletingId(product.id!); setDeleteDialogOpen(true); }}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Variants Expanded */}
                {expandedProduct === product.id && (
                  <div className="border-t border-zinc-800 bg-zinc-950 p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">Variantes</p>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-zinc-800">
                          <TableHead className="text-gray-400">SKU</TableHead>
                          <TableHead className="text-gray-400">Cor</TableHead>
                          <TableHead className="text-gray-400">Cód. Fornecedor</TableHead>
                          <TableHead className="text-gray-400 text-right">Estoque</TableHead>
                          <TableHead className="text-gray-400 text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {product.variants.map(v => (
                          <TableRow key={v.id} className="border-zinc-800">
                            <TableCell className="font-mono text-xs text-gray-300">{v.sku}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {v.colorHex && (
                                  <div className="w-4 h-4 rounded-full border border-zinc-700" style={{ backgroundColor: v.colorHex }} />
                                )}
                                <span className="text-white text-sm">{v.colorName}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-400 text-sm">{v.supplierCode || '—'}</TableCell>
                            <TableCell className="text-right">
                              <span className={`font-bold ${v.stock === 0 ? 'text-red-400' : v.stock <= 3 ? 'text-yellow-400' : 'text-green-400'}`}>
                                {v.stock} un.
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={v.isActive ? 'default' : 'secondary'} className={v.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
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
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingProduct?.id ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
          </DialogHeader>

          {editingProduct && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label className="text-gray-300">Nome do Produto *</Label>
                  <Input
                    value={editingProduct.name}
                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="Ex: ZUNO STRIX"
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Categoria *</Label>
                  <Select value={editingProduct.category} onValueChange={v => setEditingProduct({ ...editingProduct, category: v })}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">URL da Imagem Principal</Label>
                  <Input
                    value={editingProduct.imageUrl}
                    onChange={e => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Preço de Venda (R$) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Custo (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingProduct.costPrice}
                    onChange={e => setEditingProduct({ ...editingProduct, costPrice: parseFloat(e.target.value) || 0 })}
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-gray-300">Descrição</Label>
                  <Textarea
                    value={editingProduct.description}
                    onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    placeholder="Descrição do produto..."
                    className="bg-zinc-800 border-zinc-700 text-white mt-1 resize-none"
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isFeatured}
                      onChange={e => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-gray-300 text-sm">Produto em destaque</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isActive}
                      onChange={e => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-gray-300 text-sm">Produto ativo</span>
                  </label>
                </div>
              </div>

              {/* Variants */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-gray-300 text-base font-medium">Variantes (Cores / SKUs)</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addVariant} className="border-zinc-700 text-gray-300 hover:text-white">
                    <Plus className="w-3 h-3 mr-1" /> Adicionar Variante
                  </Button>
                </div>
                <div className="space-y-4">
                  {editingProduct.variants.map((variant, idx) => (
                    <div key={idx} className="bg-zinc-800 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <Tag className="w-3 h-3" /> Variante {idx + 1}
                        </span>
                        {editingProduct.variants.length > 1 && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeVariant(idx)} className="text-red-400 hover:text-red-300 h-6 px-2">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-gray-400 text-xs">SKU *</Label>
                          <Input
                            value={variant.sku}
                            onChange={e => updateVariant(idx, 'sku', e.target.value)}
                            placeholder="ZUNO-ESP-001"
                            className="bg-zinc-700 border-zinc-600 text-white mt-1 text-sm h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-400 text-xs">Nome da Cor *</Label>
                          <Input
                            value={variant.colorName}
                            onChange={e => updateVariant(idx, 'colorName', e.target.value)}
                            placeholder="Preto Fosco"
                            className="bg-zinc-700 border-zinc-600 text-white mt-1 text-sm h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-400 text-xs">Hex da Cor</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              value={variant.colorHex}
                              onChange={e => updateVariant(idx, 'colorHex', e.target.value)}
                              placeholder="#1a1a1a"
                              className="bg-zinc-700 border-zinc-600 text-white text-sm h-8 flex-1"
                            />
                            {variant.colorHex && (
                              <div className="w-8 h-8 rounded border border-zinc-600 flex-shrink-0" style={{ backgroundColor: variant.colorHex }} />
                            )}
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-400 text-xs">Cód. Fornecedor</Label>
                          <Input
                            value={variant.supplierCode}
                            onChange={e => updateVariant(idx, 'supplierCode', e.target.value)}
                            placeholder="DEVON-PRETO-FOSCO"
                            className="bg-zinc-700 border-zinc-600 text-white mt-1 text-sm h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-400 text-xs">Estoque Inicial</Label>
                          <Input
                            type="number"
                            value={variant.stock}
                            onChange={e => updateVariant(idx, 'stock', parseInt(e.target.value) || 0)}
                            className="bg-zinc-700 border-zinc-600 text-white mt-1 text-sm h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-400 text-xs">URL da Imagem</Label>
                          <Input
                            value={variant.imageUrl}
                            onChange={e => updateVariant(idx, 'imageUrl', e.target.value)}
                            placeholder="https://..."
                            className="bg-zinc-700 border-zinc-600 text-white mt-1 text-sm h-8"
                          />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={variant.isActive}
                          onChange={e => updateVariant(idx, 'isActive', e.target.checked)}
                          className="w-3 h-3 accent-primary"
                        />
                        <span className="text-gray-400 text-xs">Variante ativa</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-zinc-700 text-gray-300">
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-primary text-black hover:bg-primary/90 font-bold">
              {saving ? 'Salvando...' : editingProduct?.id ? 'Salvar Alterações' : 'Criar Produto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Produto</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Esta acção é irreversível. O produto e todas as suas variantes serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-700 text-gray-300 bg-transparent">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
