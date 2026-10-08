import React, { useCallback, useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import RawTool from '@editorjs/raw';
import ImageTool from '@editorjs/image';
import FontStyleTool from './tool/a';
export default function EditorComponent() {
  const editor = useRef<EditorJS | null>(null);
  const editorHolder = useRef<HTMLDivElement>(null);

  const handleSave = useCallback(() => {
    if (!editor.current) return;
    editor.current
      .save()
      .then((outputData) => console.log('Article data: ', outputData))
      .catch((error) => console.log('Saving failed: ', error));
  }, []);

  useEffect(() => {
    if (!editorHolder.current) return;
    if (editor.current) return;
    editor.current = new EditorJS({
      holder: editorHolder.current, // 直接传 DOM
      tools: { raw: RawTool, image: ImageTool, fontStyle: FontStyleTool },
      autofocus: true,
      data: {
        blocks: [{ type: 'raw', data: { html: '<p>请在这里输入内容</p>' } }],
      },
    });

    return () => {
      editor.current?.destroy?.();
      editor.current = null;
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div>
        <button onClick={handleSave}>保存</button>
      </div>
      <div ref={editorHolder} className="w-full flex-1" />
    </div>
  );
}
