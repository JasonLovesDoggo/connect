// List of commands that do not require API calls

import * as bin from './index';
import config from '../../../config.json';
import { getProjects, getQuote, getWeather } from '../api';
import _SumFetch from './sumfetch';
import banners from '../../../banners';

export const sumfetch = async (args: string[]): Promise<string> => {
  return await _SumFetch(args);
};

// Help
export const help = async (args: string[]): Promise<string> => {
  const commands = Object.keys(bin).sort();
  let c = '';
  for (let i = 1; i <= commands.length; i++) {
    if (i % 7 === 0) {
      c += commands[i - 1] + '\n';
    } else {
      c += commands[i - 1] + ' ';
    }
  }
  return `Welcome! Here are all the available commands:
\n${c}\n
[tab]: trigger completion.
[ctrl+l]/clear: clear terminal.\n
Type 'sumfetch' to display summary.
`;
};

// API commands

export const projects = async (args: string[]): Promise<string> => {
  const projects = await getProjects();

  const projectsHtml = projects
    .map(
      (repo: any) => `
    <li style="flex: 1;" key="${repo.id}">
      ${repo.language ? `[${repo.language}]` : ''} ${repo.name} - ${
        repo.description || ''
      }
      <a
        class="text-light-blue dark:text-dark-blue underline" 
        href="${repo.html_url}"
        target="_blank"
        rel="noreferrer"
      >
        ${repo.html_url}
      </a>
    </li>
  `,
    )
    .join('');
  return `<ul style="display: flex; flex-direction: column">${projectsHtml}</ul>`;
};

export const quote = async (args: string[]): Promise<string> => {
  const data = await getQuote();
  return data.quote;
};
export const weather = async (args: string[]): Promise<string> => {
  const city = args.join('+');
  if (!city) {
    return 'Usage: weather [city]. Example: weather toronto';
  }
  return await getWeather(city);
};

// Redirection
export const repo = async (args: string[]): Promise<string> => {
  window.open(`${config.repo}`);
  return 'Opening Github repository...';
};

// About
export const about = async (args: string[]): Promise<string> => {
  return `Hi, I am ${config.name}. 
Welcome to my little terminal!
More about me:
'sumfetch' - short summary.
'resume' - my latest resume.
'donate' - ways to support my work.
'portfolio' - my full portfolio site.
'github' - my Github profile.
'linkedin' - my LinkedIn profile.`;
};

export const resume = async (args: string[]): Promise<string> => {
  window.open(`${config.resume_url}`);
  return 'Opening resume...';
};

// Donate
export const donate = async (args: string[]): Promise<string> => {
  return `thank you for your interest. 
here are the ways you can support my work:
- <u><a class="text-light-blue dark:text-dark-blue underline" href="${config.donate_urls.github}" target="_blank">GitHub Sponsors</a></u>
`;
};

// Contact
export const email = async (args: string[]): Promise<string> => {
  window.open(`mailto:${config.email}`);
  return `Opening mailto:${config.email}...`;
};

export const github = async (args: string[]): Promise<string> => {
  window.open(`https://github.com/${config.social.github}/`);

  return 'Opening github...';
};

export const linkedin = async (args: string[]): Promise<string> => {
  window.open(`https://www.linkedin.com/in/${config.social.linkedin}/`);

  return `Opening linkedin.com/in/${config.social.linkedin}...`;
};

export const portfolio = async (args: string[]): Promise<string> => {
  window.open(`${config.portfolio_url}`);
  return `Opening ${config.portfolio_url.replace('https://', '')}...`;
};
export const website = portfolio; // Alias
// Search
export const google = async (args: string[]): Promise<string> => {
  if (!args.length) {
    return 'Usage: google [search query]. Example: google how to create a website';
  }
  window.open(`https://google.com/search?q=${args.join(' ')}`);
  return `Searching google for ${args.join(' ')}...`;
};

export const duckduckgo = async (args: string[]): Promise<string> => {
  if (!args.length) {
    return 'Usage: duckduckgo [search query]. Example: duckduckgo how to create a website';
  }
  window.open(`https://duckduckgo.com/?q=${args.join(' ')}`);
  return `Searching duckduckgo for ${args.join(' ')}...`;
};

export const bing = async (args: string[]): Promise<string> => {
  if (!args.length) {
    return 'Usage: bing [search query]. Example: bing how to create a website';
  }
  window.open(`https://bing.com/search?q=${args.join(' ')}`);
  return `Wow, really? You are using bing for ${args.join(' ')}?`;
};

export const reddit = async (args: string[]): Promise<string> => {
  if (!args.length) {
    return 'Usage: reddit [search query]. Example: reddit how to create a website';
  }
  window.open(`https://www.reddit.com/search/?q=${args.join(' ')}`);
  return `Searching reddit for ${args.join(' ')}...`;
};

// Typical linux commands
export const echo = async (args: string[]): Promise<string> => {
  if (!args.length) {
    return 'Usage: echo [string]. Example: echo hello world';
  }
  const string = args.join(' ');
  const regex =
    /<(?:(script|style|object|embed|applet|noframes|noscript|noembed)(?:\s+(?:"[\S\s]*?"|'[\S\s]*?'|(?:(?!\/>)[^>])?)+)?\s*>[\S\s]*?<\/\1\s*(?=>)|(?:\/?[\w:]+\s*\/?)|(?:[\w:]+\s+(?:"[\S\s]*?"|'[\S\s]*?'|[^>]?)+\s*\/?)|\?[\S\s]*?\?|(?:!(?:(?:DOCTYPE[\S\s]*?)|(?:\[CDATA\[[\S\s]*?\]\])|(?:--[\S\s]*?--)|(?:ATTLIST[\S\s]*?)|(?:ENTITY[\S\s]*?)|(?:ELEMENT[\S\s]*?))))>/g;

  if (regex.test(string)) {
    return 'nice try lmao';
  }

  return string.replace(regex, '');
};

export const whoami = async (args: string[]): Promise<string> => {
  return `${config.ps1_username}`; // todo add SU cmd
};

export const ls = async (args: string[]): Promise<string> => {
  return `.env
 Dockerfile
 secrets.txt
 diary/`;
};

export const cd = async (args: string[]): Promise<string> => {
  return `unfortunately, i cannot afford more directories.
if you want to help, you can type 'donate'.`;
};

export const date = async (args: string[]): Promise<string> => {
  return new Date().toString();
};

export const vi = async (args: string[]): Promise<string> => {
  return `woah, you still use 'vi'? just try 'vim'.`;
};

export const vim = async (args: string[]): Promise<string> => {
  return `'vim' is so outdated. how about 'nvim'?`;
};

export const nvim = async (args: string[]): Promise<string> => {
  return `'nvim'? too fancy. why not 'emacs'?`;
};

export const emacs = async (args?: string[]): Promise<string> => {
  return `you know what? just use nano.`;
};

export const nano = async (args?: string[]): Promise<string> => {
  return `at this point, just use vscode.`;
};

export const code = async (args?: string[]): Promise<string> => {
  return `Never gonna give you up, never gonna let you down...`;
};

export const sudo = async (args?: string[]): Promise<string> => {
  window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank'); // ...I'm sorry
  return `Permission denied: with little power comes... no responsibility? `;
};

// Banner
export const banner = (args?: string[]): string => {
  return `
${banners[0]}                                        
                                                                                                                                                                  

Type 'help' to see the list of available commands.
Type 'sumfetch' to display summary.
Type 'repo' or click <u><a class="text-light-blue dark:text-dark-blue underline" href="${config.repo}" target="_blank">here</a></u> for the Github repository.
`;
};
