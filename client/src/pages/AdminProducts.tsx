import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Edit2, Trash2, X, Check, Plus, ImageIcon, Upload, Camera } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  color: string;
  description: string;
  isNew?: boolean;
}

const CATEGORIES = ['performance', 'lifestyle'];

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v) || 0);
}

const emptyForm: Omit<Product, 'id'> = {
  name: '',
  price: 169.90,
  category: 'lifestyle',
  image: '',
  color: '',
  description: '',
  isNew: false,
};

function getDisplayName(product: Product, allProducts: Product[]): { title: string; subtitle: string | null } {
  const sameNameCount = allProducts.filter(p => p.name === product.name).length;
  if (sameNameCount > 1 && product.color) {
    return { title: product.name, subtitle: product.color };
  }
  return { title: product.name, subtitle: null };
}

export default function AdminProducts() {
  const { getAuthHeaders } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('todos');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<Omit<Product, 'id'>>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    fetch('/api/admin/products', { headers: getAuthHeaders(), credentials: 'include' })
      .then(r => r.json())
      .then(d => setProducts(Array.isArray(d) ? d : []))
      .catch(() => toast.error('Erro ao carregar produtos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.color || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'todos' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditForm({ ...p });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error();
      toast.success('Produto atualizado! Alterações refletidas no site.');
      setEditingId(null);
      load();
    } catch { toast.error('Erro ao salvar'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remover "${name}"?`)) return;
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (res.ok) { toast.success('Produto removido'); load(); }
    else toast.error('Erro ao remover');
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify(addForm),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro');
      }
      toast.success('Produto criado! Já disponível no site.');
      setShowAddModal(false);
      setAddForm({ ...emptyForm });
      load();
    } catch (e: any) { toast.error(e.message || 'Erro ao criar'); } finally { setSaving(false); }
  };

  const toggleNew = async (p: Product) => {
    await fetch(`/api/admin/products/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      credentials: 'include',
      body: JSON.stringify({ isNew: !p.isNew }),
    });
    load();
  };

  // Upload de imagem para o servidor
  const uploadImage = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const imageData = e.target?.result as string;
          const res = await fetch('/api/admin/catalog/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            credentials: 'include',
            body: JSON.stringify({ imageData, mimeType: file.type }),
          });
          if (!res.ok) throw new Error('Erro no upload');
          const data = await res.json();
          resolve(data.url || null);
        } catch {
          toast.error('Erro ao fazer upload da imagem');
          resolve(null);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Upload direto no card (modo visualização)
  const handleCardImageUpload = async (productId: string, file: File) => {
    setUploadingFor(productId);
    try {
      const url = await uploadImage(file);
      if (!url) return;
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify({ image: url }),
      });
      if (!res.ok) throw new Error();
      toast.success('Foto atualizada!');
      load();
    } catch { toast.error('Erro ao atualizar foto'); } finally { setUploadingFor(null); }
  };

  // Upload no modal de edição
  const handleEditImageUpload = async (file: File) => {
    setUploadingFor('edit');
    const url = await uploadImage(file);
    if (url) setEditForm(f => ({ ...f, image: url }));
    setUploadingFor(null);
  };

  // Upload no modal de adicionar
  const handleAddImageUpload = async (file: File) => {
    setUploadingFor('add');
    const url = await uploadImage(file);
    if (url) setAddForm(f => ({ ...f, image: url }));
    setUploadingFor(null);
  };

  return (
    <AdminLayout title="PRODUTOS" subtitle="Gerenciamento do catálogo de produtos">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar produto ou cor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 text-white text-sm pl-9 pr-4 py-2 font-body focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          {['todos', 'performance', 'lifestyle'].map(c => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`px-3 py-2 text-xs font-display font-bold tracking-wider border transition-colors ${filterCat === c ? 'bg-primary text-black border-primary' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'}`}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-primary text-black font-display font-bold text-xs tracking-wider gap-2 shrink-0">
          <Plus className="w-4 h-4" /> NOVO PRODUTO
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-4 text-xs font-body">
        <span className="text-gray-500">{filtered.length} produto(s)</span>
        <span className="text-gray-600">|</span>
        <span className="text-primary">{products.filter(p => p.category === 'performance').length} PERFORMANCE</span>
        <span className="text-gray-600">|</span>
        <span className="text-blue-400">{products.filter(p => p.category === 'lifestyle').length} LIFESTYLE</span>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="p-12 text-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center">
          <p className="font-display font-bold text-sm text-gray-500">NENHUM PRODUTO ENCONTRADO</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <Card key={p.id} className="bg-[#1a1a1a] border-white/10 overflow-hidden">
              {editingId === p.id ? (
                /* Edit Mode */
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-bold text-xs text-primary tracking-wider">EDITANDO</span>
                    <button onClick={cancelEdit} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div>
                    <label className="font-body text-[10px] text-gray-500 mb-1 block">Nome</label>
                    <input type="text" value={editForm.name || ''} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-[#111] border border-white/10 text-white text-xs px-2 py-1.5 font-body focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="font-body text-[10px] text-gray-500 mb-1 block">Cor</label>
                    <input type="text" value={editForm.color || ''} onChange={e => setEditForm(f => ({ ...f, color: e.target.value }))} className="w-full bg-[#111] border border-white/10 text-white text-xs px-2 py-1.5 font-body focus:outline-none focus:border-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-body text-[10px] text-gray-500 mb-1 block">Preço (R$)</label>
                      <input type="number" step={0.01} value={editForm.price || 0} onChange={e => setEditForm(f => ({ ...f, price: Number(e.target.value) }))} className="w-full bg-[#111] border border-white/10 text-white text-xs px-2 py-1.5 font-body focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="font-body text-[10px] text-gray-500 mb-1 block">Categoria</label>
                      <select value={editForm.category || 'lifestyle'} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-[#111] border border-white/10 text-white text-xs px-2 py-1.5 font-body focus:outline-none focus:border-primary">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  {/* Foto com upload no modo edição */}
                  <div>
                    <label className="font-body text-[10px] text-gray-500 mb-1 block">Foto do Produto</label>
                    {editForm.image && (
                      <div className="mb-2 border border-white/10 p-1">
                        <img src={editForm.image} alt="preview" className="h-24 object-contain mx-auto" onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editForm.image || ''}
                        onChange={e => setEditForm(f => ({ ...f, image: e.target.value }))}
                        className="flex-1 bg-[#111] border border-white/10 text-white text-xs px-2 py-1.5 font-body focus:outline-none focus:border-primary"
                        placeholder="URL da imagem..."
                      />
                      <label className={`flex items-center gap-1 px-2 py-1.5 border border-primary/50 text-primary text-[10px] font-display cursor-pointer hover:bg-primary/10 transition-colors ${uploadingFor === 'edit' ? 'opacity-50 pointer-events-none' : ''}`}>
                        {uploadingFor === 'edit' ? <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" /> : <Upload className="w-3 h-3" />}
                        {uploadingFor === 'edit' ? '' : 'UPLOAD'}
                        <input
                          ref={editFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => { const f = e.target.files?.[0]; if (f) handleEditImageUpload(f); e.target.value = ''; }}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-[10px] text-gray-500 mb-1 block">Descrição</label>
                    <textarea value={editForm.description || ''} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full bg-[#111] border border-white/10 text-white text-xs px-2 py-1.5 font-body focus:outline-none focus:border-primary resize-none" />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button onClick={cancelEdit} variant="outline" className="flex-1 border-white/10 text-gray-400 font-display text-[10px] h-8">CANCELAR</Button>
                    <Button onClick={saveEdit} disabled={saving} className="flex-1 bg-primary text-black font-display font-bold text-[10px] h-8 gap-1">
                      <Check className="w-3 h-3" />{saving ? '...' : 'SALVAR'}
                    </Button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <>
                  <div className="relative aspect-square bg-[#111] overflow-hidden group">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={`${p.name} ${p.color}`}
                        className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-700" />
                      </div>
                    )}
                    {/* Botão de upload sobreposto na foto */}
                    <label className={`absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${uploadingFor === p.id ? 'opacity-100' : ''}`}>
                      {uploadingFor === p.id ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <span className="text-[10px] font-display text-white">ENVIANDO...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Camera className="w-8 h-8 text-white" />
                          <span className="text-[10px] font-display text-white tracking-wider">TROCAR FOTO</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleCardImageUpload(p.id, f); e.target.value = ''; }}
                      />
                    </label>
                    <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                      <Badge className={`text-[9px] border font-display ${p.category === 'performance' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                        {(p.category || '').toUpperCase()}
                      </Badge>
                      {p.isNew && <Badge className="text-[9px] border bg-green-500/20 text-green-400 border-green-500/30 font-display">NOVO</Badge>}
                    </div>
                  </div>
                  <div className="p-3">
                    {(() => {
                      const dn = getDisplayName(p, products);
                      return (
                        <>
                          <p className="font-display font-bold text-xs text-white tracking-wide leading-tight">{dn.title}</p>
                          {dn.subtitle && (
                            <p className="font-body text-[10px] text-primary/80 mt-0.5 tracking-wide">{dn.subtitle}</p>
                          )}
                        </>
                      );
                    })()}
                    <p className="font-display font-bold text-sm text-primary mt-2">{fmt(p.price)}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => toggleNew(p)}
                        className={`flex-1 text-[10px] font-display font-bold py-1.5 border transition-colors ${p.isNew ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-white/10 text-gray-600 hover:text-gray-400'}`}
                      >
                        {p.isNew ? 'NOVO ✓' : 'MARCAR NOVO'}
                      </button>
                      <button
                        onClick={() => startEdit(p)}
                        className="p-1.5 border border-white/10 text-gray-500 hover:text-white hover:border-white/30 transition-colors"
                        title="Editar produto"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 border border-white/10 text-gray-500 hover:text-red-400 hover:border-red-500/30 transition-colors"
                        title="Remover produto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-lg my-4">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="font-display font-bold text-sm text-white tracking-wider">NOVO PRODUTO</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="font-body text-xs text-gray-500 mb-1 block">Nome do Produto *</label>
                  <input type="text" required value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" placeholder="Ex: ZUNO APEX" />
                </div>
                <div>
                  <label className="font-body text-xs text-gray-500 mb-1 block">Cor</label>
                  <input type="text" value={addForm.color} onChange={e => setAddForm(f => ({ ...f, color: e.target.value }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" placeholder="Ex: Preto" />
                </div>
                <div>
                  <label className="font-body text-xs text-gray-500 mb-1 block">Preço (R$) *</label>
                  <input type="number" required min={0} step={0.01} value={addForm.price} onChange={e => setAddForm(f => ({ ...f, price: Number(e.target.value) }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="font-body text-xs text-gray-500 mb-1 block">Categoria</label>
                  <select value={addForm.category} onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs text-gray-500 mb-1 block">Marcar como Novo?</label>
                  <select value={addForm.isNew ? 'sim' : 'nao'} onChange={e => setAddForm(f => ({ ...f, isNew: e.target.value === 'sim' }))} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary">
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </div>
                {/* Foto com upload no modal de adicionar */}
                <div className="col-span-2">
                  <label className="font-body text-xs text-gray-500 mb-1 block">Foto do Produto</label>
                  {addForm.image && (
                    <div className="mb-2 border border-white/10 p-2">
                      <img src={addForm.image} alt="preview" className="h-32 object-contain mx-auto" onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={addForm.image}
                      onChange={e => setAddForm(f => ({ ...f, image: e.target.value }))}
                      className="flex-1 bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary"
                      placeholder="URL ou faça upload →"
                    />
                    <label className={`flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/50 text-primary text-xs font-display font-bold cursor-pointer hover:bg-primary/20 transition-colors whitespace-nowrap ${uploadingFor === 'add' ? 'opacity-50 pointer-events-none' : ''}`}>
                      {uploadingFor === 'add' ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {uploadingFor === 'add' ? 'ENVIANDO...' : 'UPLOAD FOTO'}
                      <input
                        ref={addFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleAddImageUpload(f); e.target.value = ''; }}
                      />
                    </label>
                  </div>
                  <p className="font-body text-[10px] text-gray-600 mt-1">Faça upload de uma foto ou cole a URL diretamente</p>
                </div>
                <div className="col-span-2">
                  <label className="font-body text-xs text-gray-500 mb-1 block">Descrição</label>
                  <textarea value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 font-body focus:outline-none focus:border-primary resize-none" placeholder="Descrição do produto..." />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1 border-white/10 text-gray-400 font-display text-xs">CANCELAR</Button>
                <Button type="submit" disabled={saving} className="flex-1 bg-primary text-black font-display font-bold text-xs">{saving ? 'CRIANDO...' : 'CRIAR PRODUTO'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
