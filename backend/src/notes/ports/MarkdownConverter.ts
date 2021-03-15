export interface MarkdownConverter {
  convertToHTML(markdownDocument: string): string;
}
