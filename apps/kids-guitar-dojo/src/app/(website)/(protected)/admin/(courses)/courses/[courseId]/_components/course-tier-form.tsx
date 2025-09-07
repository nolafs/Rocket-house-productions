'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Pencil, Plus, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

import { Input, Textarea, Switch, Separator } from '@rocket-house-productions/shadcn-ui';
import { Badge, Button } from '@rocket-house-productions/shadcn-ui/server';

import type { Course, Tier as PrismaTier } from '@prisma/client';
import { updateProductMetadata } from '@rocket-house-productions/actions/server';

interface Props {
  initialData: Course & { tiers: PrismaTier[] };
  courseId: string;
}

interface SimpleTier {
  id?: string;
  type: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'UPGRADE';
  name: string;
  description: string;
  stripeId: string;
  stripeIdDev: string;
  free: boolean;
  position: number;
  mostPopular: boolean;
  features: string[];
}

const TIER_TYPES = ['BASIC', 'STANDARD', 'PREMIUM', 'UPGRADE'] as const;

const CourseTiersForm = ({ initialData, courseId }: Props) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  // Simple state - just an array of tier objects
  const [tiers, setTiers] = useState<SimpleTier[]>(() => {
    return (initialData.tiers || [])
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map(tier => ({
        id: tier.id,
        type: tier.type as 'BASIC' | 'STANDARD' | 'PREMIUM' | 'UPGRADE',
        name: tier.name || '',
        description: tier.description || '',
        stripeId: tier.stripeId || '',
        stripeIdDev: tier.stripeIdDev || '',
        free: tier.free || false,
        position: tier.position || 0,
        mostPopular: tier.mostPopular || false,
        features: Array.isArray((tier as any).features) ? (tier as any).features : [],
      }));
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTier = (type: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'UPGRADE') => {
    const exists = tiers.some(t => t.type === type);
    if (exists) return;

    const newTier: SimpleTier = {
      type,
      name: type.charAt(0) + type.slice(1).toLowerCase(),
      description: '',
      stripeId: '',
      stripeIdDev: '',
      free: false,
      position: type === 'BASIC' ? 0 : type === 'STANDARD' ? 1 : type === 'PREMIUM' ? 2 : 3,
      mostPopular: type === 'PREMIUM',
      features: [],
    };

    setTiers([...tiers, newTier]);
  };

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const updateTier = (index: number, field: keyof SimpleTier, value: any) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setTiers(newTiers);
  };

  const setMostPopular = (index: number) => {
    const newTiers = tiers.map((tier, i) => ({
      ...tier,
      mostPopular: i === index,
    }));
    setTiers(newTiers);
  };

  const addFeature = (tierIndex: number, feature: string) => {
    console.log(tierIndex, feature);

    if (!feature.trim()) return;
    const newTiers = [...tiers];
    newTiers[tierIndex].features = [...newTiers[tierIndex].features, feature.trim()];
    setTiers(newTiers);
  };

  const removeFeature = (tierIndex: number, featureIndex: number) => {
    const newTiers = [...tiers];
    newTiers[tierIndex].features = newTiers[tierIndex].features.filter((_, i) => i !== featureIndex);
    setTiers(newTiers);
  };

  const updateFeature = (tierIndex: number, featureIndex: number, value: string) => {
    const newTiers = [...tiers];
    newTiers[tierIndex].features[featureIndex] = value;
    setTiers(newTiers);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Validate required fields
      const errors: string[] = [];

      tiers.forEach((tier, index) => {
        if (!tier.name.trim()) {
          errors.push(`Tier ${index + 1}: Name is required`);
        }
      });

      if (errors.length > 0) {
        toast.error(errors[0]);
        setIsSubmitting(false);
        return;
      }

      // Save tiers
      await axios.patch(`/api/courses/${courseId}/tiers`, { tiers });

      // Update Stripe metadata
      for (const tier of tiers) {
        const productType = tier.type.toLowerCase();
        const baseMeta = {
          course_id: courseId,
          productType,
          position: String(tier.position),
          product_group: 'kidGuitarDojo',
          displayName: `Rockstar Academy ${tier.name}`,
        };
        if (tier.stripeId) await updateProductMetadata(tier.stripeId, baseMeta);
        if (tier.stripeIdDev) await updateProductMetadata(tier.stripeIdDev, baseMeta);
      }

      toast.success('Tiers updated');
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save tiers');
    } finally {
      setIsSubmitting(false);
    }
  };

  const missingTypes = TIER_TYPES.filter(type => !tiers.some(t => t.type === type));

  if (!isEditing) {
    return (
      <div className="mt-6 rounded-md border bg-slate-100 p-4">
        <div className="flex items-center justify-between font-medium">
          Course Tiers
          <Button onClick={() => setIsEditing(true)} variant="ghost">
            <Pencil className="mr-2 h-4 w-4" />
            Edit Tiers
          </Button>
        </div>

        {tiers.length === 0 ? (
          <div className="mt-2 text-sm italic text-slate-500">No tiers configured yet.</div>
        ) : (
          <div className="mt-3 space-y-4">
            {tiers.map((tier, index) => (
              <div key={`${tier.type}-${tier.id || index}`} className="rounded-md border bg-white p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{tier.type}</Badge>
                    <div className="font-semibold">{tier.name}</div>
                    {tier.mostPopular && (
                      <span className="inline-flex items-center text-xs font-semibold">
                        <Star className="mr-1 h-3 w-3" /> Most popular
                      </span>
                    )}
                    {tier.free && <Badge className="ml-2">Free</Badge>}
                  </div>
                  <div className="text-xs text-slate-500">position: {tier.position}</div>
                </div>
                {tier.description && <p className="mt-2 text-sm text-slate-700">{tier.description}</p>}
                <div className="mt-2 grid gap-1 text-xs">
                  <div>
                    <b>Stripe (prod)</b>: {tier.stripeId || <i>—</i>}
                  </div>
                  <div>
                    <b>Stripe (dev)</b>: {tier.stripeIdDev || <i>—</i>}
                  </div>
                </div>
                {tier.features.length > 0 && (
                  <>
                    <Separator className="my-3" />
                    <div className="flex flex-wrap gap-2">
                      {tier.features.map((feature, i) => (
                        <Badge key={i} variant="outline">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course Tiers
        <Button onClick={() => setIsEditing(false)} variant="ghost">
          Cancel
        </Button>
      </div>

      <div className="mt-4 space-y-6">
        {missingTypes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {missingTypes.map(type => (
              <Button
                key={type}
                type="button"
                variant="secondary"
                onClick={() => addTier(type)}
                className="flex items-center">
                <Plus className="mr-2 h-4 w-4" /> Add {type}
              </Button>
            ))}
          </div>
        )}

        {tiers.length === 0 && <div className="text-sm italic text-slate-500">Add a tier to get started.</div>}

        {tiers.map((tier, tierIndex) => (
          <div key={tierIndex} className="rounded-md border bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{tier.type}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm">
                  Most popular
                  <Switch checked={tier.mostPopular} onCheckedChange={() => setMostPopular(tierIndex)} />
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeTier(tierIndex)}
                  className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mb-3 flex flex-col items-center justify-between">
              <Input
                className="w-64"
                placeholder="Tier display name"
                value={tier.name}
                onChange={e => updateTier(tierIndex, 'name', e.target.value)}
              />
              <div className="mt-3 w-full">
                <label className="mb-1 block text-sm font-medium">Description</label>
                <Textarea
                  rows={3}
                  className={'w-full'}
                  placeholder="Optional short blurb"
                  value={tier.description}
                  onChange={e => updateTier(tierIndex, 'description', e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Position</label>
                  <Input
                    type="number"
                    min={0}
                    max={2}
                    value={tier.position}
                    onChange={e => updateTier(tierIndex, 'position', Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <label className="text-sm font-medium">Free</label>
                  <Switch checked={tier.free} onCheckedChange={checked => updateTier(tierIndex, 'free', checked)} />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium">Stripe Product (prod)</label>
                  <Input
                    placeholder="prod_..."
                    value={tier.stripeId}
                    onChange={e => updateTier(tierIndex, 'stripeId', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium">Stripe Product (dev)</label>
                  <Input
                    placeholder="prod_..."
                    value={tier.stripeIdDev}
                    onChange={e => updateTier(tierIndex, 'stripeIdDev', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Simple Features Section */}
            <div>
              <div className="mb-2 text-sm font-semibold">Features</div>
              {tier.features.length === 0 && <div className="mb-2 text-xs italic text-slate-500">No features yet.</div>}

              <div className="space-y-2">
                {tier.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2">
                    <Input
                      className="flex-1"
                      placeholder="Feature"
                      value={feature}
                      onChange={e => updateFeature(tierIndex, featureIndex, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="px-2 text-red-600 hover:text-red-700"
                      onClick={() => removeFeature(tierIndex, featureIndex)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <Button type="button" variant="secondary" onClick={() => addFeature(tierIndex, 'New feature')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Feature
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-x-2">
          <Button onClick={handleSubmit} disabled={isSubmitting || tiers.some(t => !t.name.trim())}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseTiersForm;
