import React from 'react';
import { Editable } from 'uhuu-components';
import { getTheme } from '../themes';

const fmt = (value, currency = 'EUR') =>
  new Intl.NumberFormat('en-EU', { style: 'currency', currency, minimumFractionDigits: 2 }).format(value ?? 0);

const fmtDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const fmtMethod = (method) =>
  method ? method.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '';

const STATUS_STYLES = {
  paid:            { bg: '#dcfce7', color: '#166534' },
  open:            { bg: '#dbeafe', color: '#1e40af' },
  overdue:         { bg: '#fee2e2', color: '#991b1b' },
  draft:           { bg: '#f3f4f6', color: '#4b5563' },
  partiallyPaid:   { bg: '#fef9c3', color: '#854d0e' },
  void:            { bg: '#f3f4f6', color: '#9ca3af' },
};

function OrgBlock({ org, label, path, theme }) {
  if (!org) return null;
  const addr = org.address ?? {};
  return (
    <div>
      <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: theme.mutedForeground }}>
        {label}
      </div>
      <Editable dialog={{ path }}>
        <div className="font-semibold">{org.name}</div>
        {org.legalName && org.legalName !== org.name && (
          <div style={{ color: theme.mutedForeground }}>{org.legalName}</div>
        )}
        {org.taxId && <div style={{ color: theme.mutedForeground }}>Tax ID: {org.taxId}</div>}
        {addr.streetAddress && <div>{addr.streetAddress}</div>}
        {(addr.postalCode || addr.addressLocality) && (
          <div>
            {[addr.postalCode, addr.addressLocality, addr.addressRegion].filter(Boolean).join(' ')}
            {addr.addressCountry && `, ${addr.addressCountry}`}
          </div>
        )}
        {org.email && <div>{org.email}</div>}
        {org.telephone && <div>{org.telephone}</div>}
      </Editable>
    </div>
  );
}

export function InvoicePage({ payload, pagePayload }) {
  const invoice = payload?.invoice;
  const theme = getTheme(pagePayload?.theme);

  if (!invoice) return null;

  const {
    invoiceNumber,
    purchaseOrderNumber,
    issueDate,
    dueDate,
    status,
    paymentTerms,
    issuer,
    billTo,
    lineItems = [],
    taxes = [],
    totals = {},
    paymentSummary,
    notes,
  } = invoice;

  const currency = totals.currency ?? 'EUR';
  const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES.draft;

  return (
    <div
      className="w-full h-full px-10 py-8 text-[11px] leading-relaxed overflow-hidden"
      style={{ fontFamily: theme.fontSans, background: theme.background, color: theme.foreground }}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex justify-between items-start mb-8 pb-5" style={{ borderBottom: `2px solid ${theme.primary}` }}>
        <div className="space-y-0.5">
          <div className="text-xl font-bold" style={{ color: theme.primary }}>
            {issuer?.name}
          </div>
          {issuer?.taxId && <div style={{ color: theme.mutedForeground }}>Tax ID: {issuer.taxId}</div>}
          {issuer?.address?.streetAddress && <div>{issuer.address.streetAddress}</div>}
          {issuer?.address && (
            <div>
              {[issuer.address.postalCode, issuer.address.addressLocality, issuer.address.addressRegion].filter(Boolean).join(' ')}
              {issuer.address.addressCountry && `, ${issuer.address.addressCountry}`}
            </div>
          )}
          {issuer?.email && <div>{issuer.email}</div>}
          {issuer?.telephone && <div>{issuer.telephone}</div>}
        </div>

        <div className="text-right space-y-1">
          <div className="text-3xl font-bold tracking-widest uppercase" style={{ color: theme.primary }}>
            Invoice
          </div>
          <Editable dialog={{ path: 'invoice.invoiceNumber' }}>
            <div className="text-sm font-semibold">{invoiceNumber}</div>
          </Editable>
          {purchaseOrderNumber && (
            <div style={{ color: theme.mutedForeground }}>PO: {purchaseOrderNumber}</div>
          )}
          <div style={{ color: theme.mutedForeground }}>
            Issue: <span style={{ color: theme.foreground }}>{fmtDate(issueDate)}</span>
          </div>
          {dueDate && (
            <div style={{ color: theme.mutedForeground }}>
              Due: <span className="font-semibold" style={{ color: theme.primary }}>{fmtDate(dueDate)}</span>
            </div>
          )}
          {status && (
            <div className="inline-flex mt-1">
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ background: statusStyle.bg, color: statusStyle.color }}
              >
                {status}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Issuer / Bill To ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-10 mb-8">
        <OrgBlock org={issuer} label="From" path="invoice.issuer" theme={theme} />
        <OrgBlock org={billTo} label="Bill To" path="invoice.billTo" theme={theme} />
      </div>

      {/* ── Line Items ───────────────────────────────────────────── */}
      <table className="w-full mb-4" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: theme.primary, color: theme.primaryForeground }}>
            {['Description', 'Category', 'Qty', 'Unit Price', 'Amount'].map((h, i) => (
              <th key={h} className={`py-2 px-3 text-[9px] font-semibold uppercase tracking-wider ${i === 0 ? 'text-left' : 'text-right'}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? theme.muted : theme.background, borderBottom: `1px solid ${theme.border}` }}>
              <td className="py-2 px-3">{item.description}</td>
              <td className="py-2 px-3 text-right" style={{ color: theme.mutedForeground }}>{item.category ?? '—'}</td>
              <td className="py-2 px-3 text-right">{item.quantity}</td>
              <td className="py-2 px-3 text-right">{fmt(item.unitPrice?.value, item.unitPrice?.currency ?? currency)}</td>
              <td className="py-2 px-3 text-right font-semibold">{fmt(item.amount?.value, item.amount?.currency ?? currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Totals ───────────────────────────────────────────────── */}
      <div className="flex justify-end mb-6">
        <div className="w-64 space-y-1">
          <div className="flex justify-between py-1" style={{ borderBottom: `1px solid ${theme.border}` }}>
            <span style={{ color: theme.mutedForeground }}>Subtotal</span>
            <span>{fmt(totals.subtotal, currency)}</span>
          </div>
          {taxes.map((tax, i) => (
            <div key={i} className="flex justify-between py-1" style={{ borderBottom: `1px solid ${theme.border}` }}>
              <span style={{ color: theme.mutedForeground }}>
                {tax.name}{tax.rate != null ? ` (${(tax.rate * 100).toFixed(0)}%)` : ''}
              </span>
              <span>{fmt(tax.amount?.value, tax.amount?.currency ?? currency)}</span>
            </div>
          ))}
          {totals.discountTotal > 0 && (
            <div className="flex justify-between py-1" style={{ borderBottom: `1px solid ${theme.border}` }}>
              <span style={{ color: theme.mutedForeground }}>Discount</span>
              <span>−{fmt(totals.discountTotal, currency)}</span>
            </div>
          )}
          <div
            className="flex justify-between py-2 px-3 font-bold text-[13px]"
            style={{ background: theme.primary, color: theme.primaryForeground, borderRadius: theme.radius }}
          >
            <span>Total</span>
            <span>{fmt(totals.grandTotal, currency)}</span>
          </div>
        </div>
      </div>

      {/* ── Payment ──────────────────────────────────────────────── */}
      {paymentSummary && (
        <div className="mb-5 p-4" style={{ background: theme.muted, border: `1px solid ${theme.border}`, borderRadius: theme.radius }}>
          <div className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: theme.mutedForeground }}>
            Payment
          </div>
          <div className="grid grid-cols-2 gap-3">
            {paymentSummary.paymentMethod && (
              <div>
                <span style={{ color: theme.mutedForeground }}>Method: </span>
                <span className="font-medium">{fmtMethod(paymentSummary.paymentMethod)}</span>
              </div>
            )}
            {paymentTerms && (
              <div>
                <span style={{ color: theme.mutedForeground }}>Terms: </span>
                <span className="font-medium">{paymentTerms}</span>
              </div>
            )}
            {paymentSummary.amountPaid?.value > 0 && (
              <div>
                <span style={{ color: theme.mutedForeground }}>Paid: </span>
                <span className="font-semibold">{fmt(paymentSummary.amountPaid.value, paymentSummary.amountPaid.currency ?? currency)}</span>
              </div>
            )}
            {paymentSummary.amountOutstanding?.value > 0 && (
              <div>
                <span style={{ color: theme.mutedForeground }}>Outstanding: </span>
                <span className="font-bold" style={{ color: theme.primary }}>
                  {fmt(paymentSummary.amountOutstanding.value, paymentSummary.amountOutstanding.currency ?? currency)}
                </span>
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
