import { render } from '@testing-library/react';
import App from '../src/App';

describe('Web App Smoke Test', () => {
  it('renders main app component without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
  });
});
