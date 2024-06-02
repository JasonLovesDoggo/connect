// List of commands that do not require API calls

import * as bin from './index';
import config from '../../../config.json';
import { getProjects, getQuote, getWeather } from '../api';
import _SumFetch from './sumfetch';
import banners from '../../../banners';

export const sumfetch = async (args: string[]): Promise<string> => {
  return await _SumFetch(args);
};
sumfetch.desc = 'Display general summary of my info.';

// Help
interface Command {
  description: string; // Add a description property to the command interface
  fn: (args: string[]) => Promise<string>;
  hidden: null | boolean;
}

export const help = async (args: string[]): Promise<string> => {
  // Filter out commands without descriptions
  const commandsWithDescriptions = Object.entries(bin)
    .filter(([, command]) => (command as unknown as Command).hidden !== true)
    .map(([commandName, command]) => {
      const description = (command as any).desc; // Access the description from the 'desc' property
      return [commandName, { description, fn: command }] as [string, Command];
    })
    .sort();

  const maxCommandLength = Math.max(
    ...commandsWithDescriptions.map(([command]) => command.length),
  );

  const formattedCommands = commandsWithDescriptions
    .map(([command, { description }]) => {
      const padding = ' '.repeat(maxCommandLength - command.length + 4); // Calculate padding for alignment
      return `${command}${padding}${description}`;
    })
    .join('\n'); // Combine commands and descriptions with a newline

  return `Welcome! Here are all the available commands:\n\n${formattedCommands}\n\n
[tab]: trigger completion.
[ctrl+l]/clear: clear terminal.\n
Type 'sumfetch' to display summary.
`;
};
help.desc = 'Display this help message.';

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
projects.desc = 'List some of my projects.';

export const quote = async (args: string[]): Promise<string> => {
  const data = await getQuote();
  return data.quote;
};
quote.desc = 'Get a random quote.';
export const weather = async (args: string[]): Promise<string> => {
  const city = args.join('+');
  if (!city) {
    return 'Usage: weather [city]. Example: weather toronto';
  }
  return await getWeather(city);
};
weather.desc = 'Get the weather for a specific city. Usage: weather [city].';

// Redirection
export const repo = async (args: string[]): Promise<string> => {
  window.open(`${config.repo}`);
  return 'Opening Github repository...';
};
repo.desc = 'Open the GitHub repository in your browser.';

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
about.desc = 'Display information about me.';

export const resume = async (args: string[]): Promise<string> => {
  window.open(`${config.resume_url}`);
  return 'Opening resume...';
};
resume.desc = 'Open my resume in your browser.';

// Donate
export const donate = async (args: string[]): Promise<string> => {
  return `thank you for your interest. 
here are the ways you can support my work:
- <u><a class="text-light-blue dark:text-dark-blue underline" href="${config.donate_urls.github}" target="_blank">GitHub Sponsors</a></u>
`;
};
donate.desc = 'Show ways to support my work.';

// Contact
export const email = async (args: string[]): Promise<string> => {
  window.open(`mailto:${config.email}`);
  return `Opening mailto:${config.email}...`;
};
email.desc = 'Send me an email.';

export const github = async (args: string[]): Promise<string> => {
  window.open(`https://github.com/${config.social.github}/`);

  return 'Opening github...';
};
github.desc = 'Open my Github profile in your browser.';

export const linkedin = async (args: string[]): Promise<string> => {
  window.open(`https://www.linkedin.com/in/${config.social.linkedin}/`);

  return `Opening linkedin.com/in/${config.social.linkedin}...`;
};
linkedin.desc = 'Open my LinkedIn profile in your browser.';

export const portfolio = async (args: string[]): Promise<string> => {
  window.open(`${config.portfolio_url}`);
  return `Opening ${config.portfolio_url.replace('https://', '')}...`;
};
portfolio.desc = 'Open my portfolio site in your browser.';

export const website = async (args: string[]): Promise<string> => {
  return await portfolio(args); // Alias for portfolio
};
website.hidden = true;

// Search
export const google = async (args: string[]): Promise<string> => {
  if (!args.length) {
    return 'Usage: google [search query]. Example: google how to create a website';
  }
  window.open(`https://google.com/search?q=${args.join(' ')}`);
  return `Searching google for ${args.join(' ')}...`;
};
google.desc =
  'Search Google for the provided query. Usage: google [search query].';

export const duckduckgo = async (args: string[]): Promise<string> => {
  if (!args.length) {
    return 'Usage: duckduckgo [search query]. Example: duckduckgo how to create a website';
  }
  window.open(`https://duckduckgo.com/?q=${args.join(' ')}`);
  return `Searching duckduckgo for ${args.join(' ')}...`;
};
duckduckgo.desc =
  'Search DuckDuckGo for the provided query. Usage: duckduckgo [search query].';

export const bing = async (args: string[]): Promise<string> => {
  if (!args.length) {
    return 'Usage: bing [search query]. Example: bing how to create a website';
  }
  window.open(`https://bing.com/search?q=${args.join(' ')}`);
  return `Wow, really? You are using bing for ${args.join(' ')}?`;
};
duckduckgo.desc =
  'Search Bing... (you sure?) for the provided query. Usage: bing [search query].';

export const reddit = async (args: string[]): Promise<string> => {
  if (!args.length) {
    return 'Usage: reddit [search query]. Example: reddit how to create a website';
  }
  window.open(`https://www.reddit.com/search/?q=${args.join(' ')}`);
  return `Searching reddit for ${args.join(' ')}...`;
};
reddit.desc =
  'Search Reddit for the provided query. Usage: reddit [search query].';

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
echo.desc = 'Print the provided string. Usage: echo [string].';

export const whoami = async (args: string[]): Promise<string> => {
  return `${config.ps1_username}`; // todo add SU cmd
};
whoami.desc = 'Print the current user.';

export const ls = async (args: string[]): Promise<string> => {
  return `.env
 Dockerfile
 secrets.txt
 diary/`;
};
ls.desc = 'List files and directories.';

export const cd = async (args: string[]): Promise<string> => {
  return `unfortunately, i cannot afford more directories.
if you want to help, you can type 'donate'.`;
};
cd.desc = 'Change directory. Usage: cd [directory].';

export const pwd = async (args: string[]): Promise<string> => {
  return '/home/guest';
};
pwd.desc = 'Print the current working directory.';

export const date = async (args: string[]): Promise<string> => {
  return new Date().toString();
};
date.desc = 'Print the current date and time.';

export const vi = async (args: string[]): Promise<string> => {
  return `woah, you still use 'vi'? just try 'vim'.`;
};
vi.desc = 'Open the vi text editor.';

export const vim = async (args: string[]): Promise<string> => {
  return `'vim' is so outdated. how about 'nvim'?`;
};
vim.desc = 'Open the vim text editor.';

export const nvim = async (args: string[]): Promise<string> => {
  return `'nvim'? too fancy. why not 'emacs'?`;
};
nvim.desc = 'Open the nvim text editor.';

export const emacs = async (args?: string[]): Promise<string> => {
  return `you know what? just use nano.`;
};
nvim.desc = 'Open the emacs text editor.';

export const nano = async (args?: string[]): Promise<string> => {
  return `at this point, just use vscode.`;
};
nano.desc = 'Open the nano text editor.';

export const code = async (args?: string[]): Promise<string> => {
  return `Never gonna give you up, never gonna let you down...`;
};
code.desc = 'Open Visual Studio Code.';

export const sudo = async (args?: string[]): Promise<string> => {
  window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank'); // ...I'm sorry
  return `Permission denied: with little power comes... no responsibility? `;
};
sudo.desc = 'Execute a command as the superuser.';

// Banner
export const banner = (args?: string[]): string => {
  return `
${banners[0]}                                        
                                                                                                                                                                  

Type 'help' to see the list of available commands.
Type 'sumfetch' to display summary.
Type 'repo' or click <u><a class="text-light-blue dark:text-dark-blue underline" href="${config.repo}" target="_blank">here</a></u> for the Github repository.
`;
};
banner.desc = 'Display the welcome banner.';
