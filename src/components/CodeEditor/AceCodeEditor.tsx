import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-html.js';
import 'ace-builds/src-noconflict/mode-json.js';
import 'ace-builds/src-noconflict/mode-mysql.js';
import 'ace-builds/src-noconflict/mode-python.js';
import 'ace-builds/src-noconflict/mode-text.js';
import 'ace-builds/src-noconflict/theme-twilight';
import { FC, useState } from 'react';
import AceEditor from 'react-ace';

interface selfProps {
  value?: any;
  readonly?: boolean;
  height?: string;
  onChange?: (value: string) => void;
  _mode?: string;
  showLineNumbers?: boolean;
  wrap?: boolean;
  gutter?: boolean;
}

const AceCodeEditor: FC<selfProps> = (props) => {
  const {
    value,
    readonly,
    height = '30vh',
    onChange,
    showLineNumbers = true,
    _mode = 'json',
    gutter = true,
    wrap = true,
  } = props;
  const [mode, setMode] = useState(_mode);
  return (
    // @param onChange - 当代码内容发生变化时的回调函数
    // @param showGutter - 是否显示行号
    // @param showPrintMargin - 是否显示打印边距
    // @param wrapEnabled - 是否启用代码自动换行
    // @param highlightActiveLine - 是否高亮当前行
    // @param editorProps - 编辑器的其他属性设置
    // @param setOptions - 编辑器的配置选项
    <AceEditor
      style={{ borderRadius: 10 }}
      theme="twilight"
      mode={mode}
      readOnly={readonly || false}
      height={height || '100%'}
      width={'100%'}
      value={value}
      fontSize={14}
      onChange={onChange}
      showGutter={gutter} //是否显示行号
      showPrintMargin={true}
      wrapEnabled={wrap} // 是否启用代码自动换行
      highlightActiveLine={true}
      editorProps={{
        $blockScrolling: true,
        $highlightPending: true,
        $highlightTagPending: true,
        $enableMultiselect: true,
      }}
      setOptions={{
        showLineNumbers: showLineNumbers,
        highlightActiveLine: true,
        cursorStyle: 'smooth',
        highlightSelectedWord: true,
        tabSize: 4,
        behavioursEnabled: true,
        readOnly: readonly || false,
        enableLiveAutocompletion: false,
        autoScrollEditorIntoView: true,
        useWorker: true,
        useSoftTabs: true,
      }}
    />
  );
};

export default AceCodeEditor;
