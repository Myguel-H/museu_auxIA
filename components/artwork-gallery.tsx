"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Palette, Eye, TrendingUp } from "lucide-react"

interface Artwork {
  id: number
  title: string
  artist: string
  year: number
  period: string
  dimensions: string
  location: string
  value: number
  description: string
  image: string
  conservation: string
  techniques: string[]
}

interface ArtworkGalleryProps {
  artworks: Artwork[]
  onArtworkSelect: (artwork: Artwork) => void
  selectedArtwork: Artwork | null
}

export function ArtworkGallery({ artworks, onArtworkSelect, selectedArtwork }: ArtworkGalleryProps) {
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`
    }
    return `€${value.toLocaleString()}`
  }

  const getConservationColor = (status: string) => {
    switch (status) {
      case "Excelente":
        return "bg-green-100 text-green-800 border-green-200"
      case "Bom":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Regular":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Precário":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {artworks.map((artwork) => (
        <Card
          key={artwork.id}
          className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
            selectedArtwork?.id === artwork.id ? "ring-2 ring-primary shadow-lg" : ""
          }`}
          onClick={() => onArtworkSelect(artwork)}
        >
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={artwork.image || "/placeholder.svg"}
              alt={artwork.title}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute top-3 right-3">
              <Badge className={`${getConservationColor(artwork.conservation)} border`}>{artwork.conservation}</Badge>
            </div>
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className="bg-black/70 text-white border-0">
                {artwork.period}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {artwork.title}
              </h3>
              <p className="text-muted-foreground font-medium">{artwork.artist}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{artwork.year}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>{formatValue(artwork.value)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Palette className="w-4 h-4" />
                <span>{artwork.dimensions}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{artwork.location.split(",")[0]}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {artwork.techniques.slice(0, 2).map((technique) => (
                <Badge key={technique} variant="outline" className="text-xs">
                  {technique}
                </Badge>
              ))}
              {artwork.techniques.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{artwork.techniques.length - 2}
                </Badge>
              )}
            </div>

            <Button className="w-full gap-2" variant={selectedArtwork?.id === artwork.id ? "default" : "outline"}>
              <Eye className="w-4 h-4" />
              {selectedArtwork?.id === artwork.id ? "Selecionada" : "Ver Análise"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
