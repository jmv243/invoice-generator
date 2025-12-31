# Invoice Generator

A modern, web-based invoice generator built with Next.js that allows you to create professional invoices and export them as PDFs.

## Features

- **Interactive Invoice Creation**: Create invoices with an intuitive form-based interface
- **PDF Export**: Download your invoices as professionally formatted PDF files using html2canvas and jsPDF
- **Dynamic Line Items**: Add, remove, and edit multiple line items with automatic calculations
- **Professional Design**: Clean, minimalist invoice layout with proper formatting
- **Real-time Calculations**: Automatic subtotal and total calculations as you type
- **Customizable Details**:
  - Business/personal information (name, address, phone)
  - Client information (name, address, email)
  - Invoice number and dates (issue date, due date)
  - Item descriptions, quantities, and rates

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **PDF Generation**: jsPDF + html2canvas
- **Runtime**: React 19

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm or another package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to start creating invoices

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Run the production server
- `npm run lint` - Run ESLint to check code quality

## Usage

1. Fill in your business information in the top left
2. Enter your client's information in the "Bill To" section
3. Set the invoice number, date, and due date
4. Add line items for services or products (description, quantity, rate)
5. Review the automatically calculated totals
6. Click "Download as PDF" to export your invoice

## Project Structure

```
invoice-generator/
├── app/
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main invoice generator component
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```
