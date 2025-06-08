"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

interface Laboratorio {
  CodLab: number
  RazonSocial: string
  Ruc: string
}

type OrdenCompraForm = {
  FechaEmision: string
  Situacion: string
  Total: number | string
  CodLab: number | string
}

export default function EditOrden() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [orden, setOrden] = useState<OrdenCompraForm | null>(null)
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadingLabs, setLoadingLabs] = useState(true)
  const [errors, setErrors] = useState<Partial<OrdenCompraForm>>({})

  useEffect(() => {
    if (!id) return

    // Cargar datos de la orden y laboratorios en paralelo
    Promise.all([
      fetch(`/api/orden/${id}`).then((res) => res.json()),
      fetch("/api/laboratorio").then((res) => res.json()),
    ])
      .then(([ordenData, labsData]) => {
        setOrden({
          FechaEmision: ordenData.FechaEmision ? ordenData.FechaEmision.substring(0, 10) : "",
          Situacion: ordenData.Situacion,
          Total: ordenData.Total,
          CodLab: ordenData.CodLab,
        })
        setLaboratorios(labsData)
        setLoading(false)
        setLoadingLabs(false)
      })
      .catch(() => {
        setLoading(false)
        setLoadingLabs(false)
      })
  }, [id])

  const validateForm = () => {
    if (!orden) return false

    const newErrors: Partial<OrdenCompraForm> = {}

    if (!orden.FechaEmision) newErrors.FechaEmision = "La fecha de emisión es requerida"
    if (!orden.Situacion) newErrors.Situacion = "La situación es requerida"
    if (!orden.Total) newErrors.Total = "El total es requerido"
    if (
      orden.Total &&
      (isNaN(Number.parseFloat(orden.Total.toString())) || Number.parseFloat(orden.Total.toString()) <= 0)
    ) {
      newErrors.Total = "El total debe ser un número mayor a 0"
    }
    if (!orden.CodLab) newErrors.CodLab = "Debe seleccionar un laboratorio"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!orden || !validateForm()) return

    setSaving(true)
    try {
      const response = await fetch(`/api/orden/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          FechaEmision: new Date(orden.FechaEmision).toISOString(),
          Situacion: orden.Situacion,
          Total: Number.parseFloat(orden.Total.toString()),
          CodLab: Number.parseInt(orden.CodLab.toString()),
        }),
      })

      if (response.ok) {
        router.push("/compras/orden")
      } else {
        alert("Error al actualizar la orden de compra")
      }
    } catch (error) {
      console.log(error)
      alert("Error de conexión")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof OrdenCompraForm, value: string | number) => {
    if (!orden) return
    setOrden({ ...orden, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined })
    }
  }

  const situaciones = ["Pendiente", "Aprobada", "Rechazada", "Entregada"]

  const getSituacionColor = (situacion: string) => {
    switch (situacion.toLowerCase()) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "aprobada":
        return "bg-green-100 text-green-800 border-green-300"
      case "rechazada":
        return "bg-red-100 text-red-800 border-red-300"
      case "entregada":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const selectedLab = laboratorios.find((lab) => lab.CodLab.toString() === orden?.CodLab.toString())

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando información de la orden...</p>
        </div>
      </div>
    )
  }

  if (!orden) {
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
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Orden no encontrada</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            La orden de compra que buscas no existe o ha sido eliminada
          </p>
          <Link
            href="/compras/orden"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Volver a las órdenes
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
              href="/compras/orden"
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
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
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
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Editar Orden de Compra</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Modificar orden #{id} - {selectedLab?.RazonSocial || "Laboratorio"}
              </p>
            </div>
          </div>

          {/* Order Info Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Orden #{id}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-6 0h6m-6 0V7a1 1 0 00-1 1v9a2 2 0 002 2h4a2 2 0 002-2V8a1 1 0 00-1-1V7"
                  />
                </svg>
                <span>
                  {orden.FechaEmision ? new Date(orden.FechaEmision).toLocaleDateString("es-PE") : "Sin fecha"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSituacionColor(
                    orden.Situacion,
                  )}`}
                >
                  {orden.Situacion}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-600 dark:text-green-400">
                  S/ {Number.parseFloat(orden.Total.toString()).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Información de la Orden</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Modifique los campos que desee actualizar</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  {/* Fecha de Emisión */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha de Emisión <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-6 0h6m-6 0V7a1 1 0 00-1 1v9a2 2 0 002 2h4a2 2 0 002-2V8a1 1 0 00-1-1V7"
                          />
                        </svg>
                      </div>
                      <input
                        type="date"
                        value={orden.FechaEmision}
                        onChange={(e) => handleInputChange("FechaEmision", e.target.value)}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          errors.FechaEmision
                            ? "border-red-300 dark:border-red-600"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      />
                    </div>
                    {errors.FechaEmision && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {errors.FechaEmision}
                      </p>
                    )}
                  </div>

                  {/* Situación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Estado de la Orden <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <select
                        value={orden.Situacion}
                        onChange={(e) => handleInputChange("Situacion", e.target.value)}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          errors.Situacion
                            ? "border-red-300 dark:border-red-600"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {situaciones.map((situacion) => (
                          <option key={situacion} value={situacion}>
                            {situacion}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.Situacion && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {errors.Situacion}
                      </p>
                    )}
                  </div>

                  {/* Total */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Total de la Orden <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <span className="text-sm font-medium">S/</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={orden.Total}
                        onChange={(e) => handleInputChange("Total", e.target.value)}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          errors.Total ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
                        }`}
                      />
                    </div>
                    {errors.Total && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {errors.Total}
                      </p>
                    )}
                  </div>

                  {/* Laboratorio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Laboratorio Proveedor <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <select
                        value={orden.CodLab}
                        onChange={(e) => handleInputChange("CodLab", e.target.value)}
                        disabled={loadingLabs}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          errors.CodLab ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        <option value="">Seleccione un laboratorio</option>
                        {laboratorios.map((lab) => (
                          <option key={lab.CodLab} value={lab.CodLab}>
                            {lab.RazonSocial} - RUC: {lab.Ruc}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.CodLab && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {errors.CodLab}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="submit"
                    disabled={saving || loadingLabs}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                        Actualizar Orden
                      </>
                    )}
                  </button>
                  <Link
                    href="/compras/orden"
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
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Vista Previa</h3>

              <div className="space-y-4">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Número de Orden</div>
                  <div className="font-medium text-gray-900 dark:text-white">#{id}</div>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Fecha de Emisión</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {orden.FechaEmision ? new Date(orden.FechaEmision).toLocaleDateString("es-PE") : "No especificada"}
                  </div>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Estado</div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSituacionColor(
                        orden.Situacion,
                      )}`}
                    >
                      {orden.Situacion}
                    </span>
                  </div>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
                  <div className="font-bold text-xl text-green-600 dark:text-green-400">
                    S/ {Number.parseFloat(orden.Total.toString()).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Laboratorio</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {selectedLab ? (
                      <div>
                        <div>{selectedLab.RazonSocial}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">RUC: {selectedLab.Ruc}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">No seleccionado</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Section */}
            <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6">
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
                  <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">Importante</h4>
                  <ul className="text-amber-700 dark:text-amber-400 space-y-1 text-xs">
                    <li>• Los cambios en el estado pueden afectar el flujo de trabajo</li>
                    <li>• Verificar el total antes de actualizar</li>
                    <li>• El cambio de laboratorio puede requerir aprobación adicional</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
