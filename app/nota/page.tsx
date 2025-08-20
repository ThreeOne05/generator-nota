"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ReceiptForm from "../components/ReceiptForm";
import ReceiptPreview from "../components/ReceiptPreview";
import { Item, PaperWidth } from "../components/types";
import {
  formatFromDateInput,
  formatLongDateID,
} from "../components/receipt-utils";

const genId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

export default function Page() {
  const [storeName, setStoreName] = useState("");
  const [cashierName, setCashierName] = useState("");
  const [cashierEnabled, setCashierEnabled] = useState<boolean>(true);
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
        setCashierEnabled(
          typeof parsed.cashierEnabled === "boolean"
            ? parsed.cashierEnabled
            : true
        );
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
      cashierEnabled,
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
    cashierEnabled,
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
      const qtyNum = typeof itemQty === "number" ? itemQty : 0;
      if (
        !itemName.trim() ||
        qtyNum < 1 ||
        itemPriceNum === "" ||
        Number.isNaN(Number(itemPriceNum))
      ) {
        return;
      }
      const id = genId();
      setItems((prev) => [
        ...prev,
        {
          id,
          name: itemName.trim(),
          qty: qtyNum,
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
      setCashierEnabled(true);
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
          <ReceiptForm
            storeName={storeName}
            setStoreName={setStoreName}
            cashierName={cashierName}
            setCashierName={setCashierName}
            cashierEnabled={cashierEnabled}
            setCashierEnabled={setCashierEnabled}
            transactionDate={transactionDate}
            setTransactionDate={setTransactionDate}
            paperWidth={paperWidth}
            setPaperWidth={setPaperWidth}
            logoDataUrl={logoDataUrl}
            onLogoChange={onLogoChange}
            note={note}
            setNote={setNote}
            footerLine1={footerLine1}
            setFooterLine1={setFooterLine1}
            footerLine2={footerLine2}
            setFooterLine2={setFooterLine2}
            itemName={itemName}
            setItemName={setItemName}
            itemQty={itemQty}
            setItemQty={setItemQty}
            itemPriceDisplay={itemPriceDisplay}
            setItemPriceDisplay={setItemPriceDisplay}
            itemPriceNum={itemPriceNum}
            setItemPriceNum={setItemPriceNum}
            items={items}
            addItem={addItem}
            removeItem={removeItem}
            updateItemField={updateItemField}
            total={total}
            handlePrint={handlePrint}
            resetAll={resetAll}
          />

          <ReceiptPreview
            logoDataUrl={logoDataUrl}
            storeName={storeName}
            cashierEnabled={cashierEnabled}
            cashierName={cashierName}
            displayDate={displayDate}
            items={items}
            total={total}
            receiptWidthClass={receiptWidthClass}
            footerLine1={footerLine1}
            footerLine2={footerLine2}
            note={note} // TAMBAH: kirim note ke preview
          />
        </div>
      </main>
    </div>
  );
}
