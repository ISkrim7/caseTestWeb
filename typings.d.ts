declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
}

declare namespace JSX {
  interface IntrinsicElements {
    style: React.DetailedHTMLProps<
      React.StyleHTMLAttributes<HTMLStyleElement>,
      HTMLStyleElement
    > & {
      jsx?: boolean;
      global?: boolean;
    };
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    APP_ENV?: string;
  }
}
