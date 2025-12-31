"use client";

import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface LineItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
}

export default function Home() {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");

  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [showToast, setShowToast] = useState(false);

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: 1, description: "", quantity: 1, rate: 0 },
  ]);

  const addLineItem = () => {
    const newId = Math.max(...lineItems.map((item) => item.id), 0) + 1;
    setLineItems([
      ...lineItems,
      { id: newId, description: "", quantity: 1, rate: 0 },
    ]);
  };

  const removeLineItem = (id: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (
    id: number,
    field: keyof LineItem,
    value: string | number
  ) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateSubtotal = () => {
    return lineItems.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;

    // Hide buttons before capturing
    const buttons = invoiceRef.current.querySelectorAll('button');
    buttons.forEach(btn => {
      (btn as HTMLElement).style.display = 'none';
    });

    // Replace all inputs with text
    const inputs = invoiceRef.current.querySelectorAll('input');
    const inputReplacements: { input: HTMLInputElement; replacement: HTMLElement }[] = [];

    inputs.forEach(input => {
      const span = document.createElement('span');
      const value = input.value || '';

      // Copy styles from input to span
      const computedStyle = window.getComputedStyle(input);
      span.style.cssText = input.style.cssText;
      span.style.display = computedStyle.display;
      span.style.fontSize = computedStyle.fontSize;
      span.style.fontWeight = computedStyle.fontWeight;
      span.style.color = computedStyle.color;
      span.style.textAlign = computedStyle.textAlign;
      span.style.width = computedStyle.width;

      // Set the text content (empty if no value)
      span.textContent = value;

      // Replace input with span
      input.parentNode?.replaceChild(span, input);
      inputReplacements.push({ input, replacement: span });
    });

    // Capture the invoice
    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Restore inputs
    inputReplacements.forEach(({ input, replacement }) => {
      replacement.parentNode?.replaceChild(input, replacement);
    });

    // Show buttons again
    buttons.forEach(btn => {
      (btn as HTMLElement).style.display = '';
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`invoice-${invoiceNumber || 'draft'}.pdf`);

    // Show toast notification
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.0; // You can add tax calculation here
  const total = subtotal + tax;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '32px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', marginBottom: '24px', textAlign: 'right' }}>
        <button
          onClick={downloadPDF}
          style={{
            padding: '12px 24px',
            backgroundColor: '#1f2937',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Download as PDF
        </button>
      </div>
      <div ref={invoiceRef} style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '64px' }}>

          {/* Header Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '32px', borderBottom: '1px solid #e5e7eb', marginBottom: '64px' }}>
            <div style={{ width: '50%' }}>
              <input
                type="text"
                placeholder="Your Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                style={{ display: 'block', fontSize: '16px', fontWeight: '600', marginBottom: '8px', border: '0', outline: 'none', width: '100%', color: '#111827' }}
              />
              <input
                type="text"
                placeholder="Street Address"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                style={{ display: 'block', fontSize: '14px', color: '#6b7280', border: '0', outline: 'none', width: '100%', marginBottom: '4px' }}
              />
              <input
                type="tel"
                placeholder="City, State Zip"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                style={{ display: 'block', fontSize: '14px', color: '#6b7280', border: '0', outline: 'none', width: '100%' }}
              />
            </div>

            <div style={{ textAlign: 'right' }}>
              <h1 style={{ fontSize: '60px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>INVOICE</h1>
              <div style={{ fontSize: '16px', color: '#6b7280', marginTop: '16px' }}>
                # <input
                  type="text"
                  placeholder="2025"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  style={{ border: '0', outline: 'none', textAlign: 'right', width: '80px', color: '#111827', fontWeight: '600' }}
                />
              </div>
            </div>
          </div>

          {/* Bill To and Date Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', marginBottom: '48px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>Bill To:</div>
              <input
                type="text"
                placeholder="Client Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                style={{ display: 'block', fontSize: '16px', fontWeight: '600', marginBottom: '8px', border: '0', outline: 'none', width: '100%', color: '#111827' }}
              />
              <input
                type="text"
                placeholder="Client Address"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                style={{ display: 'block', fontSize: '14px', color: '#6b7280', border: '0', outline: 'none', width: '100%', marginBottom: '4px' }}
              />
              <input
                type="email"
                placeholder="client@email.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                style={{ display: 'block', fontSize: '14px', color: '#6b7280', border: '0', outline: 'none', width: '100%' }}
              />
            </div>

            <div style={{ backgroundColor: '#f9fafb', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                  <span style={{ color: '#6b7280' }}>Date:</span>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    style={{ backgroundColor: 'transparent', border: '0', outline: 'none', fontWeight: '600', color: '#111827' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#6b7280' }}>Due Date:</span>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{ backgroundColor: 'transparent', border: '0', outline: 'none', fontWeight: '600', color: '#111827' }}
                  />
                </div>
              </div>
              <div style={{ paddingTop: '16px', borderTop: '1px solid #d1d5db' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', color: '#111827', fontSize: '16px' }}>Balance Due:</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', marginBottom: '48px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#1f2937' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', color: 'white' }}>Item</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: '600', color: 'white', width: '96px' }}>Quantity</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: '600', color: 'white', width: '128px' }}>Rate</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: '600', color: 'white', width: '128px' }}>Amount</th>
                <th style={{ width: '32px' }}></th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'white' }}>
              {lineItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <input
                      type="text"
                      placeholder="Description of item or service"
                      value={item.description}
                      onChange={(e) =>
                        updateLineItem(item.id, "description", e.target.value)
                      }
                      style={{ width: '100%', border: '0', outline: 'none', color: '#111827' }}
                    />
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateLineItem(
                          item.id,
                          "quantity",
                          parseInt(e.target.value) || 0
                        )
                      }
                      style={{ width: '100%', textAlign: 'center', border: '0', outline: 'none', color: '#111827' }}
                    />
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) =>
                        updateLineItem(
                          item.id,
                          "rate",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      style={{ width: '100%', textAlign: 'right', border: '0', outline: 'none', color: '#111827' }}
                    />
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: '#111827' }}>
                    {formatCurrency(item.quantity * item.rate)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button
                      onClick={() => removeLineItem(item.id)}
                      disabled={lineItems.length === 1}
                      style={{
                        width: '24px',
                        height: '24px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#9ca3af',
                        cursor: lineItems.length === 1 ? 'not-allowed' : 'pointer',
                        opacity: lineItems.length === 1 ? 0.2 : 1,
                        fontSize: '20px'
                      }}
                      title="Remove item"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addLineItem}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1f2937',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '48px'
            }}
          >
            + Add Line Item
          </button>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '320px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', padding: '8px 0' }}>
                <span style={{ color: '#6b7280' }}>Subtotal:</span>
                <span style={{ fontWeight: '600', color: '#111827' }}>{formatCurrency(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', padding: '8px 0' }}>
                <span style={{ color: '#6b7280' }}>Tax (0%):</span>
                <span style={{ fontWeight: '600', color: '#111827' }}>{formatCurrency(tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', padding: '12px 0', borderTop: '2px solid #1f2937', marginTop: '8px' }}>
                <span style={{ color: '#111827' }}>Total:</span>
                <span style={{ color: '#111827' }}>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

      </div>

      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          backgroundColor: '#1f2937',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
          fontSize: '14px',
          fontWeight: '500',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          PDF downloaded successfully!
        </div>
      )}
    </div>
  );
}
