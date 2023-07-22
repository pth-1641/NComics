import PDFDocument from 'pdfkit';

export default defineEventHandler(async (event) => {
  const { chapterId, comicId } = getQuery(event);

  if (!chapterId || !comicId) {
    return {
      status: 400,
      message: 'Bad request',
    };
  }

  const { baseURL } = useRuntimeConfig().public;

  const data: any = await $fetch(`/comics/${comicId}/chapters/${chapterId}`, {
    baseURL,
  });
  const { images, chapter_name, comic_name } = data;

  const doc = new PDFDocument({ autoFirstPage: false });

  const filename = encodeURIComponent(`${comic_name}(${chapter_name})`);
  const stream = event.node.res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment;filename=${filename}.pdf`,
  });

  doc.on('data', (chunk) => stream.write(chunk));
  doc.on('end', () => stream.end());

  for (const { src } of images) {
    const data: any = await $fetch(baseURL + src, {
      responseType: 'arrayBuffer',
    });

    // @ts-ignore
    const img = doc.openImage(data);
    doc.addPage({ size: [img.width, img.height] });
    doc.image(img, 0, 0);
  }

  doc.end();

  event.node.res.end();
});
