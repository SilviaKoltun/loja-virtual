-- Carga inicial do catálogo e dos usuários a partir de prisma/dev.db.
-- Preserva os IDs e não altera registros já existentes com o mesmo ID.
-- Dados de carrinhos, pedidos e pagamentos não fazem parte da carga.

BEGIN TRANSACTION;

INSERT INTO "Categoria" ("id", "nome") VALUES
    (1, 'Moda'),
    (2, 'Acessórios'),
    (3, 'Decoração'),
    (4, 'Organização'),
    (5, 'Pet'),
    (6, 'Oficina')
ON CONFLICT("id") DO NOTHING;

INSERT INTO "Produto" ("id", "nome", "descricao", "preco", "disponivel", "categoriaId", "imagem") VALUES
    (2, 'Suporte para Celular 3D', 'Ajustável e dobrável', 25.9, 1, 2, './assets/suporte_para_Celular_3D.png'),
    (3, 'Vaso Decorativo 3D', 'Design moderno e elegante', 39.9, 1, 3, './assets/Vaso_Decorativo_3D.png'),
    (4, 'Organizador de Cabo 3D', 'Mais organização para seus cabos', 19.9, 1, 4, './assets/Organizador_de_Cabo_3D.png'),
    (5, 'Organizador de blocas 3D', 'Suporte para armazenar e organizar blocas de diferentes tamanhos.', 34.9, 1, 6, './assets/porta_bloca_3d.png'),
    (6, 'Porta Coleira Pet 3D', 'Suporte de parede para organizar coleiras.', 24.9, 1, 5, './assets/porta_coleira_3d.png'),
    (7, 'Porta Saquinho Pet 3D', 'Suporte compacto para rolinho de saquinho, para usar durante o passeio.', 14.9, 1, 5, './assets/porta_Saquinho_pet.png'),
    (8, 'Suporte para Fones de Ouvido 3d', 'Suporte compacto para organizar e apoiar fones de ouvido.', 29.9, 1, 2, './assets/suporte_para_fone_3d.png'),
    (9, 'Luminaria Decorativa 3D', 'Para deixar seu ambiente mais aconchegante .', 49.9, 1, 3, './assets/luminaria_decorativa_3d.png'),
    (10, 'Porta Lapis 3D', 'Organizador de mesa, para lapis e canetas.', 19.9, 1, 4, './assets/porta_lapis_3d.png'),
    (11, 'Suporte para Chaves 3D', 'organizador para chaves  e pequenas ferramentas.', 39.9, 1, 6, './assets/Suporte_chaves_ferramentas_3d.png')
ON CONFLICT("id") DO NOTHING;

INSERT INTO "User" ("id", "nome", "email", "telefone", "senha", "googleId") VALUES
    (1, 'Silvia Borges', 'silviakoltun@gmail.com', NULL, NULL, '108289246009519725809'),
    (2, 'Ana', 'ana@gmail.com', '43 3333-4444', '$argon2id$v=19$m=65536,p=1,t=3$t+jzu18zFXMmYGwMhbY/yg$oO7gMJCwqtQW1qpUTmBdZYxdI+MXrdMsDim4/wWsub4', NULL),
    (3, 'Gabriel Ferreira', 'gabriel@teste.com', '43 2222 2222', '$argon2id$v=19$m=65536,p=1,t=3$OCsqiHB14vfs1e2JoNW9tQ$SCneZQMWmQyqOyiuZWwbHOFvWpoWZ6uPSYkvSPj9Y14', NULL),
    (4, 'Nathalia Borges Koltun', 'nathalia@gmail.com', '43 33334444', '$argon2id$v=19$m=65536,p=1,t=3$UdpxyVKu7rkV6pdCZpKqtw$lFXizIXJYzlP0oitygZqBlnrT76bry+iRZ8H4QCu30E', NULL),
    (5, 'Silvia Borges', 'silvia@gmail.com', '43 33334444', '$argon2id$v=19$m=65536,p=1,t=3$uXYfFVtZboYPFvQ8F6iGVw$hJZwcKLQ2RKudiQnTYCAIDftGmt8XUsQlxz5CA3L+54', NULL),
    (6, 'Silvia Ribeiro Borges Koltun', 'silvia.koltun@aluno.senai.br', NULL, NULL, '112924063551101570939')
ON CONFLICT("id") DO NOTHING;

COMMIT;
