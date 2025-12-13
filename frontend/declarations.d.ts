// declarations.d.ts
declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.jpeg' {
  const value: any;
  export default value;
}

declare module '*.gif' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  const value: any;
  export default value;
}

declare module '*.webp' {
  const value: any;
  export default value;
}

// Environment variables
declare module '@env' {
  export const EXPO_PUBLIC_API_URL: string;
}