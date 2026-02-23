type SentryClient = {
  captureException: (error: unknown) => void;
  captureMessage: (message: string) => void;
};

const sentryClient: SentryClient = {
  captureException: () => {},
  captureMessage: () => {},
};

export default sentryClient;
