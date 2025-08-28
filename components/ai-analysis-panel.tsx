"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Shield,
  Palette,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Microscope,
  Target,
} from "lucide-react"

interface AIAnalysis {
  artworkId: number
  confidence: number
  style: {
    detected: string
    confidence: number
  }
  period: {
    detected: string
    confidence: number
  }
  authenticity: {
    score: number
    probability: number
    indicators: string[]
  }
  techniques: string[]
  colorPalette: string[]
  composition: number
  conservation: {
    status: string
    issues: string[]
    recommendations: string[]
  }
  value: {
    estimated: number
    factors: string[]
  }
  processingTime: number
  observations: string
}

interface Artwork {
  id: number
  title: string
  artist: string
  year: number
  image: string
}

interface AIAnalysisPanelProps {
  artwork: Artwork
  analysis: AIAnalysis | undefined
}

export function AIAnalysisPanel({ artwork, analysis }: AIAnalysisPanelProps) {
  if (!analysis) {
    return (
      <Card className="p-12 text-center">
        <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Análise não disponível</h3>
        <p className="text-muted-foreground">A análise de IA para esta obra ainda não foi processada.</p>
      </Card>
    )
  }

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`
    }
    return `€${value.toLocaleString()}`
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return "text-green-600"
    if (confidence >= 85) return "text-blue-600"
    if (confidence >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getAuthenticityStatus = (score: number) => {
    if (score >= 95) return { label: "Autêntica", color: "bg-green-100 text-green-800", icon: CheckCircle }
    if (score >= 80) return { label: "Provável", color: "bg-blue-100 text-blue-800", icon: Eye }
    if (score >= 60) return { label: "Duvidosa", color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle }
    return { label: "Suspeita", color: "bg-red-100 text-red-800", icon: AlertTriangle }
  }

  const authenticityStatus = getAuthenticityStatus(analysis.authenticity.score)
  const AuthenticityIcon = authenticityStatus.icon

  return (
    <div className="space-y-6">
      {/* Header da Análise */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <img
              src={artwork.image || "/placeholder.svg"}
              alt={artwork.title}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-foreground">{artwork.title}</h3>
                <p className="text-lg text-muted-foreground">
                  {artwork.artist} • {artwork.year}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Confiança Geral:</span>
                  <span className={`text-lg font-bold ${getConfidenceColor(analysis.confidence)}`}>
                    {analysis.confidence}%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Processado em {analysis.processingTime}s</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Análise */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="authenticity">Autenticidade</TabsTrigger>
          <TabsTrigger value="technical">Técnica</TabsTrigger>
          <TabsTrigger value="conservation">Conservação</TabsTrigger>
          <TabsTrigger value="valuation">Avaliação</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Estilo Detectado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">{analysis.style.detected}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={analysis.style.confidence} className="flex-1" />
                    <span className={`text-sm font-medium ${getConfidenceColor(analysis.style.confidence)}`}>
                      {analysis.style.confidence}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Período Histórico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">{analysis.period.detected}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={analysis.period.confidence} className="flex-1" />
                    <span className={`text-sm font-medium ${getConfidenceColor(analysis.period.confidence)}`}>
                      {analysis.period.confidence}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Autenticidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AuthenticityIcon className="w-5 h-5" />
                    <Badge className={authenticityStatus.color}>{authenticityStatus.label}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={analysis.authenticity.score} className="flex-1" />
                    <span className={`text-sm font-medium ${getConfidenceColor(analysis.authenticity.score)}`}>
                      {analysis.authenticity.score}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Observações da IA</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{analysis.observations}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Autenticidade */}
        <TabsContent value="authenticity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Análise de Autenticidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-muted/50 rounded-lg">
                  <div className={`text-4xl font-bold ${getConfidenceColor(analysis.authenticity.score)} mb-2`}>
                    {analysis.authenticity.score}%
                  </div>
                  <p className="text-sm text-muted-foreground">Score de Autenticidade</p>
                </div>

                <div>
                  <p className="font-medium mb-2">Probabilidade de ser original:</p>
                  <div className="flex items-center gap-2">
                    <Progress value={analysis.authenticity.probability} className="flex-1" />
                    <span className="text-sm font-medium">{analysis.authenticity.probability}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Indicadores Analisados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.authenticity.indicators.map((indicator, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{indicator}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Análise Técnica */}
        <TabsContent value="technical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Microscope className="w-5 h-5" />
                  Técnicas Detectadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.techniques.map((technique, index) => (
                    <Badge key={index} variant="secondary" className="mr-2 mb-2">
                      {technique}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Análise de Composição
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">Score de Composição:</p>
                    <div className="flex items-center gap-2">
                      <Progress value={analysis.composition} className="flex-1" />
                      <span className={`text-sm font-medium ${getConfidenceColor(analysis.composition)}`}>
                        {analysis.composition}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Paleta de Cores Dominantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {analysis.colorPalette.map((color, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 rounded-full border-2 border-border" style={{ backgroundColor: color }} />
                    <span className="text-sm font-mono">{color}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conservação */}
        <TabsContent value="conservation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Estado de Conservação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-foreground">{analysis.conservation.status}</p>
                    <p className="text-sm text-muted-foreground">Estado Atual</p>
                  </div>

                  {analysis.conservation.issues.length > 0 && (
                    <div>
                      <p className="font-medium mb-2 text-destructive">Problemas Identificados:</p>
                      <ul className="space-y-1">
                        {analysis.conservation.issues.map((issue, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.conservation.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Avaliação */}
        <TabsContent value="valuation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Valor Estimado pela IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 bg-muted/50 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">{formatValue(analysis.value.estimated)}</div>
                  <p className="text-sm text-muted-foreground">Estimativa de Mercado</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fatores de Valorização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.value.factors.map((factor, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{factor}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
