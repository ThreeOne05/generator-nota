"use client";

import { Item, PaperWidth } from "./types";
import {
  formatIDR,
  onlyDigits,
  parseDigitsToNumber,
  toRupiahInput,
} from "./receipt-utils";

type ReceiptFormProps = {
  // Data nota
  storeName: string;
  setStoreName: (v: string) => void;
  cashierName: string;
  setCashierName: (v: string) => void;
  cashierEnabled: boolean;
  setCashierEnabled: (v: boolean) => void;
  transactionDate: string;
  setTransactionDate: (v: string) => void;
  paperWidth: PaperWidth;
  setPaperWidth: (v: PaperWidth) => void;
  logoDataUrl: string;
  onLogoChange: (file?: File) => void;
  note: string;
  setNote: (v: string) => void;
  footerLine1: string;
  setFooterLine1: (v: string) => void;
  footerLine2: string;
  setFooterLine2: (v: string) => void;

  // Input barang (form tambah)
  itemName: string;
  setItemName: (v: string) => void;
  itemQty: number | "";
  setItemQty: (v: number | "") => void;
  itemPriceDisplay: string;
  setItemPriceDisplay: (v: string) => void;
  itemPriceNum: number | "";
  setItemPriceNum: (v: number | "") => void;

  // List items + handlers
  items: Item[];
  addItem: (e: React.FormEvent) => void;
  removeItem: (id: string) => void;
  updateItemField: (id: string, field: keyof Item, value: string) => void;

  // Utility actions
  total: number;
  handlePrint: () => void;
  resetAll: () => void;
};

export default function ReceiptForm(props: ReceiptFormProps) {
  const {
    storeName,
    setStoreName,
    cashierName,
    setCashierName,
    cashierEnabled,
    setCashierEnabled,
    transactionDate,
    setTransactionDate,
    paperWidth,
    setPaperWidth,
    logoDataUrl,
    onLogoChange,
    note,
    setNote,
    footerLine1,
    setFooterLine1,
    footerLine2,
    setFooterLine2,
    itemName,
    setItemName,
    itemQty,
    setItemQty,
    itemPriceDisplay,
    setItemPriceDisplay,
    setItemPriceNum,
    items,
    addItem,
    removeItem,
    updateItemField,
    total,
    handlePrint,
    resetAll,
  } = props;

  return (
    <section className="print:hidden rounded-2xl sm:rounded-3xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-5 shadow-2xl shadow-black/50 ring-1 ring-amber-500/10 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/40">
      <h2 className="text-base sm:text-lg font-semibold text-amber-300">
        Data Nota
      </h2>

      <div className="mt-4 grid gap-3">
        <div className="grid items-start gap-2 sm:grid-cols-3">
          <label className="pt-1.5 text-sm text-neutral-300">
            Logo Toko (opsional)
          </label>
          <div className="sm:col-span-2 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onLogoChange(e.target.files?.[0])}
                className="block w-full rounded-lg border border-neutral-800 bg-neutral-900 file:mr-0 sm:file:mr-3 file:rounded-md file:border-0 file:bg-amber-500 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-black hover:file:bg-amber-400 text-neutral-100 outline-none"
              />
              {logoDataUrl && (
                <button
                  type="button"
                  onClick={() => onLogoChange(undefined)}
                  className="inline-flex items-center justify-center rounded-lg border border-red-500 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
                >
                  Hapus Logo
                </button>
              )}
            </div>
            {logoDataUrl && (
              <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-2">
                <img
                  src={logoDataUrl}
                  alt="Logo Toko"
                  className="mx-auto max-h-24 w-auto object-contain"
                />
              </div>
            )}
            <p className="text-xs text-neutral-500">
              Rekomendasi: Gunakan Background transparan
            </p>
          </div>
        </div>

        {/* Nama kasir + toggle tampilkan */}
        <div className="grid items-center gap-2 sm:grid-cols-3">
          <label htmlFor="cashierName" className="text-sm text-neutral-300">
            Nama Kasir
          </label>
          <div className="sm:col-span-2 flex items-center gap-3">
            <input
              id="cashierName"
              type="text"
              value={cashierName}
              onChange={(e) => setCashierName(e.target.value)}
              placeholder="Contoh: Aikira"
              disabled={!cashierEnabled}
              className={`w-full rounded-lg border px-3 py-2 outline-none ${
                cashierEnabled
                  ? "border-neutral-800 bg-neutral-900 text-neutral-100 placeholder-neutral-500 focus:border-amber-400"
                  : "border-neutral-800 bg-neutral-800/50 text-neutral-400 placeholder-neutral-500 cursor-not-allowed"
              }`}
            />
            <label className="inline-flex items-center gap-2 text-xs text-neutral-300 select-none">
              <input
                type="checkbox"
                className="h-4 w-4 accent-amber-500"
                checked={cashierEnabled}
                onChange={(e) => setCashierEnabled(e.target.checked)}
              />
              KASIR
            </label>
          </div>
        </div>

        <div className="grid items-center gap-2 sm:grid-cols-3">
          <label htmlFor="storeName" className="text-sm text-neutral-300">
            Nama Toko
          </label>
          <input
            id="storeName"
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Contoh: Toko Aikira"
            className="sm:col-span-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 placeholder-neutral-500 outline-none focus:border-amber-400"
          />
        </div>

        <div className="grid items-center gap-2 sm:grid-cols-3">
          <label htmlFor="transactionDate" className="text-sm text-neutral-300">
            Tanggal Transaksi
          </label>
          <input
            id="transactionDate"
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            className="sm:col-span-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 outline-none focus:border-amber-400"
          />
        </div>

        <div className="grid items-start gap-2 sm:grid-cols-3">
          <label htmlFor="note" className="pt-1.5 text-sm text-neutral-300">
            Keterangan (opsional)
          </label>
          <textarea
            id="note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: Alamat toko, catatan transaksi, atau info lainnya."
            className="sm:col-span-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 placeholder-neutral-500 outline-none focus:border-amber-400"
          />
        </div>

        <div className="grid items-center gap-2 sm:grid-cols-3">
          <label htmlFor="footerLine1" className="text-sm text-neutral-300">
            Baris 1
          </label>
          <input
            id="footerLine1"
            type="text"
            value={footerLine1}
            onChange={(e) => setFooterLine1(e.target.value)}
            placeholder="Contoh: Terima kasih"
            className="sm:col-span-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 placeholder-neutral-500 outline-none focus:border-amber-400"
          />
        </div>
        <div className="grid items-center gap-2 sm:grid-cols-3">
          <label htmlFor="footerLine2" className="text-sm text-neutral-300">
            Baris 2
          </label>
          <input
            id="footerLine2"
            type="text"
            value={footerLine2}
            onChange={(e) => setFooterLine2(e.target.value)}
            placeholder="Contoh: Barang yang sudah dibeli tidak dapat dikembalikan"
            className="sm:col-span-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 placeholder-neutral-500 outline-none focus:border-amber-400"
          />
        </div>
        <p className="text-xs text-neutral-500">
          Kosongkan jika tidak ingin ditampilkan.
        </p>

        <div className="grid items-center gap-2 sm:grid-cols-3">
          <label htmlFor="paperWidth" className="text-sm text-neutral-300">
            Lebar Kertas
          </label>
          <select
            id="paperWidth"
            value={paperWidth}
            onChange={(e) => props.setPaperWidth(e.target.value as PaperWidth)}
            className="sm:col-span-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 outline-none focus:border-amber-400"
          >
            <option value="58">58 mm (umum)</option>
            <option value="80">80 mm</option>
          </select>
        </div>
      </div>

      <hr className="my-4 border-neutral-800/80" />

      <h3 className="text-sm sm:text-base font-semibold text-neutral-200">
        Tambah Barang
      </h3>
      <form
        onSubmit={addItem}
        className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-5"
      >
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Nama"
          required
          className="sm:col-span-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 placeholder-neutral-500 outline-none focus:border-amber-400"
        />
        <input
          type="text"
          inputMode="numeric"
          value={itemQty}
          onChange={(e) => setItemQty(parseDigitsToNumber(e.target.value))}
          placeholder="Jumlah"
          required
          className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-right text-neutral-100 placeholder-neutral-500 outline-none focus:border-amber-400"
        />
        <input
          type="text"
          inputMode="numeric"
          value={itemPriceDisplay}
          onChange={(e) => {
            const digits = onlyDigits(e.target.value);
            if (digits === "") {
              setItemPriceNum("");
              setItemPriceDisplay("");
            } else {
              const n = Number(digits);
              setItemPriceNum(n);
              setItemPriceDisplay(toRupiahInput(n));
            }
          }}
          placeholder="Rp"
          required
          className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-right text-neutral-100 placeholder-neutral-500 outline-none focus:border-amber-400"
        />
        <button
          type="submit"
          className="w-full sm:w-auto rounded-xl bg-amber-500 px-4 py-2 font-semibold text-black shadow-md shadow-amber-900/30 ring-1 ring-amber-300/30 transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
        >
          Tambah
        </button>
      </form>

      <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-800 shadow-lg shadow-black/30">
        <div className="-mx-4 sm:mx-0 overflow-x-auto">
          <table className="min-w-[560px] sm:min-w-0 w-full text-sm">
            <thead className="bg-neutral-900/70 text-neutral-300">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Barang</th>
                <th className="px-3 py-2 text-right font-medium">Jumlah</th>
                <th className="px-3 py-2 text-right font-medium">Harga</th>
                <th className="px-3 py-2 text-right font-medium">Subtotal</th>
                <th className="px-3 py-2 text-center font-medium">Hapus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-neutral-400"
                  >
                    Belum ada item
                  </td>
                </tr>
              ) : (
                items.map((it) => (
                  <tr key={it.id}>
                    <td className="px-3 py-2">
                      <input
                        className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-neutral-100 outline-none focus:border-amber-400"
                        value={it.name}
                        onChange={(e) =>
                          updateItemField(it.id, "name", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input
                        type="text"
                        inputMode="numeric"
                        className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-right text-neutral-100 outline-none focus:border-amber-400"
                        value={it.qty}
                        onChange={(e) => {
                          const digits = onlyDigits(e.target.value);
                          updateItemField(it.id, "qty", digits);
                        }}
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input
                        type="text"
                        inputMode="numeric"
                        className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-right text-neutral-100 outline-none focus:border-amber-400"
                        value={toRupiahInput(it.price)}
                        onChange={(e) => {
                          const digits = onlyDigits(e.target.value);
                          updateItemField(it.id, "price", digits);
                        }}
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatIDR(it.qty * it.price)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        className="inline-flex items-center rounded-md border border-red-500 px-3 py-1 text-sm font-medium text-red-400 hover:bg-red-500/10"
                        onClick={() => removeItem(it.id)}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-neutral-900/70">
              <tr>
                <th
                  colSpan={3}
                  className="px-3 py-2 text-right font-semibold text-neutral-200"
                >
                  Total
                </th>
                <th className="px-3 py-2 text-right font-semibold text-amber-300">
                  {formatIDR(total)}
                </th>
                <th />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          onClick={handlePrint}
          disabled={items.length === 0}
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2 font-semibold text-black shadow-md shadow-amber-900/30 ring-1 ring-amber-300/30 transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Print
        </button>
        <button
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-neutral-800 px-4 py-2 text-neutral-100 hover:bg-neutral-800/60"
          onClick={resetAll}
        >
          Reset
        </button>
      </div>
    </section>
  );
}
