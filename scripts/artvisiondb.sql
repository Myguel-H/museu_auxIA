-- ArtVision AI Database Schema
-- Sistema de Análise e Classificação de Obras de Arte

CREATE DATABASE IF NOT EXISTS artvisiondb;
USE artvisiondb;

-- Tabela de Artistas
CREATE TABLE artistas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    nome_completo VARCHAR(500),
    ano_nascimento INT,
    ano_morte INT,
    nacionalidade VARCHAR(100),
    movimento_artistico VARCHAR(100),
    biografia TEXT,
    foto_perfil VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Períodos Artísticos
CREATE TABLE periodos_artisticos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    ano_inicio INT,
    ano_fim INT,
    caracteristicas TEXT
);

-- Tabela de Técnicas Artísticas
CREATE TABLE tecnicas_artisticas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    materiais_comuns TEXT
);

-- Tabela de Obras de Arte
CREATE TABLE obras_arte (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    artista_id INT,
    ano_criacao INT,
    periodo_artistico_id INT,
    dimensoes VARCHAR(100),
    localizacao_atual VARCHAR(255),
    valor_estimado DECIMAL(15,2),
    descricao TEXT,
    imagem_caminho VARCHAR(500),
    imagem_blob LONGBLOB,
    status_conservacao ENUM('Excelente', 'Bom', 'Regular', 'Precário') DEFAULT 'Bom',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (artista_id) REFERENCES artistas(id) ON DELETE SET NULL,
    FOREIGN KEY (periodo_artistico_id) REFERENCES periodos_artisticos(id) ON DELETE SET NULL
);

-- Tabela de Relacionamento Obra-Técnica (N:N)
CREATE TABLE obra_tecnicas (
    obra_id INT,
    tecnica_id INT,
    PRIMARY KEY (obra_id, tecnica_id),
    FOREIGN KEY (obra_id) REFERENCES obras_arte(id) ON DELETE CASCADE,
    FOREIGN KEY (tecnica_id) REFERENCES tecnicas_artisticas(id) ON DELETE CASCADE
);

-- Tabela de Análises de IA
CREATE TABLE analises_ia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    obra_id INT NOT NULL,
    versao_modelo VARCHAR(50) DEFAULT 'ArtVision-AI-v2.1',
    confianca_geral DECIMAL(5,2) CHECK (confianca_geral >= 0 AND confianca_geral <= 100),
    
    -- Análise de Estilo
    estilo_detectado VARCHAR(100),
    confianca_estilo DECIMAL(5,2),
    
    -- Análise de Período
    periodo_detectado VARCHAR(100),
    confianca_periodo DECIMAL(5,2),
    
    -- Análise de Autenticidade
    autenticidade_score DECIMAL(5,2),
    probabilidade_original DECIMAL(5,2),
    indicadores_falsificacao TEXT,
    
    -- Análise Técnica
    tecnicas_detectadas JSON,
    paleta_cores JSON,
    composicao_score DECIMAL(5,2),
    
    -- Análise de Conservação
    estado_conservacao_ia ENUM('Excelente', 'Bom', 'Regular', 'Precário', 'Crítico'),
    areas_deterioracao JSON,
    recomendacoes_conservacao TEXT,
    
    -- Análise de Valor
    valor_estimado_ia DECIMAL(15,2),
    fatores_valor JSON,
    
    -- Metadados da Análise
    tempo_processamento_segundos DECIMAL(8,3),
    data_analise TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacoes_ia TEXT,
    
    FOREIGN KEY (obra_id) REFERENCES obras_arte(id) ON DELETE CASCADE
);

-- Tabela de Histórico de Análises
CREATE TABLE historico_analises (
    id INT PRIMARY KEY AUTO_INCREMENT,
    obra_id INT NOT NULL,
    analise_anterior_id INT,
    analise_nova_id INT NOT NULL,
    mudancas_detectadas JSON,
    motivo_reanalise VARCHAR(255),
    usuario_solicitante VARCHAR(100),
    data_reanalise TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (obra_id) REFERENCES obras_arte(id) ON DELETE CASCADE,
    FOREIGN KEY (analise_anterior_id) REFERENCES analises_ia(id) ON DELETE SET NULL,
    FOREIGN KEY (analise_nova_id) REFERENCES analises_ia(id) ON DELETE CASCADE
);

-- Inserção de dados de exemplo

-- Períodos Artísticos
INSERT INTO periodos_artisticos (nome, descricao, ano_inicio, ano_fim, caracteristicas) VALUES
('Renascimento', 'Período de renovação cultural e artística na Europa', 1400, 1600, 'Perspectiva, realismo, humanismo'),
('Barroco', 'Arte dramática e ornamental', 1600, 1750, 'Dramaticidade, movimento, contrastes de luz'),
('Impressionismo', 'Movimento artístico francês', 1860, 1886, 'Pinceladas soltas, luz natural, cores puras'),
('Pós-Impressionismo', 'Reação ao Impressionismo', 1880, 1905, 'Expressão pessoal, simbolismo, estrutura'),
('Modernismo', 'Arte moderna do século XX', 1900, 1945, 'Abstração, experimentação, ruptura com tradição');

-- Técnicas Artísticas
INSERT INTO tecnicas_artisticas (nome, descricao, materiais_comuns) VALUES
('Óleo sobre tela', 'Pintura com tintas à base de óleo', 'Tinta óleo, tela, pincéis, solventes'),
('Afresco', 'Pintura sobre parede úmida', 'Pigmentos, cal, água, parede'),
('Aquarela', 'Pintura com pigmentos solúveis em água', 'Aquarela, papel, pincéis, água'),
('Tempera', 'Pintura com pigmentos e aglutinante', 'Pigmentos, ovo, água, madeira'),
('Escultura em mármore', 'Escultura talhada em mármore', 'Mármore, cinzéis, martelos'),
('Bronze fundido', 'Escultura em bronze fundido', 'Bronze, moldes, fornos');

-- Artistas
INSERT INTO artistas (nome, nome_completo, ano_nascimento, ano_morte, nacionalidade, movimento_artistico, biografia, foto_perfil) VALUES
('Leonardo da Vinci', 'Leonardo di ser Piero da Vinci', 1452, 1519, 'Italiana', 'Renascimento', 'Polímata italiano, pintor, inventor, cientista e engenheiro. Autor da Mona Lisa e A Última Ceia.', '/placeholder.svg?height=200&width=200'),
('Vincent van Gogh', 'Vincent Willem van Gogh', 1853, 1890, 'Holandesa', 'Pós-Impressionismo', 'Pintor pós-impressionista holandês, conhecido por suas pinceladas expressivas e uso vibrante das cores.', '/placeholder.svg?height=200&width=200'),
('Pablo Picasso', 'Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Cipriano de la Santísima Trinidad Ruiz y Picasso', 1881, 1973, 'Espanhola', 'Cubismo', 'Pintor, escultor e ceramista espanhol, co-fundador do movimento cubista.', '/placeholder.svg?height=200&width=200'),
('Claude Monet', 'Oscar-Claude Monet', 1840, 1926, 'Francesa', 'Impressionismo', 'Pintor francês e fundador do movimento impressionista, famoso por suas séries de nenúfares.', '/placeholder.svg?height=200&width=200'),
('Michelangelo', 'Michelangelo di Lodovico Buonarroti Simoni', 1475, 1564, 'Italiana', 'Renascimento', 'Escultor, pintor, arquiteto e poeta italiano do Alto Renascimento.', '/placeholder.svg?height=200&width=200');

-- Obras de Arte
INSERT INTO obras_arte (titulo, artista_id, ano_criacao, periodo_artistico_id, dimensoes, localizacao_atual, valor_estimado, descricao, imagem_caminho, status_conservacao) VALUES
('Mona Lisa', 1, 1503, 1, '77 cm × 53 cm', 'Museu do Louvre, Paris', 850000000.00, 'Retrato de Lisa Gherardini, esposa de Francesco del Giocondo. Obra-prima do Renascimento.', '/placeholder.svg?height=400&width=300', 'Excelente'),
('A Noite Estrelada', 2, 1889, 4, '73.7 cm × 92.1 cm', 'MoMA, Nova York', 100000000.00, 'Pintura pós-impressionista retratando uma vista noturna de Saint-Rémy-de-Provence.', '/placeholder.svg?height=400&width=300', 'Bom'),
('Guernica', 3, 1937, 5, '349.3 cm × 776.6 cm', 'Museu Reina Sofía, Madrid', 200000000.00, 'Pintura cubista retratando os horrores da guerra civil espanhola.', '/placeholder.svg?height=400&width=600', 'Bom'),
('Nenúfares', 4, 1919, 3, '200 cm × 425 cm', 'Museu de l\'Orangerie, Paris', 40000000.00, 'Série de pinturas impressionistas do jardim de Monet em Giverny.', '/placeholder.svg?height=400&width=600', 'Regular'),
('David', 5, 1504, 1, '517 cm altura', 'Galleria dell\'Accademia, Florença', 200000000.00, 'Escultura em mármore representando o herói bíblico David.', '/placeholder.svg?height=600&width=300', 'Bom');

-- Relacionamento Obra-Técnica
INSERT INTO obra_tecnicas (obra_id, tecnica_id) VALUES
(1, 1), -- Mona Lisa - Óleo sobre tela
(2, 1), -- A Noite Estrelada - Óleo sobre tela
(3, 1), -- Guernica - Óleo sobre tela
(4, 1), -- Nenúfares - Óleo sobre tela
(5, 5); -- David - Escultura em mármore

-- Análises de IA
INSERT INTO analises_ia (obra_id, confianca_geral, estilo_detectado, confianca_estilo, periodo_detectado, confianca_periodo, autenticidade_score, probabilidade_original, tecnicas_detectadas, paleta_cores, composicao_score, estado_conservacao_ia, valor_estimado_ia, tempo_processamento_segundos, observacoes_ia) VALUES
(1, 98.5, 'Renascimento Italiano', 99.2, 'Alto Renascimento', 97.8, 99.9, 99.8, '["Sfumato", "Chiaroscuro", "Óleo sobre madeira"]', '["#8B4513", "#DEB887", "#F5DEB3", "#2F4F4F", "#000000"]', 96.7, 'Excelente', 850000000.00, 45.2, 'Obra autêntica com técnicas características de Leonardo. Sfumato perfeitamente executado.'),
(2, 94.3, 'Pós-Impressionismo', 96.1, 'Pós-Impressionismo', 95.7, 98.2, 97.9, '["Impasto", "Pinceladas expressivas", "Óleo sobre tela"]', '["#191970", "#FFD700", "#FFFF00", "#4169E1", "#1E90FF"]', 93.4, 'Bom', 100000000.00, 38.7, 'Pinceladas características de Van Gogh. Movimento e energia típicos do período.'),
(3, 96.8, 'Cubismo Analítico', 98.4, 'Modernismo', 97.2, 99.1, 98.7, '["Fragmentação geométrica", "Monocromia", "Óleo sobre tela"]', '["#000000", "#FFFFFF", "#808080", "#A9A9A9", "#696969"]', 95.8, 'Bom', 200000000.00, 52.1, 'Composição cubista autêntica. Fragmentação e perspectiva múltipla características de Picasso.'),
(4, 91.7, 'Impressionismo', 94.3, 'Impressionismo', 93.8, 96.5, 95.2, '["Pinceladas soltas", "Cores puras", "Óleo sobre tela"]', '["#98FB98", "#87CEEB", "#DDA0DD", "#F0E68C", "#FFB6C1"]', 89.2, 'Regular', 40000000.00, 41.8, 'Técnica impressionista autêntica. Algumas áreas mostram sinais de envelhecimento natural.'),
(5, 97.2, 'Escultura Renascentista', 98.9, 'Alto Renascimento', 96.4, 98.8, 98.1, '["Talha em mármore", "Contrapposto", "Anatomia realista"]', '["#F5F5DC", "#FFFAF0", "#FDF5E6", "#FAF0E6", "#LINEN"]', 97.9, 'Bom', 200000000.00, 67.3, 'Escultura autêntica com técnicas de Michelangelo. Anatomia e proporções perfeitas.');

-- Índices para otimização
CREATE INDEX idx_obras_artista ON obras_arte(artista_id);
CREATE INDEX idx_obras_periodo ON obras_arte(periodo_artistico_id);
CREATE INDEX idx_analises_obra ON analises_ia(obra_id);
CREATE INDEX idx_analises_data ON analises_ia(data_analise);
CREATE INDEX idx_obras_ano ON obras_arte(ano_criacao);
CREATE INDEX idx_artistas_movimento ON artistas(movimento_artistico);

-- Views úteis para consultas
CREATE VIEW vw_obras_completas AS
SELECT 
    o.id,
    o.titulo,
    a.nome as artista_nome,
    a.movimento_artistico,
    o.ano_criacao,
    p.nome as periodo,
    o.dimensoes,
    o.localizacao_atual,
    o.valor_estimado,
    o.imagem_caminho,
    o.status_conservacao
FROM obras_arte o
LEFT JOIN artistas a ON o.artista_id = a.id
LEFT JOIN periodos_artisticos p ON o.periodo_artistico_id = p.id;

CREATE VIEW vw_analises_resumo AS
SELECT 
    o.titulo,
    a.nome as artista,
    ai.confianca_geral,
    ai.estilo_detectado,
    ai.autenticidade_score,
    ai.valor_estimado_ia,
    ai.data_analise
FROM analises_ia ai
JOIN obras_arte o ON ai.obra_id = o.id
LEFT JOIN artistas a ON o.artista_id = a.id
ORDER BY ai.data_analise DESC;
