import axios from 'axios';
import jsPDF from 'jspdf';

export const downloadPdf = async (data: {
  comicId: string;
  chapter: number;
}) => {
  const { chapter, comicId } = data;
  const config = useRuntimeConfig();
  const baseURL = config.public.baseURL as string;
  const res = await axios.get(`/comics/${comicId}/chapters/${chapter}`, {
    baseURL,
  });
  const { images, chapter_name, comic_name } = res.data;
  const multiPng = await generatePdf(images);
  multiPng.output('dataurlstring', `${comic_name}(${chapter_name})`);
  multiPng.output('save', `${comic_name}(${chapter_name})`);
  return chapter;
};

async function generatePdf(
  images: { page: number; src: string }[]
): Promise<any> {
  const doc = new jsPDF({ orientation: 'portrait' });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  for (const [i, { src }] of images.entries()) {
    doc.addImage({
      imageData: src,
      width,
      height,
      x: 0,
      y: 0,
      format: 'JPEG',
      compression: 'FAST',
    });
    if (i !== images.length - 1) {
      doc.addPage();
    }
  }
  return doc;
}
