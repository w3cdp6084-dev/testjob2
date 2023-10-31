import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { useRouter } from 'next/router';
import remark from 'remark';
import html from 'remark-html';
import { GetStaticPaths, GetStaticProps } from 'next';

const docsDirectory = path.join(process.cwd(), 'docs');

type DocData = {
  slug: string;
  title: string;
  contentHtml: string;
};

type DocPageProps = {
  docData: DocData;
};

export default function DocPage({ docData }: DocPageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{docData.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: docData.contentHtml }} />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const filenames = fs.readdirSync(docsDirectory);
  const slugs = filenames.map(filename => filename.replace(/\.md$/, ''));
  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const fullPath = path.join(docsDirectory, `${params.slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    props: {
      docData: {
        slug: params.slug as string,
        contentHtml,
        ...matterResult.data
      } as DocData
    }
  };
}
