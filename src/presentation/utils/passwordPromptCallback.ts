let callback: ((value: string | null) => void) | null = null;

export const setPasswordPromptCallback = (cb: ((value: string | null) => void) | null): void => {
  callback = cb;
};

export const resolvePasswordPrompt = (value: string | null): void => {
  if (callback) {
    callback(value);
    callback = null;
  }
};
