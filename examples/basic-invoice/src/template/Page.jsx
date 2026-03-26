import React from 'react';
import { Editable } from 'uhuu-components';
import { getTheme } from '../themes';

const fmtCurrency = (amount, currency = 'EUR') =>
  new Intl.NumberFormat('en-EU', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);

const fmtDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const fmtMethod = (method) =>
  method ? method.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '';

export function InvoicePage({ payload, pagePayload }) {
  const invoice = payload?.invoice;
  const theme = getTheme(pagePayload?.theme);

  if (!invoice) return null;

  const {
    invoiceNumber,
    issueDate,
    dueDate,
    currency,
    seller,
    buyer,
    lineItems = [],
    totals,
    paymentTerms,
    notes,
    references,
  } = invoice;

  return (
    <div
      className="w-full h-full px-10 py-8 text-[11px] leading-relaxed overflow-hidden"
      style={{ fontFamily: theme.fontSans, background: theme.background, color: theme.foreground }}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div
        className="flex justify-between items-start mb-8 pb-5"
        style={{ borderBottom: `2px solid ${theme.primary}` }}
      >
        <div className="space-y-0.5">
          <Editable dialog={{ path: 'invoice.seller.name' }}>
            <div className="text-xl font-bold" style={{ color: theme.primary }}>
              {seller.name}
            </div>
          </Editable>
          {seller.vatId && (
            <div style={{ color: theme.mutedForeground }}>VAT: {seller.vatId}</div>
          )}
          <div>{seller.address.street}</div>
          <div>{seller.address.postalCode} {seller.address.city}, {seller.address.country}</div>
          {seller.contact?.email && <div>{seller.contact.email}</div>}
          {seller.contact?.phone && <div>{seller.contact.phone}</div>}
        </div>

        <div className="text-right space-y-1">
          <div className="text-3xl font-bold tracking-widest uppercase" style={{ color: theme.primary }}>
            Invoice
          </div>
          <Editable dialog={{ path: 'invoice.invoiceNumber' }}>
            <div className="text-sm font-semibold">{invoiceNumber}</div>
          </Editable>
          <div style={{ color: theme.mutedForeground }}>
            Issue date: <span style={{ color: theme.foreground }}>{fmtDate(issueDate)}</span>
          </div>
          <div style={{ color: theme.mutedForeground }}>
            Due date:{' '}
            <span className="font-semibold" style={{ color: theme.primary }}>{fmtDate(dueDate)}</span>
          </div>
        </div>
      </div>

      {/* ── Seller / Buyer ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-10 mb-8">
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: theme.mutedForeground }}>
            From
          </div>
          <div className="font-semibold">{seller.name}</div>
          <div>{seller.address.street}</div>
          <div>{seller.address.postalCode} {seller.address.city}</div>
          <div>{seller.address.country}</div>
        </div>

        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: theme.mutedForeground }}>
            Bill To
          </div>
          <Editable dialog={{ path: 'invoice.buyer' }}>
            <div className="font-semibold">{buyer.name}</div>
            {buyer.vatId && <div style={{ color: theme.mutedForeground }}>VAT: {buyer.vatId}</div>}
            <div>{buyer.address.street}</div>
            <div>{buyer.address.postalCode} {buyer.address.city}</div>
            <div>{buyer.address.country}</div>
            {buyer.contact?.email && <div>{buyer.contact.email}</div>}
          </Editable>
        </div>
      </div>

      {/* ── References ───────────────────────────────────────────── */}
      {references && Object.values(references).some(Boolean) && (
        <div className="flex gap-6 mb-5" style={{ color: theme.mutedForeground }}>
          {references.purchaseOrder && (
            <span>Purchase Order: <strong style={{ color: theme.foreground }}>{references.purchaseOrder}</strong></span>
          )}
          {references.contract && (
            <span>Contract: <strong style={{ color: theme.foreground }}>{references.contract}</strong></span>
          )}
        </div>
      )}

      {/* ── Line Items ───────────────────────────────────────────── */}
      <table className="w-full mb-6" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: theme.primary, color: theme.primaryForeground }}>
            {['Description', 'Qty', 'Unit', 'Unit Price', 'Tax', 'Net', 'Gross'].map((h, i) => (
              <th key={h} className={`py-2 px-3 text-[9px] font-semibold uppercase tracking-wider ${i === 0 ? 'text-left' : 'text-right'}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, i) => (
            <tr
              key={item.id}
              style={{
                background: i % 2 === 0 ? theme.muted : theme.background,
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              <td className="py-2 px-3">{item.description}</td>
              <td className="py-2 px-3 text-right">{item.quantity}</td>
              <td className="py-2 px-3 text-right" style={{ color: theme.mutedForeground }}>{item.unitOfMeasure}</td>
              <td className="py-2 px-3 text-right">{fmtCurrency(item.unitPrice, currency)}</td>
              <td className="py-2 px-3 text-right" style={{ color: theme.mutedForeground }}>
                {item.tax ? `${item.tax.type} ${(item.tax.rate * 100).toFixed(0)}%` : '—'}
              </td>
              <td className="py-2 px-3 text-right">{fmtCurrency(item.totalNetAmount, currency)}</td>
              <td className="py-2 px-3 text-right font-semibold">{fmtCurrency(item.totalGrossAmount, currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Totals ───────────────────────────────────────────────── */}
      <div className="flex justify-end mb-8">
        <div className="w-60 space-y-1">
          <div className="flex justify-between py-1" style={{ borderBottom: `1px solid ${theme.border}` }}>
            <span style={{ color: theme.mutedForeground }}>Net Amount</span>
            <span>{fmtCurrency(totals.netAmount, currency)}</span>
          </div>
          <div className="flex justify-between py-1" style={{ borderBottom: `1px solid ${theme.border}` }}>
            <span style={{ color: theme.mutedForeground }}>Tax Amount</span>
            <span>{fmtCurrency(totals.taxAmount, currency)}</span>
          </div>
          {totals.grossAmount !== totals.payableAmount && (
            <div className="flex justify-between py-1" style={{ borderBottom: `1px solid ${theme.border}` }}>
              <span style={{ color: theme.mutedForeground }}>Gross Amount</span>
              <span>{fmtCurrency(totals.grossAmount, currency)}</span>
            </div>
          )}
          <div
            className="flex justify-between py-2 px-3 font-bold text-[13px]"
            style={{ background: theme.primary, color: theme.primaryForeground, borderRadius: theme.radius }}
          >
            <span>Total Due</span>
            <span>{fmtCurrency(totals.payableAmount, currency)}</span>
          </div>
        </div>
      </div>

      {/* ── Payment Details ──────────────────────────────────────── */}
      {paymentTerms && (
        <div
          className="mb-6 p-4"
          style={{ background: theme.muted, border: `1px solid ${theme.border}`, borderRadius: theme.radius }}
        >
          <div className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: theme.mutedForeground }}>
            Payment Details
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span style={{ color: theme.mutedForeground }}>Method: </span>
              <span className="font-medium">{fmtMethod(paymentTerms.method)}</span>
            </div>
            <div>
              <span style={{ color: theme.mutedForeground }}>Due date: </span>
              <span className="font-semibold">{fmtDate(paymentTerms.dueDate)}</span>
            </div>
            {paymentTerms.bankDetails?.iban && (
              <div>
                <span style={{ color: theme.mutedForeground }}>IBAN: </span>
                <span style={{ fontFamily: theme.fontMono }}>{paymentTerms.bankDetails.iban}</span>
              </div>
            )}
            {paymentTerms.bankDetails?.bic && (
              <div>
                <span style={{ color: theme.mutedForeground }}>BIC: </span>
                <span style={{ fontFamily: theme.fontMono }}>{paymentTerms.bankDetails.bic}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Notes ────────────────────────────────────────────────── */}
      {notes && (
        <Editable dialog={{ path: 'invoice.notes' }}>
          <div style={{ color: theme.mutedForeground }}>{notes}</div>
        </Editable>
      )}
    </div>
  );
}
