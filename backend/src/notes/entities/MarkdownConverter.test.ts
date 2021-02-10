import { MarkdownConverter } from './MarkdownConverter';

describe('MarkdownConverter', () => {
  const converter = new MarkdownConverter();

  it('converts the given test from markdown to HTML', () => {
    expect(converter.convertToHTML(sampleMarkdown)).toEqual(sampleHTML);
  });

  it('sanitizes the ouput HTML', () => {
    const markdown = '<div>my div</div><script>my script</script>';
    const html = '<div>my div</div>';

    expect(converter.convertToHTML(markdown)).toEqual(html);
  });
});

const sampleMarkdown = `# Title 1

## Title 2

### Title 3

#### Title 4

This is a paragraph

This is a paragraph.
But now with a line break in the middle.

**List:**

- item 1
- item 2
- item 3

*Another list*:

1. Item 1
1. Item 2
1. Item 3

[Link](http://example.com)

![Image](http://example.com/image.png)

\`\`\`
Code Block
\`\`\`
`;

const sampleHTML = `<h1 id="title-1">Title 1</h1>
<h2 id="title-2">Title 2</h2>
<h3 id="title-3">Title 3</h3>
<h4 id="title-4">Title 4</h4>
<p>This is a paragraph</p>
<p>This is a paragraph.
But now with a line break in the middle.</p>
<p><strong>List:</strong></p>
<ul>
<li>item 1</li>
<li>item 2</li>
<li>item 3</li>
</ul>
<p><em>Another list</em>:</p>
<ol>
<li>Item 1</li>
<li>Item 2</li>
<li>Item 3</li>
</ol>
<p><a href="http://example.com">Link</a></p>
<p><img alt="Image" src="http://example.com/image.png"></p>
<pre><code>Code Block
</code></pre>
`;
