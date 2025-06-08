"use client"

import type React from "react"

import Link from "next/link"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50">
        <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-white mr-8">Sistema de Compras</h1>
                <ul className="flex space-x-8">
                  <li>
                    <Link
                      href="/"
                      className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-gray-100 transition-all duration-200 ease-in-out"
                    >
                      Inicio
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/compras/laboratorio"
                      className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-gray-100 transition-all duration-200 ease-in-out"
                    >
                      Laboratorio
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/compras/orden"
                      className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-gray-100 transition-all duration-200 ease-in-out"
                    >
                      Orden de Compra
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">{children}</div>
        </main>
      </body>
    </html>
  )
}
