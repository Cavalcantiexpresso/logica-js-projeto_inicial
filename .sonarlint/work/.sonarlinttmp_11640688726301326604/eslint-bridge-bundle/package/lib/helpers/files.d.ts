/**
 * The type of input file
 *
 * The scanner indexes input files based on the project configuration,
 * if any. It determines wheter an input file denotes a `MAIN` file,
 * i.e., a source file, or a `TEST` file.
 *
 * The type of input file is then used by the linter to select which
 * rule configurations to apply, that is, which rules the linter should
 * use to analyze the file.
 */
export declare type FileType = 'MAIN' | 'TEST';
/**
 * Asynchronous read of file contents from a file path
 *
 * The function gets rid of any Byte Order Marker (BOM)
 * present in the file's header.
 *
 * @param filePath the path of a file
 * @returns Promise which resolves with the content of the file
 */
export declare function readFile(filePath: string): Promise<string>;
/**
 * Removes any Byte Order Marker (BOM) from a string's head
 *
 * A string's head is nothing else but its first character.
 *
 * @param str the input string
 * @returns the stripped string
 */
export declare function stripBOM(str: string): string;
