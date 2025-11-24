# HCI Mobile App

A React + TypeScript mobile app built from Figma designs.

## Framework & Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom components based on shadcn/ui patterns

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

or

```bash
npm start
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── App.tsx                 # Main app component with routing logic
├── main.tsx                # Entry point
├── index.html              # HTML template
├── globals.css             # Global styles and Tailwind directives
├── ui/                     # Reusable UI components (shadcn/ui style)
├── figma/                  # Figma-specific components
└── [Screen Components]     # Individual screen components
```

## Features

- Ride booking flow
- Delivery/pickup flow
- Shop browsing
- Location selection
- Driver tracking
- Multiple payment methods

## Notes

- Some UI components in the `ui/` folder are not currently used and may have missing dependencies. They're excluded from TypeScript checking.
- The app uses custom icon components instead of external icon libraries.
- Map functionality uses OpenStreetMap tiles.

## Remaining Fixes Needed

1. **Missing Dependencies**: Some UI components reference external libraries (Radix UI, Lucide React, etc.) that aren't installed. These components are currently excluded from the build. If you need them, install the required packages:
   - `@radix-ui/react-*` packages
   - `lucide-react`
   - `class-variance-authority`
   - `react-hook-form`
   - And others as needed

2. **TypeScript Warnings**: Some unused variables may appear. These are from the Figma export and can be cleaned up as needed.

3. **Assets**: If the design includes images or other assets, make sure they're placed in a `public/` folder and referenced correctly.

