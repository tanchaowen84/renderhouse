'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  CloudSunIcon,
  LayersIcon,
  MapPinIcon,
  MaximizeIcon,
  MoonIcon,
  RefreshCwIcon,
  SparklesIcon,
  SunIcon,
  SunriseIcon,
  SunsetIcon,
  UploadIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

interface WorkspaceClientProps {
  initialRecord: any;
  messages: {
    actions: {
      title: string;
      subtitle: string;
      startRender: string;
      replace: string;
    };
    noInput: string;
  };
}

type SidebarStep = 'initial' | 'settings' | 'chat';

export function WorkspaceClient({
  initialRecord,
  messages,
}: WorkspaceClientProps) {
  const [step, setStep] = useState<SidebarStep>('initial');

  // Render Settings State
  const [selectedLighting, setSelectedLighting] = useState<string>('noon');
  const [maintainAngle, setMaintainAngle] = useState(true);

  // Zoom Controls Ref
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

  return (
    <>
      {/* Tall Floating Sidebar */}
      <div className="absolute left-6 top-6 bottom-6 z-30 w-[400px] flex flex-col pointer-events-auto">
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#1E293B]/90 shadow-2xl backdrop-blur-xl transition-all duration-500">
          <AnimatePresence mode="wait">
            {step === 'initial' && (
              <motion.div
                key="initial"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex h-full flex-col p-6"
              >
                <div className="mb-4 flex items-center gap-2 text-slate-100">
                  <LayersIcon className="size-5 text-indigo-400" />
                  <h2 className="text-lg font-bold">
                    {messages.actions.title}
                  </h2>
                </div>
                <p className="mb-8 text-sm leading-relaxed text-slate-400">
                  {messages.actions.subtitle}
                </p>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setStep('settings')}
                    className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-[1px] shadow-lg transition-all hover:shadow-indigo-500/25 active:scale-[0.98]"
                  >
                    <div className="relative flex items-center gap-4 rounded-2xl bg-[#1E293B]/40 px-5 py-5 backdrop-blur-sm transition-colors group-hover:bg-transparent">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white shadow-inner">
                        <SparklesIcon className="size-6" />
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <span className="text-base font-bold text-white">
                          {messages.actions.startRender}
                        </span>
                        <span className="text-xs text-indigo-100/70">
                          Generate new AI render
                        </span>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="group w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-5 text-left transition-all hover:bg-white/10 hover:border-white/10 active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-400 group-hover:text-white transition-colors">
                        <RefreshCwIcon className="size-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-semibold text-slate-300 group-hover:text-white transition-colors">
                          {messages.actions.replace}
                        </span>
                        <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                          Upload different image
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex h-full flex-col"
              >
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-white/5 p-6">
                  <button
                    type="button"
                    onClick={() => setStep('initial')}
                    className="rounded-full p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                  >
                    <ArrowLeftIcon className="size-4" />
                  </button>
                  <h2 className="text-lg font-bold text-white">
                    Render Settings
                  </h2>
                </div>

                {/* Scrollable Settings Area */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {/* Location Section */}
                  <div className="mb-8">
                    <h3 className="mb-3 text-sm font-semibold text-slate-300">
                      Location
                    </h3>
                    <p className="mb-3 text-xs text-slate-500">
                      Select the location for your render to get accurate
                      lighting
                    </p>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <MapPinIcon className="size-4" />
                      <span>Choose location</span>
                    </button>
                  </div>

                  {/* Lighting Section */}
                  <div className="mb-8">
                    <h3 className="mb-3 text-sm font-semibold text-slate-300">
                      Lighting
                    </h3>
                    <p className="mb-3 text-xs text-slate-500">
                      Choose the time of day for your exterior render
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {
                          id: 'sunrise',
                          label: 'Sunrise',
                          icon: SunriseIcon,
                          color: 'text-orange-400',
                          bg: 'bg-orange-400/20',
                        },
                        {
                          id: 'morning',
                          label: 'Morning',
                          icon: CloudSunIcon,
                          color: 'text-sky-400',
                          bg: 'bg-sky-400/20',
                        },
                        {
                          id: 'noon',
                          label: 'Noon',
                          icon: SunIcon,
                          color: 'text-yellow-400',
                          bg: 'bg-yellow-400/20',
                        },
                        {
                          id: 'afternoon',
                          label: 'Afternoon',
                          icon: SunIcon,
                          color: 'text-amber-400',
                          bg: 'bg-amber-400/20',
                        },
                        {
                          id: 'sunset',
                          label: 'Sunset',
                          icon: SunsetIcon,
                          color: 'text-rose-400',
                          bg: 'bg-rose-400/20',
                        },
                        {
                          id: 'night',
                          label: 'Night',
                          icon: MoonIcon,
                          color: 'text-indigo-400',
                          bg: 'bg-indigo-400/20',
                        },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setSelectedLighting(item.id)}
                          className={cn(
                            'flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all',
                            selectedLighting === item.id
                              ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]'
                              : 'border-white/5 bg-white/5 hover:bg-white/10'
                          )}
                        >
                          <div
                            className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-full',
                              item.bg,
                              item.color
                            )}
                          >
                            <item.icon className="size-5" />
                          </div>
                          <span
                            className={cn(
                              'text-xs font-medium',
                              selectedLighting === item.id
                                ? 'text-white'
                                : 'text-slate-400'
                            )}
                          >
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Camera Angle */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-slate-300">
                        Camera Angle
                      </h3>
                    </div>
                    <div
                      onClick={() => setMaintainAngle(!maintainAngle)}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                    >
                      <div
                        className={cn(
                          'flex h-5 w-5 items-center justify-center rounded border transition-colors',
                          maintainAngle
                            ? 'bg-indigo-500 border-indigo-500'
                            : 'border-slate-500'
                        )}
                      >
                        {maintainAngle && (
                          <div className="h-2 w-2 rounded-[1px] bg-white" />
                        )}
                      </div>
                      <span className="text-sm text-slate-300">
                        Maintain angle
                      </span>
                    </div>
                  </div>

                  {/* More Details */}
                  <div className="mb-4">
                    <h3 className="mb-3 text-sm font-semibold text-slate-300">
                      More Details
                    </h3>
                    <textarea
                      placeholder="e.g., modern style, spring/summer setting, upscale neighborhood..."
                      className="w-full h-32 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Footer Action */}
                <div className="border-t border-white/5 p-6">
                  <button
                    type="button"
                    onClick={() => {
                      // Trigger render logic here
                      console.log('Rendering...');
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Render</span>
                    <ChevronRightIcon className="size-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Zoomable Canvas */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <TransformWrapper
          ref={transformComponentRef}
          initialScale={0.8}
          minScale={0.1}
          maxScale={4}
          centerOnInit
          limitToBounds={false}
          wheel={{ step: 0.1 }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Floating Zoom Controls */}
              <div className="absolute bottom-8 right-8 z-40 flex flex-col gap-2 rounded-xl bg-[#1E293B]/90 p-1.5 shadow-xl backdrop-blur-md border border-white/10 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => zoomIn()}
                  className="rounded-lg p-2.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                  title="Zoom In"
                >
                  <ZoomInIcon className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => zoomOut()}
                  className="rounded-lg p-2.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOutIcon className="size-5" />
                </button>
                <div className="mx-2 h-px bg-white/10" />
                <button
                  type="button"
                  onClick={() => resetTransform()}
                  className="rounded-lg p-2.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                  title="Reset View"
                >
                  <MaximizeIcon className="size-5" />
                </button>
              </div>

              <TransformComponent
                wrapperClass="!w-full !h-full"
                contentClass="!w-full !h-full flex items-center justify-center"
              >
                <div className="relative flex h-full w-full items-center justify-center p-20 pl-[400px]">
                  {initialRecord.inputUrl ? (
                    <div className="relative group shadow-2xl">
                      {/* Image Container with White Border effect */}
                      <div className="relative overflow-hidden rounded-sm ring-8 ring-white bg-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        <Image
                          src={initialRecord.inputUrl}
                          alt={initialRecord.title ?? 'Project input'}
                          width={1920}
                          height={1080}
                          className="h-auto w-auto max-w-[1200px] object-contain"
                          priority
                          draggable={false}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4 text-slate-500">
                      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/5 ring-1 ring-white/10 border border-dashed border-white/10">
                        <UploadIcon className="size-8 opacity-50" />
                      </div>
                      <p className="font-medium">{messages.noInput}</p>
                    </div>
                  )}
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </>
  );
}
