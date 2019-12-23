export type StringArgument = string;

export type EmptyArgument = undefined;

export type CommandArgument = StringArgument | EmptyArgument;

export type CommandFlagValue = true | string | undefined;

export interface CommandFlag {
  name: string;
  value: CommandFlagValue;
}

export type CommandPart = CommandArgument | CommandFlag;

export type CommandFlags = {
  [name: string]: CommandFlagValue | CommandFlagValue[];
};

export interface RichCommand {
  args: Array<string | undefined>;
  flags: CommandFlags;
}
