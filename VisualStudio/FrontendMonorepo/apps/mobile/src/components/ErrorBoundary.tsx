import React from 'react';
import { View, Text, Button } from 'react-native';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to service if needed
    // console.error(error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ fontSize: 22, color: 'red', fontWeight: 'bold', marginBottom: 12 }}>Something went wrong</Text>
          <Text style={{ marginBottom: 16 }}>{this.state.error?.message || 'An unexpected error occurred.'}</Text>
          <Button title="Reload" onPress={this.handleReload} accessibilityLabel="Reload app" />
        </View>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
