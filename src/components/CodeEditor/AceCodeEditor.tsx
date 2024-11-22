import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-json.js';
import 'ace-builds/src-noconflict/mode-python.js';
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
      showGutter={gutter}
      showPrintMargin={true}
      wrapEnabled={wrap}
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
        cursorStyle: 'slim',
        highlightSelectedWord: true,
        tabSize: 4,
        behavioursEnabled: true,
        readOnly: readonly || false,
        enableLiveAutocompletion: false,
        autoScrollEditorIntoView: true,
        useWorker: true,
      }}
    />
  );
};

export default AceCodeEditor;
