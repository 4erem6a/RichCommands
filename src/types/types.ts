/**
 * String command argument.
 */
export type StringArgument = string;

/**
 * Empty command argument.
 */
export type EmptyArgument = undefined;

/**
 * String or empty command argument.
 */
export type CommandArgument = StringArgument | EmptyArgument;

/**
 * Command flag value.
 */
export type CommandFlagValue = true | string | undefined;

/**
 * Represents a command flag.
 */
export interface CommandFlag {
  /**
   * Command flag name.
   */
  name: string;

  /**
   * Command flag value
   */
  value: CommandFlagValue;
}

/**
 * A command argument or a command flag.
 */
export type CommandPart = CommandArgument | CommandFlag;

/**
 * Represents a raw parsed command.
 */
export interface Command {
  /**
   * Command name.
   */
  name: string;

  /**
   * Command arguments and flags.
   */
  parts: CommandPart[];
}

/**
 * Object containing command flag values by their names.
 */
export type CommandFlags = {
  [name: string]: CommandFlagValue | CommandFlagValue[];
};

/**
 * Represents command arguments and flags.
 */
export interface RichArgv {
  /**
   * Command arguments.
   */
  args: Array<string | undefined>;

  /**
   * Command flags.
   */
  flags: CommandFlags;
}

/**
 * Represents a parsed command.
 */
export interface RichCommand extends RichArgv {
  /**
   * Command name.
   */
  name: string;
}
