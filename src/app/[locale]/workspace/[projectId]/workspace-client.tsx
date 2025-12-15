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
      <div className="absolute left-6 top-6 bottom-6 z-30 w-[380px] max-w-[86vw] flex flex-col pointer-events-auto">
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#d9dde1] bg-white/92 shadow-[0_24px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-400">
          <AnimatePresence mode="wait">
            {step === 'initial' && (
              <motion.div
                key="initial"
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                className="flex h-full flex-col p-6"
              >
                <div className="mb-4 flex items-center gap-2 text-[#1f242c]">
                  <LayersIcon className="size-5 text-[#6bb4a0]" />
                  <h2 className="text-lg font-semibold">
                    {messages.actions.title}
                  </h2>
                </div>
                <p className="mb-8 text-sm leading-relaxed text-[#6a707a]">
                  {messages.actions.subtitle}
                </p>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setStep('settings')}
                    className="group relative w-full overflow-hidden rounded-2xl border border-[#1f4b3e] bg-[#1f4b3e] px-5 py-5 text-left text-white shadow-[0_14px_32px_rgba(0,0,0,0.18)] transition hover:brightness-[1.05]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white">
                        <SparklesIcon className="size-6" />
                      </div>
                      <div className="flex flex-col items-start text-left">
                        <span className="text-base font-semibold">
                          {messages.actions.startRender}
                        </span>
                        <span className="text-xs text-white/80">
                          Generate new AI render
                        </span>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="group w-full rounded-2xl border border-[#d9dde1] bg-white px-5 py-5 text-left transition hover:bg-[#f5f7fa]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d9dde1] bg-white text-[#4c525c]">
                        <RefreshCwIcon className="size-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-semibold text-[#1f242c]">
                          {messages.actions.replace}
                        </span>
                        <span className="text-xs text-[#7a7f87]">
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
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }}
                className="flex h-full flex-col"
              >
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-[#e6e8ec] bg-white px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setStep('initial')}
                    className="rounded-full p-2 text-[#4c525c] transition hover:bg-[#f3f5f8]"
                  >
                    <ArrowLeftIcon className="size-4" />
                  </button>
                  <h2 className="text-lg font-semibold text-[#1f242c]">
                    Render Settings
                  </h2>
                </div>

                {/* Scrollable Settings Area */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[#cfd4da] scrollbar-track-transparent">
                  {/* Location Section */}
                  <div className="mb-8">
                    <h3 className="mb-2 text-sm font-semibold text-[#1f242c]">
                      Location
                    </h3>
                    <p className="mb-3 text-xs text-[#7a7f87]">
                      Select the location for your render to get accurate lighting
                    </p>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-xl border border-[#d9dde1] bg-white px-4 py-3 text-left text-sm text-[#4c525c] transition hover:border-[#1f4b3e] hover:bg-[#f6faf8]"
                    >
                      <MapPinIcon className="size-4" />
                      <span>Choose location</span>
                    </button>
                  </div>

                  {/* Lighting Section */}
                  <div className="mb-8">
                    <h3 className="mb-2 text-sm font-semibold text-[#1f242c]">
                      Lighting
                    </h3>
                    <p className="mb-3 text-xs text-[#7a7f87]">
                      Choose the time of day for your exterior render
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {
                          id: 'sunrise',
                          label: 'Sunrise',
                          icon: SunriseIcon,
                        },
                        {
                          id: 'morning',
                          label: 'Morning',
                          icon: CloudSunIcon,
                        },
                        {
                          id: 'noon',
                          label: 'Noon',
                          icon: SunIcon,
                        },
                        {
                          id: 'afternoon',
                          label: 'Afternoon',
                          icon: SunIcon,
                        },
                        {
                          id: 'sunset',
                          label: 'Sunset',
                          icon: SunsetIcon,
                        },
                        {
                          id: 'night',
                          label: 'Night',
                          icon: MoonIcon,
                        },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setSelectedLighting(item.id)}
                          className={cn(
                            'flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all',
                            selectedLighting === item.id
                              ? 'border-[#1f4b3e] bg-[#f6faf8] shadow-[0_12px_28px_rgba(0,0,0,0.08)]'
                              : 'border-[#d9dde1] bg-white hover:border-[#1f4b3e] hover:bg-[#f6faf8]'
                          )}
                        >
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9dde1] bg-white text-[#1f4b3e]"
                          >
                            <item.icon className="size-5" />
                          </div>
                          <span
                            className={cn(
                              'text-xs font-medium',
                              selectedLighting === item.id
                                ? 'text-[#1f4b3e]'
                                : 'text-[#4c525c]'
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
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-[#1f242c]">
                        Camera Angle
                      </h3>
                    </div>
                    <div
                      onClick={() => setMaintainAngle(!maintainAngle)}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#d9dde1] bg-white p-4 transition hover:border-[#1f4b3e] hover:bg-[#f6faf8]"
                    >
                      <div
                        className={cn(
                          'flex h-5 w-5 items-center justify-center rounded border transition-colors',
                          maintainAngle
                            ? 'border-[#1f4b3e] bg-[#1f4b3e]'
                            : 'border-[#b8bec6]'
                        )}
                      >
                        {maintainAngle && (
                          <div className="h-2 w-2 rounded-[1px] bg-white" />
                        )}
                      </div>
                      <span className="text-sm text-[#1f242c]">
                        Maintain angle
                      </span>
                    </div>
                  </div>

                  {/* More Details */}
                  <div className="mb-4">
                    <h3 className="mb-2 text-sm font-semibold text-[#1f242c]">
                      More Details
                    </h3>
                    <textarea
                      placeholder="e.g., modern style, spring/summer setting, upscale neighborhood..."
                      className="h-28 w-full resize-none rounded-xl border border-[#d9dde1] bg-white p-4 text-sm text-[#1f242c] placeholder:text-[#9aa1aa] focus:border-[#1f4b3e] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Footer Action */}
                <div className="border-t border-[#e6e8ec] bg-white px-6 py-4">
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Rendering...');
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#1f4b3e] bg-[#1f4b3e] py-3.5 text-sm font-semibold text-white transition hover:brightness-[1.05] active:brightness-[0.96]"
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
              <div className="absolute bottom-8 right-8 z-40 flex flex-col gap-2 rounded-xl border border-[#d9dde1] bg-white/92 p-1.5 shadow-[0_14px_32px_rgba(0,0,0,0.08)] backdrop-blur pointer-events-auto">
                <button
                  type="button"
                  onClick={() => zoomIn()}
                  className="rounded-lg p-2.5 text-[#4c525c] transition hover:bg-[#f3f5f8]"
                  title="Zoom In"
                >
                  <ZoomInIcon className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => zoomOut()}
                  className="rounded-lg p-2.5 text-[#4c525c] transition hover:bg-[#f3f5f8]"
                  title="Zoom Out"
                >
                  <ZoomOutIcon className="size-5" />
                </button>
                <div className="mx-2 h-px bg-[#e6e8ec]" />
                <button
                  type="button"
                  onClick={() => resetTransform()}
                  className="rounded-lg p-2.5 text-[#4c525c] transition hover:bg-[#f3f5f8]"
                  title="Reset View"
                >
                  <MaximizeIcon className="size-5" />
                </button>
              </div>

              <TransformComponent
                wrapperClass="!w-full !h-full"
                contentClass="!w-full !h-full flex items-center justify-center"
              >
                <div className="relative flex h-full w-full items-center justify-center p-10 pl-[420px]">
                  {initialRecord.inputUrl ? (
                    <div className="relative group">
                      <div className="relative overflow-hidden rounded-xl border border-[#d9dde1] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                        <Image
                          src={initialRecord.inputUrl}
                          alt={initialRecord.title ?? 'Project input'}
                          width={1920}
                          height={1080}
                          className="h-auto w-auto max-w-[1100px] object-contain"
                          priority
                          draggable={false}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4 text-[#7a7f87]">
                      <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-dashed border-[#cfd4da] bg-white/80">
                        <UploadIcon className="size-8 opacity-60" />
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
