"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50">
        <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-white mr-8">Sistema de Compras</h1>
                {/* Menú para escritorio y móvil */}
                <ul
                  className={`flex flex-col md:flex-row md:space-x-8
                    ${isOpen ? "block" : "hidden"} md:flex md:block
                    bg-gray-900 md:bg-transparent text-white md:text-inherit
                    absolute md:static top-16 left-0 w-full md:w-auto
                    transition-all duration-300 ease-in-out
                  `}
                >
                  <li>
                    <Link
                      href="/"
                      className="block px-3 py-2 text-sm font-medium hover:bg-gray-700 hover:text-gray-100 transition-all duration-200 ease-in-out"
                      onClick={() => setIsOpen(false)}
                    >
                      Inicio
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/compras/laboratorio"
                      className="block px-3 py-2 text-sm font-medium hover:bg-gray-700 hover:text-gray-100 transition-all duration-200 ease-in-out"
                      onClick={() => setIsOpen(false)}
                    >
                      Laboratorio
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/compras/orden"
                      className="block px-3 py-2 text-sm font-medium hover:bg-gray-700 hover:text-gray-100 transition-all duration-200 ease-in-out"
                      onClick={() => setIsOpen(false)}
                    >
                      Orden de Compra
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Botón hamburguesa solo en móvil */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white rounded"
                  aria-label="Toggle menu"
                >
                  {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-lg shadow-sm p-6">{children}</div>
        </main>
      </body>
    </html>
  );
}
