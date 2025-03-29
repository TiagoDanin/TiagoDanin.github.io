declare module 'fast-xml-parser' {
  export class XMLParser {
    constructor(options?: {
      ignoreAttributes?: boolean;
      parseAttributeValue?: boolean;
      isArray?: (name: string) => boolean;
      [key: string]: any;
    });
    
    parse(xml: string): any;
  }
} 