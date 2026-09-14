const Database = require("better-sqlite3");

const bancoAtual = new Database("./prisma/dev.db");
const backup = new Database("./prisma/dev-backup.db");

try {
    const categorias = backup.prepare(`
        SELECT * FROM Categoria
    `).all();

    const produtos = backup.prepare(`
        SELECT * FROM Produto
    `).all();

    const inserirCategoria = bancoAtual.prepare(`
        INSERT INTO Categoria (id, nome)
        VALUES (?, ?)
    `);

    const inserirProduto = bancoAtual.prepare(`
        INSERT INTO Produto (
            id,
            nome,
            descricao,
            preco,
            disponivel,
            imagem,
            categoriaId
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const transacao = bancoAtual.transaction(() => {

        for (const categoria of categorias) {
            inserirCategoria.run(
                categoria.id,
                categoria.nome
            );
        }

        for (const produto of produtos) {
            inserirProduto.run(
                produto.id,
                produto.nome,
                produto.descricao,
                produto.preco,
                produto.disponivel,
                produto.imagem,
                produto.categoriaId
            );
        }

    });

    transacao();

    console.log("Backup restaurado com sucesso.");
    console.log(`${categorias.length} categorias restauradas.`);
    console.log(`${produtos.length} produtos restaurados.`);

} catch (erro) {

    console.error("Erro ao restaurar:", erro.message);

} finally {

    bancoAtual.close();
    backup.close();

}