-- Script atualizado para sistema com análise automática por IA
-- ArtVision AI - Sistema de Análise Automática de Obras de Arte
-- Versão 2.0 - Com análise automática por IA

DROP DATABASE IF EXISTS artvisiondb;
CREATE DATABASE artvisiondb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE artvisiondb;

-- Tabela de usuários que submetem obras
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de artistas
CREATE TABLE artists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    birth_year INT,
    death_year INT,
    nationality VARCHAR(100),
    biography TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de períodos artísticos
CREATE TABLE periods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    start_year INT,
    end_year INT,
    description TEXT,
    characteristics TEXT
);

-- Tabela de técnicas artísticas
CREATE TABLE techniques (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    materials TEXT
);

-- Tabela principal de obras de arte
CREATE TABLE artworks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    artist_id INT,
    period_id INT,
    year_created INT,
    dimensions VARCHAR(100),
    location VARCHAR(255),
    estimated_value DECIMAL(15,2),
    description TEXT,
    image_path VARCHAR(500),
    image_blob LONGBLOB,
    conservation_status ENUM('Excelente', 'Bom', 'Regular', 'Precário') DEFAULT 'Bom',
    status ENUM('active', 'pending_analysis', 'archived') DEFAULT 'active',
    submitted_by INT,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(id),
    FOREIGN KEY (period_id) REFERENCES periods(id),
    FOREIGN KEY (submitted_by) REFERENCES users(id)
);

-- Tabela de análises de IA
CREATE TABLE ai_analyses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    artwork_id INT NOT NULL,
    confidence_score DECIMAL(5,2) NOT NULL,
    detected_style VARCHAR(100),
    style_confidence DECIMAL(5,2),
    detected_period VARCHAR(100),
    period_confidence DECIMAL(5,2),
    authenticity_score DECIMAL(5,2),
    authenticity_probability DECIMAL(5,2),
    composition_score DECIMAL(5,2),
    color_palette JSON,
    processing_time_seconds DECIMAL(8,2),
    ai_observations TEXT,
    analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);

-- Tabela de técnicas por obra
CREATE TABLE artwork_techniques (
    id INT PRIMARY KEY AUTO_INCREMENT,
    artwork_id INT NOT NULL,
    technique_id INT NOT NULL,
    confidence_score DECIMAL(5,2),
    detected_by_ai BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE,
    FOREIGN KEY (technique_id) REFERENCES techniques(id),
    UNIQUE KEY unique_artwork_technique (artwork_id, technique_id)
);

-- Tabela de indicadores de autenticidade
CREATE TABLE authenticity_indicators (
    id INT PRIMARY KEY AUTO_INCREMENT,
    analysis_id INT NOT NULL,
    indicator_text TEXT NOT NULL,
    confidence_level ENUM('Alto', 'Médio', 'Baixo') DEFAULT 'Médio',
    FOREIGN KEY (analysis_id) REFERENCES ai_analyses(id) ON DELETE CASCADE
);

-- Tabela de recomendações de conservação
CREATE TABLE conservation_recommendations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    analysis_id INT NOT NULL,
    recommendation_text TEXT NOT NULL,
    priority ENUM('Alta', 'Média', 'Baixa') DEFAULT 'Média',
    estimated_cost DECIMAL(10,2),
    FOREIGN KEY (analysis_id) REFERENCES ai_analyses(id) ON DELETE CASCADE
);

-- Tabela de problemas de conservação identificados
CREATE TABLE conservation_issues (
    id INT PRIMARY KEY AUTO_INCREMENT,
    analysis_id INT NOT NULL,
    issue_description TEXT NOT NULL,
    severity ENUM('Crítico', 'Moderado', 'Leve') DEFAULT 'Leve',
    FOREIGN KEY (analysis_id) REFERENCES ai_analyses(id) ON DELETE CASCADE
);

-- Tabela de fatores de valorização
CREATE TABLE value_factors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    analysis_id INT NOT NULL,
    factor_description TEXT NOT NULL,
    impact_weight DECIMAL(3,2) DEFAULT 1.00,
    FOREIGN KEY (analysis_id) REFERENCES ai_analyses(id) ON DELETE CASCADE
);

-- Inserir dados de exemplo

-- Usuários
INSERT INTO users (name, email) VALUES
('João Santos', 'joao.santos@email.com'),
('Ana Costa', 'ana.costa@email.com'),
('Pedro Lima', 'pedro.lima@email.com'),
('Carlos Silva', 'carlos.silva@email.com'),
('Maria Oliveira', 'maria.oliveira@email.com');

-- Artistas
INSERT INTO artists (name, birth_year, death_year, nationality, biography) VALUES
('Leonardo da Vinci', 1452, 1519, 'Italiana', 'Polímata renascentista, pintor, inventor, cientista'),
('Vincent van Gogh', 1853, 1890, 'Holandesa', 'Pintor pós-impressionista'),
('Pablo Picasso', 1881, 1973, 'Espanhola', 'Pintor, escultor, cofundador do cubismo'),
('Claude Monet', 1840, 1926, 'Francesa', 'Pintor impressionista francês'),
('Michelangelo', 1475, 1564, 'Italiana', 'Escultor, pintor, arquiteto renascentista'),
('Maria Silva', 1985, NULL, 'Brasileira', 'Artista contemporânea especializada em paisagens'),
('Carlos Mendes', 1850, 1920, 'Brasileira', 'Retratista do século XIX'),
('Artista Desconhecido', NULL, NULL, 'Desconhecida', 'Identidade não determinada');

-- Períodos
INSERT INTO periods (name, start_year, end_year, description) VALUES
('Renascimento', 1400, 1600, 'Movimento cultural europeu'),
('Pós-Impressionismo', 1880, 1905, 'Movimento artístico francês'),
('Modernismo', 1900, 1945, 'Movimento artístico moderno'),
('Impressionismo', 1860, 1886, 'Movimento artístico francês'),
('Contemporâneo', 1945, NULL, 'Arte contemporânea'),
('Realismo', 1850, 1880, 'Movimento artístico realista'),
('Arte Moderna', 1860, 1970, 'Período da arte moderna');

-- Técnicas
INSERT INTO techniques (name, description) VALUES
('Óleo sobre madeira', 'Pintura a óleo sobre suporte de madeira'),
('Sfumato', 'Técnica de esfumaçamento de Leonardo da Vinci'),
('Chiaroscuro', 'Técnica de contraste entre luz e sombra'),
('Óleo sobre tela', 'Pintura a óleo sobre tela'),
('Impasto', 'Técnica de aplicação espessa de tinta'),
('Pinceladas expressivas', 'Pinceladas visíveis e expressivas'),
('Cubismo analítico', 'Estilo cubista de análise da forma'),
('Monocromia', 'Uso de uma única cor ou tons de uma cor'),
('Pinceladas soltas', 'Técnica impressionista de pinceladas livres'),
('Cores puras', 'Uso de cores sem mistura prévia'),
('Escultura em mármore', 'Escultura talhada em mármore'),
('Contrapposto', 'Posição escultórica clássica'),
('Anatomia realista', 'Representação anatômica precisa'),
('Plein air', 'Pintura ao ar livre'),
('Técnica clássica', 'Métodos tradicionais de pintura'),
('Acrílica sobre madeira', 'Pintura acrílica sobre suporte de madeira'),
('Geometria abstrata', 'Composição com formas geométricas abstratas');

-- Obras de arte (incluindo as analisadas automaticamente)
INSERT INTO artworks (title, artist_id, period_id, year_created, dimensions, location, estimated_value, description, image_path, conservation_status, submitted_by) VALUES
('Mona Lisa', 1, 1, 1503, '77 cm × 53 cm', 'Museu do Louvre, Paris', 850000000.00, 'Retrato de Lisa Gherardini, esposa de Francesco del Giocondo. Obra-prima do Renascimento.', '/mona-lisa-inspired.png', 'Excelente', NULL),
('A Noite Estrelada', 2, 2, 1889, '73.7 cm × 92.1 cm', 'MoMA, Nova York', 100000000.00, 'Pintura pós-impressionista retratando uma vista noturna de Saint-Rémy-de-Provence.', '/starry-night-van-gogh-painting.png', 'Bom', NULL),
('Guernica', 3, 3, 1937, '349.3 cm × 776.6 cm', 'Museu Reina Sofía, Madrid', 200000000.00, 'Pintura cubista retratando os horrores da guerra civil espanhola.', '/guernica-picasso-painting.png', 'Bom', NULL),
('Nenúfares', 4, 4, 1919, '200 cm × 425 cm', 'Museu de l\'Orangerie, Paris', 40000000.00, 'Série de pinturas impressionistas do jardim de Monet em Giverny.', '/water-lilies-monet-painting.png', 'Regular', NULL),
('David', 5, 1, 1504, '517 cm altura', 'Galleria dell\'Accademia, Florença', 200000000.00, 'Escultura em mármore representando o herói bíblico David.', '/michelangelo-david-sculpture.png', 'Bom', NULL),
('Paisagem ao Pôr do Sol', 6, 5, 2023, '60 cm × 80 cm', 'Coleção Particular', 15000.00, 'Uma bela paisagem pintada durante uma viagem ao interior. Retrata o pôr do sol sobre montanhas com técnica impressionista.', '/placeholder.svg?height=400&width=600', 'Excelente', 1),
('Retrato de Família', 7, 6, 1890, '70 cm × 90 cm', 'Coleção Particular', 35000.00, 'Retrato realista de uma família do século XIX. A obra apresenta técnicas clássicas de retrato com atenção especial aos detalhes faciais.', '/placeholder.svg?height=400&width=500', 'Bom', 2),
('Abstração Geométrica', 8, 7, 1960, '50 cm × 70 cm', 'Coleção Particular', 8000.00, 'Composição abstrata com formas geométricas em cores vibrantes. Possivelmente influenciada pelo movimento construtivista.', '/placeholder.svg?height=400&width=350', 'Regular', 3);

-- Views para consultas otimizadas
CREATE VIEW artwork_details AS
SELECT 
    a.id,
    a.title,
    ar.name as artist_name,
    p.name as period_name,
    a.year_created,
    a.dimensions,
    a.location,
    a.estimated_value,
    a.description,
    a.image_path,
    a.conservation_status,
    a.submission_date,
    u.name as submitted_by_name,
    u.email as submitted_by_email
FROM artworks a
LEFT JOIN artists ar ON a.artist_id = ar.id
LEFT JOIN periods p ON a.period_id = p.id
LEFT JOIN users u ON a.submitted_by = u.id
WHERE a.status = 'active';

CREATE VIEW analysis_summary AS
SELECT 
    aa.artwork_id,
    aa.confidence_score,
    aa.detected_style,
    aa.style_confidence,
    aa.detected_period,
    aa.period_confidence,
    aa.authenticity_score,
    aa.authenticity_probability,
    aa.composition_score,
    aa.color_palette,
    aa.processing_time_seconds,
    aa.ai_observations,
    aa.analysis_date,
    COUNT(ai.id) as authenticity_indicators_count,
    COUNT(cr.id) as conservation_recommendations_count,
    COUNT(ci.id) as conservation_issues_count
FROM ai_analyses aa
LEFT JOIN authenticity_indicators ai ON aa.id = ai.analysis_id
LEFT JOIN conservation_recommendations cr ON aa.id = cr.analysis_id
LEFT JOIN conservation_issues ci ON aa.id = ci.analysis_id
GROUP BY aa.id;

-- Índices para otimização
CREATE INDEX idx_artworks_artist ON artworks(artist_id);
CREATE INDEX idx_artworks_period ON artworks(period_id);
CREATE INDEX idx_artworks_status ON artworks(status);
CREATE INDEX idx_ai_analyses_artwork ON ai_analyses(artwork_id);
CREATE INDEX idx_ai_analyses_confidence ON ai_analyses(confidence_score);
CREATE INDEX idx_artwork_techniques_artwork ON artwork_techniques(artwork_id);
