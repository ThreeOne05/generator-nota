"use client";

import { Item } from "./types";
import { formatIDR } from "./receipt-utils";

type ReceiptPreviewProps = {
  logoDataUrl: string;
  storeName: string;
  cashierEnabled: boolean;
  cashierName: string;
  displayDate: string;
  items: Item[];
  total: number;
  receiptWidthClass: string;
  footerLine1: string;
  footerLine2: string;
  note: string; // TAMBAH: terima note
};

export default function ReceiptPreview({
  logoDataUrl,
  storeName,
  cashierEnabled,
  cashierName,
  displayDate,
  items,
  total,
  receiptWidthClass,
  footerLine1,
  footerLine2,
  note, // TAMBAH
}: ReceiptPreviewProps) {
  return (
    <>
      {/* Preview UI (boxed) - sembunyikan saat print */}
      <section className="print:hidden rounded-2xl sm:rounded-3xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-5 shadow-2xl shadow-black/50 ring-1 ring-amber-500/10 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/40">
        <h2 className="mb-3 text-base sm:text-lg font-semibold text-amber-300">
          Preview Nota
        </h2>

        <div
          className={`mx-auto rounded-xl bg-white p-2 text-neutral-900 shadow-2xl shadow-black/40 ring-1 ring-neutral-200 ${receiptWidthClass}`}
        >
          <div className="font-mono text-[11px] sm:text-[12px] leading-5">
            {logoDataUrl && (
              <div className="mb-1">
                <img
                  src={logoDataUrl}
                  alt="Logo Toko"
                  className="mx-auto max-h-16 w-auto object-contain"
                />
              </div>
            )}

            <div className="text-center font-extrabold">
              {storeName || "NAMA TOKO"}
            </div>
            {cashierEnabled && (
              <div className="text-center">
                Kasir: {cashierName.trim() || "-"}
              </div>
            )}
            <div className="text-center">{displayDate}</div>

            {note.trim() !== "" && (
              <>
                <div className="my-1" />
                <div className="whitespace-pre-wrap text-center text-[10px] sm:text-[11px] leading-4 text-neutral-700">
                  {note}
                </div>
              </>
            )}

            <div className="my-1 border-b border-dashed border-neutral-400" />

            <div className="space-y-1">
              {items.map((it) => (
                <div key={it.id}>
                  <div className="break-words font-semibold">{it.name}</div>
                  <div className="flex items-center justify-between tabular-nums">
                    <span>
                      {it.qty} x {formatIDR(it.price)}
                    </span>
                    <span className="font-semibold">
                      {formatIDR(it.qty * it.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-1 border-b border-dashed border-neutral-400" />

            <div className="flex items-center justify-between font-extrabold tabular-nums">
              <span>Total</span>
              <span>{formatIDR(total)}</span>
            </div>

            <div className="my-1 border-b border-dotted border-neutral-400" />

            {footerLine1.trim() !== "" && (
              <div className="text-center">{footerLine1}</div>
            )}
            {footerLine2.trim() !== "" && (
              <div className="text-center text-neutral-500">{footerLine2}</div>
            )}
          </div>
        </div>
      </section>

      {/* Print-only: Nota polos tanpa box pembungkus */}
      <section className="hidden print:block">
        <div className={`mx-auto ${receiptWidthClass}`}>
          <div className="font-mono text-[12px] leading-5 text-black">
            {logoDataUrl && (
              <div className="mb-1">
                <img
                  src={logoDataUrl}
                  alt="Logo Toko"
                  className="mx-auto max-h-16 w-auto object-contain"
                />
              </div>
            )}

            <div className="text-center font-extrabold">
              {storeName || "NAMA TOKO"}
            </div>
            {cashierEnabled && (
              <div className="text-center">
                Kasir: {cashierName.trim() || "-"}
              </div>
            )}
            <div className="text-center">{displayDate}</div>

            {note.trim() !== "" && (
              <>
                <div className="my-1" />
                <div className="whitespace-pre-wrap text-center text-[11px] leading-4">
                  {note}
                </div>
              </>
            )}

            <div className="my-1 border-b border-dashed border-neutral-600" />

            <div className="space-y-1">
              {items.map((it) => (
                <div key={it.id}>
                  <div className="break-words font-semibold">{it.name}</div>
                  <div className="flex items-center justify-between tabular-nums">
                    <span>
                      {it.qty} x {formatIDR(it.price)}
                    </span>
                    <span className="font-semibold">
                      {formatIDR(it.qty * it.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-1 border-b border-dashed border-neutral-600" />

            <div className="flex items-center justify-between font-extrabold tabular-nums">
              <span>Total</span>
              <span>{formatIDR(total)}</span>
            </div>

            <div className="my-1 border-b border-dotted border-neutral-600" />

            {footerLine1.trim() !== "" && (
              <div className="text-center">{footerLine1}</div>
            )}
            {footerLine2.trim() !== "" && (
              <div className="text-center">{footerLine2}</div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
