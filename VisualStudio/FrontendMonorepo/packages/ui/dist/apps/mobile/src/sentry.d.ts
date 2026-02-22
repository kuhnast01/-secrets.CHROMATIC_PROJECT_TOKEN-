type SentryClient = {
    captureException: (error: unknown) => void;
    captureMessage: (message: string) => void;
};
declare const sentryClient: SentryClient;
export default sentryClient;
