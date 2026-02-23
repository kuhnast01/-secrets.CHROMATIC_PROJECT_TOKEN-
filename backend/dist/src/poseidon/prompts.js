// Poseidon prompt templates for query types
export const promptTemplates = {
    explain_file: (fileContent) => `You are an expert software assistant. Explain the following file in clear, concise terms for an engineer.\n\n---\n${fileContent}\n---`,
    explain_error: (error, fileContent) => `You are an expert software assistant. Explain the following error and its likely cause.\n\nError:\n${error}\n\n${fileContent ? `Relevant file:\n${fileContent}\n` : ''}`,
    suggest_improvements: (fileContent) => `You are an expert code reviewer. Suggest concrete improvements for the following file.\n\n---\n${fileContent}\n---`,
};
