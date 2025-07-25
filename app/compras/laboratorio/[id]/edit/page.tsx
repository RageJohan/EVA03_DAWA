"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

type Laboratorio = {
  CodLab: number
  RazonSocial: string
  Ruc: string
  Direccion: string
  Contacto: string
  Telefono: string
  Email: string
}

export default function EditLaboratorio() {
  const { id } = useParams()
  const router = useRouter()
  const [lab, setLab] = useState<Laboratorio | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<Laboratorio>>({})

  useEffect(() => {
    if (!id) return

    fetch(`/api/laboratorio/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setLab(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const validateForm = () => {
    if (!lab) return false

    const newErrors: Partial<Laboratorio> = {}

    if (!lab.RazonSocial.trim()) newErrors.RazonSocial = "La razón social es requerida"
    if (!lab.Ruc.trim()) newErrors.Ruc = "El RUC es requerido"
    if (lab.Ruc && !/^\d{11}$/.test(lab.Ruc)) newErrors.Ruc = "El RUC debe tener 11 dígitos"
    if (!lab.Direccion.trim()) newErrors.Direccion = "La dirección es requerida"
    if (!lab.Contacto.trim()) newErrors.Contacto = "El contacto es requerido"
    if (!lab.Telefono.trim()) newErrors.Telefono = "El teléfono es requerido"
    if (!lab.Email.trim()) newErrors.Email = "El email es requerido"
    if (lab.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lab.Email)) {
      newErrors.Email = "El email no tiene un formato válido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof Laboratorio, value: string) => {
    if (!lab) return
    setLab({ ...lab, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    setSaving(true)
    try {
      const response = await fetch(`/api/laboratorio/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lab),
      })

      if (response.ok) {
        router.push("/compras/laboratorio")
      } else {
        alert("Error al actualizar el laboratorio")
      }
    } catch (error) {
      console.error(error)
      alert("Error de conexión")
    } finally {
      setSaving(false)
    }
  }

  const formFields = [
    {
      key: "RazonSocial",
      label: "Razón Social",
      placeholder: "Ingrese la razón social del laboratorio",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      key: "Ruc",
      label: "RUC",
      placeholder: "Ingrese el RUC (11 dígitos)",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      key: "Direccion",
      label: "Dirección",
      placeholder: "Ingrese la dirección completa",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      key: "Contacto",
      label: "Persona de Contacto",
      placeholder: "Nombre del contacto principal",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      key: "Telefono",
      label: "Teléfono",
      placeholder: "Número de teléfono",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
    },
    {
      key: "Email",
      label: "Email",
      placeholder: "correo@laboratorio.com",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando información del laboratorio...</p>
        </div>
      </div>
    )
  }

  if (!lab) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Laboratorio no encontrado</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            El laboratorio que buscas no existe o ha sido eliminado
          </p>
          <Link
            href="/compras/laboratorio"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Volver a la lista
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/compras/laboratorio"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-6 h-6 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Editar Laboratorio</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Modificar información de <span className="font-semibold">{lab.RazonSocial}</span>
              </p>
            </div>
          </div>

          {/* Lab Info Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>RUC: {lab.Ruc}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Contacto: {lab.Contacto}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>{lab.Email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Información del Laboratorio</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Modifique los campos que desee actualizar</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formFields.map((field) => (
                <div key={field.key} className={field.key === "Direccion" ? "md:col-span-2" : ""}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {field.label} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      {field.icon}
                    </div>
                    <input
                      type={field.key === "Email" ? "email" : "text"}
                      placeholder={field.placeholder}
                      value={lab[field.key as keyof Laboratorio] || ""}
                      onChange={(e) => handleChange(field.key as keyof Laboratorio, e.target.value)}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        errors[field.key as keyof Laboratorio]
                          ? "border-red-300 dark:border-red-600"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      maxLength={field.key === "Ruc" ? 11 : undefined}
                    />
                  </div>
                  {errors[field.key as keyof Laboratorio] && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {errors[field.key as keyof Laboratorio]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Actualizar Laboratorio
                  </>
                )}
              </button>
              <Link
                href="/compras/laboratorio"
                className="flex-1 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </Link>
            </div>
          </form>
        </div>

        {/* Warning Section */}
        <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-2">Importante</h3>
              <ul className="text-amber-700 dark:text-amber-400 space-y-1 text-sm">
                <li>• Los cambios en la información del laboratorio afectarán futuras órdenes de compra</li>
                <li>• Verifique que los datos de contacto sean correctos para evitar problemas de comunicación</li>
                <li>• El RUC no debería cambiar a menos que sea absolutamente necesario</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
