"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Eye, Brain, Shield, TrendingUp, Upload } from "lucide-react"
import { ArtworkGallery } from "@/components/artwork-gallery"
import { AIAnalysisPanel } from "@/components/ai-analysis-panel"
import { FilterSidebar } from "@/components/filter-sidebar"
import { mockArtworks, mockAnalyses } from "@/lib/mock-data"
import Link from "next/link"

export default function ArtVisionDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArtwork, setSelectedArtwork] = useState(null)
  const [filteredArtworks, setFilteredArtworks] = useState(mockArtworks)
  const [activeFilters, setActiveFilters] = useState({
    period: "",
    artist: "",
    technique: "",
    authenticity: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  // Filtrar obras baseado na busca e filtros
  useEffect(() => {
    const filtered = mockArtworks.filter((artwork) => {
      const matchesSearch =
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.period.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesPeriod = !activeFilters.period || artwork.period === activeFilters.period
      const matchesArtist = !activeFilters.artist || artwork.artist === activeFilters.artist
      const matchesTechnique = !activeFilters.technique || artwork.techniques.includes(activeFilters.technique)

      return matchesSearch && matchesPeriod && matchesArtist && matchesTechnique
    })

    setFilteredArtworks(filtered)
  }, [searchTerm, activeFilters])

  const handleArtworkSelect = (artwork) => {
    setSelectedArtwork(artwork)
  }

  const getAnalysisForArtwork = (artworkId) => {
    return mockAnalyses.find((analysis) => analysis.artworkId === artworkId)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Museu - Utfpr</h1>
                <p className="text-sm text-muted-foreground">Sistema de Análise e Classificação de Obras de Arte da Utfpr</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/submit">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Upload className="w-4 h-4" />
                  Enviar Obra
                </Button>
              </Link>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar obras, artistas, períodos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar de Filtros */}
          {showFilters && (
            <div className="col-span-3">
              <FilterSidebar activeFilters={activeFilters} onFiltersChange={setActiveFilters} artworks={mockArtworks} />
            </div>
          )}

          {/* Conteúdo Principal */}
          <div className={`${showFilters ? "col-span-9" : "col-span-12"}`}>
            <Tabs defaultValue="gallery" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="gallery" className="gap-2">
                  <Eye className="w-4 h-4" />
                  Galeria de Obras
                </TabsTrigger>
                <TabsTrigger value="analysis" className="gap-2">
                  <Brain className="w-4 h-4" />
                  Análise de IA
                </TabsTrigger>
                <TabsTrigger value="insights" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Insights
                </TabsTrigger>
              </TabsList>

              {/* Galeria de Obras */}
              <TabsContent value="gallery" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">Galeria de Obras de Arte</h2>
                    <p className="text-muted-foreground mt-1">{filteredArtworks.length} obras encontradas</p>
                  </div>

                  <Select defaultValue="recent">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Mais recentes</SelectItem>
                      <SelectItem value="name">Nome A-Z</SelectItem>
                      <SelectItem value="artist">Artista</SelectItem>
                      <SelectItem value="period">Período</SelectItem>
                      <SelectItem value="value">Valor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <ArtworkGallery
                  artworks={filteredArtworks}
                  onArtworkSelect={handleArtworkSelect}
                  selectedArtwork={selectedArtwork}
                />
              </TabsContent>

              {/* Análise de IA */}
              <TabsContent value="analysis" className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Análise de IA</h2>
                  <p className="text-muted-foreground mt-1">
                    Resultados detalhados da análise de inteligência artificial
                  </p>
                </div>

                {selectedArtwork ? (
                  <AIAnalysisPanel artwork={selectedArtwork} analysis={getAnalysisForArtwork(selectedArtwork.id)} />
                ) : (
                  <Card className="p-12 text-center">
                    <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Selecione uma obra para análise</h3>
                    <p className="text-muted-foreground">
                      Escolha uma obra de arte na galeria para visualizar a análise detalhada de IA
                    </p>
                  </Card>
                )}
              </TabsContent>

              {/* Insights */}
              <TabsContent value="insights" className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Insights da Coleção</h2>
                  <p className="text-muted-foreground mt-1">Análises estatísticas e tendências da coleção</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total de Obras</CardTitle>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{mockArtworks.length}</div>
                      <p className="text-xs text-muted-foreground">+2 desde o último mês</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Autenticidade Média</CardTitle>
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">96.8%</div>
                      <p className="text-xs text-muted-foreground">+1.2% desde a última análise</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">€1.39B</div>
                      <p className="text-xs text-muted-foreground">+5.2% valorização anual</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Análises Realizadas</CardTitle>
                      <Brain className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">127</div>
                      <p className="text-xs text-muted-foreground">+23 este mês</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Gráficos de Distribuição */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribuição por Período</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {["Renascimento", "Barroco", "Impressionismo", "Pós-Impressionismo", "Modernismo"].map(
                        (period, index) => {
                          const count = mockArtworks.filter((a) => a.period === period).length
                          const percentage = (count / mockArtworks.length) * 100
                          return (
                            <div key={period} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>{period}</span>
                                <span>
                                  {count} obras ({percentage.toFixed(1)}%)
                                </span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          )
                        },
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Estado de Conservação</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { status: "Excelente", count: 2, color: "bg-green-500" },
                        { status: "Bom", count: 2, color: "bg-blue-500" },
                        { status: "Regular", count: 1, color: "bg-yellow-500" },
                        { status: "Precário", count: 0, color: "bg-red-500" },
                      ].map(({ status, count, color }) => {
                        const percentage = (count / mockArtworks.length) * 100
                        return (
                          <div key={status} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{status}</span>
                              <span>
                                {count} obras ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div className={`h-2 rounded-full ${color}`} style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
