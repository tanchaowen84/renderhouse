'use client';

import { cn } from '@/lib/utils';
import {
  ArrowUpIcon,
  Loader2Icon,
  MapPinIcon,
  MaximizeIcon,
  MessageCircleIcon,
  SparklesIcon,
  UploadIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
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

type ChatRole = 'user' | 'assistant';
type ChatMessageStatus = 'loading' | 'done';

interface RenderSpec {
  shouldRender: boolean;
  prompt?: string;
  strength?: number;
  imageSize?: string;
}

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  status?: ChatMessageStatus;
  imageUrl?: string;
  renderSpec?: RenderSpec;
}

function getPrimaryImageUrl(record: any): string | null {
  const outputUrls = record?.outputUrls;

  if (Array.isArray(outputUrls) && typeof outputUrls[0] === 'string') {
    return outputUrls[0];
  }

  if (typeof outputUrls === 'string' && outputUrls.length > 0) {
    return outputUrls;
  }

  if (typeof record?.inputUrl === 'string' && record.inputUrl.length > 0) {
    return record.inputUrl;
  }

  return null;
}

export function WorkspaceClient({
  initialRecord,
  messages,
}: WorkspaceClientProps) {
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(() =>
    getPrimaryImageUrl(initialRecord)
  );

  const [isRendering, setIsRendering] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'assistant-welcome',
      role: 'assistant',
      content:
        'Tell me what you want to change (e.g. “more modern, sunset lighting”).',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Zoom Controls Ref
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async () => {
    const content = inputValue.trim();
    if (!content) return;
    if (isRendering) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    };

    const assistantId = crypto.randomUUID();
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: 'Rendering…',
      status: 'loading',
    };

    setChatMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInputValue('');
    setIsRendering(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...chatMessages
              .filter((m) => m.status !== 'loading')
              .map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content },
          ],
          currentImageUrl,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | {
            reply?: string;
            imageUrl?: string;
            renderSpec?: RenderSpec;
            error?: string;
          }
        | null;

      if (!response.ok || !data?.reply) {
        const errorMessage = data?.error || 'Failed to generate render';
        setChatMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: errorMessage,
                  status: 'done',
                }
              : m
          )
        );
        setIsRendering(false);
        return;
      }

      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: data.reply ?? 'Done.',
                status: 'done',
                imageUrl: data.imageUrl,
                renderSpec: data.renderSpec,
              }
            : m
        )
      );
      if (data.imageUrl) {
        setCurrentImageUrl(data.imageUrl);
      }
      setIsRendering(false);
    } catch (error) {
      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: 'Network error. Please try again.',
                status: 'done',
              }
            : m
        )
      );
      setIsRendering(false);
    }
  };

  return (
    <>
      {/* Tall Floating Sidebar */}
      <div className="absolute left-6 top-6 bottom-6 z-30 w-[380px] max-w-[86vw] flex flex-col pointer-events-auto">
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#d9dde1] bg-white/92 shadow-[0_24px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-400">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-[#e6e8ec] bg-white px-6 py-4">
            <div className="flex items-center gap-2 text-[#1f242c]">
              <SparklesIcon className="size-5 text-[#6bb4a0]" />
              <h2 className="text-base font-semibold">AI Assistant</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#d9dde1] bg-white px-3 py-1.5 text-[11px] font-medium text-[#4c525c]">
              <MapPinIcon className="size-3.5" />
              <span>API</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5">
            <div className="space-y-3">
              {chatMessages.map((m) => {
                const isUser = m.role === 'user';

                return (
                  <div
                    key={m.id}
                    className={cn(
                      'flex w-full',
                      isUser ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-[0_10px_24px_rgba(0,0,0,0.06)]',
                        isUser
                          ? 'bg-[#1f4b3e] text-white'
                          : 'border border-[#e3e6ea] bg-white text-[#1f242c]'
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {!isUser && (
                          <MessageCircleIcon className="mt-0.5 size-4 text-[#6bb4a0]" />
                        )}
                        <div className="flex-1">
                          <p>{m.content}</p>

                          {m.status === 'loading' && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-[#6a707a]">
                              <Loader2Icon className="size-3.5 animate-spin" />
                              <span>Working…</span>
                            </div>
                          )}

                          {m.imageUrl && (
                            <div className="mt-3 overflow-hidden rounded-xl border border-[#e3e6ea] bg-white">
                              <Image
                                src={m.imageUrl}
                                alt="Latest render"
                                width={640}
                                height={360}
                                className="h-auto w-full object-cover"
                                draggable={false}
                              />
                              <div className="px-3 py-2 text-[11px] text-[#6a707a]">
                                Latest render
                              </div>
                            </div>
                          )}

                          {m.renderSpec?.shouldRender && m.renderSpec.prompt && (
                            <div className="mt-3 rounded-xl border border-[#e3e6ea] bg-[#fbfcfd] p-3">
                              <div className="mb-2 text-[11px] font-medium text-[#4c525c]">
                                Prompt draft
                              </div>
                              <pre className="whitespace-pre-wrap break-words rounded-lg bg-white p-3 text-xs text-[#1f242c] shadow-[inset_0_0_0_1px_rgba(227,230,234,1)]">
                                {m.renderSpec.prompt}
                              </pre>
                              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#6a707a]">
                                {typeof m.renderSpec.strength === 'number' && (
                                  <span className="rounded-full border border-[#e3e6ea] bg-white px-2 py-1">
                                    strength: {m.renderSpec.strength}
                                  </span>
                                )}
                                {m.renderSpec.imageSize && (
                                  <span className="rounded-full border border-[#e3e6ea] bg-white px-2 py-1">
                                    size: {m.renderSpec.imageSize}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t border-[#e6e8ec] bg-white p-4"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-[#d9dde1] bg-white p-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Describe changes…"
                disabled={isRendering}
                rows={1}
                className="min-h-[44px] max-h-36 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-[#1f242c] placeholder:text-[#9aa1aa] focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isRendering || inputValue.trim().length === 0}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl border transition',
                  isRendering || inputValue.trim().length === 0
                    ? 'cursor-not-allowed border-[#d9dde1] bg-[#f3f5f8] text-[#9aa1aa]'
                    : 'border-[#1f4b3e] bg-[#1f4b3e] text-white hover:brightness-[1.05] active:brightness-[0.96]'
                )}
                aria-label="Send message"
              >
                <ArrowUpIcon className="size-4" />
              </button>
            </div>
            <p className="mt-2 text-[11px] text-[#7a7f87]">
              Press Enter to send, Shift+Enter for a new line.
            </p>
          </form>
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
                  {currentImageUrl ? (
                    <div className="relative group">
                      <div className="relative overflow-hidden rounded-xl border border-[#d9dde1] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                        <Image
                          src={currentImageUrl}
                          alt={initialRecord.title ?? 'Project image'}
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
