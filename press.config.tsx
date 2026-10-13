import { defineConfig } from "fumapress";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { metaSchema, pageSchema } from "fumapress/adapters/mdx/schema";
import { defineDocs } from "fumadocs-mdx/macro";
import { applyMdxPreset } from "fumadocs-mdx/config";
import remarkMath from "remark-math";
import remarkDirective from "remark-directive";
import defaultMdxComponents, { createRelativeLink } from "fumadocs-ui/mdx";
import rehypeKatex from "rehype-katex";
import { remarkComponents } from "./src/lib/remark-components";
import { remarkStatements } from "./src/lib/remark-statements";
import { mdxComponents } from "./src/components/mdx";
import { createNotebookLayoutPage } from "fumapress/layouts/notebook";

const NotebookLayout = createNotebookLayoutPage<typeof config.$context>();

const docs = defineDocs({
  dir: "content",
  docs: {
    async: true,
    schema: pageSchema,
    lastModified: true,
    mdxOptions: applyMdxPreset({
      remarkPlugins: [
        remarkMath,
        remarkDirective,
        remarkComponents,
        remarkStatements,
      ],
      rehypePlugins: (v) => [rehypeKatex, ...v],
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

const config = defineConfig({
  content: docs.toFumadocsSource(),
  site: {
    name: "Lee Beydoun",
    // the URL where your site is deployed, needed for SEO features like sitemap:
    baseUrl: "https://leebeydoun.github.io/leekb",
  },
  mode: "static",
  renderPage: (props) => <NotebookLayout {...props} />,
  meta: {
    root() {
      return (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Geist:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
            rel="stylesheet"
          />
        </>
      );
    },
  },
}).adapters(
  fumadocsMdx({
    // the defaults, plus our components so content files can use them without importing
    async getMdxComponents(page) {
      return {
        ...defaultMdxComponents,
        a: createRelativeLink(await this.getLoader(), page),
        ...mdxComponents,
      };
    },
  }),
);

export default config;
