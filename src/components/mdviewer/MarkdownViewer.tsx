interface MarkdownViewerProps {
  markdown?: string;
  className?: string;
  maxHeight?: string;
}
const MarkdownViewer = ({markdown, className, maxHeight}:MarkdownViewerProps) => {


 const parseMarkdown = (text: string): string => {
    return text
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mb-3 mt-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mb-4 mt-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-6 mt-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">$1</h1>')
      
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<div class="relative bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto border border-gray-700"><div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div><pre class="text-green-400 font-mono text-sm leading-relaxed"><code>$2</code></pre></div>')
      
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 text-purple-600 dark:text-purple-400 px-2 py-1 rounded text-sm font-mono border">$1</code>')
      
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-blue-700 dark:text-blue-300">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-purple-600 dark:text-purple-400">$1</em>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline hover:no-underline transition-all duration-200 font-medium">$1</a>')
      
      // Blockquotes
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300 rounded-r-lg">$1</blockquote>')
      
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="my-8 border-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent">')
      
      // Tables (basic implementation)
      .replace(/\|(.+)\|/g, (match, content) => {
        const cells = content.split('|').map((cell: string) => cell.trim());
        const isHeader = match.includes('---');
        if (isHeader) return '';
        
        const cellElements = cells.map((cell: string) => 
          `<td class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-sm">${cell}</td>`
        ).join('');
        return `<tr class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">${cellElements}</tr>`;
      })
      
      // Lists
      .replace(/^- (.*$)/gm, '<li class="mb-2 text-gray-700 dark:text-gray-300 leading-relaxed">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="mb-2 text-gray-700 dark:text-gray-300 leading-relaxed">$1</li>')
      
      // Line breaks and paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">')
      .replace(/\n/g, '<br>');
  };

  // Wrap content and handle lists/tables
  let wrappedContent = parseMarkdown(markdown);
  
  // Wrap paragraphs
  if (!wrappedContent.startsWith('<')) {
    wrappedContent = '<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">' + wrappedContent + '</p>';
  }
  
  // Handle lists
  wrappedContent = wrappedContent
    .replace(/(<li class="mb-2[^>]*>.*?<\/li>)/gs, (match) => {
      const isOrdered = /^\d+\./.test(match);
      const listClass = isOrdered 
        ? 'list-decimal list-inside space-y-1 mb-4 ml-4 marker:text-purple-500 marker:font-bold'
        : 'list-disc list-inside space-y-1 mb-4 ml-4 marker:text-purple-500';
      return `<ul class="${listClass}">${match}</ul>`;
    });

  // Handle tables
  wrappedContent = wrappedContent
    .replace(/(<tr class="hover:bg-gray-50[^>]*>.*?<\/tr>)/gs, (match) => {
      return `<div class="overflow-x-auto my-6"><table class="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"><tbody>${match}</tbody></table></div>`;
    });


  return (
    <div 
      className={`overflow-y-auto text-wrap break-words ${className}`}
      style={{ maxHeight }}
    >
      <div 
        className="prose prose-sm max-w-none p-1"
        dangerouslySetInnerHTML={{ __html: wrappedContent }}
      />
      
    </div>
  );
};

export default MarkdownViewer;