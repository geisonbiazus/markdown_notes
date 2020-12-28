import marked from 'marked';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = (new JSDOM('').window as any) as Window;
const DOMPurify = createDOMPurify(window);

export class MarkdownConverter {
  public convertToHTML(markdownDocument: string): string {
    const html = marked(markdownDocument);
    return this.sanitizeHTML(html);
  }

  private sanitizeHTML(html: string): string {
    return DOMPurify.sanitize(html);
  }
}
