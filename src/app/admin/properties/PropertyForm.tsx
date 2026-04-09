"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { X, Save, ArrowLeft, ImagePlus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Property } from "@/types";

interface Props {
  property?: Partial<Property> & { id?: string };
}
import { LOCATIONS, PROPERTY_TYPES } from "@/lib/constants";

export default function PropertyForm({ property }: Props) {
  const router = useRouter();
  const isEditing = !!property?.id;

  const [form, setForm] = useState({
    title: property?.title || "",
    description: property?.description || "",
    price: property?.price || "",
    type: property?.type || "sale",
    status: property?.status || "available",
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    area: property?.area || "",
    lot_area: property?.lot_area || "",
    garage: property?.garage || 0,
    property_type: property?.property_type || PROPERTY_TYPES[0],
    location: property?.location || LOCATIONS[0],
    subdivision: property?.subdivision || "",
    map_url: property?.map_url || "",
    video_url: property?.video_url || "",
    featured: property?.featured || false,
  });

  const [images, setImages] = useState<string[]>(property?.images || []);
  const [uploading, setUploading] = useState(false);
  const [removingUrl, setRemovingUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const supabase = createClient();
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("properties")
        .upload(fileName, file);

      if (!uploadError) {
        const { data } = supabase.storage
          .from("properties")
          .getPublicUrl(fileName);
        uploadedUrls.push(data.publicUrl);
      }
    }

    setImages((prev) => [...prev, ...uploadedUrls]);
    setUploading(false);
  };

  const removeImage = async (url: string) => {
    setRemovingUrl(url);
    const supabase = createClient();
    const fileName = url.split("/").pop();
    if (fileName) {
      await supabase.storage.from("properties").remove([fileName]);
    }
    setImages((prev) => prev.filter((img) => img !== url));
    setRemovingUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    // map_url excluded from payload — column not in DB schema yet.
    // The property detail page falls back to a location pin automatically.
    // To enable custom map URLs: add a map_url text column to the properties
    // table in Supabase, then add `map_url: form.map_url || null` to the payload.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { map_url: _map_url, video_url: _video_url, ...formWithoutOptional } = form;
    const payload = {
      ...formWithoutOptional,
      video_url: form.video_url || null,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area),
      lot_area: form.lot_area ? Number(form.lot_area) : null,
      garage: Number(form.garage),
      images,
    };

    if (isEditing) {
      const { error } = await supabase
        .from("properties")
        .update(payload)
        .eq("id", property.id);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase.from("properties").insert(payload);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    }

    // Revalidate cache
    await fetch("/api/revalidate", { method: "POST" });

    router.push("/admin/properties");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {/* Basic info */}
          <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-6 flex flex-col gap-5">
            <h2 className="text-luxury-50 font-bold text-base">
              Basic Information
            </h2>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                Title <span className="text-gold-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Modern Family Home in San Jose del Monte"
                className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-xl px-4 py-3 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the property..."
                className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-xl px-4 py-3 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors resize-none"
              />
            </div>

            {/* Price + Listing Type + Property Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                  Price (₱) <span className="text-gold-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 4500000"
                  className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-xl px-4 py-3 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                  Listing Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-xl px-4 py-3 text-luxury-50 text-sm outline-none transition-colors">
                  <option value="sale" className="bg-luxury-800">For Sale</option>
                  <option value="rent" className="bg-luxury-800">For Rent</option>
                </select>
              </div>
            </div>

            {/* Property Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                Property Type
              </label>
              <select
                name="property_type"
                value={form.property_type}
                onChange={handleChange}
                className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-xl px-4 py-3 text-luxury-50 text-sm outline-none transition-colors">
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-luxury-800">{t}</option>
                ))}
              </select>
            </div>

            {/* Bedrooms + Bathrooms + Floor Area + Lot Area + Garage */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={form.bedrooms}
                  onChange={handleChange}
                  min={0}
                  className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-xl px-4 py-3 text-luxury-50 text-sm outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={form.bathrooms}
                  onChange={handleChange}
                  min={0}
                  className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-xl px-4 py-3 text-luxury-50 text-sm outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                  Floor Area (sqm)
                </label>
                <input
                  type="number"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  min={0}
                  step="any"
                  placeholder="e.g. 81"
                  className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-xl px-4 py-3 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                  Lot Area (sqm)
                </label>
                <input
                  type="number"
                  name="lot_area"
                  value={form.lot_area}
                  onChange={handleChange}
                  min={0}
                  step="any"
                  placeholder="e.g. 144"
                  className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-xl px-4 py-3 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                  Garage
                </label>
                <input
                  type="number"
                  name="garage"
                  value={form.garage}
                  onChange={handleChange}
                  min={0}
                  placeholder="0"
                  className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-xl px-4 py-3 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors"
                />
              </div>
            </div>

            {/* Location + Subdivision */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                  Location <span className="text-gold-500">*</span>
                </label>
                <select
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-xl px-4 py-3 text-luxury-50 text-sm outline-none transition-colors">
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} className="bg-luxury-800">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                  Subdivision
                </label>
                <input
                  type="text"
                  name="subdivision"
                  value={form.subdivision}
                  onChange={handleChange}
                  placeholder="e.g. Palmera Homes"
                  className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-xl px-4 py-3 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors"
                />
              </div>
            </div>

            {/* Map URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                Google Maps Embed URL
              </label>
              <input
                type="url"
                name="map_url"
                value={form.map_url}
                onChange={handleChange}
                placeholder="Paste embed URL from Google Maps → Share → Embed a map"
                className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-xl px-4 py-3 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors"
              />
              <p className="text-luxury-500 text-xs">
                Optional — leave blank to use subdivision + location search. For exact pin: Google Maps → Share → Embed a map → copy the src URL.
              </p>
            </div>

            {/* Video Tour URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                Video Tour URL
              </label>
              <input
                type="url"
                name="video_url"
                value={form.video_url}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-xl px-4 py-3 text-luxury-50 placeholder-luxury-500 text-sm outline-none transition-colors"
              />
              <p className="text-luxury-500 text-xs">
                Optional — paste a YouTube link. Leave blank if no video tour.
              </p>
            </div>

          </div>

          {/* Images */}
          <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-6 flex flex-col gap-5">
            <h2 className="text-luxury-50 font-bold text-base">
              Property Photos
            </h2>

            {/* Upload button */}
            <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-luxury-600 hover:border-gold-500/50 rounded-xl py-8 cursor-pointer transition-colors">
              <div className="w-12 h-12 rounded-full bg-luxury-700 flex items-center justify-center">
                {uploading ? (
                  <span className="w-5 h-5 border-2 border-luxury-400/30 border-t-luxury-400 rounded-full animate-spin" />
                ) : (
                  <ImagePlus className="w-5 h-5 text-luxury-400" />
                )}
              </div>
              <div className="text-center">
                <p className="text-luxury-300 text-sm font-medium">
                  {uploading ? "Uploading..." : "Click to upload photos"}
                </p>
                <p className="text-luxury-500 text-xs mt-1">
                  JPG, PNG, WebP up to 5MB each
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {/* Image preview grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((url, i) => (
                  <div
                    key={url}
                    className="relative group aspect-4/3 rounded-xl overflow-hidden bg-luxury-700 border border-luxury-600">
                    <Image
                      src={url}
                      alt={`Photo ${i + 1}`}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                    {/* Remove button — always visible on mobile, hover-only on desktop */}
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      disabled={removingUrl === url}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity disabled:opacity-60">
                      {removingUrl === url ? (
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>
                    {/* Removing overlay */}
                    {removingUrl === url && (
                      <div className="absolute inset-0 bg-luxury-900/60 flex items-center justify-center">
                        <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                    {i === 0 && (
                      <span className="absolute bottom-2 left-2 text-[10px] font-bold tracking-widest uppercase bg-luxury-900/80 text-gold-500 px-2 py-1 rounded-md">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Status & Settings */}
          <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-6 flex flex-col gap-5">
            <h2 className="text-luxury-50 font-bold text-base">Settings</h2>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/50 focus:border-gold-500 rounded-xl px-4 py-3 text-luxury-50 text-sm outline-none transition-colors">
                <option value="available" className="bg-luxury-800">
                  Available
                </option>
                <option value="sold" className="bg-luxury-800">
                  Sold
                </option>
                <option value="rented" className="bg-luxury-800">
                  Rented
                </option>
              </select>
            </div>

            {/* Featured */}
            <div className="flex items-center justify-between bg-luxury-900 border border-luxury-700 rounded-xl px-4 py-3">
              <div>
                <p className="text-luxury-50 text-sm font-medium">
                  Featured Listing
                </p>
                <p className="text-luxury-500 text-xs mt-0.5">
                  Show on homepage
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-luxury-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500" />
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-70 disabled:cursor-not-allowed text-luxury-900 text-sm font-bold px-6 py-4 rounded-xl tracking-wide transition-colors">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-luxury-900/30 border-t-luxury-900 rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditing ? "Save Changes" : "Add Property"}
                </>
              )}
            </button>
            <Link
              href="/admin/properties"
              className="flex items-center justify-center gap-2 border border-luxury-700 hover:border-gold-500/50 text-luxury-400 hover:text-luxury-50 text-sm font-medium px-6 py-3 rounded-xl transition-all">
              <ArrowLeft className="w-4 h-4" />
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
