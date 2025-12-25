import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, ChevronDown, ChevronRight, RotateCcw, Sparkles, Zap } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { type AetherBackgroundSettings, defaultSettings } from './index';

interface EffectSection {
  id: string;
  name: string;
  icon: string;
}

const effectSections: EffectSection[] = [
  { id: 'smoke', name: 'SMOKE_FOG', icon: '◈' },
  { id: 'dotMatrix', name: 'DOT_MATRIX', icon: '⬡' },
  { id: 'hexGrid', name: 'HEX_GRID', icon: '⎔' },
  { id: 'particles', name: 'PARTICLES', icon: '✦' },
  { id: 'vignette', name: 'VIGNETTE', icon: '◐' },
];

interface Preset {
  id: string;
  name: string;
  description: string;
  settings: AetherBackgroundSettings;
}

const presets: Preset[] = [
  {
    id: 'aether',
    name: 'AETHER_OS',
    description: 'Slow fog, dot matrix, minimal particles',
    settings: {
      smokeIntensity: 1.0,
      smokeSpeed: 1.3,
      dotMatrixIntensity: 1.0,
      dotMatrixScale: 1.5,
      hexGridOpacity: 0.0,
      vignetteIntensity: 0.8,
      particleGlow: 0.3,
      floatingParticleCount: 40,
      floatingParticleSpeed: 0.15,
      liteMode: true,
    },
  },
  {
    id: 'spore',
    name: 'SPORE',
    description: 'High energy, hex grid overlay',
    settings: {
      smokeIntensity: 0.7,
      smokeSpeed: 0.8,
      dotMatrixIntensity: 0.4,
      dotMatrixScale: 2.5,
      hexGridOpacity: 0.0,
      vignetteIntensity: 0.5,
      particleGlow: 0.1,
      floatingParticleCount: 200,
      floatingParticleSpeed: 0.1,
      liteMode: false,
    },
  },
  {
    id: 'void',
    name: 'VOID',
    description: 'Dark and sparse, deep space feel',
    settings: {
      smokeIntensity: 0.2,
      smokeSpeed: 0.05,
      dotMatrixIntensity: 0.08,
      dotMatrixScale: 4.0,
      hexGridOpacity: 0.0,
      vignetteIntensity: 1.4,
      particleGlow: 0.15,
      floatingParticleCount: 15,
      floatingParticleSpeed: 0.03,
      liteMode: false,
    },
  },
];

interface EffectsControlsProps {
  settings: AetherBackgroundSettings;
  onSettingsChange: (settings: AetherBackgroundSettings) => void;
}

export function EffectsControls({ settings, onSettingsChange }: EffectsControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['smoke', 'particles']));

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const updateSetting = <K extends keyof AetherBackgroundSettings>(
    key: K,
    value: AetherBackgroundSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const resetToDefaults = () => {
    onSettingsChange(defaultSettings);
  };

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-black/80 border border-cyan-400/50 flex items-center justify-center text-cyan-400 hover:border-cyan-400 hover:text-cyan-300 transition-colors shadow-lg shadow-cyan-400/20"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed right-0 top-0 bottom-0 z-50 w-80 bg-black/95 border-l border-cyan-400/30 overflow-hidden flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-4 border-b border-cyan-400/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 text-xs">◈</span>
                  <span className="text-cyan-400 font-mono text-sm tracking-wider">EFFECT_PARAMETERS</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-cyan-400/60 hover:text-cyan-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-400/20 scrollbar-track-transparent">
                <div className="border border-cyan-400/20 rounded-lg overflow-hidden bg-black/50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <Label className="text-cyan-400/90 font-mono text-xs">LITE_MODE</Label>
                    </div>
                    <Switch
                      checked={settings.liteMode}
                      onCheckedChange={(checked) => updateSetting('liteMode', checked)}
                    />
                  </div>
                  <p className="text-cyan-400/50 text-[10px] mt-2 font-mono">
                    Reduces GPU load for better performance
                  </p>
                </div>

                <div className="border border-primary/30 rounded-lg overflow-hidden bg-black/50">
                  <div className="px-4 py-3 flex items-center gap-2 border-b border-primary/20">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-primary font-mono text-xs tracking-wider">PRESETS</span>
                  </div>
                  <div className="p-3 grid grid-cols-3 gap-2">
                    {presets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => onSettingsChange(preset.settings)}
                        className="px-3 py-2 text-left rounded border border-cyan-400/20 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all group"
                        title={preset.description}
                      >
                        <span className="text-cyan-400/90 font-mono text-[10px] tracking-wider group-hover:text-cyan-300">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {effectSections.map((section) => (
                  <div
                    key={section.id}
                    className="border border-cyan-400/20 rounded-lg overflow-hidden bg-black/50"
                  >
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-cyan-400/5 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 text-sm">{section.icon}</span>
                        <span className="text-cyan-400/90 font-mono text-xs tracking-wider">
                          {section.name}
                        </span>
                      </div>
                      {expandedSections.has(section.id) ? (
                        <ChevronDown className="w-4 h-4 text-cyan-400/60" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-cyan-400/60" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedSections.has(section.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-4">
                            {section.id === 'smoke' && (
                              <>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-cyan-400/70 text-xs font-mono">INTENSITY</Label>
                                    <span className="text-cyan-400/50 text-xs font-mono">
                                      {settings.smokeIntensity.toFixed(2)}
                                    </span>
                                  </div>
                                  <Slider
                                    value={[settings.smokeIntensity]}
                                    onValueChange={([v]) => updateSetting('smokeIntensity', v)}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    className="[&_[role=slider]]:bg-cyan-400 [&_[role=slider]]:border-cyan-400"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-cyan-400/70 text-xs font-mono">SPEED</Label>
                                    <span className="text-cyan-400/50 text-xs font-mono">
                                      {settings.smokeSpeed.toFixed(2)}
                                    </span>
                                  </div>
                                  <Slider
                                    value={[settings.smokeSpeed]}
                                    onValueChange={([v]) => updateSetting('smokeSpeed', v)}
                                    min={0}
                                    max={3}
                                    step={0.1}
                                    className="[&_[role=slider]]:bg-cyan-400 [&_[role=slider]]:border-cyan-400"
                                  />
                                </div>
                              </>
                            )}

                            {section.id === 'dotMatrix' && (
                              <>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-cyan-400/70 text-xs font-mono">INTENSITY</Label>
                                    <span className="text-cyan-400/50 text-xs font-mono">
                                      {settings.dotMatrixIntensity.toFixed(2)}
                                    </span>
                                  </div>
                                  <Slider
                                    value={[settings.dotMatrixIntensity]}
                                    onValueChange={([v]) => updateSetting('dotMatrixIntensity', v)}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    className="[&_[role=slider]]:bg-cyan-400 [&_[role=slider]]:border-cyan-400"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-cyan-400/70 text-xs font-mono">SCALE</Label>
                                    <span className="text-cyan-400/50 text-xs font-mono">
                                      {settings.dotMatrixScale.toFixed(1)}
                                    </span>
                                  </div>
                                  <Slider
                                    value={[settings.dotMatrixScale]}
                                    onValueChange={([v]) => updateSetting('dotMatrixScale', v)}
                                    min={1}
                                    max={8}
                                    step={0.5}
                                    className="[&_[role=slider]]:bg-cyan-400 [&_[role=slider]]:border-cyan-400"
                                  />
                                </div>
                              </>
                            )}

                            {section.id === 'hexGrid' && (
                              <>
                                <div className="flex items-center justify-between py-1">
                                  <Label className="text-cyan-400/70 text-xs font-mono">ENABLED</Label>
                                  <Switch
                                    checked={settings.hexGridOpacity > 0}
                                    onCheckedChange={(checked) =>
                                      updateSetting('hexGridOpacity', checked ? 0.1 : 0)
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-cyan-400/70 text-xs font-mono">OPACITY</Label>
                                    <span className="text-cyan-400/50 text-xs font-mono">
                                      {settings.hexGridOpacity.toFixed(2)}
                                    </span>
                                  </div>
                                  <Slider
                                    value={[settings.hexGridOpacity]}
                                    onValueChange={([v]) => updateSetting('hexGridOpacity', v)}
                                    min={0}
                                    max={0.3}
                                    step={0.01}
                                    className="[&_[role=slider]]:bg-cyan-400 [&_[role=slider]]:border-cyan-400"
                                  />
                                </div>
                              </>
                            )}

                            {section.id === 'particles' && (
                              <>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-cyan-400/70 text-xs font-mono">GLOW_SPOTS</Label>
                                    <span className="text-cyan-400/50 text-xs font-mono">
                                      {settings.particleGlow.toFixed(2)}
                                    </span>
                                  </div>
                                  <Slider
                                    value={[settings.particleGlow]}
                                    onValueChange={([v]) => updateSetting('particleGlow', v)}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    className="[&_[role=slider]]:bg-cyan-400 [&_[role=slider]]:border-cyan-400"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-cyan-400/70 text-xs font-mono">FLOAT_COUNT</Label>
                                    <span className="text-cyan-400/50 text-xs font-mono">
                                      {settings.floatingParticleCount}
                                    </span>
                                  </div>
                                  <Slider
                                    value={[settings.floatingParticleCount]}
                                    onValueChange={([v]) => updateSetting('floatingParticleCount', Math.round(v))}
                                    min={0}
                                    max={150}
                                    step={5}
                                    className="[&_[role=slider]]:bg-cyan-400 [&_[role=slider]]:border-cyan-400"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-cyan-400/70 text-xs font-mono">FLOAT_SPEED</Label>
                                    <span className="text-cyan-400/50 text-xs font-mono">
                                      {settings.floatingParticleSpeed.toFixed(2)}
                                    </span>
                                  </div>
                                  <Slider
                                    value={[settings.floatingParticleSpeed]}
                                    onValueChange={([v]) => updateSetting('floatingParticleSpeed', v)}
                                    min={0.05}
                                    max={2}
                                    step={0.05}
                                    className="[&_[role=slider]]:bg-cyan-400 [&_[role=slider]]:border-cyan-400"
                                  />
                                </div>
                              </>
                            )}

                            {section.id === 'vignette' && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label className="text-cyan-400/70 text-xs font-mono">INTENSITY</Label>
                                  <span className="text-cyan-400/50 text-xs font-mono">
                                    {settings.vignetteIntensity.toFixed(2)}
                                  </span>
                                </div>
                                <Slider
                                  value={[settings.vignetteIntensity]}
                                  onValueChange={([v]) => updateSetting('vignetteIntensity', v)}
                                  min={0}
                                  max={2}
                                  step={0.05}
                                  className="[&_[role=slider]]:bg-cyan-400 [&_[role=slider]]:border-cyan-400"
                                />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-cyan-400/30">
                <Button
                  onClick={resetToDefaults}
                  variant="outline"
                  className="w-full border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/50 font-mono text-xs"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  RESET_DEFAULTS
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

