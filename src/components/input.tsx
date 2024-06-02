import React, { useMemo } from 'react';
import { shell } from '../utils/shell';
import { Ps1 } from './Ps1';
import * as bin from '../utils/bin/commands';
import fuzzysort from 'fuzzysort';

export const Input = ({
  inputRef,
  containerRef,
  command,
  history,
  lastCommandIndex,
  setCommand,
  setHistory,
  setLastCommandIndex,
  clearHistory,
}) => {
  const onSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    const commands: [string] = history
      .map(({ command }) => command)
      .filter((command: string) => command);

    if (event.key === 'c' && event.ctrlKey) {
      event.preventDefault();
      setCommand('');
      setHistory('');
      setLastCommandIndex(0);
    }

    if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault();
      clearHistory();
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      handleTabCompletion(command, setCommand);
    }

    if (event.key === 'Enter' || event.code === '13') {
      event.preventDefault();
      setLastCommandIndex(0);
      await shell(command, setHistory, clearHistory, setCommand);
      containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!commands.length) {
        return;
      }
      const index: number = lastCommandIndex + 1;
      if (index <= commands.length) {
        setLastCommandIndex(index);
        setCommand(commands[commands.length - index]);
      }
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!commands.length) {
        return;
      }
      const index: number = lastCommandIndex - 1;
      if (index > 0) {
        setLastCommandIndex(index);
        setCommand(commands[commands.length - index]);
      } else {
        setLastCommandIndex(0);
        setCommand('');
      }
    }
  };

  const onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(value);
  };

  const handleTabCompletion = (
    command: string,
    setCommand: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (!likelyCommandResult) {
      return;
    }
    setCommand(likelyCommandResult.target);
  };

  const keys = useMemo(() => Object.keys(bin), []);
  const prepared = useMemo(() => keys.map(fuzzysort.prepare), []);

  const likelyCommandResult: Fuzzysort.Result = useMemo(() => {
    const result = fuzzysort.go(command, prepared, {
      limit: 1,
      threshold: 0,
    });
    const keyFound: boolean = keys.some((key) => key.startsWith(command));
    if (!keyFound) {
      return null;
    }
    return result[0] || null; // Return the result object or null if no match
  }, [command, prepared]);

  const renderCommand = () => {
    if (!likelyCommandResult) {
      return (
        <span className="text-dark-red">{command}</span> // No match, show command in red
      );
    }

    const { target, indexes } = likelyCommandResult;
    let parts = [];
    let lastIndex = 0;
    for (const index of indexes) {
      parts.push(
        <span key={index} className="text-dark-green">
          {target.slice(lastIndex, index)}
        </span>,
      ); // Matched part in green
      parts.push(<span key={target[index]} className="text-gray-400">{target[index]}</span>); // Extrapolated part in gray
      lastIndex = index + 1;
    }
    parts.push(
      <span key={target.slice(lastIndex)} className="text-dark-green">
        {target.slice(lastIndex)}
      </span>,
    ); // Remaining matched part in green

    return parts;
  };

  return (
    <div className="flex flex-row space-x-2">
      <label htmlFor="prompt" className="flex-shrink">
        <Ps1 />
      </label>

      <div className="relative flex-grow">
        <input
          ref={inputRef}
          id="prompt"
          type="text"
          className="bg-light-background dark:bg-dark-background focus:outline-none text-dark-green w-full"
          value={command}
          onChange={onChange}
          autoFocus
          onKeyDown={onSubmit}
          autoComplete="off"
          spellCheck="false"
        />
        <div
          className="absolute top-0 left-0 pointer-events-none"
          style={{ width: `${inputRef.current?.offsetWidth || 0}px` }}
        >
          {renderCommand()}
        </div>
      </div>
    </div>
  );
};

export default Input;
