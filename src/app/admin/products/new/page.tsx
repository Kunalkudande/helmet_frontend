'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft, Save, Upload, X, Plus, Trash2, Star, GripVertical, ImageIcon,
  Package, Tag, Layers, Settings2, Weight, Shield, Wind, Eye, ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

/* ─── Constants ─── */
const CATEGORIES = [
  { value: 'FULL_FACE', label: 'Full Face', desc: 'Complete head & chin protection' },
  { value: 'HALF_FACE', label: 'Half Face', desc: 'Open face with chin bar' },
  { value: 'OPEN_FACE', label: 'Open Face', desc: 'Three-quarter coverage' },
  { value: 'MODULAR', label: 'Modular', desc: 'Flip-up chin bar' },
  { value: 'OFF_ROAD', label: 'Off Road', desc: 'For dirt & adventure riding' },
  { value: 'KIDS', label: 'Kids', desc: 'Junior helmets for young riders' },
  { value: 'LADIES', label: 'Ladies', desc: 'Designed for women riders' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FREE_SIZE'] as const;

const VISOR_TYPES = [
  'Clear', 'Tinted', 'Smoke', 'Iridium', 'Pinlock Ready', 'Anti-fog', 'Double Visor', 'None',
];

const CERTIFICATIONS = [
  'ISI', 'DOT', 'ECE 22.05', 'ECE 22.06', 'SNELL', 'FIM', 'SHARP 5-Star',
];

const MATERIALS = [
  'ABS', 'Polycarbonate', 'Fiberglass', 'Carbon Fiber', 'Kevlar Composite', 'Thermoplastic',
];

const COMMON_COLORS = [
  { name: 'Matt Black', hex: '#1a1a1a' },
  { name: 'Gloss Black', hex: '#0a0a0a' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Orange', hex: '#ea580c' },
  { name: 'Green', hex: '#16a34a' },
  { name: 'Grey', hex: '#6b7280' },
  { name: 'Silver', hex: '#94a3b8' },
  { name: 'Fluo Yellow', hex: '#d4ff00' },
  { name: 'Fluo Orange', hex: '#ff6600' },
];

/* ─── Types ─── */
interface VariantRow {
  id: string;
  size: string;
  color: string;
  stock: string;
  additionalPrice: string;
}

interface SpecsForm {
  weight: string;
  material: string;
  certifications: string[];
  visorType: string;
  ventilation: boolean;
  features: string[];
}

interface ImageFile {
  id: string;
  file?: File;
  preview: string;
  uploading?: boolean;
  uploaded?: boolean;
  imageUrl?: string;
  isPrimary?: boolean;
}

/* ─── Helpers ─── */
const uid = () => Math.random().toString(36).slice(2, 10);

const inputClass = (hasError?: boolean) =>
  cn(
    'w-full px-4 py-2.5 bg-white/5 border rounded-xl text-sm text-white transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500',
    'placeholder:text-brand-500',
    hasError ? 'border-red-400 ring-1 ring-red-200' : 'border-white/10 hover:border-white/20'
  );

const labelClass = 'block text-sm font-semibold text-brand-300 mb-1.5';

/* ─── Section Wrapper ─── */
function Section({ icon: Icon, title, description, children, defaultOpen = true }: {
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Icon size={20} className="text-orange-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            {description && <p className="text-sm text-brand-500 mt-0.5">{description}</p>}
          </div>
        </div>
        <ChevronDown size={20} className={cn('text-brand-500 transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-white/10">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function AddProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Basic Info State ── */
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('FULL_FACE');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');

  /* ── Images ── */
  const [images, setImages] = useState<ImageFile[]>([]);

  /* ── Specifications ── */
  const [specs, setSpecs] = useState<SpecsForm>({
    weight: '',
    material: '',
    certifications: [],
    visorType: '',
    ventilation: true,
    features: [],
  });
  const [newFeature, setNewFeature] = useState('');

  /* ── Variants ── */
  const [variants, setVariants] = useState<VariantRow[]>([]);

  /* ── UI State ── */
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'basic' | 'images' | 'specs' | 'variants'>('basic');

  /* ═════════════════════════════════════════════════════════
     IMAGE HANDLING
     ═════════════════════════════════════════════════════════ */
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        continue;
      }
      newImages.push({
        id: uid(),
        file,
        preview: URL.createObjectURL(file),
        isPrimary: images.length === 0 && i === 0,
      });
    }

    setImages((prev) => [...prev, ...newImages]);
    e.target.value = '';
  }, [images.length]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const newImages: ImageFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        continue;
      }
      newImages.push({
        id: uid(),
        file,
        preview: URL.createObjectURL(file),
        isPrimary: images.length === 0 && i === 0,
      });
    }
    setImages((prev) => [...prev, ...newImages]);
  }, [images.length]);

  const removeImage = (id: string) => {
    setImages((prev) => {
      const remaining = prev.filter((img) => img.id !== id);
      // If removed image was primary, make first one primary
      if (remaining.length > 0 && !remaining.some((img) => img.isPrimary)) {
        remaining[0].isPrimary = true;
      }
      return remaining;
    });
  };

  const setPrimaryImg = (id: string) => {
    setImages((prev) =>
      prev.map((img) => ({ ...img, isPrimary: img.id === id }))
    );
  };

  /* ═════════════════════════════════════════════════════════
     VARIANT HANDLING
     ═════════════════════════════════════════════════════════ */
  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { id: uid(), size: 'M', color: 'Matt Black', stock: '10', additionalPrice: '0' },
    ]);
  };

  const updateVariant = (id: string, field: keyof VariantRow, value: string) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const removeVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const addAllSizes = () => {
    const color = variants.length > 0 ? variants[0].color : 'Matt Black';
    const newVariants = SIZES.map((size) => ({
      id: uid(),
      size,
      color,
      stock: '10',
      additionalPrice: '0',
    }));
    setVariants((prev) => [...prev, ...newVariants]);
  };

  /* ═════════════════════════════════════════════════════════
     SPECS HANDLING
     ═════════════════════════════════════════════════════════ */
  const toggleCertification = (cert: string) => {
    setSpecs((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert],
    }));
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setSpecs((prev) => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
    setNewFeature('');
  };

  const removeFeature = (index: number) => {
    setSpecs((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  /* ═════════════════════════════════════════════════════════
     VALIDATION
     ═════════════════════════════════════════════════════════ */
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name || name.length < 3) errs.name = 'Name must be at least 3 characters';
    if (!brand) errs.brand = 'Brand is required';
    if (!category) errs.category = 'Select a category';
    if (!description || description.length < 20) errs.description = 'Description must be at least 20 characters';
    if (!price || parseFloat(price) <= 0) errs.price = 'Enter a valid price';
    if (discountPrice && parseFloat(discountPrice) >= parseFloat(price)) errs.discountPrice = 'Must be less than price';
    if (stock === '' || parseInt(stock) < 0) errs.stock = 'Enter valid stock';
    if (!sku || sku.length < 3) errs.sku = 'SKU must be at least 3 characters';

    // Variant validation
    for (const v of variants) {
      if (parseInt(v.stock) < 0) {
        errs[`variant_${v.id}`] = 'Stock cannot be negative';
      }
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // Find which tab has errors
      if (errs.name || errs.brand || errs.category || errs.description || errs.price || errs.discountPrice || errs.stock || errs.sku) {
        setActiveTab('basic');
      }
      toast.error('Please fix the errors before saving');
    }
    return Object.keys(errs).length === 0;
  };

  /* ═════════════════════════════════════════════════════════
     SUBMIT
     ═════════════════════════════════════════════════════════ */
  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);

    try {
      // 1. Build product payload
      const payload: any = {
        name,
        brand,
        category,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        sku,
      };

      if (discountPrice) payload.discountPrice = parseFloat(discountPrice);

      // Specs
      const hasSpecs = specs.weight || specs.material || specs.visorType || specs.certifications.length > 0;
      if (hasSpecs) {
        payload.specifications = {
          weight: specs.weight || 'N/A',
          material: specs.material || 'N/A',
          certifications: specs.certifications,
          visorType: specs.visorType || 'N/A',
          ventilation: specs.ventilation,
          features: specs.features,
        };
      }

      // Variants
      if (variants.length > 0) {
        payload.variants = variants.map((v) => ({
          size: v.size,
          color: v.color,
          stock: parseInt(v.stock) || 0,
          additionalPrice: parseFloat(v.additionalPrice) || 0,
        }));
      }

      // 2. Create product
      const res = await api.post('/products', payload);
      const product = res.data.data;
      toast.success('Product created!');

      // 3. Upload images
      if (images.length > 0) {
        const formData = new FormData();
        for (const img of images) {
          if (img.file) {
            formData.append('images', img.file);
          }
        }

        if (formData.has('images')) {
          try {
            await api.post(`/products/${product.id}/images`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(`${images.length} image(s) uploaded`);
          } catch (imgErr: any) {
            toast.error('Product created but image upload failed. You can add images later.');
            // image upload error handled by toast
          }
        }
      }

      router.push('/admin/products');
    } catch (error: any) {
      const msg = error.response?.data?.error || error.response?.data?.message || 'Failed to create product';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  /* ═════════════════════════════════════════════════════════
     RENDER
     ═════════════════════════════════════════════════════════ */
  const tabs = [
    { key: 'basic' as const, label: 'Basic Info', icon: Package, count: null },
    { key: 'images' as const, label: 'Images', icon: ImageIcon, count: images.length || null },
    { key: 'specs' as const, label: 'Specifications', icon: Settings2, count: null },
    { key: 'variants' as const, label: 'Size & Variants', icon: Layers, count: variants.length || null },
  ];

  return (
    <div className="min-h-screen bg-[hsl(0,0%,5%)]">
      {/* ── Top Bar ── */}
      <div className="sticky top-0 z-30 bg-white/[0.05] backdrop-blur-xl border-b border-white/10">
        <div className="px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/products')}
              className="p-2 rounded-xl hover:bg-white/10 text-brand-500 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Add New Product</h1>
              <p className="text-sm text-brand-500">Fill in all the details for your helmet listing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/products')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={saving}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/25"
            >
              <Save size={16} className="mr-2" />
              {saving ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-8 py-6 max-w-6xl mx-auto">
        {/* ── Tab Navigation ── */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all',
                activeTab === tab.key
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-white/[0.03] text-brand-400 hover:bg-white/10 border border-white/10'
              )}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.count && (
                <span className={cn(
                  'ml-1 px-2 py-0.5 rounded-full text-xs font-bold',
                  activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-orange-500/10 text-orange-400'
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════
           TAB: BASIC INFO
           ════════════════════════════════════════════════════════ */}
        {activeTab === 'basic' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Section icon={Package} title="Product Information" description="Basic details about the helmet">
              <div className="space-y-5">
                {/* Name & Brand */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Product Name *</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Steelbird SBA-7 Hero ISI Certified"
                      className={inputClass(!!errors.name)}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  <p className="text-xs text-brand-500 mt-1">Include brand, model, and key feature for best SEO</p>
                  </div>
                  <div>
                    <label className={labelClass}>Brand *</label>
                    <input
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. Steelbird, HJC, Arai, Shoei"
                      className={inputClass(!!errors.brand)}
                    />
                    {errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand}</p>}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className={labelClass}>Category *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={cn(
                          'p-4 rounded-xl border-2 text-left transition-all',
                          category === cat.value
                            ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/20'
                            : 'border-white/10 hover:border-white/20 bg-white/[0.03]'
                        )}
                      >
                        <p className={cn(
                          'text-sm font-bold',
                          category === cat.value ? 'text-orange-400' : 'text-brand-300'
                        )}>
                          {cat.label}
                        </p>
                        <p className="text-xs text-brand-500 mt-0.5">{cat.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className={labelClass}>Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the helmet in detail — materials, safety features, comfort, who it's best for..."
                    rows={5}
                    className={cn(inputClass(!!errors.description), 'resize-vertical')}
                  />
                  {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                  <p className="text-xs text-brand-500 mt-1">{description.length} / 20 min characters</p>
                </div>
              </div>
            </Section>

            <Section icon={Tag} title="Pricing & Inventory" description="Set price, discount, stock, and SKU">
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div>
                    <label className={labelClass}>MRP (₹) *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500 text-sm font-medium">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="2999"
                        className={cn(inputClass(!!errors.price), 'pl-8')}
                      />
                    </div>
                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Selling Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500 text-sm font-medium">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value)}
                        placeholder="Optional"
                        className={cn(inputClass(!!errors.discountPrice), 'pl-8')}
                      />
                    </div>
                    {errors.discountPrice && <p className="text-xs text-red-500 mt-1">{errors.discountPrice}</p>}
                    {price && discountPrice && parseFloat(discountPrice) < parseFloat(price) && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        {Math.round(((parseFloat(price) - parseFloat(discountPrice)) / parseFloat(price)) * 100)}% off
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Total Stock *</label>
                    <input
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="50"
                      className={inputClass(!!errors.stock)}
                    />
                    {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>SKU Code *</label>
                    <input
                      value={sku}
                      onChange={(e) => setSku(e.target.value.toUpperCase())}
                      placeholder="SB-SBA7-HERO"
                      className={inputClass(!!errors.sku)}
                    />
                    {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku}</p>}
                    <p className="text-xs text-brand-500 mt-1">Unique stock keeping unit code</p>
                  </div>
                </div>
              </div>
            </Section>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════
           TAB: IMAGES
           ════════════════════════════════════════════════════════ */}
        {activeTab === 'images' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Section icon={ImageIcon} title="Product Images" description="Upload high-quality photos of the helmet from different angles">
              {/* Drop zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-orange-400 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-white/5 hover:bg-orange-500/5"
              >
                  <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                    <Upload size={28} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-300">
                      Drop images here or <span className="text-orange-500">browse</span>
                    </p>
                    <p className="text-xs text-brand-500 mt-1">
                      JPEG, PNG, WebP up to 5MB each • Max 10 images
                    </p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Image grid */}
              {images.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-brand-300">
                      {images.length} image{images.length !== 1 ? 's' : ''} selected
                    </p>
                    <button
                      onClick={() => setImages([])}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove all
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((img) => (
                      <div
                        key={img.id}
                        className={cn(
                          'relative group rounded-xl overflow-hidden border-2 aspect-square transition-all',
                          img.isPrimary ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-white/10'
                        )}
                      >
                        <Image
                          src={img.preview}
                          alt="Product"
                          fill
                          className="object-cover"
                        />

                        {/* Primary badge */}
                        {img.isPrimary && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                            Primary
                          </div>
                        )}

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {!img.isPrimary && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setPrimaryImg(img.id); }}
                              className="p-2 bg-white/20 backdrop-blur rounded-lg text-white hover:bg-white/30 transition"
                              title="Set as primary"
                            >
                              <Star size={16} />
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                            className="p-2 bg-red-500/80 backdrop-blur rounded-lg text-white hover:bg-red-600/80 transition"
                            title="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add more button */}
                    {images.length < 10 && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-white/20 hover:border-orange-400 flex flex-col items-center justify-center gap-2 text-brand-500 hover:text-orange-500 transition"
                      >
                        <Plus size={24} />
                        <span className="text-xs font-medium">Add more</span>
                      </button>
                    )}
                  </div>

                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-xs text-amber-700">
                      <strong>Tips:</strong> First image is the primary/thumbnail. Click the star icon to change primary. 
                      Use high-resolution photos showing front, back, side, interior, and visor details.
                    </p>
                  </div>
                </div>
              )}
            </Section>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════
           TAB: SPECIFICATIONS
           ════════════════════════════════════════════════════════ */}
        {activeTab === 'specs' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Section icon={Settings2} title="Technical Specifications" description="Helmet weight, material, and build details">
              <div className="space-y-5">
                {/* Weight & Material */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>
                      <Weight size={14} className="inline mr-1 text-brand-500" />
                      Weight
                    </label>
                    <input
                      value={specs.weight}
                      onChange={(e) => setSpecs({ ...specs, weight: e.target.value })}
                      placeholder="e.g. 1.35 kg"
                      className={inputClass()}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Shell Material</label>
                    <select
                      value={specs.material}
                      onChange={(e) => setSpecs({ ...specs, material: e.target.value })}
                      className={cn(inputClass(), 'bg-white/5')}
                    >
                      <option value="">Select material</option>
                      {MATERIALS.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Visor & Ventilation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>
                      <Eye size={14} className="inline mr-1 text-brand-500" />
                      Visor Type
                    </label>
                    <select
                      value={specs.visorType}
                      onChange={(e) => setSpecs({ ...specs, visorType: e.target.value })}
                      className={cn(inputClass(), 'bg-white/5')}
                    >
                      <option value="">Select visor type</option>
                      {VISOR_TYPES.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>
                      <Wind size={14} className="inline mr-1 text-brand-500" />
                      Ventilation
                    </label>
                    <div className="flex items-center gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="ventilation"
                          checked={specs.ventilation === true}
                          onChange={() => setSpecs({ ...specs, ventilation: true })}
                          className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                        />
                    <span className="text-sm text-brand-300">Yes — Vented</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="ventilation"
                          checked={specs.ventilation === false}
                          onChange={() => setSpecs({ ...specs, ventilation: false })}
                          className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm text-brand-300">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            <Section icon={Shield} title="Safety Certifications" description="Select all applicable safety certifications">
              <div className="flex flex-wrap gap-2">
                {CERTIFICATIONS.map((cert) => {
                  const selected = specs.certifications.includes(cert);
                  return (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => toggleCertification(cert)}
                      className={cn(
                        'px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all',
                        selected
                          ? 'border-green-500 bg-green-500/10 text-green-400 ring-2 ring-green-500/20'
                          : 'border-white/10 bg-white/[0.03] text-brand-400 hover:border-white/20'
                      )}
                    >
                      {selected && <span className="mr-1.5">✓</span>}
                      {cert}
                    </button>
                  );
                })}
              </div>
            </Section>

            <Section icon={Star} title="Key Features" description="Add standout features that make this helmet special" defaultOpen={true}>
              <div className="space-y-4">
                {/* Existing features */}
                {specs.features.length > 0 && (
                  <div className="space-y-2">
                    {specs.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-xl group"
                      >
                        <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-orange-500">{idx + 1}</span>
                        </div>
                        <span className="text-sm text-brand-300 flex-1">{feature}</span>
                        <button
                          onClick={() => removeFeature(idx)}
                          className="p-1 text-brand-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add feature */}
                <div className="flex gap-2">
                  <input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    placeholder="e.g. Quick-release buckle, Removable washable liner..."
                    className={cn(inputClass(), 'flex-1')}
                  />
                  <Button onClick={addFeature} variant="outline" className="px-4">
                    <Plus size={16} className="mr-1" /> Add
                  </Button>
                </div>

                {specs.features.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-brand-500">No features added yet. Add features like "Anti-scratch visor", "Aerodynamic design", etc.</p>
                  </div>
                )}
              </div>
            </Section>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════
           TAB: VARIANTS (SIZE / COLOR)
           ════════════════════════════════════════════════════════ */}
        {activeTab === 'variants' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Section icon={Layers} title="Size & Color Variants" description="Add available sizes and colors with individual stock levels">
              <div className="space-y-5">
                {/* Quick actions */}
                <div className="flex flex-wrap gap-2">
                  <Button onClick={addVariant} variant="outline" size="sm">
                    <Plus size={14} className="mr-1" /> Add Variant
                  </Button>
                  <Button onClick={addAllSizes} variant="outline" size="sm">
                    <Layers size={14} className="mr-1" /> Add All Sizes
                  </Button>
                </div>

                {variants.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl">
                    <Layers size={40} className="mx-auto text-brand-600 mb-3" />
                    <h3 className="text-lg font-semibold text-brand-300 mb-1">No variants yet</h3>
                    <p className="text-sm text-brand-500 mb-4">
                      Add size and color combinations so customers can choose their fit
                    </p>
                    <Button onClick={addAllSizes} variant="outline">
                      <Plus size={16} className="mr-1" /> Quick Add All Sizes
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="hidden md:grid grid-cols-12 gap-3 px-4 text-xs font-semibold text-brand-500 uppercase tracking-wider">
                      <div className="col-span-2">Size</div>
                      <div className="col-span-4">Color</div>
                      <div className="col-span-2">Stock</div>
                      <div className="col-span-3">Extra Price (₹)</div>
                      <div className="col-span-1" />
                    </div>

                    {variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition"
                      >
                        {/* Size */}
                        <div className="md:col-span-2">
                          <label className="md:hidden text-xs font-semibold text-brand-500 uppercase mb-1 block">Size</label>
                          <select
                            value={variant.size}
                            onChange={(e) => updateVariant(variant.id, 'size', e.target.value)}
                            className={cn(inputClass(), 'bg-white/5 py-2')}
                          >
                            {SIZES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>

                        {/* Color */}
                        <div className="md:col-span-4">
                          <label className="md:hidden text-xs font-semibold text-brand-500 uppercase mb-1 block">Color</label>
                          <div className="flex gap-2 items-center">
                            <select
                              value={variant.color}
                              onChange={(e) => updateVariant(variant.id, 'color', e.target.value)}
                              className={cn(inputClass(), 'bg-white/5 py-2 flex-1')}
                            >
                              {COMMON_COLORS.map((c) => (
                                <option key={c.name} value={c.name}>{c.name}</option>
                              ))}
                            </select>
                            <div
                              className="w-8 h-8 rounded-lg border border-white/10 flex-shrink-0"
                              style={{ backgroundColor: COMMON_COLORS.find((c) => c.name === variant.color)?.hex || '#ccc' }}
                            />
                          </div>
                        </div>

                        {/* Stock */}
                        <div className="md:col-span-2">
                          <label className="md:hidden text-xs font-semibold text-brand-500 uppercase mb-1 block">Stock</label>
                          <input
                            type="number"
                            min="0"
                            value={variant.stock}
                            onChange={(e) => updateVariant(variant.id, 'stock', e.target.value)}
                            className={cn(inputClass(!!errors[`variant_${variant.id}`]), 'py-2')}
                          />
                        </div>

                        {/* Additional Price */}
                        <div className="md:col-span-3">
                          <label className="md:hidden text-xs font-semibold text-brand-500 uppercase mb-1 block">Extra Price</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-500 text-xs">+₹</span>
                            <input
                              type="number"
                              min="0"
                              value={variant.additionalPrice}
                              onChange={(e) => updateVariant(variant.id, 'additionalPrice', e.target.value)}
                              className={cn(inputClass(), 'py-2 pl-8')}
                            />
                          </div>
                        </div>

                        {/* Delete */}
                        <div className="md:col-span-1 flex items-center justify-end">
                          <button
                            onClick={() => removeVariant(variant.id)}
                            className="p-2 text-brand-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {variants.length > 0 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-xs text-blue-700">
                      <strong>Note:</strong> "Extra Price" adds on top of the base price. For example, if base price is ₹2,999 and XL variant has +₹200, 
                      the XL will show as ₹3,199. Total stock should equal the sum of variant stocks.
                    </p>
                  </div>
                )}
              </div>
            </Section>
          </motion.div>
        )}

        {/* ── Bottom Save Bar ── */}
        <div className="mt-8 flex items-center justify-between bg-white/[0.03] rounded-2xl border border-white/10 p-5">
          <div className="text-sm text-brand-500">
            {images.length > 0 && <span className="mr-3">📷 {images.length} images</span>}
            {variants.length > 0 && <span className="mr-3">📐 {variants.length} variants</span>}
            {specs.certifications.length > 0 && <span>🛡️ {specs.certifications.length} certifications</span>}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push('/admin/products')}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={saving}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/25"
            >
              <Save size={16} className="mr-2" />
              {saving ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
