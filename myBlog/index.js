import express from "express";
import bodyParser from "body-parser";
import fs from "fs"
import methodOverride from "method-override"

const port = 3000;
const app = express();
const nomePosts = [];

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.render("index.ejs", { posts: nomePosts});
});

app.get("/publicar", (req, res) => {
    res.render("publicar.ejs");
});

app.get("/post", (req, res) => {
    const postEscolhido = req.query.titulo;
    const nomeArquivo = postEscolhido + ".txt";

    // Leitura do post
    fs.readFile("posts/" + nomeArquivo, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Erro ao tentar ler o post");
        }
        
        res.render("post.ejs", { titulo: postEscolhido, texto: data});
    });

});

app.post("/post", (req, res) => {
    const nomeArquivo = req.body["titulo"] + ".txt";
    const textoPost = req.body["texto"];

    // Inserindo o nome do post no vetor de posts
    nomePosts.push(req.body["titulo"]);

    // Criando o arquivo do post
    fs.writeFile("posts/" + nomeArquivo, textoPost, (err) => {
        if (err) throw err;
        console.log("Arquivo salvo");
    });

    res.redirect("/");
})

app.delete("/post", (req, res) => {
    const postEscolhido = req.query.titulo;
    const nomeArquivo = postEscolhido + ".txt";

    // Excluindo o arquivo do post
    fs.rm("posts/" + nomeArquivo, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao excluir");
        }

        console.log(`Arquivo ${postEscolhido} foi removido.`);
    });

    // Retirando o nome do post do vetor de posts
    const index = nomePosts.indexOf(postEscolhido);

    if(index > -1) {
        nomePosts.splice(index, 1);
    }

    res.redirect("/");
});

app.put("/post", (req,res) => {
    const postEscolhido = req.query.titulo;
    const nomeArquivoAntigo = postEscolhido + ".txt";
    const nomeArquivoNovo = req.body["titulo"] + ".txt";
    const textoPost = req.body["texto"];

    // Excluindo o post desatualizado
    fs.rm("posts/" + nomeArquivoAntigo, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao excluir o arquivo");
        }

        console.log(`Arquivo ${postEscolhido} foi removido.`);
    });

    // Retirando o post desatualizado do vetor de nomes de posts
    const index = nomePosts.indexOf(postEscolhido);

    if(index > -1) {
        nomePosts.splice(index, 1);
    }

    // Inserindo o novo titulo do post no vetor
    nomePosts.push(req.body["titulo"]);

    // Salvando o post atualizado
    fs.writeFile("posts/" + nomeArquivoNovo, textoPost, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Erro ao salvar o arquivo");
        }
        console.log("Arquivo salvo");
    });

    res.redirect("/");

});

app.get("/editar", (req, res) => {
    const postEscolhido = req.query.titulo;
    const nomeArquivo = postEscolhido + ".txt";

    fs.readFile("posts/" + nomeArquivo, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Não foi possivel ler o arquivo");
        }
        
        res.render("editar.ejs", { titulo: postEscolhido, texto: data});
    });
})
app.listen(port, () => {
    console.log(`I'm listening on port ${port}`);
})