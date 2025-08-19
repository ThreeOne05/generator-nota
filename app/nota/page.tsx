"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Item = {
  id: string;
  name: string;
  qty: number;
  price: number;
};

type PaperWidth = "58" | "80";

const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatNumID = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatLongDateID = (date: Date) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

const formatFromDateInput = (dateStr: string) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  return formatLongDateID(date);
};

// Helpers untuk input rupiah
const onlyDigits = (s: string) => s.replace(/\D/g, "");
const toRupiahInput = (n: number) => `Rp ${formatNumID(n)}`;

export default function Page() {
  const [storeName, setStoreName] = useState("");
  const [cashierName, setCashierName] = useState("");
  const [transactionDate, setTransactionDate] = useState<string>("");
  const [paperWidth, setPaperWidth] = useState<PaperWidth>("58");

  const [logoDataUrl, setLogoDataUrl] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const [footerLine1, setFooterLine1] = useState<string>("Terima kasih");
  const [footerLine2, setFooterLine2] = useState<string>(
    "Barang yang sudah dibeli tidak dapat dikembalikan"
  );

  const [itemName, setItemName] = useState("");
  const [itemQty, setItemQty] = useState<number | "">("");
  // Ubah input harga: pisahkan tampilan (string "Rp ...") dan nilai angka
  const [itemPriceDisplay, setItemPriceDisplay] = useState<string>("");
  const [itemPriceNum, setItemPriceNum] = useState<number | "">("");

  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("receipt_state_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        setStoreName(parsed.storeName ?? "");
        setCashierName(parsed.cashierName ?? "");
        setTransactionDate(parsed.transactionDate ?? "");
        setPaperWidth(parsed.paperWidth ?? "58");
        setLogoDataUrl(parsed.logoDataUrl ?? "");
        setNote(parsed.note ?? "");
        setFooterLine1(
          typeof parsed.footerLine1 === "string"
            ? parsed.footerLine1
            : "Terima kasih"
        );
        setFooterLine2(
          typeof parsed.footerLine2 === "string"
            ? parsed.footerLine2
            : "Barang yang sudah dibeli tidak dapat dikembalikan"
        );
        setItems(Array.isArray(parsed.items) ? parsed.items : []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const data = {
      storeName,
      cashierName,
      transactionDate,
      paperWidth,
      logoDataUrl,
      note,
      footerLine1,
      footerLine2,
      items,
    };
    try {
      localStorage.setItem("receipt_state_v1", JSON.stringify(data));
    } catch {}
  }, [
    storeName,
    cashierName,
    transactionDate,
    paperWidth,
    logoDataUrl,
    note,
    footerLine1,
    footerLine2,
    items,
  ]);

  const addItem = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (
        !itemName ||
        !itemQty ||
        itemPriceNum === "" ||
        Number.isNaN(Number(itemPriceNum))
      ) {
        return;
      }
      const id = crypto.randomUUID();
      setItems((prev) => [
        ...prev,
        {
          id,
          name: itemName.trim(),
          qty: Number(itemQty),
          price: Number(itemPriceNum),
        },
      ]);
      setItemName("");
      setItemQty("");
      setItemPriceNum("");
      setItemPriceDisplay("");
    },
    [itemName, itemQty, itemPriceNum]
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const updateItemField = useCallback(
    (id: string, field: keyof Item, value: string) => {
      setItems((prev) =>
        prev.map((it) =>
          it.id === id
            ? {
                ...it,
                [field]:
                  field === "qty" || field === "price"
                    ? Number(value || 0)
                    : value,
              }
            : it
        )
      );
    },
    []
  );

  const total = useMemo(
    () => items.reduce((acc, it) => acc + it.qty * it.price, 0),
    [items]
  );

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const resetAll = useCallback(() => {
    if (confirm("Hapus semua data nota?")) {
      setStoreName("");
      setCashierName("");
      setTransactionDate("");
      setPaperWidth("58");
      setLogoDataUrl("");
      setNote("");
      setFooterLine1("Terima kasih");
      setFooterLine2("Barang yang sudah dibeli tidak dapat dikembalikan");
      setItems([]);
      setItemName("");
      setItemQty("");
      setItemPriceNum("");
      setItemPriceDisplay("");
      localStorage.removeItem("receipt_state_v1");
    }
  }, []);

  const onLogoChange = useCallback(async (file?: File) => {
    if (!file) {
      setLogoDataUrl("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl((reader.result as string) || "");
    reader.readAsDataURL(file);
  }, []);

  const receiptWidthClass = paperWidth === "58" ? "w-[58mm]" : "w-[80mm]";
  const fallbackToday = formatLongDateID(new Date());
  const formattedTrxDate =
    transactionDate && formatFromDateInput(transactionDate);
  const displayDate = formattedTrxDate || fallbackToday;

  return (
    <div className="relative min-h-screen bg-neutral-950 px-3 py-6 print:bg-white print:p-0 print:min-h-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_280px_at_center_-120px,rgba(245,158,11,0.18),transparent_60%)] print:hidden" />

      <main className="relative mx-auto w-full max-w-6xl">
        <header className="mb-5 text-center print:hidden">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Generator Thermal
            </span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-300">
            Made In Aikira
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
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
                <label
                  htmlFor="cashierName"
                  className="text-sm text-neutral-300"
                >
                  Nama Kasir
                </label>
                <input
                  id="cashierName"
                  type="text"
                  value={cashierName}
                  onChange={(e) => setCashierName(e.target.value)}
                  placeholder="Contoh: Aikira"
                  className="sm:col-span-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 placeholder-neutral-500 outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid items-center gap-2 sm:grid-cols-3">
                <label
                  htmlFor="transactionDate"
                  className="text-sm text-neutral-300"
                >
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
                <label
                  htmlFor="note"
                  className="pt-1.5 text-sm text-neutral-300"
                >
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
                <label
                  htmlFor="footerLine1"
                  className="text-sm text-neutral-300"
                >
                  Footer baris 1
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
                <label
                  htmlFor="footerLine2"
                  className="text-sm text-neutral-300"
                >
                  Footer baris 2
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
                Kosongkan footer jika tidak ingin ditampilkan.
              </p>

              <div className="grid items-center gap-2 sm:grid-cols-3">
                <label
                  htmlFor="paperWidth"
                  className="text-sm text-neutral-300"
                >
                  Lebar Kertas
                </label>
                <select
                  id="paperWidth"
                  value={paperWidth}
                  onChange={(e) => setPaperWidth(e.target.value as PaperWidth)}
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
                min={1}
                step={1}
                value={itemQty}
                onChange={(e) =>
                  setItemQty(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="Jumlah"
                required
                className="no-spinner rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-right text-neutral-100 placeholder-neutral-500 outline-none focus:border-amber-400"
              />
              {/* Input harga: text + format rupiah */}
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
                      <th className="px-3 py-2 text-left font-medium">
                        Barang
                      </th>
                      <th className="px-3 py-2 text-right font-medium">
                        Jumlah
                      </th>
                      <th className="px-3 py-2 text-right font-medium">
                        Harga
                      </th>
                      <th className="px-3 py-2 text-right font-medium">
                        Subtotal
                      </th>
                      <th className="px-3 py-2 text-center font-medium">
                        Hapus
                      </th>
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
                              type="number"
                              min={1}
                              step={1}
                              className="no-spinner w-full rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-right text-neutral-100 outline-none focus:border-amber-400"
                              value={it.qty}
                              onChange={(e) =>
                                updateItemField(it.id, "qty", e.target.value)
                              }
                            />
                          </td>
                          <td className="px-3 py-2 text-right">
                            {/* Harga edit: text rupiah */}
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

          <section className="rounded-2xl sm:rounded-3xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-5 shadow-2xl shadow-black/50 ring-1 ring-amber-500/10 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/40">
            <h2 className="mb-3 text-base sm:text-lg font-semibold text-amber-300 print:hidden">
              Preview Nota
            </h2>

            <div
              className={`mx-auto rounded-xl bg-white p-2 text-neutral-900 shadow-2xl shadow-black/40 ring-1 ring-neutral-200 print:m-0 print:shadow-none print:ring-0 ${receiptWidthClass}`}
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
                <div className="text-center">Kasir: {cashierName || "-"}</div>
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
                  <div className="text-center text-neutral-500">
                    {footerLine2}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
