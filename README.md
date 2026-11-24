# The Golden Frame – Premium Snooker & Pool Lounge Website

A pixel-perfect, production-quality React + Vite website for **The Golden Frame**, Silvassa's premier snooker & pool lounge located in Khariwad, Silvassa. Built with a cinematic dark aesthetic, gold accents, and premium animations.

## 🚀 Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** – custom luxury design tokens
- **Framer Motion** – scroll reveals, page transitions, hover effects
- **Swiper JS** – testimonial carousel
- **React Router DOM v6** – multi-page routing
- **React Icons** – icon library
- **GSAP** – available for advanced animations

## ✨ Features

- Animated luxury loader with progress bar
- Sticky transparent navbar with blur-on-scroll
- Fullscreen hero with particle canvas
- Masonry gallery with category filters and lightbox
- Swiper testimonial slider with autoplay
- Booking form with validation
- Annual/monthly pricing toggle
- Animated counters
- Scroll progress bar
- Back-to-top button
- Fully responsive (mobile-first)
- Smooth page transitions with AnimatePresence
- Gold glow shadows and glassmorphism cards
- Cormorant Garamond headings + Poppins body

## 📁 Project Structure

```
golden-frame/
├── public/
├── src/
│   ├── components/
│   │   ├── common/      – Button, SectionTitle, Loader, Container
│   │   ├── layout/      – Navbar, Footer, MobileMenu, ScrollToTop, ScrollProgress
│   │   └── home/        – Hero, About, Services, Pricing, Gallery, Testimonials, Booking, CTA, Partners
│   ├── pages/           – Home, About, Gallery, Pricing, Contact, NotFound
│   ├── routes/          – AppRoutes
│   ├── hooks/           – useScroll, useAnimation, useWindowSize
│   ├── utils/           – constants, animations, helpers
│   ├── data/            – servicesData, testimonialsData, galleryData, pricingData
│   └── styles/          – index.css (Tailwind + custom luxury CSS)
```

## 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#0B0B0B` |
| Surface | `#111111` |
| Gold | `#D4AF37` |
| Soft Gold | `#F5D76E` |
| Ivory | `#F5F5F5` |
| Gray | `#B0B0B0` |
| Heading Font | Cormorant Garamond |
| Body Font | Poppins |

## 📄 Pages

| Page | Route |
|---|---|
| Home | `/` |
| About | `/about` |
| Gallery | `/gallery` |
| Pricing | `/pricing` |
| Contact | `/contact` |

---

© 2026 The Golden Frame Snooker & Pool Lounge, Silvassa. All rights reserved.
