// FontInlineTool.ts
export default class FontInlineTool {
  static get isInline() {
    return true; // 必须设置为 true
  }

  static get toolbox() {
    return {
      title: 'FontStyle',
      icon: '🖌️',
    };
  }

  constructor({ api, data }: any) {
    this.api = api;
    this.data = data || {};
  }

  render() {
    const span = document.createElement('span');
    span.style.color = this.data.color || '';
    span.style.backgroundColor = this.data.background || '';
    span.style.fontWeight = this.data.bold ? 'bold' : '';
    span.style.fontStyle = this.data.italic ? 'italic' : '';
    span.style.textDecoration = this.data.underline ? 'underline' : '';
    return span;
  }

  surround(range: Range) {
    if (!range) return;

    const span = this.render();
    range.surroundContents(span);
    this.api.selection.expandToTag(span);
  }

  checkState() {
    const selection = window.getSelection();
    if (!selection || !selection.anchorNode) return false;
    const parent = selection.anchorNode.parentElement;
    return parent && parent.tagName === 'SPAN';
  }

  renderActions() {
    // 可在工具栏显示的按钮或颜色选择器
  }

  save(element: HTMLElement) {
    return {
      text: element.innerHTML,
      color: element.style.color,
      background: element.style.backgroundColor,
      bold: element.style.fontWeight === 'bold',
      italic: element.style.fontStyle === 'italic',
      underline: element.style.textDecoration === 'underline',
    };
  }
}
