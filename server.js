let path = require("path");
let fsp = require("fs/promises");
let express = require("express");

let root = process.cwd();
let isProduction = process.env.NODE_ENV === "production";

function resolve(p) {
  return path.resolve(__dirname, p);
}

async function createServer() {
  let app = express();
  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;

  if (!isProduction) {
    vite = await require("vite").createServer({
      root,
      server: { middlewareMode: "ssr" },
    });

    app.use(vite.middlewares);
  } else {
    app.use(require("compression")());
    app.use(express.static(resolve("dist/client")));
  }

  app.use("*", async (req, res) => {
    let url = req.originalUrl;
    let preloadedState = require("./src/app/Store").getPreloadedState();

    try {
      let template;
      let render;

      if (!isProduction) {
        template = await fsp.readFile(resolve("index.html"), "utf8");
        template = await vite.transformIndexHtml(url, template);
        render = await vite
          .ssrLoadModule("src/entry-server.jsx")
          .then((m) => m.render);
      } else {
        template = await fsp.readFile(
          resolve("dist/client/index.html"),
          "utf8"
        );
        render = (await import("./dist/server/entry-server.mjs")).render;
      }

      let html = template.replace(
        `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
    <!--app-head-->
  </head>
  <body>
    <div id="root"><!--app-html--></div>
    <script type="module" src="/src/entry-client.jsx"></script>
  </body>
</html>
`,
        `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
    <!--app-head-->
  </head>
  <body>
    <div id="root">${render(url)}</div>
    <script>window.__PRELOADED_STATE__ = ${JSON.stringify(
      preloadedState
    ).replace(/</g, "\\u003c")}
         </script>
    <script type="module" src="/src/entry-client.jsx"></script>
  </body>
</html>
`
      );
      res.setHeader("Content-Type", "text/html");
      return res.status(200).end(html);
    } catch (error) {
      if (!isProduction) {
        vite.ssrFixStacktrace(error);
      }
      console.log(error.stack);
      res.status(500).end(error.stack);
    }
  });

  return app;
}

createServer().then((app) => {
  app.listen(3000, () => {
    console.log("HTTP server is running at http://localhost:3000");
  });
});
