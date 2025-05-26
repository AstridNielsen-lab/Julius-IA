import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return uuidv4();
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function simulateBrowsing(url: string): Promise<{ content: string; title: string }> {
  // In a real implementation, this would call a backend service like Browserless
  // For now, we'll simulate a response
  await delay(1500);
  
  if (url.includes('wikipedia')) {
    return {
      title: 'Wikipedia - The Free Encyclopedia',
      content: `<div class="article">
        <h1>Wikipedia</h1>
        <p>Wikipedia is a free online encyclopedia, created and edited by volunteers around the world.</p>
        <p>Wikipedia is the largest and most-read reference work in history, and is consistently one of the 15 most popular websites.</p>
        <h2>History</h2>
        <p>Wikipedia was launched on January 15, 2001, by Jimmy Wales and Larry Sanger. Sanger coined its name as a blend of "wiki" and "encyclopedia".</p>
        <h2>Growth</h2>
        <p>Initially an English-language encyclopedia, versions in other languages were quickly developed. The English Wikipedia is now one of more than 300 Wikipedia encyclopedias in different languages.</p>
      </div>`
    };
  } else if (url.includes('github')) {
    return {
      title: 'GitHub: Where the world builds software',
      content: `<div class="article">
        <h1>GitHub</h1>
        <p>GitHub is a provider of Internet hosting for software development and version control using Git.</p>
        <p>It offers the distributed version control and source code management (SCM) functionality of Git, plus its own features.</p>
        <h2>Features</h2>
        <p>GitHub provides access control and several collaboration features such as bug tracking, feature requests, task management, continuous integration, and wikis for every project.</p>
      </div>`
    };
  } else {
    return {
      title: 'Search Results',
      content: `<div class="search-results">
        <p>Here are some search results for "${url}":</p>
        <ul>
          <li><a href="#">Result 1: Information about ${url}</a></li>
          <li><a href="#">Result 2: More details on ${url}</a></li>
          <li><a href="#">Result 3: Related topics to ${url}</a></li>
          <li><a href="#">Result 4: Further reading on ${url}</a></li>
        </ul>
      </div>`
    };
  }
}

export function markdownToPdf(markdown: string): Blob {
  // In a real implementation, this would convert markdown to PDF
  // For this demo, we'll just create a simple text blob
  return new Blob([markdown], { type: 'application/pdf' });
}