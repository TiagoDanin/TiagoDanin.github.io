'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code2, Terminal, PlayCircle, Bug, Search } from "lucide-react";

interface PropertyDetails {
  name: string;
  type: string;
  subProperties?: string[];
  error?: string;
}

interface ConsoleMessage {
  type: 'log' | 'error' | 'warn';
  message: string;
  timestamp: number;
}

export default function WebViewPage() {
  const [properties, setProperties] = useState<PropertyDetails[]>([]);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [code, setCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const consoleOutputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Intercept console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = function (...args: unknown[]) {
      setConsoleMessages((prev) => [
        ...prev,
        { type: 'log', message: args.join(' '), timestamp: Date.now() },
      ]);
      originalLog.apply(console, args);
    };

    console.error = function (...args: unknown[]) {
      setConsoleMessages((prev) => [
        ...prev,
        { type: 'error', message: args.join(' '), timestamp: Date.now() },
      ]);
      originalError.apply(console, args);
    };

    console.warn = function (...args: unknown[]) {
      setConsoleMessages((prev) => [
        ...prev,
        { type: 'warn', message: args.join(' '), timestamp: Date.now() },
      ]);
      originalWarn.apply(console, args);
    };

    // Generate window properties report
    generateWindowReport();

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  useEffect(() => {
    if (consoleOutputRef.current) {
      consoleOutputRef.current.scrollTop = consoleOutputRef.current.scrollHeight;
    }
  }, [consoleMessages]);

  const generateWindowReport = () => {
    const props: PropertyDetails[] = [];

    for (const topProp in window) {
      try {
        const obj = (window as any)[topProp];
        const propDetail: PropertyDetails = {
          name: topProp,
          type: typeof obj,
        };

        if (typeof obj === 'object' && obj !== null) {
          try {
            const subProps = Object.getOwnPropertyNames(obj);
            propDetail.subProperties = subProps;
          } catch (e) {
            propDetail.error = e instanceof Error ? e.message : 'Cannot enumerate sub-properties';
          }
        } else if (typeof obj === 'function') {
          try {
            const funcProps = Object.getOwnPropertyNames(obj);
            propDetail.subProperties = funcProps;
          } catch (e) {
            propDetail.error = e instanceof Error ? e.message : 'Cannot access function properties';
          }
        }

        props.push(propDetail);
      } catch (e) {
        props.push({
          name: topProp,
          type: 'unknown',
          error: e instanceof Error ? e.message : 'Cannot access',
        });
      }
    }

    setProperties(props);
  };

  const inspectProperty = (propName: string) => {
    try {
      const obj = (window as any)[propName];
      console.log(`Inspecting ${propName}:`, obj);
      const details = {
        type: typeof obj,
        value: obj,
        properties: Object.getOwnPropertyNames(obj),
        descriptors: Object.getOwnPropertyDescriptor(window, propName),
      };
      console.log('Details:', details);
    } catch (e) {
      console.error(`Error inspecting ${propName}:`, e);
    }
  };

  const executeCode = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(code);
      console.log('Code execution result:', result);
    } catch (e) {
      console.error('Code execution error:', e);
    }
  };

  const clearConsole = () => {
    setConsoleMessages([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      executeCode();
    }
  };

  const filteredProperties = properties.filter(prop =>
    prop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="mb-4">
              <Bug className="h-4 w-4 mr-2" />
              Bug Bounty POC Environment
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              WebView Inspector
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore window object properties, execute JavaScript code, and test POCs for bug bounty research
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Window Properties Panel */}
            <Card className="flex flex-col h-[600px]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    <CardTitle>Window Properties</CardTitle>
                  </div>
                  <Badge variant="outline">{filteredProperties.length} properties</Badge>
                </div>
                <CardDescription>
                  Click on property names to inspect in console
                </CardDescription>
                <div className="pt-2">
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {filteredProperties.map((prop) => (
                    <div key={prop.name} className="border-l-2 border-primary/20 pl-4 hover:border-primary/50 transition-colors">
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => inspectProperty(prop.name)}
                          className="text-primary hover:underline font-mono text-sm font-semibold"
                        >
                          {prop.name}
                        </button>
                        <Badge variant="secondary" className="text-xs">
                          {prop.type}
                        </Badge>
                      </div>
                      {prop.error && (
                        <div className="text-destructive text-xs mt-1">
                          Error: {prop.error}
                        </div>
                      )}
                      {prop.subProperties && (
                        <details className="mt-2 text-sm text-muted-foreground">
                          <summary className="cursor-pointer hover:text-foreground">
                            {prop.subProperties.length} sub-properties
                          </summary>
                          <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5">
                            {prop.subProperties.slice(0, 20).map((subProp, idx) => (
                              <li key={idx} className="font-mono text-xs">
                                {subProp}
                              </li>
                            ))}
                            {prop.subProperties.length > 20 && (
                              <li className="text-xs italic">
                                ... and {prop.subProperties.length - 20} more
                              </li>
                            )}
                          </ul>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Console & Code Execution Panel */}
            <div className="flex flex-col gap-6">
              {/* Console Output */}
              <Card className="flex flex-col h-[300px]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-primary" />
                      <CardTitle>Console Output</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" onClick={clearConsole}>
                      Clear
                    </Button>
                  </div>
                  <CardDescription>
                    Console logs, warnings, and errors appear here
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                  <div
                    ref={consoleOutputRef}
                    className="font-mono text-sm space-y-1 bg-muted/30 p-3 rounded-md min-h-full"
                  >
                    {consoleMessages.length === 0 ? (
                      <div className="text-muted-foreground italic">
                        Console output will appear here...
                      </div>
                    ) : (
                      consoleMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={
                            msg.type === 'error'
                              ? 'text-destructive'
                              : msg.type === 'warn'
                              ? 'text-yellow-600 dark:text-yellow-500'
                              : 'text-foreground'
                          }
                        >
                          <span className="opacity-50">[{msg.type.toUpperCase()}]</span> {msg.message}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Code Execution */}
              <Card className="flex flex-col h-[284px]">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-primary" />
                    <CardTitle>Code Execution</CardTitle>
                  </div>
                  <CardDescription>
                    Execute JavaScript code (Ctrl/Cmd + Enter to run)
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="// Enter your JavaScript code here&#x0A;console.log('Hello, Bug Bounty!');"
                    className="flex-1 w-full bg-muted/30 text-foreground border rounded-md p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button onClick={executeCode} className="w-full">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Run Code
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tools for exploring browser environments and testing security POCs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Search className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Property Inspector</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Explore all window object properties with search functionality and detailed inspection
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Terminal className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Console Interceptor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Captures console.log, console.error, and console.warn with color-coded output
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Code2 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Code Execution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Execute arbitrary JavaScript code for testing and POC development
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
