"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"

interface FilterSidebarProps {
  activeFilters: {
    period: string
    artist: string
    technique: string
    authenticity: string
  }
  onFiltersChange: (filters: any) => void
  artworks: any[]
}

export function FilterSidebar({ activeFilters, onFiltersChange, artworks }: FilterSidebarProps) {
  const periods = [...new Set(artworks.map((a) => a.period))].sort()
  const artists = [...new Set(artworks.map((a) => a.artist))].sort()
  const techniques = [...new Set(artworks.flatMap((a) => a.techniques))].sort()

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...activeFilters,
      [key]: value === "all" ? "" : value,
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      period: "",
      artist: "",
      technique: "",
      authenticity: "",
    })
  }

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              <X className="w-4 h-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>
        {activeFilterCount > 0 && <Badge variant="secondary">{activeFilterCount} filtro(s) ativo(s)</Badge>}
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Período Artístico</label>
          <Select value={activeFilters.period || "all"} onValueChange={(value) => handleFilterChange("period", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os períodos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os períodos</SelectItem>
              {periods.map((period) => (
                <SelectItem key={period} value={period}>
                  {period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Artista</label>
          <Select value={activeFilters.artist || "all"} onValueChange={(value) => handleFilterChange("artist", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os artistas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os artistas</SelectItem>
              {artists.map((artist) => (
                <SelectItem key={artist} value={artist}>
                  {artist}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Técnica</label>
          <Select
            value={activeFilters.technique || "all"}
            onValueChange={(value) => handleFilterChange("technique", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as técnicas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as técnicas</SelectItem>
              {techniques.map((technique) => (
                <SelectItem key={technique} value={technique}>
                  {technique}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Autenticidade</label>
          <Select
            value={activeFilters.authenticity || "all"}
            onValueChange={(value) => handleFilterChange("authenticity", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="authentic">Autênticas (95%+)</SelectItem>
              <SelectItem value="probable">Prováveis (80-94%)</SelectItem>
              <SelectItem value="doubtful">Duvidosas (60-79%)</SelectItem>
              <SelectItem value="suspicious">Suspeitas (&lt;60%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">{artworks.length} obra(s) na coleção</p>
        </div>
      </CardContent>
    </Card>
  )
}
