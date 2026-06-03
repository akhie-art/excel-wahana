"use client";

import React, { useEffect, useRef } from "react";
import { Undo, Redo } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Markdown <-> HTML Parsers ────────────────────────────────────────────────

export const markdownToHtml = (md: string): string => {
  if (!md) return "<p><br></p>";
  
  const lines = md.split("\n");
  const processed: string[] = [];
  
  let currentListType: "ol" | "ul" | null = null;
  let currentListItems: string[] = [];
  let currentListStart = 1;
  
  const flushList = () => {
    if (!currentListType) return;
    if (currentListType === "ol") {
      processed.push(`<ol start="${currentListStart}">${currentListItems.map(item => `<li>${item}</li>`).join("")}</ol>`);
    } else {
      processed.push(`<ul>${currentListItems.map(item => `<li>${item}</li>`).join("")}</ul>`);
    }
    currentListItems = [];
    currentListType = null;
  };
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Check if line is a list item BEFORE escaping HTML to keep regex clean
    const numListMatch = line.match(/^(\d+)\.\s(.*)/);
    const bulletListMatch = line.match(/^([*\-])\s(.*)/);
    
    if (numListMatch) {
      if (currentListType !== "ol") {
        flushList();
        currentListType = "ol";
        currentListStart = parseInt(numListMatch[1], 10);
      }
      
      let itemContent = numListMatch[2];
      itemContent = itemContent
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      
      // Formatting
      itemContent = itemContent.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      itemContent = itemContent.replace(/\*(.*?)\*/g, "<em>$1</em>");
      itemContent = itemContent.replace(/_(.*?)_/g, "<em>$1</em>");
      itemContent = itemContent.replace(/`(.*?)`/g, "<code>$1</code>");
      
      currentListItems.push(itemContent);
    } else if (bulletListMatch) {
      if (currentListType !== "ul") {
        flushList();
        currentListType = "ul";
      }
      
      let itemContent = bulletListMatch[2];
      itemContent = itemContent
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      
      // Formatting
      itemContent = itemContent.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      itemContent = itemContent.replace(/\*(.*?)\*/g, "<em>$1</em>");
      itemContent = itemContent.replace(/_(.*?)_/g, "<em>$1</em>");
      itemContent = itemContent.replace(/`(.*?)`/g, "<code>$1</code>");
      
      currentListItems.push(itemContent);
    } else {
      flushList();
      
      let html = line;
      html = html
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      
      // Formatting
      html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
      html = html.replace(/_(.*?)_/g, "<em>$1</em>");
      html = html.replace(/`(.*?)`/g, "<code>$1</code>");
      
      if (!html.trim()) {
        processed.push("<p><br></p>");
      } else {
        processed.push(`<p>${html}</p>`);
      }
    }
  }
  
  flushList();
  return processed.join("");
};

export const htmlToMarkdown = (html: string): string => {
  if (!html) return "";
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  
  let olCounter = 0;
  
  const parseNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || "";
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tagName = el.tagName.toLowerCase();
      
      if (tagName === "ol") {
        const startAttr = el.getAttribute("start");
        if (startAttr) {
          olCounter = parseInt(startAttr, 10) - 1;
        }
      }
      
      let childrenText = "";
      el.childNodes.forEach((child) => {
        childrenText += parseNode(child);
      });
      
      switch (tagName) {
        case "strong":
        case "b":
          return `**${childrenText}**`;
        case "em":
        case "i":
          return `*${childrenText}*`;
        case "code":
          return `\`${childrenText}\``;
        case "li":
          const parentTag = el.parentElement?.tagName.toLowerCase();
          if (parentTag === "ol") {
            olCounter++;
            return `${olCounter}. ${childrenText}\n`;
          } else {
            return `* ${childrenText}\n`;
          }
        case "p":
        case "div":
          return childrenText ? `${childrenText}\n` : "\n";
        case "br":
          return "\n";
        default:
          return childrenText;
      }
    }
    
    return "";
  };
  
  let markdown = "";
  doc.body.childNodes.forEach((node) => {
    markdown += parseNode(node);
  });
  
  return markdown
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

// ─── RichTextEditor Component ──────────────────────────────────────────────────

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  editorKey: string | number;
  editingStepId: string | null;
  formSubTab: string;
  minHeightClass?: string;
  className?: string;
}

export function RichTextEditor({
  label,
  value,
  onChange,
  editorKey,
  editingStepId,
  formSubTab,
  minHeightClass = "min-h-[120px]",
  className = "",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync state content into editor DOM
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = markdownToHtml(value);
    }
  }, [editingStepId, editorKey, formSubTab]);

  const handleFormat = (command: string, formatValue: string = "") => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();

    if (command === "code") {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        
        let parentNode = range.commonAncestorContainer;
        if (parentNode.nodeType === Node.TEXT_NODE) {
          parentNode = parentNode.parentNode!;
        }
        
        if ((parentNode as HTMLElement).tagName?.toLowerCase() === "code") {
          // Unwrap
          const parentEl = parentNode as HTMLElement;
          const textNode = document.createTextNode(parentEl.textContent || "");
          parentEl.parentNode?.replaceChild(textNode, parentEl);
        } else {
          // Wrap
          const code = document.createElement("code");
          code.className = "bg-muted px-1.5 py-0.5 rounded font-mono text-[10px] md:text-xs text-foreground border border-border/60";
          code.appendChild(range.extractContents());
          range.insertNode(code);
        }
      }
    } else if (command === "list") {
      document.execCommand("insertOrderedList", false);
    } else {
      document.execCommand(command, false, formatValue);
    }

    onChange(htmlToMarkdown(editor.innerHTML));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Backspace") {
      const selection = window.getSelection();
      if (selection && selection.isCollapsed && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let node = range.startContainer;
        
        // Find closest li element
        while (node && node !== editorRef.current) {
          if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName.toLowerCase() === "li") {
            break;
          }
          node = node.parentNode!;
        }
        
        if (node && node !== editorRef.current && (node as HTMLElement).tagName.toLowerCase() === "li") {
          const li = node as HTMLElement;
          const textContent = li.textContent?.trim() || "";
          
          if (textContent === "" && li.innerHTML.replace(/<br>/g, "").trim() === "") {
            e.preventDefault();
            
            const olOrUl = li.parentElement;
            if (olOrUl && (olOrUl.tagName.toLowerCase() === "ol" || olOrUl.tagName.toLowerCase() === "ul")) {
              const parent = olOrUl.parentElement;
              if (parent) {
                const listItems = Array.from(olOrUl.children);
                const liIndex = listItems.indexOf(li);
                
                const p = document.createElement("p");
                p.innerHTML = "<br>";
                
                const beforeItems = listItems.slice(0, liIndex);
                const afterItems = listItems.slice(liIndex + 1);
                
                if (beforeItems.length > 0) {
                  listItems.forEach((item, idx) => {
                    if (idx >= liIndex) {
                      olOrUl.removeChild(item);
                    }
                  });
                  olOrUl.after(p);
                } else {
                  olOrUl.before(p);
                  olOrUl.removeChild(li);
                }
                
                if (afterItems.length > 0) {
                  const newList = document.createElement(olOrUl.tagName.toLowerCase());
                  if (olOrUl.tagName.toLowerCase() === "ol") {
                    const startNum = (olOrUl as HTMLOListElement).start || 1;
                    newList.setAttribute("start", String(startNum + beforeItems.length));
                  }
                  afterItems.forEach(item => newList.appendChild(item));
                  p.after(newList);
                }
                
                if (olOrUl.children.length === 0) {
                  olOrUl.parentNode?.removeChild(olOrUl);
                }
                
                const newRange = document.createRange();
                newRange.setStart(p, 0);
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);
                
                onChange(htmlToMarkdown(editorRef.current?.innerHTML || ""));
              }
            }
          }
        }
      }
    }
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex justify-between items-center select-none gap-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {label}
        </label>
        
        {/* Formatting Toolbar */}
        <div className="flex items-center gap-1 bg-muted/40 px-1.5 py-0.5 rounded-lg select-none border border-border/40">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleFormat("undo")}
            className="h-5 px-1.5 rounded hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center"
            title="Batalkan (Undo)"
          >
            <Undo className="h-3 w-3" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleFormat("redo")}
            className="h-5 px-1.5 rounded hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center border-r border-border/40 pr-2 mr-1"
            title="Ulangi (Redo)"
          >
            <Redo className="h-3 w-3" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleFormat("bold")}
            className="h-5 px-2 rounded hover:bg-muted/80 text-[9px] font-extrabold text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center font-sans"
            title="Tebal (Bold)"
          >
            B
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleFormat("italic")}
            className="h-5 px-2 rounded hover:bg-muted/80 text-[9px] italic font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center font-sans"
            title="Miring (Italic)"
          >
            I
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleFormat("code")}
            className="h-5 px-2 rounded hover:bg-muted/80 text-[9px] font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center"
            title="Format Kode"
          >
            `Code`
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleFormat("list")}
            className="h-5 px-2 rounded hover:bg-muted/80 text-[9px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center font-sans font-bold"
            title="Daftar Angka"
          >
            1.
          </button>
        </div>
      </div>

      <div
        ref={editorRef}
        key={`rich-editor-${editingStepId}-${editorKey}`}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(htmlToMarkdown(e.currentTarget.innerHTML))}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full rounded-lg border border-border/80 bg-background/50 p-3 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed overflow-y-auto select-text cursor-text",
          "[&_strong]:text-foreground [&_strong]:font-bold [&_em]:italic [&_em]:text-foreground/90",
          "[&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-xs [&_code]:text-foreground [&_code]:border [&_code]:border-border/60",
          "[&_ol]:list-decimal [&_ol]:pl-4 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-3",
          minHeightClass
        )}
      />
    </div>
  );
}
