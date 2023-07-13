import axios from 'axios';
import PDFDocument from 'pdfkit';

export default defineEventHandler(async (event) => {
  const { chapterId, comicId } = getQuery(event);

  const { data } = await axios.get(`/comics/${comicId}/chapters/${chapterId}`, {
    baseURL: process.env.BASE_URL,
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
    const { data } = await axios.get(src, {
      responseType: 'arraybuffer',
    });

    // @ts-ignore
    const img = doc.openImage(data);
    doc.addPage({ size: [img.width, img.height] });
    doc.image(img, 0, 0);
  }

  doc.end();

  event.node.res.end();
});
