"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Loader2, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SubmissionForm {
  title: string
  artistName: string
  description: string
  submittedBy: string
  submittedEmail: string
  image: File | null
}

interface AIAnalysisResult {
  confidence: number
  style: string
  period: string
  techniques: string[]
  authenticity: number
  colorPalette: string[]
  observations: string
}

export default function SubmitArtwork() {
  const [form, setForm] = useState<SubmissionForm>({
    title: "",
    artistName: "",
    description: "",
    submittedBy: "",
    submittedEmail: "",
    image: null,
  })

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const simulateAIAnalysis = async (image: File, description: string, title: string): Promise<AIAnalysisResult> => {
    // Simula tempo de processamento da IA
    await new Promise((resolve) => setTimeout(resolve, 3000 + Math.random() * 2000))

    // Análise baseada em palavras-chave na descrição e título
    const keywords = (description + " " + title).toLowerCase()

    let style = "Contemporâneo"
    let period = "Século XXI"
    let techniques = ["Técnica mista"]
    let confidence = 85 + Math.random() * 10

    // Detecção de estilo baseada em palavras-chave
    if (keywords.includes("impressionist") || keywords.includes("plein air") || keywords.includes("luz natural")) {
      style = "Impressionismo"
      period = "Século XIX"
      techniques = ["Óleo sobre tela", "Pinceladas soltas", "Cores puras"]
      confidence = 90 + Math.random() * 8
    } else if (keywords.includes("realista") || keywords.includes("retrato") || keywords.includes("clássic")) {
      style = "Realismo"
      period = "Século XIX-XX"
      techniques = ["Óleo sobre tela", "Técnica clássica", "Chiaroscuro"]
      confidence = 88 + Math.random() * 10
    } else if (keywords.includes("abstract") || keywords.includes("geométric") || keywords.includes("modern")) {
      style = "Arte Moderna"
      period = "Século XX"
      techniques = ["Acrílica sobre tela", "Abstração geométrica"]
      confidence = 82 + Math.random() * 12
    } else if (keywords.includes("cubist") || keywords.includes("fragment")) {
      style = "Cubismo"
      period = "Século XX"
      techniques = ["Óleo sobre tela", "Fragmentação geométrica"]
      confidence = 85 + Math.random() * 10
    }

    // Paleta de cores baseada no estilo detectado
    const colorPalettes = {
      Impressionismo: ["#87CEEB", "#98FB98", "#DDA0DD", "#F0E68C", "#FFB6C1"],
      Realismo: ["#8B4513", "#DEB887", "#F5DEB3", "#2F4F4F", "#000000"],
      "Arte Moderna": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
      Cubismo: ["#000000", "#FFFFFF", "#808080", "#A9A9A9", "#696969"],
      Contemporâneo: ["#FF7675", "#74B9FF", "#00B894", "#FDCB6E", "#6C5CE7"],
    }

    return {
      confidence: Math.round(confidence * 10) / 10,
      style,
      period,
      techniques,
      authenticity: Math.round((75 + Math.random() * 20) * 10) / 10,
      colorPalette: colorPalettes[style as keyof typeof colorPalettes] || colorPalettes["Contemporâneo"],
      observations: `Análise automática detectou características de ${style.toLowerCase()}. A obra apresenta técnicas consistentes com o período ${period.toLowerCase()}. Recomenda-se análise adicional por especialista para confirmação definitiva.`,
    }
  }

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setForm((prev) => ({ ...prev, image: file }))
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.image) {
      alert("Por favor, selecione uma imagem da obra de arte.")
      return
    }

    setIsAnalyzing(true)

    try {
      const analysis = await simulateAIAnalysis(form.image, form.description, form.title)
      setAnalysisResult(analysis)

      // Simula salvamento no banco de dados
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)
    } catch (error) {
      console.error("Erro na análise:", error)
      alert("Erro ao processar a obra. Tente novamente.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (isSubmitted && analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-emerald-200 shadow-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl text-emerald-800">Análise Concluída!</CardTitle>
              <CardDescription>A IA analisou sua obra de arte com sucesso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Informações da Obra</h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Título:</strong> {form.title}
                    </p>
                    <p>
                      <strong>Artista:</strong> {form.artistName}
                    </p>
                    <p>
                      <strong>Submetido por:</strong> {form.submittedBy}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Análise da IA</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Confiança: {analysisResult.confidence}%</Badge>
                    </div>
                    <p>
                      <strong>Estilo:</strong> {analysisResult.style}
                    </p>
                    <p>
                      <strong>Período:</strong> {analysisResult.period}
                    </p>
                    <p>
                      <strong>Autenticidade:</strong> {analysisResult.authenticity}%
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Técnicas Identificadas</h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.techniques.map((technique, index) => (
                    <Badge key={index} variant="outline">
                      {technique}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Paleta de Cores Detectada</h3>
                <div className="flex gap-2">
                  {analysisResult.colorPalette.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Observações da IA</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{analysisResult.observations}</p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => {
                    setIsSubmitted(false)
                    setAnalysisResult(null)
                    setForm({
                      title: "",
                      artistName: "",
                      description: "",
                      submittedBy: "",
                      submittedEmail: "",
                      image: null,
                    })
                  }}
                  variant="outline"
                >
                  Submeter Outra Obra
                </Button>
                <Button onClick={() => (window.location.href = "/")}>Ver Galeria Principal</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="border-emerald-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-emerald-800">Submeter Obra de Arte</CardTitle>
            <CardDescription>
              Envie sua obra para análise automática por IA. O sistema identificará estilo, período, técnicas e
              autenticidade.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Obra</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Paisagem ao Pôr do Sol"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="artist">Nome do Artista</Label>
                <Input
                  id="artist"
                  value={form.artistName}
                  onChange={(e) => setForm((prev) => ({ ...prev, artistName: e.target.value }))}
                  placeholder="Ex: Maria Silva ou Artista Desconhecido"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição Detalhada</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva a obra, técnicas utilizadas, período estimado, história, etc. Quanto mais detalhes, melhor será a análise da IA."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="submitter">Seu Nome</Label>
                <Input
                  id="submitter"
                  value={form.submittedBy}
                  onChange={(e) => setForm((prev) => ({ ...prev, submittedBy: e.target.value }))}
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Seu Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.submittedEmail}
                  onChange={(e) => setForm((prev) => ({ ...prev, submittedEmail: e.target.value }))}
                  placeholder="seu.email@exemplo.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Imagem da Obra</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:border-emerald-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {form.image ? (
                    <div className="space-y-2">
                      <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto" />
                      <p className="text-sm text-gray-600">Arquivo selecionado: {form.image.name}</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setForm((prev) => ({ ...prev, image: null }))}
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-600">Arraste uma imagem aqui ou clique para selecionar</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("image-upload")?.click()}
                      >
                        Selecionar Arquivo
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analisando com IA...
                  </>
                ) : (
                  "Submeter para Análise"
                )}
              </Button>
            </form>

            {isAnalyzing && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Análise em Progresso</p>
                    <p className="text-sm text-blue-600">
                      A IA está analisando estilo, período, técnicas e autenticidade da obra...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
