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

    fs.readFile("posts/" + nomeArquivo, 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }
        
        res.render("post.ejs", { titulo: postEscolhido, texto: data});
    });

});

app.delete("/post", (req, res) => {
    const postEscolhido = req.query.titulo;
    const nomeArquivo = postEscolhido + ".txt";

    fs.rm("posts/" + nomeArquivo, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao excluir");
        }

        console.log(`Arquivo ${postEscolhido} foi removido.`);
    });

    const index = nomePosts.indexOf(postEscolhido);

    console.log(nomePosts);

    if(index > -1) {
        nomePosts.splice(index, 1);
    }

    console.log(nomePosts);

    res.redirect("/");
});

app.put("/post", (req,res) => {
    const postEscolhido = req.query.titulo;
    const nomeArquivo = postEscolhido + ".txt";

    fs.readFile("posts/" + nomeArquivo, 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }
        
        res.render("publicar.ejs", { titulo: postEscolhido, texto: data});
    });

    fs.rm("posts/" + nomeArquivo, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao excluir");
        }

        console.log(`Arquivo ${postEscolhido} foi removido.`);
    });

    const index = nomePosts.indexOf(postEscolhido);

    console.log(nomePosts);

    if(index > -1) {
        nomePosts.splice(index, 1);
    }

    console.log(nomePosts);

});

app.post("/publicar", (req, res) => {
    const nomeArquivo = req.body["titulo"] + ".txt";
    const textoPost = req.body["texto"];
    
    nomePosts.push(req.body["titulo"]);

    fs.writeFile("posts/"+ nomeArquivo, textoPost, (err) => {
        if (err) throw err;
        console.log("O post foi salvo.");
    });

    res.redirect("/");
});

app.listen(port, () => {
    console.log(`I'm listening on port ${port}`);
})