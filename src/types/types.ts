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
  readonly name: string;

  /**
   * Command flag value
   */
  readonly value: CommandFlagValue;
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
  readonly name: string;

  /**
   * Command arguments and flags.
   */
  readonly parts: CommandPart[];
}

/**
 * Object containing command flag values by their names.
 */
export type CommandFlags = {
  readonly [name: string]: CommandFlagValue | CommandFlagValue[];
};

/**
 * Represents command arguments and flags.
 */
export interface RichArgv {
  /**
   * Command arguments.
   */
  readonly args: Array<string | undefined>;

  /**
   * Command flags.
   */
  readonly flags: CommandFlags;
}

/**
 * Represents a parsed command.
 */
export interface RichCommand extends RichArgv {
  /**
   * Command name.
   */
  readonly name: string;
}
